import { createBrowserRouter } from 'react-router';
import { Login } from './pages/Login';
import { Dashboard } from './pages/Dashboard';
import { TeamCredentials } from './pages/TeamCredentials';
import { TeamDashboard } from './pages/TeamDashboard';
import { NotFound } from './pages/NotFound';
import { RootLayout } from './layouts/RootLayout';

export const router = createBrowserRouter([
  {
    path: '/',
    element: <RootLayout />,
    children: [
      {
        index: true,
        element: <Login />,
      },
      {
        path: 'dashboard',
        element: <Dashboard />,
      },
      {
        path: 'credentials',
        element: <TeamCredentials />,
      },
      {
        path: 'team/:teamId',
        element: <TeamDashboard />,
      },
      {
        path: '*',
        element: <NotFound />,
      },
    ],
  },
]);