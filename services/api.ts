const BASE_URL = (import.meta.env.VITE_API_URL as string) || 'http://localhost:3001';

export interface Team {
  id: string;
  name: string;
  platform: 'GitHub' | 'Jira';
  url: string;
  apiToken?: string;
  jiraEmail?: string;
  projectKey?: string;
  status: 'Active' | 'Inactive';
  addedAt: string;
  lastSynced?: string;
}

export interface UnifiedIssue {
  id: string;
  title: string;
  status: 'To-Do' | 'In Progress' | 'In Review' | 'Completed' | 'Backlog';
  priority: 'High' | 'Medium' | 'Low';
  assignee: string | null;
  assigneeId: string | null;
  createdAt: string;
  closedAt: string | null;
  updatedAt: string;
  daysOpen: number;
  url: string;
  platform: 'GitHub' | 'Jira';
  labels: string[];
  description: string;
}

export interface TeamMemberStats {
  id: string;
  name: string;
  totalTasks: number;
  completed: number;
  inProgress: number;
  inReview: number;
  backlog: number;
  toDo: number;
  avgCompletionTime: number;
  stdDeviation: number;
  efficiencyScore: number;
  latestOpenTask: UnifiedIssue | null;
  latestCompletedTask: UnifiedIssue | null;
}

export interface TeamAnalysis {
  teamId: string;
  platform: 'GitHub' | 'Jira';
  totalTasks: number;
  completed: number;
  inProgress: number;
  inReview: number;
  backlog: number;
  toDo: number;
  members: TeamMemberStats[];
  mostOpenedMember: string | null;
  mostBacklogMember: string | null;
  mostTodoMember: string | null;
  longestOpenTasks: UnifiedIssue[];
  projectDurationDays: number;
  fetchedAt: string;
}

async function request<T>(path: string, options?: RequestInit): Promise<T> {
  const res = await fetch(`${BASE_URL}${path}`, {
    headers: { 'Content-Type': 'application/json', ...(options?.headers ?? {}) },
    ...options,
  });
  if (!res.ok) {
    const text = await res.text();
    let message = `Request failed: ${res.status}`;
    try {
      const json = JSON.parse(text);
      message = (json as { error?: string }).error ?? message;
    } catch { /* body was HTML or empty — keep the status message */ }
    throw new Error(message);
  }
  const json = await res.json();
  return (json as { data: T }).data;
}

export const api = {
  teams: {
    list: (): Promise<Team[]> => request<Team[]>('/api/teams'),

    get: (id: string): Promise<Team> => request<Team>(`/api/teams/${id}`),

    create: (data: Partial<Team>): Promise<Team> =>
      request<Team>('/api/teams', { method: 'POST', body: JSON.stringify(data) }),

    update: (id: string, data: Partial<Team>): Promise<Team> =>
      request<Team>(`/api/teams/${id}`, { method: 'PUT', body: JSON.stringify(data) }),

    delete: (id: string): Promise<void> =>
      request<void>(`/api/teams/${id}`, { method: 'DELETE' }),

    test: (id: string): Promise<{ success: boolean; message: string }> =>
      request<{ success: boolean; message: string }>(`/api/teams/${id}/test`, { method: 'POST' }),
  },

  analysis: {
    getTeamAnalysis: (teamId: string): Promise<TeamAnalysis> =>
      request<TeamAnalysis>(`/api/analysis/${teamId}`),

    getIssues: (teamId: string): Promise<UnifiedIssue[]> =>
      request<UnifiedIssue[]>(`/api/analysis/${teamId}/issues`),

    getMembers: (teamId: string): Promise<TeamMemberStats[]> =>
      request<TeamMemberStats[]>(`/api/analysis/${teamId}/members`),
  },
};
