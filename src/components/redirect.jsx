// RoleRedirect.jsx
import { Navigate } from "react-router-dom";
import { useAuthStore } from "../store/useAuthStore";

export default function RoleRedirect() {
  const { user } = useAuthStore();

  if (!user) return <Navigate to="/auth/sign-in" />;

  switch (user.role) {
    case "SUPER_ADMIN":
      return <Navigate to="/dashboard" />;

    case "OWNER":
      return <Navigate to="/dashboard/beta" />;


    default:
      return <Navigate to="/" />;
  }
}
