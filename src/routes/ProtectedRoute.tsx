import type { FC } from 'react';
import { Navigate } from 'react-router-dom';
import { useAuthenticatedUser } from '../hooks/useAuthenticatedUser';
interface ProtectedRouteProps {
  children: React.ReactNode;
}

const ProtectedRoute: FC<ProtectedRouteProps> = ({ children }) => {
  const { user } = useAuthenticatedUser();
  if (!user) {
    return <Navigate to="/login" replace />;
  }
  return <>{children}</>;
};

export default ProtectedRoute;