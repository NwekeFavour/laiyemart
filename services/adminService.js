import { create } from "zustand";
import { devtools } from "zustand/middleware";
import { useAuthStore } from "../src/store/useAuthStore";

const VITE_BACKEND_URL = import.meta.env.VITE_BACKEND_URL;

export const useAdminStore = create(
  devtools((set) => ({
    // ===== STATE =====
    stores: [],
    owners: [],
    loading: false,
    error: null,

    // ===== ACTIONS =====

    /* -------- FETCH ALL STORES -------- */
    fetchAllStores: async () => {
      set({ loading: true, error: null });
        const { token } = useAuthStore.getState();

      try {
        
        const res = await fetch(`${VITE_BACKEND_URL}/api/stores/stores`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (!res.ok) {
          const err = await res.json();
          throw new Error(err.message || "Failed to fetch stores");
        }

        const data = await res.json();
        console.log(data)
        set({
          stores: data,
          loading: false,
        });
      } catch (err) {
        set({ error: err.message, loading: false });
      }
    },

    /* -------- FETCH ALL STORE OWNERS -------- */
    fetchStoreOwners: async () => {
      set({ loading: true, error: null });
        const { token } = useAuthStore.getState();

      try {

        const res = await fetch(`${VITE_BACKEND_URL}/api/stores/owners`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (!res.ok) {
          const err = await res.json();
          throw new Error(err.message || "Failed to fetch owners");
        }

        const data = await res.json();

        set({
          owners: data,
          loading: false,
        });
      } catch (err) {
        set({ error: err.message, loading: false });
      }
    },

    /* -------- RESET -------- */
    resetAdminState: () =>
      set({
        stores: [],
        owners: [],
        loading: false,
        error: null,
      }),
  }))
);
