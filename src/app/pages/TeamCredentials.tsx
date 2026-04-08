import { useState, useEffect } from 'react';
import { Edit, Trash2, Plus, Search, Clock, Wifi, WifiOff } from 'lucide-react';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { StatusBadge } from '../components/StatusBadge';
import { PlatformBadge } from '../components/PlatformBadge';
import { TeamFormModal } from '../components/TeamFormModal';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from '../components/ui/alert-dialog';
import { formatDistanceToNow } from 'date-fns';
import { toast } from 'sonner';
import { api, Team } from '../services/api';

export function TeamCredentials() {
  const [teams, setTeams] = useState<Team[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingTeam, setEditingTeam] = useState<Team | null>(null);
  const [deleteTeamId, setDeleteTeamId] = useState<string | null>(null);
  const [testingId, setTestingId] = useState<string | null>(null);
  const [testResults, setTestResults] = useState<Record<string, boolean>>({});

  useEffect(() => {
    loadTeams();
  }, []);

  async function loadTeams() {
    try {
      setLoading(true);
      setError(null);
      const data = await api.teams.list();
      setTeams(data);
    } catch (err: any) {
      setError(err.message ?? 'Failed to load teams. Is the server running?');
    } finally {
      setLoading(false);
    }
  }

  const filteredTeams = teams.filter((team) =>
    team.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    team.url.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleAddTeam = () => {
    setEditingTeam(null);
    setIsModalOpen(true);
  };

  const handleEditTeam = (team: Team) => {
    setEditingTeam(team);
    setIsModalOpen(true);
  };

  const handleSaveTeam = async (teamData: Partial<Team>) => {
    try {
      if (editingTeam) {
        const updated = await api.teams.update(editingTeam.id, teamData);
        setTeams(teams.map((t) => (t.id === editingTeam.id ? updated : t)));
        toast.success('Team updated successfully!');
      } else {
        const created = await api.teams.create(teamData);
        setTeams([...teams, created]);
        toast.success('Team added successfully!');
      }
    } catch (err: any) {
      toast.error(err.message ?? 'Failed to save team');
    }
    setIsModalOpen(false);
  };

  const handleDeleteTeam = async () => {
    if (!deleteTeamId) return;
    try {
      await api.teams.delete(deleteTeamId);
      setTeams(teams.filter((t) => t.id !== deleteTeamId));
      toast.success('Team deleted successfully!');
    } catch (err: any) {
      toast.error(err.message ?? 'Failed to delete team');
    }
    setDeleteTeamId(null);
  };

  const handleTestConnection = async (team: Team) => {
    setTestingId(team.id);
    try {
      const result = await api.teams.test(team.id);
      setTestResults(prev => ({ ...prev, [team.id]: result.success }));
      if (result.success) {
        toast.success(result.message);
      } else {
        toast.error(result.message);
      }
    } catch (err: any) {
      setTestResults(prev => ({ ...prev, [team.id]: false }));
      toast.error(err.message ?? 'Connection test failed');
    } finally {
      setTestingId(null);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-[1600px] mx-auto p-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Team Credentials Management</h1>
            <p className="text-gray-600 mt-1">Manage GitHub and Jira credentials for all teams</p>
          </div>

          <Button onClick={handleAddTeam} className="bg-[#2C5F8D] hover:bg-[#234a6f] gap-2">
            <Plus className="h-4 w-4" />
            Add New Team
          </Button>
        </div>

        {/* Search Bar */}
        <div className="mb-6">
          <div className="relative max-w-md">
            <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
            <Input
              placeholder="Search teams..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
          </div>
        </div>

        {/* Error state */}
        {error && (
          <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg text-red-700 text-sm">
            {error}
            <button onClick={loadTeams} className="ml-3 underline hover:no-underline">
              Retry
            </button>
          </div>
        )}

        {/* Teams Table */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
          {loading ? (
            <div className="text-center py-12 text-gray-500">Loading teams...</div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50 border-b border-gray-200">
                  <tr>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                      Team Name
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                      Platform
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                      Repository/Project URL
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                      Last Synced
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                      Status
                    </th>
                    <th className="px-6 py-4 text-center text-xs font-semibold text-gray-600 uppercase tracking-wider">
                      Connection
                    </th>
                    <th className="px-6 py-4 text-right text-xs font-semibold text-gray-600 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {filteredTeams.map((team) => (
                    <tr key={team.id} className="hover:bg-gray-50 transition-colors">
                      <td className="px-6 py-4">
                        <div className="font-medium text-gray-900">{team.name}</div>
                      </td>
                      <td className="px-6 py-4">
                        <PlatformBadge platform={team.platform} />
                      </td>
                      <td className="px-6 py-4">
                        <div className="text-sm text-gray-600">{team.url}</div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-1 text-sm text-gray-600">
                          <Clock className="h-3 w-3" />
                          {team.lastSynced
                            ? formatDistanceToNow(new Date(team.lastSynced), { addSuffix: true })
                            : 'Never'}
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <StatusBadge status={team.status} />
                      </td>
                      <td className="px-6 py-4 text-center">
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleTestConnection(team)}
                            disabled={testingId === team.id}
                            className="border border-gray-200 hover:border-blue-300 hover:bg-blue-50 rounded-lg px-3 py-1 gap-2 text-xs font-medium text-gray-600 hover:text-blue-600"
                            title="Test connection"
                          >
                            {testingId === team.id ? (
                              <><Wifi className="h-4 w-4 text-gray-400 animate-pulse" /><span>Testing…</span></>
                            ) : testResults[team.id] === false ? (
                              <><WifiOff className="h-4 w-4 text-red-500" /><span className="text-red-500">Failed</span></>
                            ) : testResults[team.id] === true ? (
                              <><Wifi className="h-4 w-4 text-green-600" /><span className="text-green-600">Connected</span></>
                            ) : (
                              <><Wifi className="h-4 w-4" /><span>Test</span></>
                            )}
                          </Button>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center justify-end gap-2">
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleEditTeam(team)}
                            className="hover:bg-blue-50"
                          >
                            <Edit className="h-4 w-4 text-blue-600" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => setDeleteTeamId(team.id)}
                            className="hover:bg-red-50"
                          >
                            <Trash2 className="h-4 w-4 text-red-600" />
                          </Button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          {!loading && filteredTeams.length === 0 && !error && (
            <div className="text-center py-12">
              <p className="text-gray-500">
                {searchQuery ? 'No teams found matching your search.' : 'No teams yet. Add your first team to get started.'}
              </p>
            </div>
          )}
        </div>

        {/* Pagination */}
        {filteredTeams.length > 10 && (
          <div className="mt-6 flex items-center justify-between">
            <div className="text-sm text-gray-600">
              Showing {Math.min(10, filteredTeams.length)} of {filteredTeams.length} teams
            </div>
            <div className="flex gap-2">
              <Button variant="outline" size="sm" disabled>Previous</Button>
              <Button variant="outline" size="sm" className="bg-[#2C5F8D] text-white hover:bg-[#234a6f]">1</Button>
              <Button variant="outline" size="sm">2</Button>
              <Button variant="outline" size="sm">Next</Button>
            </div>
          </div>
        )}
      </div>

      {/* Team Form Modal */}
      <TeamFormModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSave={handleSaveTeam}
        team={editingTeam}
      />

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={deleteTeamId !== null} onOpenChange={() => setDeleteTeamId(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This will permanently delete this team and remove all associated credentials. This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDeleteTeam}
              className="bg-red-600 hover:bg-red-700"
            >
              Delete Team
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
