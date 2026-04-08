import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router';
import { Calendar, Users, Github, LayoutGrid, Clock, RefreshCw } from 'lucide-react';
import { TeamCard } from '../components/TeamCard';
import { Button } from '../components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../components/ui/select';
import { api, Team, TeamAnalysis } from '../services/api';
import { motion } from 'motion/react';

const CACHE_KEY = 'kabas_analyses_cache';

function loadCache(): { analyses: Record<string, TeamAnalysis>; syncedAt: string } | null {
  try {
    const raw = localStorage.getItem(CACHE_KEY);
    return raw ? JSON.parse(raw) : null;
  } catch { return null; }
}

function formatSyncTime(iso: string) {
  const diff = Math.floor((Date.now() - new Date(iso).getTime()) / 1000);
  if (diff < 60) return 'less than a minute ago';
  if (diff < 3600) return `${Math.floor(diff / 60)}m ago`;
  if (diff < 86400) return `${Math.floor(diff / 3600)}h ago`;
  return new Date(iso).toLocaleDateString();
}

export function Dashboard() {
  const navigate = useNavigate();
  const [dateRange, setDateRange] = useState('30');
  const [teams, setTeams] = useState<Team[]>([]);
  const [analyses, setAnalyses] = useState<Record<string, TeamAnalysis>>({});
  const [loading, setLoading] = useState(true);
  const [syncing, setSyncing] = useState(false);
  const [syncedAt, setSyncedAt] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  // On mount: load teams list + restore cached analyses (no API call for analysis)
  useEffect(() => {
    async function loadTeams() {
      try {
        setLoading(true);
        setError(null);
        const data = await api.teams.list();
        setTeams(data);

        const cached = loadCache();
        if (cached) {
          setAnalyses(cached.analyses);
          setSyncedAt(cached.syncedAt);
        }
      } catch (err: any) {
        setError(err.message ?? 'Failed to load teams. Is the server running?');
      } finally {
        setLoading(false);
      }
    }
    loadTeams();
  }, []);

  async function handleSync() {
    try {
      setSyncing(true);
      setError(null);
      const fresh: Record<string, TeamAnalysis> = {};
      await Promise.all(
        teams.map(team =>
          api.analysis.getTeamAnalysis(team.id)
            .then(a => { fresh[team.id] = a; })
            .catch(err => console.error(`Failed to sync team ${team.id}`, err))
        )
      );
      const now = new Date().toISOString();
      setAnalyses(fresh);
      setSyncedAt(now);
      localStorage.setItem(CACHE_KEY, JSON.stringify({ analyses: fresh, syncedAt: now }));
    } catch (err: any) {
      setError(err.message ?? 'Sync failed.');
    } finally {
      setSyncing(false);
    }
  }

  return (
    <div className="min-h-screen">
      <div className="max-w-[1600px] mx-auto p-8 relative z-10">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-8 gap-4">
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">Dashboard Overview</h1>
            <p className="text-gray-600 mt-1 text-sm sm:text-base">Monitor all your teams' performance at a glance</p>
          </div>

          <div className="flex items-center gap-3">
            <Calendar className="h-5 w-5 text-gray-400 hidden sm:block" />
            <Select value={dateRange} onValueChange={setDateRange}>
              <SelectTrigger className="w-full sm:w-[180px]">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="7">Last 7 days</SelectItem>
                <SelectItem value="30">Last 30 days</SelectItem>
                <SelectItem value="all">All time</SelectItem>
              </SelectContent>
            </Select>
            <Button
              onClick={handleSync}
              disabled={syncing || teams.length === 0}
              className="bg-gradient-to-r from-blue-600 to-blue-500 text-white shadow-md shadow-blue-200 flex items-center gap-2"
            >
              <RefreshCw className={`h-4 w-4 ${syncing ? 'animate-spin' : ''}`} />
              <span className="hidden sm:inline">{syncing ? 'Syncing…' : 'Sync'}</span>
            </Button>
          </div>
        </div>

        {/* Error state */}
        {error && (
          <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg text-red-700 text-sm">
            {error}
          </div>
        )}

        {loading ? (
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 mb-8">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="glass-card p-6 animate-pulse">
                <div className="h-4 bg-gray-200 rounded w-1/2 mb-3" />
                <div className="h-8 bg-gray-200 rounded w-1/3" />
              </div>
            ))}
          </div>
        ) : (
          <>
            {/* Last Synced bar */}
            <div className="flex items-center justify-between mb-4 text-sm text-gray-500">
              <div className="flex items-center gap-2">
                <Clock className="h-4 w-4 text-indigo-400" />
                {syncedAt
                  ? <span>Last synced <span className="font-medium text-gray-700">{formatSyncTime(syncedAt)}</span></span>
                  : <span className="italic">Not synced yet — hit <strong>Sync</strong> to load data</span>
                }
              </div>
            </div>

            {/* Summary Stats */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 mb-8">
              <div className="glass-card p-6 relative overflow-hidden">
                <div className="absolute top-0 right-0 -mr-4 -mt-4 bg-blue-100/50 p-6 rounded-full opacity-50"><Users className="w-8 h-8 text-blue-600" /></div>
                <div className="text-sm font-semibold text-gray-500 mb-2 flex items-center gap-2">
                  <Users className="w-4 h-4 text-blue-600" /> Total Teams
                </div>
                <div className="text-3xl font-bold text-gray-900">{teams.length}</div>
                <div className="text-xs text-gray-500 mt-1">
                  {teams.filter((t) => t.status === 'Active').length} active
                </div>
              </div>
              <div className="glass-card p-6 relative overflow-hidden">
                <div className="absolute top-0 right-0 -mr-4 -mt-4 bg-blue-100/50 p-6 rounded-full opacity-50"><Github className="w-8 h-8 text-blue-600" /></div>
                <div className="text-sm font-semibold text-gray-500 mb-2 flex items-center gap-2">
                  <Github className="w-4 h-4 text-blue-600" /> GitHub Teams
                </div>
                <div className="text-3xl font-bold text-gray-900">
                  {teams.filter((t) => t.platform === 'GitHub').length}
                </div>
                <div className="text-xs text-gray-500 mt-1">Connected boards</div>
              </div>
              <div className="glass-card p-6 relative overflow-hidden">
                <div className="absolute top-0 right-0 -mr-4 -mt-4 bg-blue-100/50 p-6 rounded-full opacity-50"><LayoutGrid className="w-8 h-8 text-blue-600" /></div>
                <div className="text-sm font-semibold text-gray-500 mb-2 flex items-center gap-2">
                  <LayoutGrid className="w-4 h-4 text-blue-600" /> Jira Teams
                </div>
                <div className="text-3xl font-bold text-gray-900">
                  {teams.filter((t) => t.platform === 'Jira').length}
                </div>
                <div className="text-xs text-gray-500 mt-1">Connected projects</div>
              </div>
              <div className="glass-card p-6 relative overflow-hidden">
                <div className="absolute top-0 right-0 -mr-4 -mt-4 bg-blue-100/50 p-6 rounded-full opacity-50"><Clock className="w-8 h-8 text-blue-600" /></div>
                <div className="text-sm font-semibold text-gray-500 mb-2 flex items-center gap-2">
                  <Clock className="w-4 h-4 text-blue-600" /> Last Synced
                </div>
                <div className="text-3xl font-bold text-gray-900">
                  {teams.filter((t) => t.lastSynced).length}
                </div>
                <div className="text-xs text-gray-500 mt-1">Teams with data</div>
              </div>
            </div>

            {/* Team Cards Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {teams.map((team) => (
                <motion.div key={team.id} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
                  <TeamCard
                    name={team.name}
                    platform={team.platform}
                    totalTasks={analyses[team.id]?.totalTasks ?? null}
                    completed={analyses[team.id]?.completed ?? null}
                    inProgress={analyses[team.id]?.inProgress ?? null}
                    backlog={analyses[team.id]?.backlog ?? null}
                    lastSynced={team.lastSynced ? new Date(team.lastSynced) : new Date(team.addedAt)}
                    onClick={() => navigate(`/team/${team.id}`)}
                  />
                </motion.div>
              ))}
            </div>

            {/* Empty state */}
            {teams.length === 0 && !error && (
              <div className="text-center py-16 glass-card mt-8">
                <div className="text-gray-400 text-lg mb-4">No teams yet</div>
                <Button
                  onClick={() => navigate('/credentials')}
                  className="bg-gradient-to-r from-blue-600 to-blue-500 hover:from-blue-700 hover:to-blue-600 text-white shadow-lg shadow-blue-200"
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
