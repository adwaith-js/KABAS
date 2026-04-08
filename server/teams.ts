import { Router, Request, Response } from 'express';
import { TeamStore } from '../storage/TeamStore.js';
import { GitHubAPIClient } from '../clients/GitHubAPIClient.js';
import { JiraAPIClient } from '../clients/JiraAPIClient.js';

export function createTeamsRouter(store: TeamStore): Router {
  const router = Router();

  router.get('/teams', (_req: Request, res: Response) => {
    res.json({ data: store.getAll() });
  });

  router.get('/teams/:id', (req: Request, res: Response) => {
    const team = store.getById(req.params.id);
    if (!team) return res.status(404).json({ error: 'Team not found' });
    return res.json({ data: team });
  });

  router.post('/teams', (req: Request, res: Response) => {
    const { name, platform, url, apiToken, jiraEmail, projectKey, status } = req.body;
    if (!name || !platform || !url) {
      return res.status(400).json({ error: 'name, platform, and url are required' });
    }
    const team = store.create({
      name,
      platform,
      url,
      apiToken,
      jiraEmail,
      projectKey,
      status: status ?? 'Active',
    });
    return res.status(201).json({ data: team });
  });

  router.put('/teams/:id', (req: Request, res: Response) => {
    const updated = store.update(req.params.id, req.body);
    if (!updated) return res.status(404).json({ error: 'Team not found' });
    return res.json({ data: updated });
  });

  router.delete('/teams/:id', (req: Request, res: Response) => {
    const deleted = store.delete(req.params.id);
    if (!deleted) return res.status(404).json({ error: 'Team not found' });
    return res.json({ data: { success: true } });
  });

  router.post('/teams/:id/test', async (req: Request, res: Response) => {
    const team = store.getById(req.params.id);
    if (!team) return res.status(404).json({ error: 'Team not found' });

    try {
      let success = false;
      if (team.platform === 'GitHub') {
        const parsed = GitHubAPIClient.parseUrl(team.url);
        const client = new GitHubAPIClient({ parsed, token: team.apiToken });
        success = await client.testConnection();
      } else {
        const baseUrl = team.url.startsWith('http') ? team.url : `https://${team.url}`;
        const projectKey = team.projectKey ?? JiraAPIClient.parseJiraUrl(team.url).projectKey;
        if (!team.jiraEmail || !team.apiToken) {
          return res.status(400).json({ error: 'Jira requires jiraEmail and apiToken' });
        }
        const client = new JiraAPIClient({
          baseUrl,
          projectKey,
          email: team.jiraEmail,
          apiToken: team.apiToken,
        });
        success = await client.testConnection();
      }

      const message = success ? 'Connection successful' : 'Connection failed — check credentials';
      return res.json({ data: { success, message } });
    } catch (err: any) {
      return res.json({ data: { success: false, message: err.message ?? 'Connection failed' } });
    }
  });

  return router;
}
