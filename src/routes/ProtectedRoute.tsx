// src/routes/ProtectedRoute.tsx
import { Navigate } from "react-router-dom";
import { getCurrentUser } from "src/utils/api/authService";

interface ProtectedRouteProps {
  children: JSX.Element;
}

const ProtectedRoute = ({ children }: ProtectedRouteProps) => {
  const currentUser = getCurrentUser();

  // Check if a user exists and has a valid token
  const isAuthenticated = currentUser && currentUser.token;

  if (!isAuthenticated) {
    // Redirect to login if not authenticated
    return <Navigate to="/auth/login" replace />;
  }

  // If authenticated, render the child components
  return children;
};

export default ProtectedRoute;
