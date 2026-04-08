import { createBrowserRouter } from 'react-router';
import { Login } from './pages/Login';
import { Dashboard } from './pages/Dashboard';
import { TeamCredentials } from './pages/TeamCredentials';
import { TeamDashboard } from './pages/TeamDashboard';
import { NotFound } from './pages/NotFound';
import { RootLayout } from './layouts/RootLayout';
import { ProtectedRoute } from './components/ProtectedRoute';

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
        element: <ProtectedRoute><Dashboard /></ProtectedRoute>,
      },
      {
        path: 'credentials',
        element: <ProtectedRoute><TeamCredentials /></ProtectedRoute>,
      },
      {
        path: 'team/:teamId',
        element: <ProtectedRoute><TeamDashboard /></ProtectedRoute>,
      },
      {
        path: '*',
        element: <NotFound />,
      },
    ],
  },
]);
