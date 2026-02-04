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

export const verifyCustomerOTP = async ({ email, otp, storeSlug }) => {
  const res = await fetch(`${API_URL}/api/customers/verify-otp`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email, otp, storeSlug }),
  });

  const data = await res.json();
  if (!res.ok) throw new Error(data.message || "Verification failed");
return data;
};


export const resendCustomerOTP = async ({ email, storeSlug }) => {
  const res = await fetch(`${API_URL}/api/customers/resend-otp`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email, storeSlug }),
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.message || "Failed to resend code");
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


export const forgotPasswordCustomer = async (data) => {
  try {
    const response = await fetch(`${API_URL}/api/customers/forgot-password`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data), // { email, storeSlug }
    });

    const result = await response.json();

    if (!response.ok) {
      // This allows your catch block to receive the error message from your backend
      throw new Error(result.message || 'Something went wrong');
    }

    return result;
  } catch (error) {
    // Re-throw so your UI component can display the toast/alert
    throw error;
  }
};


export const logoutCustomer = () => {
  // Access the Zustand store's logout action
  useCustomerAuthStore.getState().logout();
  
  // Optional: Redirect user or clear other local data
  // window.location.href = "/login"; 
};