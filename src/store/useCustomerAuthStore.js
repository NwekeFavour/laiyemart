import { create } from "zustand";
import { persist } from "zustand/middleware";

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
      logout: () =>
        set({
          token: null,
          customer: null,
          store: null,
          isAuthenticated: false,
        }),

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
