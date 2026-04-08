import { Badge } from './ui/badge';

interface StatusBadgeProps {
  status: 'To-Do' | 'In Progress' | 'In Review' | 'Completed' | 'Backlog' | 'Active' | 'Inactive';
  size?: 'default' | 'sm';
}

export function StatusBadge({ status, size = 'default' }: StatusBadgeProps) {
  const getStatusColor = () => {
    switch (status) {
      case 'Completed':
        return 'bg-[#28A745] text-white hover:bg-[#218838]';
      case 'In Progress':
        return 'bg-[#FFC107] text-gray-900 hover:bg-[#e0a800]';
      case 'In Review':
        return 'bg-[#6F42C1] text-white hover:bg-[#5a35a0]';
      case 'To-Do':
        return 'bg-[#0066CC] text-white hover:bg-[#0052a3]';
      case 'Backlog':
        return 'bg-[#DC3545] text-white hover:bg-[#c82333]';
      case 'Active':
        return 'bg-[#28A745] text-white hover:bg-[#218838]';
      case 'Inactive':
        return 'bg-gray-400 text-white hover:bg-gray-500';
      default:
        return 'bg-gray-200 text-gray-900';
    }
  };

  return (
    <Badge className={`${getStatusColor()} ${size === 'sm' ? 'text-xs px-2 py-0' : ''}`}>
      {status}
    </Badge>
  );
}
