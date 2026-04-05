import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router';
import { ArrowLeft, Users, Target, Clock, TrendingUp, RefreshCw, ChevronDown, ChevronUp, AlertTriangle } from 'lucide-react';
import { Button } from '../components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../components/ui/select';
import { MetricCard } from '../components/MetricCard';
import { TaskCard } from '../components/TaskCard';
import { PlatformBadge } from '../components/PlatformBadge';
import { StatusBadge } from '../components/StatusBadge';
import { TaskDistributionModal } from '../components/TaskDistributionModal';
import { TaskStatusModal } from '../components/TaskStatusModal';
import { LongestTasksModal } from '../components/LongestTasksModal';
import { Task, TeamMember } from '../data/mockData';
import { api, TeamAnalysis, UnifiedIssue, TeamMemberStats } from '../services/api';
import { AnalysisEngine } from '../services/analysisEngine';
import { PieChart, Pie, Cell, ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip as RechartsTooltip } from 'recharts';

function toMockTask(issue: UnifiedIssue): Task {
    return {
        id: issue.id,
        title: issue.title,
        status: issue.status,
        priority: issue.priority,
        owner: issue.assignee ?? 'Unassigned',
        ownerId: issue.assigneeId ?? issue.assignee ?? 'Unassigned',
        createdDate: new Date(issue.createdAt),
        completedDate: issue.closedAt ? new Date(issue.closedAt) : undefined,
        daysOpen: issue.daysOpen,
        description: issue.description,
    };
}

function toMockMember(m: TeamMemberStats): TeamMember {
    return {
        id: m.id,
        name: m.name,
        avatar: m.name.charAt(0).toUpperCase(),
        totalTasks: m.totalTasks,
        completed: m.completed,
        inProgress: m.inProgress,
        backlog: m.backlog,
        avgCompletionTime: m.avgCompletionTime,
        stdDeviation: m.stdDeviation,
        efficiencyScore: m.efficiencyScore,
    };
}

export function TeamDashboard() {
    const { teamId } = useParams();

    const [dateRange, setDateRange] = useState('30');
    const [sortColumn, setSortColumn] = useState<string>('name');
    const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('asc');
    const [expandedMember, setExpandedMember] = useState<string | null>(null);
    const [distModalOpen, setDistModalOpen] = useState(false);
    const [statusModalOpen, setStatusModalOpen] = useState(false);
    const [statusModalTab, setStatusModalTab] = useState<'To-Do' | 'In Progress' | 'In Review' | 'Completed' | 'Backlog'>('To-Do');
    const [longestModalOpen, setLongestModalOpen] = useState(false);

    const [analysis, setAnalysis] = useState<TeamAnalysis | null>(null);
    const [issues, setIssues] = useState<UnifiedIssue[]>([]);
    const [loading, setLoading] = useState(true);
    const [syncing, setSyncing] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [teamName, setTeamName] = useState<string>('');

    async function loadData(forceRefresh = false) {
        if (!teamId) return;

        try {
            if (forceRefresh) setSyncing(true);
            else setLoading(true);
            setError(null);

            const [teamData, analysisData, issuesData] = await Promise.all([
                api.teams.get(teamId),
                api.analysis.getTeamAnalysis(teamId),
                api.analysis.getIssues(teamId),
            ]);

            setTeamName(teamData.name);
            setAnalysis(analysisData);
            setIssues(issuesData);

        } catch (err: any) {
            setError(err.message ?? 'Failed to load team data');

        } finally {
            setLoading(false);
            setSyncing(false);
        }
    }

    useEffect(() => {
        loadData();
    }, [teamId]);

    if (loading) {
        return (
            <div className="min-h-screen bg-gray-50">
                <div className="max-w-[1600px] mx-auto p-8">
                    <div className="animate-pulse space-y-6">
                        <div className="h-8 bg-gray-200 rounded w-1/3" />
                        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
                            {[1, 2, 3, 4].map((i) => (
                                <div key={i} className="h-40 bg-gray-200 rounded-lg" />
                            ))}
                        </div>
                        <div className="h-64 bg-gray-200 rounded-lg" />
                    </div>
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="min-h-screen bg-gray-50">
                <div className="max-w-[1600px] mx-auto p-8">
                    <Link to="/dashboard">
                        <Button variant="ghost" className="mb-4 -ml-4">
                            <ArrowLeft className="h-4 w-4 mr-2" />
                            Back to All Teams
                        </Button>
                    </Link>

                    <div className="p-6 bg-red-50 border border-red-200 rounded-lg text-red-700">
                        <p className="font-semibold mb-1">Failed to load team data</p>
                        <p className="text-sm">{error}</p>
                        <Button onClick={() => loadData()} className="mt-4" variant="outline">
                            Retry
                        </Button>
                    </div>

                </div>
            </div>
        );
    }

    if (!analysis) {
        return <div className="p-8 text-center">Team not found</div>;
    }

    const members = analysis.members;
    const mockMembers = members.map(toMockMember);
    const mockTasks = issues.map(toMockTask);

    const statusBreakdown = {
        'To-Do': analysis.toDo,
        'In Progress': analysis.inProgress,
        'In Review': analysis.inReview,
        'Completed': analysis.completed,
        'Backlog': analysis.backlog,
    };

    const pieData = [
        { name: 'To-Do', value: statusBreakdown['To-Do'], color: '#0066CC' },
        { name: 'In Progress', value: statusBreakdown['In Progress'], color: '#FFC107' },
        { name: 'In Review', value: statusBreakdown['In Review'], color: '#6F42C1' },
        { name: 'Completed', value: statusBreakdown['Completed'], color: '#28A745' },
        { name: 'Backlog', value: statusBreakdown['Backlog'], color: '#DC3545' },
    ];

    const memberDistribution = members.map((m) => ({
        name: m.name,
        tasks: m.totalTasks,
    }));

    const openStatusModal = (tab: 'To-Do' | 'In Progress' | 'In Review' | 'Completed' | 'Backlog') => {
        setStatusModalTab(tab);
        setStatusModalOpen(true);
    };

    const longestTasks = analysis.longestOpenTasks.slice(0, 3);
    const mockLongestTasks = longestTasks.map(toMockTask);

    const outliers = AnalysisEngine.detectOutliers(members);

    const sortedMembers = [...members].sort((a, b) => {

        const aVal = a[sortColumn as keyof TeamMemberStats] as any;
        const bVal = b[sortColumn as keyof TeamMemberStats] as any;

        if (sortColumn === 'name') {
            return sortDirection === 'asc'
                ? String(aVal).localeCompare(String(bVal))
                : String(bVal).localeCompare(String(aVal));
        }

        return sortDirection === 'asc' ? Number(aVal) - Number(bVal) : Number(bVal) - Number(aVal);
    });

    const handleSort = (column: string) => {
        if (sortColumn === column) {
            setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
        } else {
            setSortColumn(column);
            setSortDirection('asc');
        }
    };

    const SortIcon = ({ column }: { column: string }) => {
        if (sortColumn !== column) return null;
        return sortDirection === 'asc' ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />;
    };

    return (
        <div className="min-h-screen bg-gray-50">
            <div className="max-w-[1600px] mx-auto p-8">
                {/* Header */}
                <div className="mb-8">
                    <Link to="/dashboard">
                        <Button variant="ghost" className="mb-4 -ml-4">
                            <ArrowLeft className="h-4 w-4 mr-2" />
                            Back to All Teams
                        </Button>
                    </Link>

                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-4">
                            <h1 className="text-3xl font-bold text-gray-900">{teamName}</h1>
                            <PlatformBadge platform={analysis.platform} />
                        </div>

                        <div className="flex items-center gap-3">
                            <Select value={dateRange} onValueChange={setDateRange}>
                                <SelectTrigger className="w-[180px]">
                                    <SelectValue />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="7">Last 7 days</SelectItem>
                                    <SelectItem value="30">Last 30 days</SelectItem>
                                    <SelectItem value="all">All time</SelectItem>
                                </SelectContent>
                            </Select>

                            <Button
                                className="bg-[#2C5F8D] hover:bg-[#234a6f] gap-2"
                                onClick={() => loadData(true)}
                                disabled={syncing}
                            >
                                <RefreshCw className={`h-4 w-4 ${syncing ? 'animate-spin' : ''}`} />
                                {syncing ? 'Syncing...' : 'Sync Now'}
                            </Button>
                        </div>
                    </div>
                </div>

                {/* Section 1: Task Distribution Overview */}
                <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">

                    {/* Card 1: Total Tasks by Member */}
                    <MetricCard
                        title="Total Tasks by Member"
                        value=""
                        icon={Users}
                        onClick={() => setDistModalOpen(true)}
                    >
                        <div className="h-40 -mx-2">
                            <ResponsiveContainer width="100%" height="100%">
                                <BarChart data={memberDistribution}>
                                    <XAxis dataKey="name" tick={{ fontSize: 10 }} angle={-45} textAnchor="end" height={60} />
                                    <YAxis tick={{ fontSize: 10 }} />
                                    <RechartsTooltip />
                                    <Bar dataKey="tasks" fill="#2C5F8D" />
                                </BarChart>
                            </ResponsiveContainer>
                        </div>
                    </MetricCard>

                    {/* Card 2: Task Status Breakdown */}
                    <MetricCard
                        title="Task Status Breakdown"
                        value=""
                        icon={Target}
                        onClick={() => setStatusModalOpen(true)}
                    >
                        <div className="h-40 flex items-center justify-center">
                            <ResponsiveContainer width="100%" height="100%">
                                <PieChart>
                                    <Pie
                                        data={pieData}
                                        cx="50%"
                                        cy="50%"
                                        innerRadius={30}
                                        outerRadius={60}
                                        paddingAngle={2}
                                        dataKey="value"
                                    >
                                        {pieData.map((entry, index) => (
                                            <Cell key={`cell-${index}`} fill={entry.color} />
                                        ))}
                                    </Pie>
                                    <RechartsTooltip />
                                </PieChart>
                            </ResponsiveContainer>
                        </div>
                        <div className="text-center text-2xl font-bold text-gray-900 -mt-4">
                            {analysis.totalTasks}
                        </div>
                    </MetricCard>

                    {/* Card 3: Longest Open Tasks */}
                    <MetricCard
                        title="Longest Open Tasks"
                        value=""
                        icon={Clock}
                        onClick={() => setLongestModalOpen(true)}
                    >
                        <div className="space-y-2">
                            {longestTasks.map((task) => (
                                <div key={task.id} className="text-xs">
                                    <div className="font-medium text-gray-900 truncate">{task.title}</div>
                                    <div className="text-gray-500 flex justify-between">
                                        <span>{task.assignee ?? 'Unassigned'}</span>
                                        <span className="font-semibold text-orange-600">{task.daysOpen} days</span>
                                    </div>
                                </div>
                            ))}
                            {longestTasks.length === 0 && (
                                <div className="text-xs text-gray-400">No open tasks</div>
                            )}
                        </div>
                    </MetricCard>

                    {/* Card 4: Key Insights */}
                    <MetricCard title="Key Insights" value="" icon={TrendingUp}>
                        <div className="space-y-3 text-sm">
                            <div>
                                <div className="text-xs text-gray-500">Most Opened Tasks</div>
                                <div className="font-semibold text-gray-900">{analysis.mostOpenedMember ?? '—'}</div>
                                <div className="text-xs text-blue-600">
                                    {analysis.mostOpenedMember
                                        ? `${members.find((m) => m.name === analysis.mostOpenedMember || m.id === analysis.mostOpenedMember)?.inProgress ?? 0} in progress`
                                        : ''}
                                </div>
                            </div>
                            <div>
                                <div className="text-xs text-gray-500">Most Backlog Tasks</div>
                                <div className="font-semibold text-gray-900">{analysis.mostBacklogMember ?? '—'}</div>
                                <div className="text-xs text-red-600">
                                    {analysis.mostBacklogMember
                                        ? `${members.find((m) => m.name === analysis.mostBacklogMember || m.id === analysis.mostBacklogMember)?.backlog ?? 0} backlog`
                                        : ''}
                                </div>
                            </div>
                            <div>
                                <div className="text-xs text-gray-500">Most To-Do Tasks</div>
                                <div className="font-semibold text-gray-900">{analysis.mostTodoMember ?? '—'}</div>
                                <div className="text-xs text-gray-600">
                                    {analysis.mostTodoMember
                                        ? `${members.find((m) => m.name === analysis.mostTodoMember || m.id === analysis.mostTodoMember)?.toDo ?? 0} to-do`
                                        : ''}
                                </div>
                            </div>
                        </div>
                    </MetricCard>
                </div>

                {/* Section 2: Status Counters — requirement: "Total number of to-do, opened/in-process, completed and backlog tasks/issues" */}
                <div className="grid grid-cols-5 gap-4 mb-8">
                    {(
                        [
                            { label: 'To-Do', count: analysis.toDo, color: 'bg-blue-50 border-blue-200 text-blue-700', tab: 'To-Do' },
                            { label: 'In Progress', count: analysis.inProgress, color: 'bg-yellow-50 border-yellow-200 text-yellow-700', tab: 'In Progress' },
                            { label: 'In Review', count: analysis.inReview, color: 'bg-purple-50 border-purple-200 text-purple-700', tab: 'In Review' },
                            { label: 'Completed', count: analysis.completed, color: 'bg-green-50 border-green-200 text-green-700', tab: 'Completed' },
                            { label: 'Backlog', count: analysis.backlog, color: 'bg-red-50 border-red-200 text-red-700', tab: 'Backlog' },
                        ] as const
                    ).map(({ label, count, color, tab }) => (
                        <button
                            key={tab}
                            onClick={() => openStatusModal(tab)}
                            className={`border rounded-lg p-5 text-left hover:shadow-md transition-shadow ${color}`}
                        >
                            <div className="text-sm font-medium mb-1">{label}</div>
                            <div className="text-4xl font-bold">{count}</div>
                            <div className="text-xs mt-1 opacity-70">Click to view tasks</div>
                        </button>
                    ))}
                </div>

                {/* Section 4: Team Member Performance Table */}
                <div className="bg-white rounded-lg shadow-sm border border-gray-200 mb-8 overflow-hidden">
                    <div className="p-6 border-b border-gray-200">
                        <h2 className="text-xl font-bold text-gray-900">Team Member Performance</h2>
                    </div>

                    <div className="overflow-x-auto">
                        <table className="w-full">
                            <thead className="bg-gray-50">
                                <tr>
                                    <th
                                        className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider cursor-pointer hover:bg-gray-100"
                                        onClick={() => handleSort('name')}
                                    >
                                        <div className="flex items-center gap-1">Member Name <SortIcon column="name" /></div>
                                    </th>
                                    <th
                                        className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider cursor-pointer hover:bg-gray-100"
                                        onClick={() => handleSort('totalTasks')}
                                    >
                                        <div className="flex items-center gap-1">Total <SortIcon column="totalTasks" /></div>
                                    </th>
                                    <th
                                        className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider cursor-pointer hover:bg-gray-100"
                                        onClick={() => handleSort('completed')}
                                    >
                                        <div className="flex items-center gap-1">Completed <SortIcon column="completed" /></div>
                                    </th>
                                    <th
                                        className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider cursor-pointer hover:bg-gray-100"
                                        onClick={() => handleSort('toDo')}
                                    >
                                        <div className="flex items-center gap-1">To-Do <SortIcon column="toDo" /></div>
                                    </th>
                                    <th
                                        className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider cursor-pointer hover:bg-gray-100"
                                        onClick={() => handleSort('inProgress')}
                                    >
                                        <div className="flex items-center gap-1">In Progress <SortIcon column="inProgress" /></div>
                                    </th>
                                    <th
                                        className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider cursor-pointer hover:bg-gray-100"
                                        onClick={() => handleSort('inReview')}
                                    >
                                        <div className="flex items-center gap-1">In Review <SortIcon column="inReview" /></div>
                                    </th>
                                    <th
                                        className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider cursor-pointer hover:bg-gray-100"
                                        onClick={() => handleSort('backlog')}
                                    >
                                        <div className="flex items-center gap-1">Backlog <SortIcon column="backlog" /></div>
                                    </th>
                                    <th
                                        className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider cursor-pointer hover:bg-gray-100"
                                        onClick={() => handleSort('avgCompletionTime')}
                                    >
                                        <div className="flex items-center gap-1">Avg. Time (days) <SortIcon column="avgCompletionTime" /></div>
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                                        Std. Dev
                                    </th>
                                    <th
                                        className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider cursor-pointer hover:bg-gray-100"
                                        onClick={() => handleSort('efficiencyScore')}
                                    >
                                        <div className="flex items-center gap-1">Efficiency <SortIcon column="efficiencyScore" /></div>
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                                        Latest Task
                                    </th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-200">
                                {sortedMembers.map((member) => {
                                    const completionPercentage = member.totalTasks > 0 ? (member.completed / member.totalTasks) * 100 : 0;
                                    const efficiencyColor =
                                        member.efficiencyScore < 20
                                            ? 'text-green-700 bg-green-50'
                                            : member.efficiencyScore < 40
                                                ? 'text-yellow-700 bg-yellow-50'
                                                : 'text-red-700 bg-red-50';
                                    const latestTask = member.latestOpenTask ?? member.latestCompletedTask;

                                    return (
                                        <tr key={member.id} className="hover:bg-gray-50">
                                            <td className="px-6 py-4">
                                                <div className="flex items-center gap-3">
                                                    <div className="h-8 w-8 rounded-full bg-[#2C5F8D] text-white flex items-center justify-center text-sm font-semibold">
                                                        {member.name.charAt(0).toUpperCase()}
                                                    </div>
                                                    <div className="font-medium text-gray-900">{member.name}</div>
                                                </div>
                                            </td>
                                            <td className="px-6 py-4">
                                                <div className="font-semibold text-gray-900">{member.totalTasks}</div>
                                            </td>
                                            <td className="px-6 py-4">
                                                <div className="space-y-1">
                                                    <div className="font-semibold text-green-700">{member.completed}</div>
                                                    <div className="relative h-1 w-full bg-green-100 rounded-full overflow-hidden">
                                                        <div
                                                            className="absolute inset-0 bg-green-600 transition-all"
                                                            style={{ width: `${completionPercentage}%` }}
                                                        />
                                                    </div>
                                                </div>
                                            </td>
                                            <td className="px-6 py-4">
                                                <div className="font-semibold text-blue-600">{member.toDo}</div>
                                            </td>
                                            <td className="px-6 py-4">
                                                <div className="font-semibold text-blue-700">{member.inProgress}</div>
                                            </td>
                                            <td className="px-6 py-4">
                                                <div className="font-semibold text-purple-700">{member.inReview}</div>
                                            </td>
                                            <td className="px-6 py-4">
                                                <div className="font-semibold text-orange-700">{member.backlog}</div>
                                            </td>
                                            <td className="px-6 py-4">
                                                <div className="font-mono text-sm">{member.avgCompletionTime.toFixed(1)}</div>
                                            </td>
                                            <td className="px-6 py-4">
                                                <div className="font-mono text-sm text-gray-600">{member.stdDeviation.toFixed(1)}</div>
                                            </td>
                                            <td className="px-6 py-4">
                                                <div className={`inline-flex px-2 py-1 rounded text-sm font-semibold ${efficiencyColor}`}>
                                                    {member.efficiencyScore.toFixed(1)}%
                                                </div>
                                            </td>
                                            <td className="px-6 py-4">
                                                {latestTask && (
                                                    <div className="text-sm text-gray-600 max-w-xs truncate">{latestTask.title}</div>
                                                )}
                                            </td>
                                        </tr>
                                    );
                                })}
                            </tbody>
                        </table>
                    </div>
                </div>

                {/* Section 5: Outlier Detection */}
                {outliers.length > 0 && (
                    <div className="bg-amber-50 border border-amber-200 rounded-lg p-6 mb-8">
                        <div className="flex items-center gap-3 mb-3">
                            <AlertTriangle className="h-5 w-5 text-amber-600 flex-shrink-0" />
                            <h2 className="text-lg font-bold text-amber-800">Efficiency Outliers Detected</h2>
                        </div>
                        <p className="text-sm text-amber-700 mb-3">
                            The following team members have efficiency scores that deviate more than 1.5 standard deviations from the team mean. This may indicate workload imbalance or blockers that need attention.
                        </p>

                        <div className="flex flex-wrap gap-2">
                            {outliers.map((name) => {
                                const m = members.find((mem) => mem.name === name || mem.id === name);
                                return (
                                    <div key={name} className="bg-amber-100 border border-amber-300 rounded-md px-3 py-2 text-sm">
                                        <span className="font-semibold text-amber-900">{m?.name ?? name}</span>
                                        {m && (
                                            <span className="ml-2 text-amber-700">
                                                {m.efficiencyScore.toFixed(1)}% efficiency
                                            </span>
                                        )}
                                    </div>
                                );
                            })}
                        </div>
                    </div>
                )}

                {/* Section 6: Latest Task Samples */}
                <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                    <h2 className="text-xl font-bold text-gray-900 mb-6">Latest Task Samples</h2>

                    <div className="space-y-6">
                        {members.map((member) => {
                            const sampleTask = member.latestOpenTask ?? member.latestCompletedTask;
                            if (!sampleTask) return null;

                            return (
                                <div key={member.id}>
                                    <button
                                        onClick={() => setExpandedMember(expandedMember === member.id ? null : member.id)}
                                        className="w-full flex items-center justify-between p-4 bg-gray-50 hover:bg-gray-100 rounded-lg transition-colors"
                                    >
                                        <div className="flex items-center gap-3">
                                            <div className="h-8 w-8 rounded-full bg-[#2C5F8D] text-white flex items-center justify-center text-sm font-semibold">
                                                {member.name.charAt(0).toUpperCase()}
                                            </div>
                                            <div className="font-semibold text-gray-900">{member.name}</div>
                                            <StatusBadge status={sampleTask.status} size="sm" />
                                        </div>
                                        {expandedMember === member.id ? (
                                            <ChevronUp className="h-5 w-5" />
                                        ) : (
                                            <ChevronDown className="h-5 w-5" />
                                        )}
                                    </button>

                                    {expandedMember === member.id && (
                                        <div className="mt-3 pl-4">
                                            <TaskCard
                                                title={sampleTask.title}
                                                status={sampleTask.status}
                                                priority={sampleTask.priority}
                                                owner={sampleTask.assignee ?? 'Unassigned'}
                                                createdDate={new Date(sampleTask.createdAt)}
                                                completedDate={sampleTask.closedAt ? new Date(sampleTask.closedAt) : undefined}
                                                daysOpen={sampleTask.daysOpen}
                                                description={sampleTask.description}
                                                platform={analysis.platform}
                                            />
                                        </div>
                                    )}
                                </div>
                            );
                        })}
                    </div>
                </div>
            </div>

            {/* Modals */}
            <TaskDistributionModal
                isOpen={distModalOpen}
                onClose={() => setDistModalOpen(false)}
                tasks={mockTasks}
                members={mockMembers}
            />

            <TaskStatusModal
                isOpen={statusModalOpen}
                onClose={() => setStatusModalOpen(false)}
                tasks={mockTasks}
                defaultTab={statusModalTab}
            />

            <LongestTasksModal
                isOpen={longestModalOpen}
                onClose={() => setLongestModalOpen(false)}
                tasks={mockLongestTasks}
            />
        </div>
    );
}
