import { Link, useLocation } from 'react-router';
import { BarChart3, User, LogOut } from 'lucide-react';
import { Button } from './ui/button';

export function Navbar() {
  const location = useLocation();
  const isLoginPage = location.pathname === '/';

  if (isLoginPage) return null;

  return (
    <nav className="bg-white border-b border-gray-200 px-6 py-4">
      <div className="max-w-[1600px] mx-auto flex items-center justify-between">
        <Link to="/dashboard" className="flex items-center gap-3">
          <div className="bg-[#2C5F8D] p-2 rounded-lg">
            <BarChart3 className="h-6 w-6 text-white" />
          </div>
          <div>
            <h1 className="font-bold text-xl text-gray-900">KABAS</h1>
            <p className="text-xs text-gray-500">Kanban Board Assessment System</p>
          </div>
        </Link>

        <div className="flex items-center gap-6">
          <Link to="/dashboard">
            <Button
              variant={location.pathname === '/dashboard' ? 'default' : 'ghost'}
              className={location.pathname === '/dashboard' ? 'bg-[#2C5F8D] hover:bg-[#234a6f]' : ''}
            >
              Dashboard
            </Button>
          </Link>
          <Link to="/credentials">
            <Button
              variant={location.pathname === '/credentials' ? 'default' : 'ghost'}
              className={location.pathname === '/credentials' ? 'bg-[#2C5F8D] hover:bg-[#234a6f]' : ''}
            >
              Team Credentials
            </Button>
          </Link>

          <div className="flex items-center gap-3 ml-6 pl-6 border-l border-gray-200">
            <div className="flex items-center gap-2">
              <div className="bg-[#2C5F8D] p-2 rounded-full">
                <User className="h-4 w-4 text-white" />
              </div>
              <span className="text-sm font-medium">Instructor</span>
            </div>
            <Link to="/">
              <Button variant="ghost" size="sm">
                <LogOut className="h-4 w-4" />
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </nav>
  );
}
