import { Download } from 'lucide-react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from './ui/dialog';
import { Button } from './ui/button';
import { StatusBadge } from './StatusBadge';
import { PriorityBadge } from './PriorityBadge';
import { Task } from '../data/mockData';
import { format } from 'date-fns';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';

interface TaskStatusModalProps {
    isOpen: boolean;
    onClose: () => void;
    tasks: Task[];
    defaultTab?: 'To-Do' | 'In Progress' | 'In Review' | 'Completed' | 'Backlog';
}

export function TaskStatusModal({ isOpen, onClose, tasks, defaultTab = 'To-Do' }: TaskStatusModalProps) {
    const groupedTasks = {
        'To-Do': tasks.filter(t => t.status === 'To-Do'),
        'In Progress': tasks.filter(t => t.status === 'In Progress'),
        'In Review': tasks.filter(t => t.status === 'In Review'),
        'Completed': tasks.filter(t => t.status === 'Completed'),
        'Backlog': tasks.filter(t => t.status === 'Backlog'),
    };

    const handleExport = () => {
        alert('Export functionality would download CSV/PDF here');
    };

    const TaskTable = ({ tasks }: { tasks: Task[] }) => (
        <div className="overflow-auto max-h-96">
            <table className="w-full">
                <thead className="bg-gray-50 sticky top-0">
                    <tr>
                        <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase">Task</th>
                        <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase">Priority</th>
                        <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase">Owner</th>
                        <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase">Duration</th>
                        <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase">Created</th>
                    </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                    {tasks.map(task => (
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
                                <div className="text-sm font-semibold text-gray-900">{task.daysOpen} days</div>
                            </td>
                            <td className="px-4 py-3">
                                <div className="text-sm text-gray-600">{format(task.createdDate, 'MMM d, yyyy')}</div>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
            {tasks.length === 0 && (
                <div className="text-center py-8 text-gray-500">
                    No tasks in this status.
                </div>
            )}
        </div>
    );

    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent className="max-w-4xl max-h-[80vh] overflow-hidden flex flex-col">
                <DialogHeader>
                    <div className="flex items-center justify-between">
                        <DialogTitle>Task Status Details</DialogTitle>
                        <Button onClick={handleExport} variant="outline" size="sm" className="gap-2">
                            <Download className="h-4 w-4" />
                            Export
                        </Button>
                    </div>
                </DialogHeader>

                <Tabs defaultValue={defaultTab} className="flex-1 flex flex-col overflow-hidden">
                    <TabsList className="grid w-full grid-cols-5">
                        <TabsTrigger value="To-Do" className="gap-1 text-xs">
                            <StatusBadge status="To-Do" size="sm" />
                            ({groupedTasks['To-Do'].length})
                        </TabsTrigger>
                        <TabsTrigger value="In Progress" className="gap-1 text-xs">
                            <StatusBadge status="In Progress" size="sm" />
                            ({groupedTasks['In Progress'].length})
                        </TabsTrigger>
                        <TabsTrigger value="In Review" className="gap-1 text-xs">
                            <StatusBadge status="In Review" size="sm" />
                            ({groupedTasks['In Review'].length})
                        </TabsTrigger>
                        <TabsTrigger value="Completed" className="gap-1 text-xs">
                            <StatusBadge status="Completed" size="sm" />
                            ({groupedTasks['Completed'].length})
                        </TabsTrigger>
                        <TabsTrigger value="Backlog" className="gap-1 text-xs">
                            <StatusBadge status="Backlog" size="sm" />
                            ({groupedTasks['Backlog'].length})
                        </TabsTrigger>
                    </TabsList>

                    <div className="flex-1 overflow-hidden mt-4">
                        <TabsContent value="To-Do" className="h-full m-0">
                            <TaskTable tasks={groupedTasks['To-Do']} />
                        </TabsContent>
                        <TabsContent value="In Progress" className="h-full m-0">
                            <TaskTable tasks={groupedTasks['In Progress']} />
                        </TabsContent>
                        <TabsContent value="In Review" className="h-full m-0">
                            <TaskTable tasks={groupedTasks['In Review']} />
                        </TabsContent>
                        <TabsContent value="Completed" className="h-full m-0">
                            <TaskTable tasks={groupedTasks['Completed']} />
                        </TabsContent>
                        <TabsContent value="Backlog" className="h-full m-0">
                            <TaskTable tasks={groupedTasks['Backlog']} />
                        </TabsContent>
                    </div>
                </Tabs>
            </DialogContent>
        </Dialog>
    );
}
