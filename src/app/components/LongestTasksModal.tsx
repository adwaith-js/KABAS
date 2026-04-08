import { AlertCircle } from 'lucide-react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from './ui/dialog';
import { StatusBadge } from './StatusBadge';
import { PriorityBadge } from './PriorityBadge';
import { Task } from '../data/mockData';
import { format } from 'date-fns';

interface LongestTasksModalProps {
  isOpen: boolean;
  onClose: () => void;
  tasks: Task[];
}

export function LongestTasksModal({ isOpen, onClose, tasks }: LongestTasksModalProps) {
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-3xl">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <AlertCircle className="h-5 w-5 text-orange-600" />
            Longest Open Tasks
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-4 py-4">
          {tasks.map((task, index) => (
            <div key={task.id} className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow">
              <div className="flex items-start justify-between mb-3">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-2">
                    <span className="text-2xl font-bold text-gray-400">#{index + 1}</span>
                    <h3 className="font-semibold text-gray-900">{task.title}</h3>
                  </div>
                  <p className="text-sm text-gray-600 mb-3">{task.description}</p>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <div className="text-xs text-gray-500 mb-1">Owner</div>
                  <div className="font-medium text-gray-900">{task.owner}</div>
                </div>
                <div>
                  <div className="text-xs text-gray-500 mb-1">Days Open</div>
                  <div className="text-2xl font-bold text-orange-600">{task.daysOpen} days</div>
                </div>
                <div>
                  <div className="text-xs text-gray-500 mb-1">Status</div>
                  <StatusBadge status={task.status} size="sm" />
                </div>
                <div>
                  <div className="text-xs text-gray-500 mb-1">Priority</div>
                  <PriorityBadge priority={task.priority} />
                </div>
                <div>
                  <div className="text-xs text-gray-500 mb-1">Created</div>
                  <div className="text-sm text-gray-900">{format(task.createdDate, 'MMM d, yyyy')}</div>
                </div>
                <div>
                  <div className="text-xs text-gray-500 mb-1">Last Updated</div>
                  <div className="text-sm text-gray-900">{format(task.createdDate, 'MMM d, yyyy')}</div>
                </div>
              </div>
            </div>
          ))}

          {tasks.length === 0 && (
            <div className="text-center py-8 text-gray-500">
              No open tasks found.
            </div>
          )}
        </div>

        <div className="border-t pt-4 text-sm text-gray-600">
          Sorted by duration (longest first)
        </div>
      </DialogContent>
    </Dialog>
  );
}
