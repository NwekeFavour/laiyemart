// RoleRedirect.jsx
import { useAuthStore } from "../store/useAuthStore";

export default function RoleRedirect() {
  const { user } = useAuthStore();

  if (!user) {
    window.location.href = "/auth/sign-in";
    return null;
  }

  const isLocal = window.location.hostname.includes("localhost");
  const protocol = window.location.protocol;
  const dashboardBase = isLocal 
    ? "dashboard.localhost:5173" 
    : "dashboard.layemart.com";

  const authData = localStorage.getItem("layemart-auth");
  const encodedAuth = encodeURIComponent(authData);

  // Use a helper to build the sync URL
  const getSyncUrl = (path) => `${protocol}//${dashboardBase}/auth-sync?data=${encodedAuth}&redirect=${path}`;

  if (user.role === "SUPER_ADMIN") {
    // Redirect to the ADMIN specific path
    window.location.href = getSyncUrl("/admin/dashboard");
    return null;
  }

  if (user.role === "OWNER") {
    // Redirect to the OWNER specific path (NOT /)
    window.location.href = getSyncUrl("/");
    return null;
  }

  window.location.href = "/";
  return null;
}