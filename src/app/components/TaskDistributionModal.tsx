import { Download, Search } from 'lucide-react';
import { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from './ui/dialog';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { StatusBadge } from './StatusBadge';
import { PriorityBadge } from './PriorityBadge';
import { Task, TeamMember } from '../data/mockData';
import { format } from 'date-fns';

interface TaskDistributionModalProps {
    isOpen: boolean;
    onClose: () => void;
    tasks: Task[];
    members: TeamMember[];
}

export function TaskDistributionModal({ isOpen, onClose, tasks, members }: TaskDistributionModalProps) {
    const [searchQuery, setSearchQuery] = useState('');
    const [selectedMember, setSelectedMember] = useState<string>('all');

    const filteredTasks = tasks.filter(task => {
        const matchesSearch = task.title.toLowerCase().includes(searchQuery.toLowerCase());
        const matchesMember = selectedMember === 'all' || task.ownerId === selectedMember;
        return matchesSearch && matchesMember;
    });

    const handleExport = () => {
        // Mock export functionality
        alert('Export functionality would download CSV/PDF here');
    };

    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent className="max-w-4xl max-h-[80vh] overflow-hidden flex flex-col">
                <DialogHeader>
                    <DialogTitle>Tasks by Member - Detailed View</DialogTitle>
                </DialogHeader>

                <div className="flex items-center gap-4 py-4">
                    <div className="relative flex-1">
                        <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                        <Input
                            placeholder="Search tasks..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="pl-10"
                        />
                    </div>

                    <select
                        value={selectedMember}
                        onChange={(e) => setSelectedMember(e.target.value)}
                        className="px-4 py-2 border border-gray-300 rounded-md"
                    >
                        <option value="all">All Members</option>
                        {members.map(member => (
                            <option key={member.id} value={member.id}>{member.name}</option>
                        ))}
                    </select>

                    <Button onClick={handleExport} variant="outline" className="gap-2">
                        <Download className="h-4 w-4" />
                        Export
                    </Button>
                </div>

                <div className="flex-1 overflow-auto">
                    <table className="w-full">
                        <thead className="bg-gray-50 sticky top-0">
                            <tr>
                                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase">Task</th>
                                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase">Priority</th>
                                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase">Owner</th>
                                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase">Status</th>
                                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase">Duration</th>
                                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase">Created</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-200">
                            {filteredTasks.map(task => (
                                <tr key={task.id} className="hover:bg-gray-50">
                                    <td className="px-4 py-3">
                                        <div className="font-medium text-gray-900">{task.title}</div>
                                    </td>
                                    <td className="px-4 py-3">
                                        <PriorityBadge priority={task.priority} />
                                    </td>
                                    <td className="px-4 py-3">
                                        <div className="text-sm text-gray-900">{task.owner}</div>
                                    </td>
                                    <td className="px-4 py-3">
                                        <StatusBadge status={task.status} size="sm" />
                                    </td>
                                    <td className="px-4 py-3">
                                        <div className="text-sm font-semibold text-gray-900">{task.daysOpen} days</div>
                                    </td>
                                    <td className="px-4 py-3">
                                        <div className="text-sm text-gray-600">{format(task.createdDate, 'MMM d, yyyy')}</div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>

                    {filteredTasks.length === 0 && (
                        <div className="text-center py-12 text-gray-500">
                            No tasks found matching your criteria.
                        </div>
                    )}
                </div>

                <div className="border-t pt-4 text-sm text-gray-600">
                    Showing {filteredTasks.length} of {tasks.length} tasks
                </div>
            </DialogContent>
        </Dialog>
    );
}
