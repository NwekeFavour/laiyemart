import { create } from "zustand";
import { useAuthStore } from "../src/store/useAuthStore";

const useOrderStore = create((set) => ({
  orders: [],
  stats: { count: 0, totalSales: 0 },
  isLoading: false,
  error: null,

  fetchVendorOrders: async () => {
    // 1. Set loading state
    set({ isLoading: true, error: null });
    const { token } = useAuthStore.getState();
    try {
      const response = await fetch(
        `${import.meta.env.VITE_BACKEND_URL}/api/orders/vendor/all`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        },
      );

      // 2. Parse JSON
      const data = await response.json();

      // 3. Handle non-200 responses
      if (!response.ok) {
        throw new Error(
          data.message || "Something went wrong while fetching orders",
        );
      }

      // 4. Update state on success
      set({
        orders: data.orders,
        stats: data.stats,
        isLoading: false,
      });
    } catch (err) {
      // 5. Catch network errors or thrown errors
      set({
        error: err.message || "Failed to fetch orders",
        isLoading: false,
      });
    }
  },

  updateStatus: async (orderId, newStatus) => {
    set({ isLoading: true }); // Set to true while starting
    const {token} = useAuthStore.getState()
    try {
      const response = await fetch(`${import.meta.env.VITE_BACKEND_URL}/api/orders/vendor/${orderId}/status`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          // If you store your token in localStorage, include it here:
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ newStatus }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Failed to update status");
      }

      if (data.success) {
        // ✅ Update the local state
        set((state) => ({
          orders: state.orders.map((order) =>
            order._id === orderId
              ? {
                  ...order,
                  productStatus: newStatus,
                  productstatusHistory: data.order.productstatusHistory,
                }
              : order,
          ),
          isLoading: false,
        }));
        return { success: true };
      }
    } catch (error) {
      set({ isLoading: false });
      return {
        success: false,
        message: error.message || "Update failed",
      };
    }
  },
  // Clear store (useful for logging out)
  clearOrderStore: () =>
    set({ orders: [], stats: { count: 0, totalSales: 0 }, error: null }),
}));

export default useOrderStore;
