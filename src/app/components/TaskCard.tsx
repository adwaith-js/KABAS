import { ExternalLink, Calendar, Clock } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { StatusBadge } from './StatusBadge';
import { PriorityBadge } from './PriorityBadge';
import { format } from 'date-fns';

interface TaskCardProps {
  title: string;
  status: 'To-Do' | 'In Progress' | 'In Review' | 'Completed' | 'Backlog';
  priority: 'High' | 'Medium' | 'Low';
  owner: string;
  createdDate: Date;
  completedDate?: Date;
  daysOpen: number;
  description: string;
  platform: 'GitHub' | 'Jira';
}

export function TaskCard({
  title,
  status,
  priority,
  owner,
  createdDate,
  completedDate,
  daysOpen,
  description,
  platform,
}: TaskCardProps) {
  return (
    <Card className="hover:shadow-md transition-shadow">
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between gap-3">
          <CardTitle className="text-base font-semibold">{title}</CardTitle>
          <div className="flex gap-2 flex-shrink-0">
            <StatusBadge status={status} size="sm" />
            <PriorityBadge priority={priority} />
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          <p className="text-sm text-gray-600 line-clamp-2">{description}</p>
          
          <div className="flex items-center gap-4 text-xs text-gray-500">
            <div className="flex items-center gap-1">
              <Calendar className="h-3 w-3" />
              <span>
                {completedDate
                  ? `Completed ${format(completedDate, 'MMM d')}`
                  : `Opened ${format(createdDate, 'MMM d')}`}
              </span>
            </div>
            <div className="flex items-center gap-1">
              <Clock className="h-3 w-3" />
              <span>{daysOpen} days {status === 'Completed' ? 'to complete' : 'open'}</span>
            </div>
          </div>

          <div className="flex items-center justify-between pt-2 border-t border-gray-100">
            <span className="text-sm text-gray-700">Owner: <span className="font-medium">{owner}</span></span>
            <Button variant="outline" size="sm" className="gap-1">
              <ExternalLink className="h-3 w-3" />
              View in {platform}
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
