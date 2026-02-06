import { create } from "zustand";
import { useAuthStore } from "../src/store/useAuthStore";
import { toast } from "react-toastify";
import { useCustomerAuthStore } from "../src/store/useCustomerAuthStore";
import { getSubdomain } from "../storeResolver";

const VITE_BACKEND_URL = import.meta.env.VITE_BACKEND_URL;

export const useProductStore = create((set, get) => ({
  products: [],
  loading: false,
  error: null,

  _getHeaders: () => {
    const { token } = useCustomerAuthStore.getState();

    // Logic for Starter vs Professional
    const sub = getSubdomain();
    const pathParts = window.location.pathname.split("/").filter(Boolean);
    const resolvedSlug = sub || pathParts[0]; // Fallback to first path part for Starter plan

    return {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
      "x-store-slug": resolvedSlug,
    };
  },

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
      const res = await fetch(`${VITE_BACKEND_URL}/api/products/${productId}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!res.ok) {
        throw new Error("Failed to delete product");
      }

      set((state) => ({
        products: state.products.filter((product) => product._id !== productId),
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

  fetchStoreProducts: async (subdomain) => {
    set({ loading: true, error: null });
    try {
      // Note: No token needed for public view
      const response = await fetch(
        `${import.meta.env.VITE_BACKEND_URL}/api/products/public/${subdomain}`,
      );
      const data = await response.json();
      // console.log(data)
      if (response.ok) {
        set({ products: data.products, loading: false });
        // console.log(data)
      } else {
        throw new Error(data.message || "Failed to fetch");
      }
    } catch (err) {
      set({ error: err.message, loading: false, products: [] });
    }
  },
  // store/useProductStore.js
  toggleStar: async (productId, storeId) => {
    const { products } = get();
    const {customer } = useCustomerAuthStore.getState();
    // 1. Capture the current state of this specific product
    const targetProduct = products.find((p) => p._id === productId);
    if (!targetProduct) return;


    if(!customer) {
      toast.error("You need to be logged in to add to your wishlist", {containerId: "STOREFRONT"})
    }
    // 2. OPTIMISTIC UPDATE: Use the current state to determine the next state
    const nextStarState = !targetProduct.star;

    set({
      products: products.map((p) =>
        p._id === productId ? { ...p, star: nextStarState } : p,
      ),
    });

    try {
      const res = await fetch(
        `${import.meta.env.VITE_BACKEND_URL}/api/products/${productId}/star`,
        {
          method: "PATCH",
          headers: get()._getHeaders(),
          body: JSON.stringify({ storeId }),
        },
      );

      const data = await res.json();

      if (!res.ok) throw new Error(data.message);

      // 3. RECONCILE: Use the EXACT value returned by the server
      // This stops the "Always Add" loop if the server and client disagree
      set({
        products: get().products.map((p) =>
          p._id === productId ? { ...p, star: data.star } : p,
        ),
      });

      toast.success(data.message, {containerId: "STOREFRONT"});
    } catch (err) {
      // 4. ROLLBACK: If server fails, set it back to what it was before the click
      set({
        products: get().products.map((p) =>
          p._id === productId ? { ...p, star: targetProduct.star } : p,
        ),
      });
      toast.error(err.message, {containerId: "STOREFRONT"});
    }
  },

  updateProduct: async (productId, formData, token) => {
    try {
      set({ loading: true, error: null });

      const res = await fetch(`${VITE_BACKEND_URL}/api/products/${productId}`, {
        method: "PUT",
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: formData,
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.message);

      set((state) => ({
        products: state.products.map((p) =>
          p._id === productId ? data.product : p,
        ),
        loading: false,
      }));

      return data.product;
    } catch (err) {
      set({ error: err.message, loading: false });
      throw err;
    }
  },
  // Set local products (for the Demo mode)
  setLocalProducts: (items) => set({ products: items, loading: false }),

  // Reset store on logout
  resetProducts: () => {
    set({
      products: [],
      loading: false,
      error: null,
    });
  },
}));
