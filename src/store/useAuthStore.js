import { create } from "zustand";
import { persist } from "zustand/middleware";
import { useProductStore } from "../../services/productService";

const isTokenExpired = (token) => {
  if (!token) return true;
  try {
    const payload = JSON.parse(atob(token.split(".")[1]));
    return payload.exp * 1000 < Date.now();
  } catch {
    return true;
  }
};

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
          user: state.user ? { ...state.user, ...userData } : userData,
        })),

      logout: () => {
        set({ token: null, user: null, store: null, isAuthenticated: false });
        localStorage.removeItem("layemart-auth");
        useProductStore.getState().resetProducts();
      },
      setStore: (store) => set({ store }),
      setStoreData: (storeData) =>
        set((state) => ({
          store: state.store ? { ...state.store, ...storeData } : storeData,
        })),
    }),
    {
      name: "layemart-auth",
      onRehydrateStorage: () => (state) => {
        if (state && isTokenExpired(state.token)) {
          // Token is expired — clear everything silently
          state.token = null;
          state.user = null;
          state.store = null;
          state.isAuthenticated = false;
          localStorage.removeItem("layemart-auth");
        }
      },
    },
  ),
);
