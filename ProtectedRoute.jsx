import { Navigate, Outlet } from 'react-router-dom';

const ProtectedRoute = ({ allowedRoles }) => {
  // Assuming you store your auth data in localStorage or Zustand
  const authData = JSON.parse(localStorage.getItem("layemart-auth"));
  const userRole = authData?.state?.user?.role;
  // console.log(userRole)
  if (!authData) {
    return <Navigate to="/auth/sign-in" replace />;
  }

  if (!allowedRoles.includes(userRole)) {
    return <Navigate to="/unauthorized" replace />;
  }

  return <Outlet />;
};

export default ProtectedRoute;