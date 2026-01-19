import { create } from "zustand";
import { persist } from "zustand/middleware";
import { useCartStore } from "../../services/cartService";
import { toast } from "react-toastify";

export const useCustomerAuthStore = create(
  persist(
    (set, get) => ({
      // 🔐 Auth state
      token: null,
      customer: null,
      store: null,
      isAuthenticated: false,

      // ✅ Login customer
      login: ({ token, customer, store }) =>
        set({
          token,
          customer,
          store,
          isAuthenticated: true,
        }),

      // 🚪 Logout customer
// 🚪 Logout customer
      logout: () => {
        // 1. Clear Auth State in Zustand (this also updates localStorage because of 'persist')
        set({ 
          customer: null, 
          token: null, 
          store: null,
          isAuthenticated: false 
        });

        // 2. Reset the Cart locally ONLY (No API call)
        // We use a new function called 'resetCartLocally' to avoid the 500 error
        useCartStore.getState().resetCartLocally(); 

        // 3. Clear storage explicitly just in case
        localStorage.removeItem("layemart-customer-auth");

        // 4. Success Message
        toast.success("Logged out successfully");
      },

      // 🔄 Update customer profile
      updateCustomer: (updates) =>
        set((state) => ({
          customer: { ...state.customer, ...updates },
        })),
    }),
    {
      name: "layemart-customer-auth", // localStorage key
    }
  )
);
