import { useState, useEffect } from "react";
import { useAuthStore } from "../store/useAuthStore";

const isTokenExpired = (token) => {
  if (!token) return true;
  try {
    const payload = JSON.parse(atob(token.split(".")[1]));
    return payload.exp * 1000 < Date.now();
  } catch {
    return true;
  }
};

export default function RoleRedirect() {
  const { user, token, logout } = useAuthStore();
  const [checking, setChecking] = useState(true);

  useEffect(() => {
    const verify = async () => {
      // 1. Check token expiry locally first
      if (!token || isTokenExpired(token)) {
        logout();
        localStorage.removeItem("layemart-auth");
        window.location.href = "/auth/sign-in";
        return;
      }

      // 2. Verify token is still valid on backend
      try {
        const res = await fetch(`${import.meta.env.VITE_BACKEND_URL}/api/auth/me`, {
          headers: { Authorization: `Bearer ${token}` }
        });

        if (!res.ok) {
          logout();
          localStorage.removeItem("layemart-auth");
          window.location.href = "/auth/sign-in";
          return;
        }
      } catch {
        // Network error — allow through
      } finally {
        setChecking(false);
      }
    };

    verify();
  }, []);

  // ✅ Wait for verification before doing anything
  if (checking) return null;

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