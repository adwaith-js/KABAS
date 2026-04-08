import { Clock } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { PlatformBadge } from './PlatformBadge';
import { formatDistanceToNow } from 'date-fns';

interface TeamCardProps {
  name: string;
  platform: 'GitHub' | 'Jira';
  totalTasks: number | null;
  completed: number | null;
  inProgress: number | null;
  backlog: number | null;
  lastSynced: Date;
  onClick: () => void;
}

export function TeamCard({
  name,
  platform,
  totalTasks,
  completed,
  inProgress,
  backlog,
  lastSynced,
  onClick,
}: TeamCardProps) {
  return (
    <Card className="hover:shadow-lg transition-all cursor-pointer group" onClick={onClick}>
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between">
          <CardTitle className="text-lg group-hover:text-[#2C5F8D] transition-colors">{name}</CardTitle>
          <PlatformBadge platform={platform} />
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          {totalTasks === null ? (
            <div className="flex items-center justify-center h-24 text-sm text-gray-400 bg-gray-50 rounded-lg">
              Click to load board analysis
            </div>
          ) : (
            <div className="grid grid-cols-2 gap-3">
              <div className="bg-slate-50/50 backdrop-blur-sm p-3 rounded-xl border border-slate-100/50">
                <div className="text-xs text-gray-500 mb-1">Total Tasks</div>
                <div className="text-2xl font-bold text-gray-900">{totalTasks}</div>
              </div>
              <div className="bg-emerald-50/50 backdrop-blur-sm p-3 rounded-xl border border-emerald-100/50">
                <div className="text-xs text-green-600 mb-1">Completed</div>
                <div className="text-2xl font-bold text-green-700">{completed}</div>
              </div>
              <div className="bg-indigo-50/50 backdrop-blur-sm p-3 rounded-xl border border-indigo-100/50">
                <div className="text-xs text-blue-600 mb-1">In Progress</div>
                <div className="text-2xl font-bold text-indigo-700">{inProgress}</div>
              </div>
              <div className="bg-amber-50/50 backdrop-blur-sm p-3 rounded-xl border border-amber-100/50">
                <div className="text-xs text-orange-600 mb-1">Backlog</div>
                <div className="text-2xl font-bold text-orange-700">{backlog}</div>
              </div>
            </div>
          )}

          <div className="pt-3 border-t border-gray-100">
            <div className="flex items-center justify-between text-xs text-gray-500 mb-3">
              <div className="flex items-center gap-1">
                <Clock className="h-3 w-3" />
                <span>Synced {formatDistanceToNow(lastSynced, { addSuffix: true })}</span>
              </div>
              <div className="flex items-center gap-1">
                <div className="h-2 w-2 bg-green-500 rounded-full"></div>
                <span>Active</span>
              </div>
            </div>
            <Button className="w-full bg-gradient-to-r from-blue-600 to-blue-500 hover:from-blue-700 hover:to-blue-600 text-white shadow-md shadow-blue-200 border-0 mt-3 rounded-xl">
              View Details
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
