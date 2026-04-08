import { Outlet } from 'react-router';
import { Navbar } from '../components/Navbar';
import { Toaster } from '../components/ui/sonner';

export function RootLayout() {
  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <Outlet />
      <Toaster />
    </div>
  );
}
