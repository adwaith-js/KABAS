import { useState, useEffect } from 'react';
import { Eye, EyeOff, HelpCircle } from 'lucide-react';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogFooter } from './ui/dialog';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from './ui/tooltip';
import { Team } from '../services/api';

interface TeamFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (team: Partial<Team>) => void;
  team?: Team | null;
}

export function TeamFormModal({ isOpen, onClose, onSave, team }: TeamFormModalProps) {
  const [formData, setFormData] = useState({
    name: '',
    platform: 'GitHub' as 'GitHub' | 'Jira',
    url: '',
    apiToken: '',
    jiraEmail: '',
    projectKey: '',
  });
  const [showToken, setShowToken] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    if (team) {
      setFormData({
        name: team.name,
        platform: team.platform,
        url: team.url,
        apiToken: team.apiToken || '',
        jiraEmail: team.jiraEmail || '',
        projectKey: team.projectKey || '',
      });
    } else {
      setFormData({
        name: '',
        platform: 'GitHub',
        url: '',
        apiToken: '',
        jiraEmail: '',
        projectKey: '',
      });
    }
    setErrors({});
  }, [team, isOpen]);

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.name.trim()) {
      newErrors.name = 'Team name is required';
    }
    if (!formData.url.trim()) {
      newErrors.url = 'URL is required';
    } else if (!isValidUrl(formData.url)) {
      newErrors.url = 'Please enter a valid URL';
    }
    if (!formData.apiToken.trim()) {
      newErrors.apiToken = 'API token is required';
    }
    if (formData.platform === 'Jira' && !formData.jiraEmail.trim()) {
      newErrors.jiraEmail = 'Jira email is required';
    }
    if (formData.platform === 'Jira' && !formData.projectKey.trim()) {
      newErrors.projectKey = 'Project key is required';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const isValidUrl = (url: string) => {
    if (!url.includes('.') || url.length < 6) return false;
    if (formData.platform === 'GitHub' && !url.includes('github.com')) return false;
    return true;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (validateForm()) {
      const data: Partial<Team> = {
        name: formData.name,
        platform: formData.platform,
        url: formData.url,
        apiToken: formData.apiToken || undefined,
      };
      if (formData.platform === 'Jira') {
        data.jiraEmail = formData.jiraEmail || undefined;
        data.projectKey = formData.projectKey || undefined;
      }
      onSave(data);
      onClose();
    }
  };

  const isFormValid =
    formData.name &&
    formData.url &&
    formData.apiToken &&
    (formData.platform !== 'Jira' || (formData.jiraEmail && formData.projectKey));

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[550px]">
        <DialogHeader>
          <DialogTitle>{team ? 'Edit Team' : 'Add New Team'}</DialogTitle>
          <DialogDescription>
            {team ? 'Update team credentials and information.' : 'Enter the team credentials to connect to their Kanban board.'}
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4 py-4">
          {/* Team Name */}
          <div className="space-y-2">
            <Label htmlFor="teamName">Team Name</Label>
            <Input
              id="teamName"
              placeholder="e.g., Team Alpha"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              className={errors.name ? 'border-red-500' : ''}
            />
            {errors.name && <p className="text-xs text-red-600">{errors.name}</p>}
          </div>

          {/* Platform Selection */}
          <div className="space-y-2">
            <Label htmlFor="platform">Platform</Label>
            <Select
              value={formData.platform}
              onValueChange={(value: 'GitHub' | 'Jira') =>
                setFormData({ ...formData, platform: value, jiraEmail: '', projectKey: '' })
              }
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="GitHub">GitHub</SelectItem>
                <SelectItem value="Jira">Jira</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Repository/Project URL */}
          <div className="space-y-2">
            <Label htmlFor="url">
              {formData.platform === 'GitHub' ? 'Repository URL' : 'Jira Base URL'}
            </Label>
            <Input
              id="url"
              placeholder={
                formData.platform === 'GitHub'
                  ? 'https://github.com/users/username/projects/3'
                  : 'https://teamname.atlassian.net/jira/software/projects/PROJ/boards'
              }
              value={formData.url}
              onChange={(e) => {
                const url = e.target.value;
                const update: typeof formData = { ...formData, url };
                // Auto-extract project key from full Jira URL
                if (formData.platform === 'Jira' && url.includes('atlassian.net') && !formData.projectKey) {
                  const match = url.match(/\/projects\/([A-Z][A-Z0-9_]*)/i);
                  if (match) update.projectKey = match[1].toUpperCase();
                }
                setFormData(update);
              }}
              className={errors.url ? 'border-red-500' : ''}
            />
            {errors.url && <p className="text-xs text-red-600">{errors.url}</p>}
            {formData.platform === 'GitHub' && (
              <p className="text-xs text-gray-500">
                Accepts a Projects board URL (e.g. <span className="font-mono">github.com/users/name/projects/3</span>) or a repository URL (<span className="font-mono">github.com/owner/repo</span>).
              </p>
            )}
            {formData.platform === 'Jira' && (
              <p className="text-xs text-gray-500">
                Paste the full board URL and the Project Key will be filled in automatically.
              </p>
            )}
          </div>

          {/* Jira-specific fields */}
          {formData.platform === 'Jira' && (
            <>
              <div className="space-y-2">
                <Label htmlFor="jiraEmail">Jira Account Email</Label>
                <Input
                  id="jiraEmail"
                  type="email"
                  placeholder="your@email.com"
                  value={formData.jiraEmail}
                  onChange={(e) => setFormData({ ...formData, jiraEmail: e.target.value })}
                  className={errors.jiraEmail ? 'border-red-500' : ''}
                />
                {errors.jiraEmail && <p className="text-xs text-red-600">{errors.jiraEmail}</p>}
              </div>

              <div className="space-y-2">
                <Label htmlFor="projectKey">Project Key</Label>
                <Input
                  id="projectKey"
                  placeholder="e.g., PROJ"
                  value={formData.projectKey}
                  onChange={(e) =>
                    setFormData({ ...formData, projectKey: e.target.value.toUpperCase() })
                  }
                  className={errors.projectKey ? 'border-red-500' : ''}
                />
                {errors.projectKey && <p className="text-xs text-red-600">{errors.projectKey}</p>}
                <p className="text-xs text-gray-500">
                  The project key shown in your Jira issue IDs (e.g., PROJ-123).
                </p>
              </div>
            </>
          )}

          {/* API Token */}
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <Label htmlFor="apiToken">
                {formData.platform === 'GitHub' ? 'Personal Access Token' : 'Jira API Token'}
              </Label>
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <HelpCircle className="h-4 w-4 text-gray-400 cursor-help" />
                  </TooltipTrigger>
                  <TooltipContent className="max-w-xs">
                    <p className="text-xs">
                      {formData.platform === 'GitHub'
                        ? 'Generate a personal access token from GitHub Settings → Developer settings → Personal access tokens'
                        : 'Generate an API token from Jira Settings → Security → API tokens'}
                    </p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            </div>
            <div className="relative">
              <Input
                id="apiToken"
                type={showToken ? 'text' : 'password'}
                placeholder="Enter API token"
                value={formData.apiToken}
                onChange={(e) => setFormData({ ...formData, apiToken: e.target.value })}
                className={errors.apiToken ? 'border-red-500 pr-10' : 'pr-10'}
              />
              <button
                type="button"
                onClick={() => setShowToken(!showToken)}
                className="absolute right-3 top-3 text-gray-400 hover:text-gray-600"
              >
                {showToken ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
              </button>
            </div>
            {errors.apiToken && <p className="text-xs text-red-600">{errors.apiToken}</p>}
            <p className="text-xs text-gray-500">Your credentials are encrypted and stored securely.</p>
          </div>
        </form>

        <DialogFooter>
          <Button variant="outline" onClick={onClose} type="button">
            Cancel
          </Button>
          <Button
            onClick={handleSubmit}
            disabled={!isFormValid}
            className="bg-[#2C5F8D] hover:bg-[#234a6f]"
          >
            {team ? 'Update Team' : 'Save Team'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
