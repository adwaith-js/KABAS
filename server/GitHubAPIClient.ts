import { Octokit } from '@octokit/rest';
import { UnifiedIssue, IssueStatus, IssuePriority, normalizeGitHubIssue } from '../models/UnifiedIssue.js';

export type GitHubUrlType = 'repository' | 'user-project' | 'org-project';

export interface ParsedGitHubUrl {
  urlType: GitHubUrlType;
  owner: string;
  repo?: string;
  projectNumber?: number;
}

export interface GitHubCredentials {
  parsed: ParsedGitHubUrl;
  token?: string;
}

// GraphQL fragment for project items — fetches status, priority, assignees, and linked issue/PR content
const PROJECT_ITEMS_QUERY = /* graphql */ `
  query GetProjectItems($login: String!, $projectNumber: Int!, $cursor: String, $isOrg: Boolean!) {
    user(login: $login) @skip(if: $isOrg) {
      projectV2(number: $projectNumber) {
        ...ProjectFields
      }
    }
    organization(login: $login) @include(if: $isOrg) {
      projectV2(number: $projectNumber) {
        ...ProjectFields
      }
    }
  }

  fragment ProjectFields on ProjectV2 {
    items(first: 100, after: $cursor) {
      pageInfo { hasNextPage endCursor }
      nodes {
        id
        createdAt
        updatedAt
        fieldValues(first: 20) {
          nodes {
            ... on ProjectV2ItemFieldSingleSelectValue {
              name
              field { ... on ProjectV2SingleSelectField { name } }
            }
          }
        }
        content {
          ... on Issue {
            number
            title
            url
            state
            createdAt
            closedAt
            updatedAt
            body
            assignees(first: 10) { nodes { login databaseId } }
            labels(first: 10) { nodes { name } }
          }
          ... on PullRequest {
            number
            title
            url
            state
            createdAt
            closedAt
            updatedAt
            assignees(first: 10) { nodes { login databaseId } }
          }
          ... on DraftIssue {
            title
            createdAt
            updatedAt
            body
            assignees(first: 10) { nodes { login } }
          }
        }
      }
    }
  }
`;

export class GitHubAPIClient {
  private octokit: Octokit;
  private credentials: GitHubCredentials;

  constructor(credentials: GitHubCredentials) {
    this.credentials = credentials;
    this.octokit = new Octokit({ auth: credentials.token });
  }

  // Parse any GitHub URL — projects board or repository
  static parseUrl(url: string): ParsedGitHubUrl {
    const cleaned = url.replace(/^https?:\/\//, '').replace(/^github\.com\//, '');
    const parts = cleaned.split('/').filter(Boolean);

    // github.com/users/{login}/projects/{number}
    if (parts[0] === 'users' && parts[2] === 'projects' && parts[3]) {
      return { urlType: 'user-project', owner: parts[1], projectNumber: parseInt(parts[3], 10) };
    }
    // github.com/orgs/{org}/projects/{number}
    if (parts[0] === 'orgs' && parts[2] === 'projects' && parts[3]) {
      return { urlType: 'org-project', owner: parts[1], projectNumber: parseInt(parts[3], 10) };
    }
    // github.com/{owner}/{repo}/projects/{number}  (old-style or new project linked to repo)
    if (parts.length >= 4 && parts[2] === 'projects') {
      return { urlType: 'user-project', owner: parts[0], projectNumber: parseInt(parts[3], 10) };
    }
    // github.com/{owner}/{repo}
    if (parts.length >= 2) {
      return { urlType: 'repository', owner: parts[0], repo: parts[1] };
    }

    throw new Error(
      `Cannot parse GitHub URL "${url}". ` +
      `Use a Projects board URL (github.com/users/name/projects/N) or a repository URL (github.com/owner/repo).`,
    );
  }

  async fetchAllIssues(): Promise<UnifiedIssue[]> {
    const { urlType } = this.credentials.parsed;
    if (urlType === 'repository') {
      return this.fetchRepositoryIssues();
    }
    return this.fetchProjectItems();
  }

  async testConnection(): Promise<boolean> {
    try {
      const { urlType, owner, repo, projectNumber } = this.credentials.parsed;
      if (urlType === 'repository') {
        await this.octokit.rest.repos.get({ owner: owner, repo: repo! });
      } else {
        // Test by fetching the first page of project items
        const isOrg = urlType === 'org-project';
        await (this.octokit as any).graphql(PROJECT_ITEMS_QUERY, {
          login: owner,
          projectNumber: projectNumber!,
          cursor: null,
          isOrg,
        });
      }
      return true;
    } catch {
      return false;
    }
  }

  private async fetchRepositoryIssues(): Promise<UnifiedIssue[]> {
    const { owner, repo } = this.credentials.parsed;
    const rawIssues = await this.octokit.paginate(
      this.octokit.rest.issues.listForRepo,
      { owner: owner!, repo: repo!, state: 'all', per_page: 100 },
      (response) => response.data,
    );
    return rawIssues
      .filter((issue: any) => !issue.pull_request)
      .map((issue: any) => normalizeGitHubIssue(issue));
  }

  private async fetchProjectItems(): Promise<UnifiedIssue[]> {
    const { owner, projectNumber, urlType } = this.credentials.parsed;
    const isOrg = urlType === 'org-project';
    const allItems: UnifiedIssue[] = [];
    let cursor: string | null = null;

    do {
      const data: any = await (this.octokit as any).graphql(PROJECT_ITEMS_QUERY, {
        login: owner,
        projectNumber: projectNumber!,
        cursor,
        isOrg,
      });

      const project = isOrg ? data.organization?.projectV2 : data.user?.projectV2;
      if (!project) throw new Error(`GitHub Project #${projectNumber} not found for ${owner}`);

      const { nodes, pageInfo } = project.items;
      for (const item of nodes ?? []) {
        if (!item?.content) continue; // skip items with no content
        const issue = normalizeProjectItem(item);
        if (issue) allItems.push(issue);
      }

      cursor = pageInfo.hasNextPage ? pageInfo.endCursor : null;
    } while (cursor);

    return allItems;
  }
}

function normalizeProjectItem(item: any): UnifiedIssue | null {
  const content = item.content;
  if (!content) return null;

  const isDraft = !content.url; // DraftIssue has no url
  const createdAt = new Date(content.createdAt ?? item.createdAt);
  const closedAt = content.closedAt ? new Date(content.closedAt) : null;
  const updatedAt = new Date(content.updatedAt ?? item.updatedAt);
  const daysOpen = Math.max(0, Math.floor(((closedAt ?? new Date()).getTime() - createdAt.getTime()) / 86400000));

  // Extract status and priority from project field values
  const fieldValues: Array<{ name: string; field: { name: string } }> =
    (item.fieldValues?.nodes ?? []).filter((f: any) => f?.field?.name);

  const statusField = fieldValues.find((f) => f.field.name.toLowerCase() === 'status');
  const priorityField = fieldValues.find((f) => f.field.name.toLowerCase() === 'priority');

  const status = mapProjectStatus(statusField?.name, content.state, closedAt);
  const priority = mapProjectPriority(priorityField?.name, content.labels?.nodes ?? []);

  const labels: string[] = (content.labels?.nodes ?? []).map((l: any) => l.name ?? '');
  const assignees = content.assignees?.nodes ?? [];
  const assignee = assignees[0]?.login ?? null;
  const assigneeId = assignees[0]?.databaseId?.toString() ?? null;

  return {
    id: item.id,
    title: content.title ?? '(no title)',
    status,
    priority,
    assignee,
    assigneeId,
    createdAt,
    closedAt,
    updatedAt,
    daysOpen,
    url: content.url ?? '',
    platform: 'GitHub',
    labels,
    description: (content.body ?? '').slice(0, 500),
  };
}

function mapProjectStatus(
  fieldValue: string | undefined,
  githubState: string | undefined,
  closedAt: Date | null,
): IssueStatus {
  // Closed issues are always Completed regardless of board column
  if (githubState === 'CLOSED' || githubState === 'closed' || closedAt) return 'Completed';

  if (!fieldValue) return 'To-Do';
  const v = fieldValue.toLowerCase();

  if (v.includes('done') || v.includes('complete') || v.includes('closed') || v.includes('finished')) return 'Completed';
  if (v.includes('review')) return 'In Review';
  if (v.includes('progress') || v.includes('doing') || v.includes('active')) return 'In Progress';
  if (v.includes('backlog') || v.includes('icebox') || v.includes('hold')) return 'Backlog';
  return 'To-Do';
}

function mapProjectPriority(
  fieldValue: string | undefined,
  labels: Array<{ name: string }>,
): IssuePriority {
  if (fieldValue) {
    const v = fieldValue.toLowerCase();
    if (v.includes('high') || v.includes('critical') || v.includes('urgent') || v === 'p1') return 'High';
    if (v.includes('low') || v === 'p3') return 'Low';
    return 'Medium';
  }
  // Fall back to labels
  const lowerLabels = labels.map((l) => l.name.toLowerCase());
  if (lowerLabels.some((l) => l.includes('high') || l === 'p1' || l.includes('critical'))) return 'High';
  if (lowerLabels.some((l) => l.includes('low') || l === 'p3')) return 'Low';
  return 'Medium';
}
