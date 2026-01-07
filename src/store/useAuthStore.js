import { create } from "zustand";
import { persist } from "zustand/middleware";

export const useAuthStore = create(
  persist(
    (set) => ({
      //
      // STATE
      //
      token: null,
      user: null,
      store: null,
      isAuthenticated: false,

      //
      // ACTIONS
      //
      login: ({ token, user, store }) =>
        set({
          token,
          user,
          store,
          isAuthenticated: true,
        }),

      logout: () =>
        set({
          token: null,
          user: null,
          store: null,
          isAuthenticated: false,
        }),

      setStore: (store) => set({ store }),
    }),
    {
      name: "layemart-auth",
    }
  )
);
