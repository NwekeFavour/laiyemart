import { create } from "zustand";
import { useAuthStore } from "./useAuthStore";

const API_URL = import.meta.env.VITE_BACKEND_URL;

export const useStoreProfileStore = create((set, get) => ({
  store: null,
  loading: false,
  error: null,
  success: null,
  totalCustomers: 0,
  setTotalCustomers: (count) => set({ totalCustomers: count }),

  // ============================
  // UPDATE STORE PROFILE
  // ============================

  setStore: (storeData) => set({ store: storeData }),
  updateStoreProfile: async ({ email, logo, storeType, description, heroFile, heroTitle, heroSubtitle, token }) => {
    set({ loading: true, error: null, success: null });

    try {
      const formData = new FormData();
      if (email) formData.append("email", email);
      if (logo) formData.append("logo", logo);
      if(description) formData.append("description", description);
      if(heroTitle) formData.append("heroTitle", heroTitle);
      if(heroSubtitle) formData.append("heroSubtitle", heroSubtitle);
      if(storeType) formData.append("storeType", storeType);    
      if (heroFile) formData.append("heroImage", heroFile); // Must match backend field name
      const res = await fetch(`${API_URL}/api/stores/profile`, {
        method: "PUT",
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: formData,
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.message);

      set({
        store: data.store,
        success: "Profile updated successfully",
      });

      return data;
    } catch (err) {
      set({ error: err.message || "Update failed" });
    } finally {
      set({ loading: false });
    }
  },

  fetchTotalCustomers: async (storeId) => {
    const { token } = useAuthStore.getState();
    const res = await fetch(`${API_URL}/api/stores/${storeId}/customers`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    if (!res.ok) throw new Error("Failed to fetch customers");
    return await res.json();
  },

  // ============================
  // VERIFY STORE EMAIL
  // ============================
  verifyStoreEmail: async (token) => {
    set({ loading: true, error: null, success: null });

    try {
      const res = await fetch(
        `${API_URL}/api/stores/verify-email/${token}`
      );

      const data = await res.json();
      if (!res.ok) throw new Error(data.message);

      set({
        success: "Email verified successfully",
      });
    } catch (err) {
      set({ error: err.message || "Verification failed" });
    } finally {
      set({ loading: false });
    }
  },

  resendStoreVerification: async (email) => {
    const {token} = useAuthStore.getState()
    const response = await fetch(`${API_URL}/api/stores/resend-verification`, {
      method: "POST",
      headers: { 
        "Content-Type": "application/json",
        "Authorization" : `Bearer ${token}`
       },
      body: JSON.stringify({ email }),
    });
    return response.json();
  },

  // ============================
  // CLEAR STATUS
  // ============================
  clearStatus: () => set({ error: null, success: null }),
}));
