import { create } from "zustand";

const API_URL = import.meta.env.VITE_BACKEND_URL;

export const useStoreProfileStore = create((set, get) => ({
  store: null,
  loading: false,
  error: null,
  success: null,

  // ============================
  // UPDATE STORE PROFILE
  // ============================
  updateStoreProfile: async ({ email, logo, storeType, token }) => {
    set({ loading: true, error: null, success: null });

    try {
      const formData = new FormData();
      if (email) formData.append("email", email);
      if (logo) formData.append("logo", logo);
      if(storeType) formData.append("storeType", storeType);

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
    } catch (err) {
      set({ error: err.message || "Update failed" });
    } finally {
      set({ loading: false });
    }
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
    const response = await fetch(`${API_URL}/api/stores/resend-verification`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email }),
    });
    return response.json();
  },

  // ============================
  // CLEAR STATUS
  // ============================
  clearStatus: () => set({ error: null, success: null }),
}));
