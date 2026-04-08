import { useState } from 'react';
import { useNavigate } from 'react-router';
import { BarChart3, Mail, Lock } from 'lucide-react';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Label } from '../components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/card';
import { api, auth } from '../services/api';

export function Login() {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      const result = await api.auth.login(email, password);
      auth.setToken(result.token);
      navigate('/dashboard');
    } catch (err: any) {
      setError(err.message ?? 'Login failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#2C5F8D] to-[#1a3a57] flex items-center justify-center p-4">
      <div className="w-full max-w-6xl grid md:grid-cols-2 gap-8 items-center">
        {/* Left side - Branding */}
        <div className="text-white space-y-6">
          <div className="flex items-center gap-4">
            <div className="bg-white p-4 rounded-2xl">
              <BarChart3 className="h-12 w-12 text-[#2C5F8D]" />
            </div>
            <div>
              <h1 className="text-4xl font-bold">KABAS</h1>
              <p className="text-xl text-blue-100">Kanban Board Assessment System</p>
            </div>
          </div>
          
          <div className="space-y-4 pl-4">
            <h2 className="text-3xl font-bold">Streamline Your Team Assessment Workflow</h2>
            <p className="text-lg text-blue-100">
              Manage multiple teams' GitHub and Jira credentials, visualize their Kanban board 
              performance, and track progress all in one place.
            </p>
            
            <div className="space-y-3 pt-4">
              <div className="flex items-start gap-3">
                <div className="bg-white/20 p-2 rounded-lg mt-1">
                  <div className="h-2 w-2 bg-white rounded-full"></div>
                </div>
                <div>
                  <h3 className="font-semibold text-lg">Centralized Credential Management</h3>
                  <p className="text-blue-100">Securely store and manage team access credentials</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <div className="bg-white/20 p-2 rounded-lg mt-1">
                  <div className="h-2 w-2 bg-white rounded-full"></div>
                </div>
                <div>
                  <h3 className="font-semibold text-lg">Real-time Performance Insights</h3>
                  <p className="text-blue-100">Track task distribution, completion rates, and team efficiency</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <div className="bg-white/20 p-2 rounded-lg mt-1">
                  <div className="h-2 w-2 bg-white rounded-full"></div>
                </div>
                <div>
                  <h3 className="font-semibold text-lg">Multi-platform Support</h3>
                  <p className="text-blue-100">Seamlessly integrate with GitHub and Jira boards</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Right side - Login form */}
        <Card className="w-full max-w-md mx-auto shadow-2xl">
          <CardHeader className="space-y-1">
            <CardTitle className="text-2xl">Welcome Back</CardTitle>
            <CardDescription>Sign in to access your instructor dashboard</CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleLogin} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <div className="relative">
                  <Mail className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                  <Input
                    id="email"
                    type="email"
                    placeholder="instructor@university.edu"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="pl-10"
                    required
                  />
                </div>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="password">Password</Label>
                <div className="relative">
                  <Lock className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                  <Input
                    id="password"
                    type="password"
                    placeholder="••••••••"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="pl-10"
                    required
                  />
                </div>
              </div>

              <div className="flex items-center justify-between text-sm">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input type="checkbox" className="rounded border-gray-300" />
                  <span className="text-gray-600">Remember me</span>
                </label>
                <a href="#" className="text-[#2C5F8D] hover:underline">
                  Forgot password?
                </a>
              </div>

              {error && (
                <p className="text-sm text-red-600 bg-red-50 border border-red-200 rounded px-3 py-2">{error}</p>
              )}

              <Button
                type="submit"
                disabled={loading}
                className="w-full bg-[#2C5F8D] hover:bg-[#234a6f] text-white py-6 text-lg"
              >
                {loading ? 'Signing in...' : 'Sign In'}
              </Button>

              <p className="text-center text-sm text-gray-600">
                Don't have an account?{' '}
                <a href="#" className="text-[#2C5F8D] hover:underline font-medium">
                  Contact Administrator
                </a>
              </p>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
