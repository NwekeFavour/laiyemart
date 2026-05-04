import { useAuthStore } from "../store/useAuthStore";

export default function RoleRedirect() {
  const { user, token, logout } = useAuthStore();

  // ✅ Check if token is expired before doing anything
  if (token) {
    try {
      const payload = JSON.parse(atob(token.split(".")[1]));
      const isExpired = payload.exp * 1000 < Date.now();
      
      if (isExpired) {
        // Clear everything and send to login fresh
        logout();
        localStorage.removeItem("layemart-auth");
        window.location.href = "/auth/sign-in";
        return null;
      }
    } catch (e) {
      // Malformed token — clear and redirect
      logout();
      localStorage.removeItem("layemart-auth");
      window.location.href = "/auth/sign-in";
      return null;
    }
  }

  if (!user || !token) {
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

  const getSyncUrl = (path) =>
    `${protocol}//${dashboardBase}/auth-sync?data=${encodedAuth}&redirect=${path}`;

  if (user.role === "SUPER_ADMIN") {
    window.location.href = getSyncUrl("/admin/dashboard");
    return null;
  }

  if (user.role === "OWNER") {
    window.location.href = getSyncUrl("/");
    return null;
  }

  window.location.href = "/";
  return null;
}