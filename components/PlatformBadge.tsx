import { Github } from 'lucide-react';
import { Badge } from './ui/badge';

interface PlatformBadgeProps {
  platform: 'GitHub' | 'Jira';
}

export function PlatformBadge({ platform }: PlatformBadgeProps) {
  if (platform === 'GitHub') {
    return (
      <Badge className="bg-gray-900 text-white hover:bg-gray-800">
        <Github className="h-3 w-3 mr-1" />
        GitHub
      </Badge>
    );
  }

  return (
    <Badge className="bg-[#0052CC] text-white hover:bg-[#0747A6]">
      <svg className="h-3 w-3 mr-1" viewBox="0 0 24 24" fill="currentColor">
        <path d="M11.53 2c0 2.4 1.97 4.35 4.35 4.35h1.78v1.7c0 2.4 1.94 4.34 4.34 4.34V2.84a.84.84 0 0 0-.84-.84h-9.63zm.94 13.12c-2.4 0-4.34 1.94-4.34 4.34v2.36c0 .47.37.84.84.84h9.63c-.01-2.4-1.97-4.35-4.35-4.35h-1.78v-1.7c0-.82-.23-1.58-.63-2.23-.22-.37-.47-.7-.75-1-.12-.14-.25-.27-.38-.39l-.24.13z"/>
      </svg>
      Jira
    </Badge>
  );
}
