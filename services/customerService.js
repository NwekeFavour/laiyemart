import { useCustomerAuthStore } from "../src/store/useCustomerAuthStore";

const API_URL =
  import.meta.env.VITE_BACKEND_URL || "http://localhost:5000";

// 🔑 Login
export const loginCustomer = async ({ email, password, storeSlug }) => {
  const res = await fetch(`${API_URL}/api/customers/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email, password, storeSlug }),
  });

  const data = await res.json();
  if (!res.ok) throw new Error(data.message || "Login failed");

  useCustomerAuthStore.getState().login({
    token: data.token,
    customer: data.customer,
    store: data.store,
  });

  return data;
};

// 📝 Register
export const registerCustomer = async ({ email, password, name, storeSlug }) => {
  const res = await fetch(`${API_URL}/api/customers/register`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email, password, name, storeSlug }),
  });

  const data = await res.json();
  if (!res.ok) throw new Error(data.message || "Registration failed");

  return data;
};

// 👤 Get logged-in customer
export const fetchCustomerMe = async () => {
  const { token } = useCustomerAuthStore.getState();
  if (!token) throw new Error("No token");

  const res = await fetch(`${API_URL}/api/customers/me`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  const data = await res.json();
  if (!res.ok) throw new Error(data.message || "Unauthorized");

  useCustomerAuthStore.getState().login({
    token,
    customer: data.customer,
    store: data.store,
  });

  return data;
};
