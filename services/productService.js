import { create } from "zustand";
import { useAuthStore } from "../src/store/useAuthStore";

const VITE_BACKEND_URL = import.meta.env.VITE_BACKEND_URL;

export const useProductStore = create((set, get) => ({
  products: [],
  loading: false,
  error: null,

  // Fetch products for logged-in store owner
  fetchMyProducts: async () => {
    const { token } = useAuthStore.getState();

    if (!token) return;

    set({ loading: true, error: null });

    try {
      const res = await fetch(`${VITE_BACKEND_URL}/api/products/myproducts`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!res.ok) {
        throw new Error("Failed to fetch products");
      }

      const data = await res.json();

      set({
        products: data.products,
        loading: false,
      });
    } catch (err) {
      set({
        error: err.message,
        loading: false,
      });
    }
  },

  // Create product
  createProduct: async (productData) => {
    const { token } = useAuthStore.getState();

    set({ loading: true, error: null });

    try {
      const res = await fetch(`${VITE_BACKEND_URL}/api/products`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: productData,
      });  
      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.message || "Failed to create product");
      }
      const data = await res.json();

      // Optimistic update
      set((state) => ({
        products: [data, ...state.products],
        loading: false,
      }));

      return data.products;
    } catch (err) {
      set({
        error: err.message,
        loading: false,
      });
      throw err;
    }
  },

  // Delete product
  deleteProduct: async (productId) => {
    const { token } = useAuthStore.getState();

    set({ loading: true, error: null });

    try {
      const res = await fetch(
        `${VITE_BACKEND_URL}/api/products/${productId}`,
        {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (!res.ok) {
        throw new Error("Failed to delete product");
      }

      set((state) => ({
        products: state.products.filter(
          (product) => product._id !== productId
        ),
        loading: false,
      }));
    } catch (err) {
      set({
        error: err.message,
        loading: false,
      });
      throw err;
    }
  },

  // Reset store on logout
  resetProducts: () => {
    set({
      products: [],
      loading: false,
      error: null,
    });
  },
}));
