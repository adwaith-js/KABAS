import { Router, Request, Response } from 'express';
import { TeamStore } from '../storage/TeamStore.js';
import { ResponseCache } from '../cache/ResponseCache.js';
import { GitHubAPIClient } from '../clients/GitHubAPIClient.js';
import { JiraAPIClient } from '../clients/JiraAPIClient.js';
import { AnalysisEngine } from '../analysis/AnalysisEngine.js';
import { TeamAnalysis, UnifiedIssue } from '../models/UnifiedIssue.js';

export function createAnalysisRouter(store: TeamStore): Router {
  const router = Router();
  const analysisCache = new ResponseCache<TeamAnalysis>(60);
  const issuesCache = new ResponseCache<UnifiedIssue[]>(60);

  async function fetchIssues(teamId: string): Promise<UnifiedIssue[]> {
    const cached = issuesCache.get(teamId);
    if (cached) return cached;

    const team = store.getById(teamId);
    if (!team) throw new Error('Team not found');

    console.log(`[Sync] Starting data fetch for team: ${team.name} (${team.platform})`);

    let issues: UnifiedIssue[];
    if (team.platform === 'GitHub') {
      const parsed = GitHubAPIClient.parseUrl(team.url);
      const client = new GitHubAPIClient({ parsed, token: team.apiToken });
      issues = await client.fetchAllIssues();
      console.log(`[GitHub API] Successfully HTTP 200: Fetched ${issues.length} issues/items`);
    } else {
      const { baseUrl, projectKey: parsedKey } = JiraAPIClient.parseJiraUrl(team.url);
      const projectKey = team.projectKey || parsedKey;
      if (!team.jiraEmail || !team.apiToken) throw new Error('Jira requires jiraEmail and apiToken');
      const client = new JiraAPIClient({
        baseUrl,
        projectKey,
        email: team.jiraEmail,
        apiToken: team.apiToken,
      });
      issues = await client.fetchAllIssues();
      console.log(`[Jira API] Successfully HTTP 200: Fetched ${issues.length} issues/items`);
    }

    issuesCache.set(teamId, issues);
    store.update(teamId, { lastSynced: new Date().toISOString() });
    return issues;
  }

  router.get('/analysis/:teamId', async (req: Request, res: Response) => {
    const { teamId } = req.params;

    const cached = analysisCache.get(teamId);
    if (cached) return res.json({ data: cached });

    const team = store.getById(teamId);
    if (!team) return res.status(404).json({ error: 'Team not found' });

    try {
      const issues = await fetchIssues(teamId);
      const analysis = AnalysisEngine.analyzeTeam(teamId, team.platform, issues);
      analysisCache.set(teamId, analysis);
      return res.json({ data: analysis });
    } catch (err: any) {
      return res.status(500).json({ error: err.message ?? 'Analysis failed' });
    }
  });

  router.get('/analysis/:teamId/issues', async (req: Request, res: Response) => {
    const { teamId } = req.params;

    if (!store.getById(teamId)) return res.status(404).json({ error: 'Team not found' });

    try {
      const issues = await fetchIssues(teamId);
      return res.json({ data: issues });
    } catch (err: any) {
      return res.status(500).json({ error: err.message ?? 'Failed to fetch issues' });
    }
  });

  router.get('/analysis/:teamId/members', async (req: Request, res: Response) => {
    const { teamId } = req.params;

    const team = store.getById(teamId);
    if (!team) return res.status(404).json({ error: 'Team not found' });

    const cached = analysisCache.get(teamId);
    if (cached) return res.json({ data: cached.members });

    try {
      const issues = await fetchIssues(teamId);
      const analysis = AnalysisEngine.analyzeTeam(teamId, team.platform, issues);
      analysisCache.set(teamId, analysis);
      return res.json({ data: analysis.members });
    } catch (err: any) {
      return res.status(500).json({ error: err.message ?? 'Failed to fetch members' });
    }
  });

  return router;
}
