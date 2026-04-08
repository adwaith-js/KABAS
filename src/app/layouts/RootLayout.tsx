import { Outlet } from 'react-router';
import { Navbar } from '../components/Navbar';
import { Toaster } from '../components/ui/sonner';

export function RootLayout() {
  return (
    <div className="app-bg">
      <div className="relative z-10 min-h-screen flex flex-col">
        <Navbar />
        <main className="flex-1">
          <Outlet />
        </main>
      </div>
      <Toaster />
    </div>
  );
}
