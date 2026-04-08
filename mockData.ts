// Mock data for KABAS application

export interface Team {
  id: string;
  name: string;
  platform: 'GitHub' | 'Jira';
  url: string;
  lastUpdated: Date;
  status: 'Active' | 'Inactive';
  apiToken?: string;
}

export interface TeamMember {
  id: string;
  name: string;
  avatar: string;
  totalTasks: number;
  completed: number;
  inProgress: number;
  backlog: number;
  avgCompletionTime: number;
  stdDeviation: number;
  efficiencyScore: number;
}

export interface Task {
  id: string;
  title: string;
  status: 'To-Do' | 'In Progress' | 'In Review' | 'Completed' | 'Backlog';
  priority: 'High' | 'Medium' | 'Low';
  owner: string;
  ownerId: string;
  createdDate: Date;
  completedDate?: Date;
  daysOpen: number;
  description: string;
}

export const teams: Team[] = [
  {
    id: '1',
    name: 'Team Alpha',
    platform: 'GitHub',
    url: 'github.com/team-alpha/project',
    lastUpdated: new Date('2026-02-10T10:30:00'),
    status: 'Active',
  },
  {
    id: '2',
    name: 'Team Beta',
    platform: 'Jira',
    url: 'teambeta.atlassian.net',
    lastUpdated: new Date('2026-02-09T15:45:00'),
    status: 'Active',
  },
  {
    id: '3',
    name: 'Team Gamma',
    platform: 'GitHub',
    url: 'github.com/team-gamma/kanban',
    lastUpdated: new Date('2026-02-10T09:15:00'),
    status: 'Active',
  },
  {
    id: '4',
    name: 'Team Delta',
    platform: 'Jira',
    url: 'teamdelta.atlassian.net',
    lastUpdated: new Date('2026-02-08T14:20:00'),
    status: 'Inactive',
  },
];

export const teamMembers: Record<string, TeamMember[]> = {
  '1': [
    {
      id: 'm1',
      name: 'Alice Chen',
      avatar: '👩‍💻',
      totalTasks: 18,
      completed: 15,
      inProgress: 2,
      backlog: 1,
      avgCompletionTime: 3.2,
      stdDeviation: 1.1,
      efficiencyScore: 16.7,
    },
    {
      id: 'm2',
      name: 'Bob Kumar',
      avatar: '👨‍💼',
      totalTasks: 15,
      completed: 10,
      inProgress: 3,
      backlog: 2,
      avgCompletionTime: 5.1,
      stdDeviation: 2.3,
      efficiencyScore: 33.3,
    },
    {
      id: 'm3',
      name: 'Charlie Smith',
      avatar: '👨‍🔧',
      totalTasks: 12,
      completed: 11,
      inProgress: 1,
      backlog: 0,
      avgCompletionTime: 2.8,
      stdDeviation: 0.9,
      efficiencyScore: 8.3,
    },
    {
      id: 'm4',
      name: 'Diana Rodriguez',
      avatar: '👩‍🎨',
      totalTasks: 16,
      completed: 12,
      inProgress: 2,
      backlog: 2,
      avgCompletionTime: 4.5,
      stdDeviation: 1.8,
      efficiencyScore: 25.0,
    },
  ],
  '2': [
    {
      id: 'm5',
      name: 'Emma Wilson',
      avatar: '👩‍💼',
      totalTasks: 20,
      completed: 16,
      inProgress: 3,
      backlog: 1,
      avgCompletionTime: 3.9,
      stdDeviation: 1.5,
      efficiencyScore: 20.0,
    },
    {
      id: 'm6',
      name: 'Frank Zhang',
      avatar: '👨‍💻',
      totalTasks: 14,
      completed: 10,
      inProgress: 2,
      backlog: 2,
      avgCompletionTime: 6.2,
      stdDeviation: 2.7,
      efficiencyScore: 28.6,
    },
  ],
  '3': [
    {
      id: 'm7',
      name: 'Grace Lee',
      avatar: '👩‍🔬',
      totalTasks: 17,
      completed: 14,
      inProgress: 2,
      backlog: 1,
      avgCompletionTime: 3.5,
      stdDeviation: 1.2,
      efficiencyScore: 17.6,
    },
    {
      id: 'm8',
      name: 'Henry Patel',
      avatar: '👨‍🎓',
      totalTasks: 13,
      completed: 9,
      inProgress: 3,
      backlog: 1,
      avgCompletionTime: 4.8,
      stdDeviation: 2.1,
      efficiencyScore: 30.8,
    },
    {
      id: 'm9',
      name: 'Iris Johnson',
      avatar: '👩‍⚕️',
      totalTasks: 11,
      completed: 10,
      inProgress: 1,
      backlog: 0,
      avgCompletionTime: 2.5,
      stdDeviation: 0.8,
      efficiencyScore: 9.1,
    },
  ],
};

export const tasks: Record<string, Task[]> = {
  '1': [
    {
      id: 't1',
      title: 'Implement user authentication',
      status: 'Completed',
      priority: 'High',
      owner: 'Alice Chen',
      ownerId: 'm1',
      createdDate: new Date('2026-02-05'),
      completedDate: new Date('2026-02-08'),
      daysOpen: 3,
      description: 'Set up OAuth2 authentication flow with JWT tokens for secure user login.',
    },
    {
      id: 't2',
      title: 'Fix dashboard bug #42',
      status: 'In Progress',
      priority: 'High',
      owner: 'Alice Chen',
      ownerId: 'm1',
      createdDate: new Date('2026-02-08'),
      daysOpen: 2,
      description: 'Dashboard crashes when loading more than 50 items. Need to implement pagination.',
    },
    {
      id: 't3',
      title: 'Design new landing page',
      status: 'Completed',
      priority: 'Medium',
      owner: 'Diana Rodriguez',
      ownerId: 'm4',
      createdDate: new Date('2026-02-01'),
      completedDate: new Date('2026-02-06'),
      daysOpen: 5,
      description: 'Create a modern, responsive landing page with hero section and feature highlights.',
    },
    {
      id: 't4',
      title: 'Optimize database queries',
      status: 'In Progress',
      priority: 'High',
      owner: 'Bob Kumar',
      ownerId: 'm2',
      createdDate: new Date('2026-01-28'),
      daysOpen: 13,
      description: 'Several queries are taking >3s to execute. Add indexes and optimize joins.',
    },
    {
      id: 't5',
      title: 'Write API documentation',
      status: 'To-Do',
      priority: 'Medium',
      owner: 'Charlie Smith',
      ownerId: 'm3',
      createdDate: new Date('2026-02-07'),
      daysOpen: 3,
      description: 'Document all REST API endpoints with examples and response schemas.',
    },
    {
      id: 't6',
      title: 'Set up CI/CD pipeline',
      status: 'Completed',
      priority: 'High',
      owner: 'Charlie Smith',
      ownerId: 'm3',
      createdDate: new Date('2026-01-20'),
      completedDate: new Date('2026-01-23'),
      daysOpen: 3,
      description: 'Configure automated testing and deployment pipeline using GitHub Actions.',
    },
    {
      id: 't7',
      title: 'Add dark mode support',
      status: 'Backlog',
      priority: 'Low',
      owner: 'Diana Rodriguez',
      ownerId: 'm4',
      createdDate: new Date('2026-02-02'),
      daysOpen: 8,
      description: 'Implement theme switching functionality with dark mode color palette.',
    },
    {
      id: 't8',
      title: 'Mobile app responsive design',
      status: 'In Progress',
      priority: 'Medium',
      owner: 'Bob Kumar',
      ownerId: 'm2',
      createdDate: new Date('2026-02-04'),
      daysOpen: 6,
      description: 'Ensure all pages are fully responsive and work well on mobile devices.',
    },
    {
      id: 't9',
      title: 'Implement email notifications',
      status: 'Completed',
      priority: 'Medium',
      owner: 'Alice Chen',
      ownerId: 'm1',
      createdDate: new Date('2026-01-25'),
      completedDate: new Date('2026-01-28'),
      daysOpen: 3,
      description: 'Send email notifications for important events using SendGrid API.',
    },
    {
      id: 't10',
      title: 'Security audit and fixes',
      status: 'In Progress',
      priority: 'High',
      owner: 'Bob Kumar',
      ownerId: 'm2',
      createdDate: new Date('2026-01-30'),
      daysOpen: 11,
      description: 'Conduct security audit and fix identified vulnerabilities.',
    },
  ],
  '2': [
    {
      id: 't11',
      title: 'Refactor legacy codebase',
      status: 'In Progress',
      priority: 'High',
      owner: 'Emma Wilson',
      ownerId: 'm5',
      createdDate: new Date('2026-01-25'),
      daysOpen: 16,
      description: 'Modernize old code to use latest React patterns and TypeScript.',
    },
    {
      id: 't12',
      title: 'Add search functionality',
      status: 'Completed',
      priority: 'Medium',
      owner: 'Frank Zhang',
      ownerId: 'm6',
      createdDate: new Date('2026-02-03'),
      completedDate: new Date('2026-02-08'),
      daysOpen: 5,
      description: 'Implement full-text search with filters and sorting options.',
    },
  ],
  '3': [
    {
      id: 't13',
      title: 'Migrate to microservices',
      status: 'In Progress',
      priority: 'High',
      owner: 'Grace Lee',
      ownerId: 'm7',
      createdDate: new Date('2026-01-15'),
      daysOpen: 26,
      description: 'Break down monolithic application into independent microservices.',
    },
    {
      id: 't14',
      title: 'Performance optimization',
      status: 'Completed',
      priority: 'High',
      owner: 'Iris Johnson',
      ownerId: 'm9',
      createdDate: new Date('2026-02-06'),
      completedDate: new Date('2026-02-09'),
      daysOpen: 3,
      description: 'Improve page load time by optimizing images and lazy loading components.',
    },
  ],
};

export function getTeamStats(teamId: string) {
  const members = teamMembers[teamId] || [];
  const teamTasks = tasks[teamId] || [];

  const totalTasks = teamTasks.length;
  const completed = teamTasks.filter(t => t.status === 'Completed').length;
  const inProgress = teamTasks.filter(t => t.status === 'In Progress').length;
  const backlog = teamTasks.filter(t => t.status === 'Backlog').length;
  const toDo = teamTasks.filter(t => t.status === 'To-Do').length;

  return {
    totalTasks,
    completed,
    inProgress,
    backlog,
    toDo,
    members: members.length,
  };
}

export function getLongestOpenTasks(teamId: string, limit: number = 3) {
  const teamTasks = tasks[teamId] || [];
  const openTasks = teamTasks.filter(t => t.status === 'In Progress' || t.status === 'To-Do');
  return openTasks.sort((a, b) => b.daysOpen - a.daysOpen).slice(0, limit);
}
