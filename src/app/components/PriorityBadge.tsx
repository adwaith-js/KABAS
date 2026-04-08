import { AlertCircle, ArrowUp, Minus } from 'lucide-react';
import { Badge } from './ui/badge';

interface PriorityBadgeProps {
  priority: 'High' | 'Medium' | 'Low';
}

export function PriorityBadge({ priority }: PriorityBadgeProps) {
  const getPriorityConfig = () => {
    switch (priority) {
      case 'High':
        return {
          color: 'bg-red-100 text-red-800 border-red-200',
          icon: <AlertCircle className="h-3 w-3" />,
        };
      case 'Medium':
        return {
          color: 'bg-orange-100 text-orange-800 border-orange-200',
          icon: <ArrowUp className="h-3 w-3" />,
        };
      case 'Low':
        return {
          color: 'bg-blue-100 text-blue-800 border-blue-200',
          icon: <Minus className="h-3 w-3" />,
        };
    }
  };

  const config = getPriorityConfig();

  return (
    <Badge variant="outline" className={`${config.color} flex items-center gap-1`}>
      {config.icon}
      {priority}
    </Badge>
  );
}
