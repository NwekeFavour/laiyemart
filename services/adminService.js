import { create } from "zustand";
import { devtools } from "zustand/middleware";
import { useAuthStore } from "../src/store/useAuthStore";

const VITE_BACKEND_URL = import.meta.env.VITE_BACKEND_URL;

export const useAdminStore = create(
  devtools((set, get) => ({
    // ===== STATE =====
    stores: [],
    owners: [],
    transactions: [],
    platformWideStats: null,
    categoryStats: [],
    loading: false,
    platformOrders: [],
    adminNotifications: [],
    adminUnreadCount: 0,
    platformStats: {
      totalGMV: 0,
      orderCount: 0,
      pendingReviews: 0,
    },
    subscriptionStats: {
      totalEarnings: 0,
      totalSubscriptions: 0,
      currency: "NGN",
    },
    subscriptionBreakdown: [], // For the breakdown by plan
    loadingTransactions: false,
    loadingOrders: false,
    error: null,

    // ===== ACTIONS =====

    /* -------- FETCH SUBSCRIPTION EARNINGS -------- */
    fetchTransactions: async () => {
      set({ loadingTransactions: true});
      try {
        const response = await fetch(`${VITE_BACKEND_URL}/api/transactions`, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            // Add Authorization header here if your admin routes are protected
            // 'Authorization': `Bearer ${localStorage.getItem('token')}`
          }
        });

        if (!response.ok) throw new Error('Failed to fetch transactions');
        
        const result = await response.json();
        set({ transactions: result.data, loadingTransactions: false });
      } catch (err) {
        console.error("Fetch Transactions Error:", err);
        set({ loadingTransactions: false, error: err.message });
      }
    },
    fetchPlatformWideStats: async () => {
      try {
        const response = await fetch(`${VITE_BACKEND_URL}/api/transactions/stats/platform-wide`, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
          }
        });
        
        if (!response.ok) throw new Error('Failed to fetch earnings stats');
        
        const result = await response.json();
        console.log("Platform-Wide Stats:", result);
        set({ platformWideStats: result.stats });
      } catch (err) {
        console.error("Fetch Earnings Error:", err);
      }
    },
    fetchPlatformEarnings: async () => {
      set({ loadingTransactions: true, error: null });
      const { token } = useAuthStore.getState();

      try {
        const res = await fetch(
          `${VITE_BACKEND_URL}/api/transactions/stats/total`,
          {
            headers: { Authorization: `Bearer ${token}` },
          },
        );

        if (!res.ok) throw new Error("Failed to fetch earnings");

        const data = await res.json();
        if (data.success) {
          set({
            subscriptionStats: data.data,
            loadingTransactions: false,
          });
        }
      } catch (err) {
        set({ error: err.message, loadingTransactions: false });
      }
    },

    /* -------- FETCH REVENUE BREAKDOWN -------- */
    fetchEarningsBreakdown: async () => {
      const { token } = useAuthStore.getState();
      try {
        const res = await fetch(
          `${VITE_BACKEND_URL}/api/transactions/stats/breakdown`,
          {
            headers: { Authorization: `Bearer ${token}` },
          },
        );

        const data = await res.json();
        if (data.success) {
          set({ subscriptionBreakdown: data.breakdown });
        }
      } catch (err) {
        console.error("Error fetching breakdown:", err);
      }
    },

    // Add to useAdminStore actions
    fetchAdminNotifications: async () => {
      const { token } = useAuthStore.getState();
      const res = await fetch(`${VITE_BACKEND_URL}/api/notifications/admin`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      if (data.success) set({ notifications: data.notifications });
      console.log(data);
    },
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
        const { token } = useAuthStore.getState();

        const response = await fetch(
          `${VITE_BACKEND_URL}/api/orders/admin/platform-orders`,
          {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`, // Assuming you need auth
            },
          },
        );

        // 2. Fetch doesn't throw on 404/500, so we check response.ok
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data = await response.json();

        if (data.success) {
          set({
            platformOrders: data.orders,
            // Mapping the new Mission Control metrics
            platformStats: {
              // Financials
              platformRev: data.stats.platformRev,      // The "10% cut"
              vendorPayouts: data.stats.vendorPayouts,  // Money split to subaccounts
              pendingReviews: data.stats.pendingReviews,
              escrowBalance: data.stats.escrowBalance,  // Funds currently in escrow
              // Totals & Trends
              totalOrders: data.count,
              gmvTrend: data.stats.gmvTrend,
              ordersTrend: data.stats.ordersTrend,
              totalGMV: data.stats.totalGMV,
              // Keeping these if you calculate them elsewhere
              ownersTrend: data.stats.ownersTrend || 0,
              storesTrend: data.stats.storesTrend || 0,
            },
            loadingOrders: false,
          });
        }
      } catch (error) {
        console.error("Error fetching platform orders with fetch:", error);
        set({ loadingOrders: false });
      }
    },

    fetchAdminNotifications: async () => {
      const { token } = useAuthStore.getState();
      try {
        const response = await fetch(
          `${VITE_BACKEND_URL}/api/notifications/admin`,
          {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
            },
          },
        );

        const data = await response.json();
        const unreadCount = data.notifications.filter(
          (n) => n.isRead === false,
        ).length;
        if (data.success) {
          set({
            adminNotifications: data.notifications,
            adminUnreadCount: unreadCount,
          });
        }
      } catch (err) {
        console.error("Error fetching admin alerts:", err);
      }
    },

    handleMarkAdminAllRead: async () => {
      const { token } = useAuthStore.getState();
      try {
        const response = await fetch(
          `${VITE_BACKEND_URL}/api/notifications/admin/read-all`,
          {
            method: "PATCH",
            headers: {
              Authorization: `Bearer ${token}`,
            },
          },
        );

        const data = await response.json();
        if (data.success) {
          set({ adminUnreadCount: 0 });
          get().fetchAdminNotifications(); // Refresh the list
        }
      } catch (err) {
        console.error("Error marking alerts as read:", err);
      }
    },

    fetchCategoryStats: async () => {
      try {
        const token = useAuthStore.getState().token;
        const response = await fetch(
          `${VITE_BACKEND_URL}/api/stores/admin/category-intelligence`,
          {
            headers: { Authorization: `Bearer ${token}` },
          },
        );
        const data = await response.json();
        if (data.success) set({ categoryStats: data.stats });
      } catch (error) {
        console.error("Failed to fetch intelligence data", error);
      }
    },

    deleteStore: async (storeId) => {
      const { token } = useAuthStore.getState();
      try {
        const res = await fetch(`${VITE_BACKEND_URL}/api/stores/${storeId}`, {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        const data = await res.json();

        if (!res.ok) {
          throw new Error(data.message || "Failed to delete store");
        }

        // Optimistically remove the store from local state
        set((state) => ({
          stores: {
            ...state.stores,
            count: (state.stores.count || 1) - 1,
            data: state.stores.data?.filter((s) => s._id !== storeId) ?? [],
          },
        }));

        return { success: true, message: data.message };
      } catch (err) {
        console.log("Delete Store Error:", err);
        console.error("Delete Store Error:", err);
        return { success: false, message: err.message };
      }
    },

    // Suspend toggle
    suspendStore: async (storeId, reason) => {
      const res = await fetch(`${API_URL}/api/stores/${storeId}/suspend`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${getAdminToken()}`,
        },
        body: JSON.stringify({ reason }),
      });
      return res.json();
    },

    // Broadcast
    sendBroadcast: async ({ subject, message, targetPlan }) => {
      const res = await fetch(`${API_URL}/api/admin/broadcast`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${getAdminToken()}`,
        },
        body: JSON.stringify({ subject, message, targetPlan }),
      });
      return res.json();
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
