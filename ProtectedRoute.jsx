import { Navigate, Outlet, useLocation } from 'react-router-dom';
import { useAuthStore } from './src/store/useAuthStore';

const ProtectedRoute = ({ allowedRoles }) => {
  const { user } = useAuthStore();
  const location = useLocation();

  // 1. Check if user exists at all
  if (!user) {
    // Redirect to login but keep the location they were trying to go to
    return <Navigate to="/auth/sign-in" state={{ from: location }} replace />;
  }

  // 2. Check if their role is allowed
  if (allowedRoles && !allowedRoles.includes(user.role)) {
    // If they are a SUPER_ADMIN trying to hit an OWNER route (or vice versa)
    // Send them to their respective correct start page instead of a dead-end "/"
    const fallbackPath = user.role === "SUPER_ADMIN" ? "/admin/dashboard" : "/";
    return <Navigate to={fallbackPath} replace />;
  }

  return <Outlet />;
};

export default ProtectedRoute;