import { create } from "zustand";
import { persist } from "zustand/middleware";
import { useProductStore } from "../../services/productService";

export const useAuthStore = create(
  persist(
    (set, get) => ({
      token: null,
      user: null,
      store: null,
      isEmailVerified: false,
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

        setUser: (userData) => 
        set((state) => ({ 
          user: state.user ? { ...state.user, ...userData } : userData 
        })),

        logout: () => {
            set({ token: null, user: null, store: null, isAuthenticated: false });
            localStorage.removeItem("layemart-auth")
            useProductStore.getState().resetProducts();
        },
      setStore: (store) => set({ store })
    }),
    {
        name: "layemart-auth",
    }
  )
);
