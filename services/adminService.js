import { create } from "zustand";
import { devtools } from "zustand/middleware";
import { useAuthStore } from "../src/store/useAuthStore";

const VITE_BACKEND_URL = import.meta.env.VITE_BACKEND_URL;

export const useAdminStore = create(
  devtools((set) => ({
    // ===== STATE =====
    stores: [],
    owners: [],
    categoryStats: [],
    loading: false,
    platformOrders: [],
    platformStats: {
      totalGMV: 0,
      orderCount: 0,
      pendingReviews: 0,
    },
    loadingOrders: false,
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
        // console.log(data);
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

    fetchPlatformOrders: async () => {
      set({ loadingOrders: true });
      try {
        // 1. Get your token from wherever it's stored (localStorage/Cookies)
        const {token} = useAuthStore.getState()

        const response = await fetch(`${VITE_BACKEND_URL}/api/orders/admin/platform-orders`, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`, // Assuming you need auth
          },
        });

        // 2. Fetch doesn't throw on 404/500, so we check response.ok
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data = await response.json();

        if (data.success) {
          set({
            platformOrders: data.orders,
            platformStats: {
              totalGMV: data.totalGMV,
              orderCount: data.count,
              pendingReviews: data.pendingReviews,
            },
            loadingOrders: false,
          });
        }
      } catch (error) {
        console.error("Error fetching platform orders with fetch:", error);
        set({ loadingOrders: false });
      }
    },

    fetchCategoryStats: async () => {
      try {
        const token = useAuthStore.getState().token;
        const response = await fetch(`${VITE_BACKEND_URL}/api/stores/admin/category-intelligence`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        const data = await response.json();
        if (data.success) set({ categoryStats: data.stats });
      } catch (error) {
        console.error("Failed to fetch intelligence data", error);
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
  })),
);
