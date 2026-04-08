import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router';
import { Calendar } from 'lucide-react';
import { TeamCard } from '../components/TeamCard';
import { Button } from '../components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../components/ui/select';
import { api, Team } from '../services/api';
import { motion } from 'motion/react';

export function Dashboard() {
  const navigate = useNavigate();
  const [dateRange, setDateRange] = useState('30');
  const [teams, setTeams] = useState<Team[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
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
    loadTeams();
  }, []);

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-[1600px] mx-auto p-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Dashboard Overview</h1>
            <p className="text-gray-600 mt-1">Monitor all your teams' performance at a glance</p>
          </div>

          <div className="flex items-center gap-3">
            <Calendar className="h-5 w-5 text-gray-400" />
            <Select value={dateRange} onValueChange={setDateRange}>
              <SelectTrigger className="w-[180px]">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="7">Last 7 days</SelectItem>
                <SelectItem value="30">Last 30 days</SelectItem>
                <SelectItem value="all">All time</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* Error state */}
        {error && (
          <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg text-red-700 text-sm">
            {error}
          </div>
        )}

        {loading ? (
          <div className="grid grid-cols-4 gap-6 mb-8">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="bg-white p-6 rounded-lg shadow-sm border border-gray-200 animate-pulse">
                <div className="h-4 bg-gray-200 rounded w-1/2 mb-3" />
                <div className="h-8 bg-gray-200 rounded w-1/3" />
              </div>
            ))}
          </div>
        ) : (
          <>
            {/* Summary Stats */}
            <div className="grid grid-cols-4 gap-6 mb-8">
              <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
                <div className="text-sm text-gray-600 mb-1">Total Teams</div>
                <div className="text-3xl font-bold text-gray-900">{teams.length}</div>
                <div className="text-xs text-green-600 mt-1">
                  {teams.filter((t) => t.status === 'Active').length} active
                </div>
              </div>
              <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
                <div className="text-sm text-gray-600 mb-1">GitHub Teams</div>
                <div className="text-3xl font-bold text-gray-900">
                  {teams.filter((t) => t.platform === 'GitHub').length}
                </div>
                <div className="text-xs text-gray-500 mt-1">Connected boards</div>
              </div>
              <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
                <div className="text-sm text-gray-600 mb-1">Jira Teams</div>
                <div className="text-3xl font-bold text-green-600">
                  {teams.filter((t) => t.platform === 'Jira').length}
                </div>
                <div className="text-xs text-green-600 mt-1">Connected projects</div>
              </div>
              <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
                <div className="text-sm text-gray-600 mb-1">Last Synced</div>
                <div className="text-3xl font-bold text-blue-600">
                  {teams.filter((t) => t.lastSynced).length}
                </div>
                <div className="text-xs text-gray-500 mt-1">Teams with data</div>
              </div>
            </div>

            {/* Team Cards Grid */}
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {teams.map((team) => (
                <motion.div key={team.id} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
                  <TeamCard
                    name={team.name}
                    platform={team.platform}
                    totalTasks={null}
                    completed={null}
                    inProgress={null}
                    backlog={null}
                    lastSynced={team.lastSynced ? new Date(team.lastSynced) : new Date(team.addedAt)}
                    onClick={() => navigate(`/team/${team.id}`)}
                  />
                </motion.div>
              ))}
            </div>

            {/* Empty state */}
            {teams.length === 0 && !error && (
              <div className="text-center py-16">
                <div className="text-gray-400 text-lg mb-4">No teams yet</div>
                <Button
                  onClick={() => navigate('/credentials')}
                  className="bg-[#2C5F8D] hover:bg-[#234a6f]"
                >
                  Add Your First Team
                </Button>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}
