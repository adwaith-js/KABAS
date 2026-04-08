import { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router';
import { User, LogOut, Menu, X } from 'lucide-react';
import { Button } from './ui/button';
import { auth } from '../services/api';

export function Navbar() {
  const location = useLocation();
  const navigate = useNavigate();
  const isLoginPage = location.pathname === '/';
  const [menuOpen, setMenuOpen] = useState(false);

  const handleLogout = () => {
    auth.clearToken();
    navigate('/');
  };

  if (isLoginPage) return null;

  return (
    <nav className="bg-white/70 backdrop-blur-md border-b border-white/50 shadow-sm px-4 sm:px-6 py-4 sticky top-0 z-50 transition-all">
      <div className="max-w-[1600px] mx-auto flex items-center justify-between">
        <Link to="/dashboard" className="flex items-center gap-3 group">
          <img
            src="/icons/icon.svg"
            alt="KABAS"
            className="h-10 w-10 rounded-xl shadow-md transition-transform group-hover:scale-105"
          />
          <div>
            <h1 className="font-bold text-xl text-gray-900">KABAS</h1>
            <p className="text-xs text-gray-500 hidden sm:block">Kanban Board Assessment System</p>
          </div>
        </Link>

        {/* Desktop nav */}
        <div className="hidden sm:flex items-center gap-6">
          <Link to="/dashboard">
            <Button
              variant={location.pathname === '/dashboard' ? 'default' : 'ghost'}
              className={location.pathname === '/dashboard' ? 'bg-gradient-to-r from-blue-600 to-blue-500 text-white shadow-md shadow-blue-200' : ''}
            >
              Dashboard
            </Button>
          </Link>
          <Link to="/credentials">
            <Button
              variant={location.pathname === '/credentials' ? 'default' : 'ghost'}
              className={location.pathname === '/credentials' ? 'bg-gradient-to-r from-blue-600 to-blue-500 text-white shadow-md shadow-blue-200' : ''}
            >
              Team Credentials
            </Button>
          </Link>

          <div className="flex items-center gap-3 ml-6 pl-6 border-l border-gray-200/60">
            <div className="flex items-center gap-2">
              <div className="bg-gradient-to-br from-blue-600 to-blue-400 shadow-sm p-2 rounded-full">
                <User className="h-4 w-4 text-white" />
              </div>
              <span className="text-sm font-medium">Instructor</span>
            </div>
            <Button variant="ghost" size="sm" onClick={handleLogout}>
              <LogOut className="h-4 w-4" />
            </Button>
          </div>
        </div>

        {/* Mobile hamburger */}
        <Button variant="ghost" size="sm" className="sm:hidden" onClick={() => setMenuOpen(!menuOpen)}>
          {menuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        </Button>
      </div>

      {/* Mobile menu */}
      {menuOpen && (
        <div className="sm:hidden border-t border-gray-200/50 mt-3 pt-3 pb-2 px-4 space-y-2">
          <Link to="/dashboard" onClick={() => setMenuOpen(false)}>
            <Button
              variant={location.pathname === '/dashboard' ? 'default' : 'ghost'}
              className={`w-full justify-start ${location.pathname === '/dashboard' ? 'bg-gradient-to-r from-blue-600 to-blue-500 text-white' : ''}`}
            >
              Dashboard
            </Button>
          </Link>
          <Link to="/credentials" onClick={() => setMenuOpen(false)}>
            <Button
              variant={location.pathname === '/credentials' ? 'default' : 'ghost'}
              className={`w-full justify-start ${location.pathname === '/credentials' ? 'bg-gradient-to-r from-blue-600 to-blue-500 text-white' : ''}`}
            >
              Team Credentials
            </Button>
          </Link>
          <div className="flex items-center justify-between pt-2 border-t border-gray-200/50">
            <div className="flex items-center gap-2">
              <div className="bg-gradient-to-br from-blue-600 to-blue-400 shadow-sm p-2 rounded-full">
                <User className="h-4 w-4 text-white" />
              </div>
              <span className="text-sm font-medium">Instructor</span>
            </div>
            <Button variant="ghost" size="sm" onClick={handleLogout}>
              <LogOut className="h-4 w-4" />
              <span className="ml-2 text-sm">Logout</span>
            </Button>
          </div>
        </div>
      )}
    </nav>
  );
}
