import { Navigate } from 'react-router';
import { getCurrentUser } from '../utils/api/authService';

interface PublicRouteProps {
  children: React.ReactElement;
}

const PublicRoute = ({ children }: PublicRouteProps) => {
  const currentUser = getCurrentUser();

  // If user is already logged in, redirect to dashboard
  if (currentUser?.token) {
    return <Navigate to="/dashboard" />;
  }

  // If not logged in, show the requested auth page
  return children;
};

export default PublicRoute;