
import { Navigate } from 'react-router-dom';
import { useAuthStore } from '@/stores/authStore';

interface ProtectedRouteProps {
  children: React.ReactNode;
}

export const ProtectedRoute = ({ children }: ProtectedRouteProps) => {
  const { user, isAuthenticated } = useAuthStore();

  const isAdmin = isAuthenticated && user?.email === 'lydia@ninaarmend.co.site';

  if (!isAdmin) {
    return <Navigate to="/account" replace />;
  }

  return <>{children}</>;
};
