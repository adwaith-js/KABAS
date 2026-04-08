export type IssueStatus = 'To-Do' | 'In Progress' | 'In Review' | 'Completed' | 'Backlog';
export type IssuePriority = 'High' | 'Medium' | 'Low';
export type Platform = 'GitHub' | 'Jira';

export interface UnifiedIssue {
  id: string;
  title: string;
  status: IssueStatus;
  priority: IssuePriority;
  assignee: string | null;
  assigneeId: string | null;
  createdAt: Date;
  closedAt: Date | null;
  updatedAt: Date;
  daysOpen: number;
  url: string;
  platform: Platform;
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
  platform: Platform;
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
  fetchedAt: Date;
}

function calcDaysOpen(createdAt: Date, closedAt: Date | null): number {
  const end = closedAt ?? new Date();
  return Math.max(0, Math.floor((end.getTime() - createdAt.getTime()) / (1000 * 60 * 60 * 24)));
}

export function normalizeGitHubIssue(raw: any): UnifiedIssue {
  const labels: string[] = (raw.labels ?? []).map((l: any) => (typeof l === 'string' ? l : l.name ?? ''));
  const lowerLabels = labels.map((l) => l.toLowerCase());

  let status: IssueStatus;
  if (raw.state === 'closed') {
    status = 'Completed';
  } else if (lowerLabels.includes('backlog')) {
    status = 'Backlog';
  } else if (lowerLabels.some((l) => l.includes('review'))) {
    status = 'In Review';
  } else if (lowerLabels.includes('in progress') || lowerLabels.includes('doing')) {
    status = 'In Progress';
  } else {
    status = 'To-Do';
  }

  let priority: IssuePriority;
  if (lowerLabels.includes('high') || lowerLabels.includes('p1') || lowerLabels.includes('critical')) {
    priority = 'High';
  } else if (lowerLabels.includes('low') || lowerLabels.includes('p3')) {
    priority = 'Low';
  } else {
    priority = 'Medium';
  }

  const createdAt = new Date(raw.created_at);
  const closedAt = raw.closed_at ? new Date(raw.closed_at) : null;

  return {
    id: raw.id?.toString() ?? raw.number?.toString() ?? '',
    title: raw.title ?? '',
    status,
    priority,
    assignee: raw.assignee?.login ?? null,
    assigneeId: raw.assignee?.id?.toString() ?? null,
    createdAt,
    closedAt,
    updatedAt: new Date(raw.updated_at),
    daysOpen: calcDaysOpen(createdAt, closedAt),
    url: raw.html_url ?? '',
    platform: 'GitHub',
    labels,
    description: (raw.body ?? '').slice(0, 500),
  };
}

export function normalizeJiraIssue(raw: any): UnifiedIssue {
  const fields = raw.fields ?? {};
  const labels: string[] = fields.labels ?? [];

  const statusName: string = fields.status?.name ?? '';
  let status: IssueStatus;
  if (['Done', 'Closed', 'Resolved'].includes(statusName)) {
    status = 'Completed';
  } else if (['In Review', 'Review', 'Code Review', 'Under Review', 'Reviewing'].includes(statusName)) {
    status = 'In Review';
  } else if (['In Progress', 'In Development', 'Doing'].includes(statusName)) {
    status = 'In Progress';
  } else if (statusName === 'Backlog') {
    status = 'Backlog';
  } else {
    status = 'To-Do';
  }

  const priorityName: string = fields.priority?.name ?? '';
  let priority: IssuePriority;
  if (['Highest', 'High', 'Critical'].includes(priorityName)) {
    priority = 'High';
  } else if (['Low', 'Lowest'].includes(priorityName)) {
    priority = 'Low';
  } else {
    priority = 'Medium';
  }

  const createdAt = new Date(fields.created);
  const closedAt = fields.resolutiondate ? new Date(fields.resolutiondate) : null;

  let description = '';
  if (fields.description) {
    if (typeof fields.description === 'string') {
      description = fields.description.slice(0, 500);
    } else {
      description = (fields.summary ?? '').slice(0, 500);
    }
  } else {
    description = (fields.summary ?? '').slice(0, 500);
  }

  return {
    id: raw.id ?? raw.key ?? '',
    title: fields.summary ?? '',
    status,
    priority,
    assignee: fields.assignee?.displayName ?? null,
    assigneeId: fields.assignee?.accountId ?? null,
    createdAt,
    closedAt,
    updatedAt: new Date(fields.updated),
    daysOpen: calcDaysOpen(createdAt, closedAt),
    url: raw.self ? `${raw.self.split('/rest/')[0]}/browse/${raw.key}` : '',
    platform: 'Jira',
    labels,
    description,
  };
}
