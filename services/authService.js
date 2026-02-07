import { useAuthStore } from "../src/store/useAuthStore";


const VITE_BACKEND_URL = import.meta.env.VITE_BACKEND_URL || "http://localhost:5000";

export const loginStoreOwner = async (email, password) => {
  const res = await fetch(`${VITE_BACKEND_URL}/api/auth/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email, password }),
  });

  const data = await res.json();

  if (!res.ok) {
    throw new Error(data.message || "Login failed");
  }

  // ✅ Update Zustand here
  useAuthStore.getState().login({
    token: data.token,
    user: data.user,
    store: data.store, // fetched later
  });

  return data;
};

export const verifyOTP = async ({ email, otp }) => {
  const res = await fetch(`${VITE_BACKEND_URL}/api/auth/verify-otp`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email, otp }),
  });

  const data = await res.json();
  if (!res.ok) throw data;

  useAuthStore.getState().setUser({ isEmailVerified: true });

  return data;
};

export const registerStoreOwner = async ({
  email,
  password,
  billingCycle,
  plan,
  couponCode
}) => {
  const res = await fetch(`${VITE_BACKEND_URL}/api/auth/register`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email, password, billingCycle, plan , couponCode}),
  });

  const data = await res.json();

  if (!res.ok) {
    throw new Error(data.message || "Registration failed");
  }

  useAuthStore.getState().login({
    token: data.token,
    user: data.user,
    store: data.store,
    isEmailVerified: data.isEmailVerified,
    profilePicture: data.user.profilePicture,
  });
};


export const fetchMe = async () => {
  const { token } = useAuthStore.getState();

  const res = await fetch(`${VITE_BACKEND_URL}/api/auth/me`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  if (!res.ok) throw new Error("Unauthorized");

  const data = await res.json();

  useAuthStore.getState().login({
    token,
    user: data.user,
    store: data.store,
    isEmailVerified: data.isEmailVerified,
    profilePicture: data.user.profilePicture,
  });
};

export const updateStorePlan = async (data) => {
  const response = await fetch(`${VITE_BACKEND_URL}/api/auth/update-plan`, {
    method: "PATCH", // Use PATCH for updates
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });

  const result = await response.json();
  if (!response.ok) throw new Error(result.message || "Failed to update plan");
  return result;
};