import { UnifiedIssue, normalizeJiraIssue } from '../models/UnifiedIssue.js';

export interface JiraCredentials {
  baseUrl: string;
  projectKey: string;
  email: string;
  apiToken: string;
}

export class JiraAPIClient {
  private baseUrl: string;
  private projectKey: string;
  private authHeader: string;
  private apiVersion: 'v3' | 'v2' | null = null; // cached after first successful call

  constructor(credentials: JiraCredentials) {
    this.baseUrl = credentials.baseUrl.replace(/\/$/, '');
    this.projectKey = credentials.projectKey;
    this.authHeader = `Basic ${Buffer.from(`${credentials.email}:${credentials.apiToken}`).toString('base64')}`;
  }

  static parseJiraUrl(url: string): { baseUrl: string; projectKey: string } {
    const withProto = url.startsWith('http') ? url : `https://${url}`;
    const parsed = new URL(withProto);
    const baseUrl = `${parsed.protocol}//${parsed.host}`;
    const pathParts = parsed.pathname.split('/').filter(Boolean);
    const browseIdx = pathParts.indexOf('browse');
    const projectsIdx = pathParts.indexOf('projects');
    let projectKey = '';
    if (browseIdx !== -1 && pathParts[browseIdx + 1]) {
      projectKey = pathParts[browseIdx + 1].split('-')[0];
    } else if (projectsIdx !== -1 && pathParts[projectsIdx + 1]) {
      projectKey = pathParts[projectsIdx + 1];
    }
    return { baseUrl, projectKey };
  }

  // Detect which API version the instance supports (v3 for Cloud, v2 for Server/Data Center)
  private async detectApiVersion(): Promise<'v3' | 'v2'> {
    if (this.apiVersion) return this.apiVersion;

    const probe = await fetch(`${this.baseUrl}/rest/api/3/serverInfo`, {
      headers: { Authorization: this.authHeader, Accept: 'application/json' },
    });

    this.apiVersion = probe.ok ? 'v3' : 'v2';
    return this.apiVersion;
  }

  async fetchAllIssues(): Promise<UnifiedIssue[]> {
    if (!this.projectKey) throw new Error('Jira project key is required. Enter it in the Project Key field or include it in the board URL.');

    const version = await this.detectApiVersion();
    return version === 'v3' ? this.fetchAllV3() : this.fetchAllV2();
  }

  // Jira Cloud: POST /rest/api/3/search/jql — cursor-based pagination via nextPageToken
  private async fetchAllV3(): Promise<UnifiedIssue[]> {
    const fields = ['summary', 'status', 'priority', 'assignee', 'created', 'resolutiondate', 'updated', 'description', 'labels', 'issuetype'];
    const jql = `project = ${this.projectKey} ORDER BY created DESC`;
    const allRaw: any[] = [];
    let nextPageToken: string | undefined;

    do {
      const body: Record<string, unknown> = { jql, maxResults: 100, fields };
      if (nextPageToken) body.nextPageToken = nextPageToken;

      const response = await fetch(`${this.baseUrl}/rest/api/3/search/jql`, {
        method: 'POST',
        headers: { Authorization: this.authHeader, Accept: 'application/json', 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
      });

      if (!response.ok) {
        const text = await response.text().catch(() => '');
        throw new Error(`Jira API error: ${response.status} ${response.statusText}${text ? ` — ${text.slice(0, 300)}` : ''}`);
      }

      const data = await response.json();
      allRaw.push(...(data.issues ?? []));
      nextPageToken = data.nextPageToken ?? undefined;
    } while (nextPageToken);

    return allRaw.map((issue) => normalizeJiraIssue(issue));
  }

  // Jira Server / Data Center: GET /rest/api/2/search — offset-based pagination
  private async fetchAllV2(): Promise<UnifiedIssue[]> {
    const fields = 'summary,status,priority,assignee,created,resolutiondate,updated,description,labels,issuetype';
    const jql = `project = ${this.projectKey} ORDER BY created DESC`;
    const allRaw: any[] = [];
    let startAt = 0;
    let total = Infinity;

    while (startAt < total) {
      const params = new URLSearchParams({ jql, maxResults: '100', startAt: String(startAt), fields });
      const response = await fetch(`${this.baseUrl}/rest/api/2/search?${params}`, {
        headers: { Authorization: this.authHeader, Accept: 'application/json' },
      });

      if (!response.ok) {
        const text = await response.text().catch(() => '');
        throw new Error(`Jira API error: ${response.status} ${response.statusText}${text ? ` — ${text.slice(0, 300)}` : ''}`);
      }

      const data = await response.json();
      total = data.total ?? 0;
      allRaw.push(...(data.issues ?? []));
      startAt += (data.issues ?? []).length;
      if ((data.issues ?? []).length === 0) break;
    }

    return allRaw.map((issue) => normalizeJiraIssue(issue));
  }

  async testConnection(): Promise<boolean> {
    try {
      const version = await this.detectApiVersion();
      // Use the project endpoint to validate credentials + project key
      const apiBase = version === 'v3' ? '3' : '2';
      const url = `${this.baseUrl}/rest/api/${apiBase}/project/${encodeURIComponent(this.projectKey)}`;
      const response = await fetch(url, {
        headers: { Authorization: this.authHeader, Accept: 'application/json' },
      });
      return response.ok;
    } catch {
      return false;
    }
  }
}
