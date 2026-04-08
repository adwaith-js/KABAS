import { UnifiedIssue, TeamAnalysis, TeamMemberStats } from '../models/UnifiedIssue.js';

export class AnalysisEngine {
  static calculateEfficiency(
    issues: UnifiedIssue[],
    memberName: string,
    projectDurationDays: number,
  ): number {
    if (projectDurationDays === 0) return 0;
    const completed = issues.filter(
      (i) => (i.assignee === memberName || i.assigneeId === memberName) && i.status === 'Completed',
    );
    if (completed.length === 0) return 0;
    const { avg } = this.calculateAvgAndStdDev(completed);
    return (avg / projectDurationDays) * 100;
  }

  static calculateAvgAndStdDev(completedIssues: UnifiedIssue[]): { avg: number; stdDev: number } {
    if (completedIssues.length === 0) return { avg: 0, stdDev: 0 };
    const times = completedIssues.map((i) => i.daysOpen);
    const avg = times.reduce((sum, t) => sum + t, 0) / times.length;
    const variance = times.reduce((sum, t) => sum + Math.pow(t - avg, 2), 0) / times.length;
    return { avg, stdDev: Math.sqrt(variance) };
  }

  static findMostFlags(issues: UnifiedIssue[]): {
    mostOpened: string | null;
    mostBacklog: string | null;
    mostTodo: string | null;
  } {
    const inProgressCount = new Map<string, number>();
    const backlogCount = new Map<string, number>();
    const todoCount = new Map<string, number>();

    for (const issue of issues) {
      const key = issue.assignee ?? issue.assigneeId ?? 'Unassigned';
      if (issue.status === 'In Progress' || issue.status === 'In Review') inProgressCount.set(key, (inProgressCount.get(key) ?? 0) + 1);
      if (issue.status === 'Backlog') backlogCount.set(key, (backlogCount.get(key) ?? 0) + 1);
      if (issue.status === 'To-Do') todoCount.set(key, (todoCount.get(key) ?? 0) + 1);
    }

    const topKey = (map: Map<string, number>): string | null => {
      if (map.size === 0) return null;
      return [...map.entries()].reduce((a, b) => (b[1] > a[1] ? b : a))[0];
    };

    return {
      mostOpened: topKey(inProgressCount),
      mostBacklog: topKey(backlogCount),
      mostTodo: topKey(todoCount),
    };
  }

  static countTasksPerMember(issues: UnifiedIssue[]): Map<string, number> {
    const counts = new Map<string, number>();
    for (const issue of issues) {
      const key = issue.assignee ?? issue.assigneeId ?? 'Unassigned';
      counts.set(key, (counts.get(key) ?? 0) + 1);
    }
    return counts;
  }

  static detectOutliers(members: TeamMemberStats[]): string[] {
    if (members.length < 2) return [];
    const scores = members.map((m) => m.efficiencyScore);
    const mean = scores.reduce((a, b) => a + b, 0) / scores.length;
    const variance = scores.reduce((sum, s) => sum + Math.pow(s - mean, 2), 0) / scores.length;
    const stdDev = Math.sqrt(variance);
    if (stdDev === 0) return [];
    return members
      .filter((m) => Math.abs(m.efficiencyScore - mean) > 1.5 * stdDev)
      .map((m) => m.name);
  }

  static analyzeTeam(teamId: string, platform: 'GitHub' | 'Jira', issues: UnifiedIssue[]): TeamAnalysis {
    const now = new Date();

    const projectDurationDays =
      issues.length === 0
        ? 0
        : Math.max(
            1,
            Math.floor(
              (now.getTime() - Math.min(...issues.map((i) => i.createdAt.getTime()))) /
                (1000 * 60 * 60 * 24),
            ),
          );

    // Group issues by member key
    const memberMap = new Map<string, UnifiedIssue[]>();
    for (const issue of issues) {
      const key = issue.assigneeId ?? issue.assignee ?? 'Unassigned';
      if (!memberMap.has(key)) memberMap.set(key, []);
      memberMap.get(key)!.push(issue);
    }

    const members: TeamMemberStats[] = [];
    for (const [key, memberIssues] of memberMap) {
      const completed = memberIssues.filter((i) => i.status === 'Completed');
      const inProgress = memberIssues.filter((i) => i.status === 'In Progress');
      const inReview = memberIssues.filter((i) => i.status === 'In Review');
      const backlog = memberIssues.filter((i) => i.status === 'Backlog');
      const toDo = memberIssues.filter((i) => i.status === 'To-Do');

      const { avg, stdDev } = this.calculateAvgAndStdDev(completed);
      const efficiencyScore = projectDurationDays > 0 ? (avg / projectDurationDays) * 100 : 0;

      const openIssues = [...inProgress, ...inReview, ...toDo, ...backlog];
      const latestOpenTask =
        openIssues.length === 0
          ? null
          : openIssues.reduce((a, b) => (b.updatedAt > a.updatedAt ? b : a));

      const latestCompletedTask =
        completed.length === 0
          ? null
          : completed.reduce((a, b) => {
              const aDate = a.closedAt ?? a.updatedAt;
              const bDate = b.closedAt ?? b.updatedAt;
              return bDate > aDate ? b : a;
            });

      const displayName = memberIssues[0].assignee ?? key;

      members.push({
        id: key,
        name: displayName,
        totalTasks: memberIssues.length,
        completed: completed.length,
        inProgress: inProgress.length,
        inReview: inReview.length,
        backlog: backlog.length,
        toDo: toDo.length,
        avgCompletionTime: avg,
        stdDeviation: stdDev,
        efficiencyScore,
        latestOpenTask,
        latestCompletedTask,
      });
    }

    const { mostOpened, mostBacklog, mostTodo } = this.findMostFlags(issues);

    const longestOpenTasks = issues
      .filter((i) => i.status !== 'Completed')
      .sort((a, b) => b.daysOpen - a.daysOpen)
      .slice(0, 5);

    return {
      teamId,
      platform,
      totalTasks: issues.length,
      completed: issues.filter((i) => i.status === 'Completed').length,
      inProgress: issues.filter((i) => i.status === 'In Progress').length,
      inReview: issues.filter((i) => i.status === 'In Review').length,
      backlog: issues.filter((i) => i.status === 'Backlog').length,
      toDo: issues.filter((i) => i.status === 'To-Do').length,
      members,
      mostOpenedMember: mostOpened,
      mostBacklogMember: mostBacklog,
      mostTodoMember: mostTodo,
      longestOpenTasks,
      projectDurationDays,
      fetchedAt: now,
    };
  }
}
