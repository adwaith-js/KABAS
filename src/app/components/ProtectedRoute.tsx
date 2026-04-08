import { Navigate } from 'react-router';
import { auth } from '../services/api';

export function ProtectedRoute({ children }: { children: React.ReactNode }) {
  if (!auth.isAuthenticated()) {
    return <Navigate to="/" replace />;
  }
  return <>{children}</>;
}
