import { create } from "zustand";
import { useCustomerAuthStore } from "../src/store/useCustomerAuthStore";
import { getSubdomain } from "../storeResolver";
import { toast } from "react-toastify";

const API_URL = import.meta.env.VITE_BACKEND_URL || "http://localhost:5000";

// Helper to handle fetch responses and errors
const handleResponse = async (response) => {
  const data = await response.json();
  if (!response.ok) {
    throw new Error(data.message || "Something went wrong");
  }
  return data;
};

export const useCartStore = create((set, get) => ({
  cart: { items: [], cartTotal: 0 },
  loading: false,
  error: null,

  resetCartLocally: () => {
    set({
      cart: { items: [], cartTotal: 0 },
      loading: false,
    });
  },
  // Helper to get Auth Headers
  getHeaders: () => {
    const { token } = useCustomerAuthStore.getState();

    // Logic for Starter vs Professional
    const subdomain = getSubdomain();
    const pathParts = window.location.pathname.split("/").filter(Boolean);
    const resolvedSlug = subdomain || pathParts[0]; // Fallback to first path part for Starter plan

    return {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
      "x-store-slug": resolvedSlug,
    };
  },

  // 1. Fetch Cart
  fetchCart: async (storeId) => {
    if (!storeId) return;
    set({ loading: true, error: null });
    try {
      const response = await fetch(`${API_URL}/api/cart/${storeId}`, {
        method: "GET",
        headers: get().getHeaders(),
      });
      const data = await handleResponse(response);
      if (data.success) set({ cart: data.data });
    } catch (err) {
      set({ error: err.message });
      if (err.message.includes("401"))
        set({ cart: { items: [], cartTotal: 0 } });
    } finally {
      set({ loading: false });
    }
  },

  // 2. Add Item to Cart
  addToCart: async (
    storeId,
    productId,
    quantity = 1,
    variantSelection = {},
  ) => {
    set({ loading: true, error: null });
    try {
      const response = await fetch(`${API_URL}/api/cart/`, {
        method: "POST",
        headers: get().getHeaders(),
        body: JSON.stringify({
          storeId,
          productId,
          quantity,
          selectedColor: variantSelection.color || null,
          selectedSize: variantSelection.size || null,
          selectedPrice: variantSelection.price || null,
        }),
      });

      const data = await response.json();
      if (!response.ok)
        throw new Error(data.message || "Could not add item to cart");
      if (data.success) set({ cart: data.data });
    } catch (err) {
      set({ error: err.message });
    } finally {
      set({ loading: false });
    }
  },

  // 3. Update Quantity (Optimistic)
  // Frontend
  updateQuantity: async (
    storeId,
    productId,
    newQuantity,
    selectedColor = null,
    selectedSize = null,
  ) => {
    // Optimistic update — match by product + variant
    set((state) => {
      if (!state.cart) return state;
      const updatedItems = state.cart.items.map((item) => {
        const sameProduct = item.product._id === productId;
        const sameColor =
          (item.selectedColor || null) === (selectedColor || null);
        const sameSize = (item.selectedSize || null) === (selectedSize || null);
        return sameProduct && sameColor && sameSize
          ? { ...item, quantity: newQuantity }
          : item;
      });
      const newTotal = updatedItems.reduce((acc, item) => {
        const price =
          item.selectedPrice ||
          item.priceAtAddition ||
          item.product?.price ||
          0;
        return acc + item.quantity * price;
      }, 0);
      return {
        cart: { ...state.cart, items: updatedItems, cartTotal: newTotal },
      };
    });

    try {
      const response = await fetch(`${API_URL}/api/cart/quantity`, {
        method: "PATCH",
        headers: { ...get().getHeaders(), "Content-Type": "application/json" },
        body: JSON.stringify({
          storeId,
          productId,
          quantity: newQuantity,
          selectedColor,
          selectedSize,
        }),
      });

      const contentType = response.headers.get("content-type");
      if (!contentType?.includes("application/json")) {
        throw new Error("Server error: Check backend logs");
      }

      const result = await response.json();
      if (!response.ok || !result.success)
        throw new Error(result?.message || "Failed to update quantity");

      set({ cart: result.data });
    } catch (err) {
      console.error("Update Quantity Error:", err.message);
      get().fetchCart(storeId);
      toast.error("Could not update quantity. Please try again.");
    }
  },

  // 4. Remove Item
  removeItem: async (
    storeId,
    productId,
    selectedColor = null,
    selectedSize = null,
  ) => {
    set({ loading: true, error: null });
    try {
      const response = await fetch(`${API_URL}/api/cart/item/${storeId}/${productId}`, {
        method: "DELETE",
        headers: { ...get().getHeaders(), "Content-Type": "application/json" },
        body: JSON.stringify({
          storeId,
          productId,
          selectedColor,
          selectedSize,
        }),
      });

      const data = await handleResponse(response);
      if (data.success) set({ cart: data.data });
    } catch (err) {
      set({ error: err.message });
      toast.error("Could not remove item");
    } finally {
      set({ loading: false });
    }
  },

  getTotalPrice: () => {
    const cart = get().cart;
    return cart ? cart.cartTotal : 0;
  },

  // 5. Clear Cart
  clearCart: async (storeId) => {
    try {
      const response = await fetch(`${API_URL}/api/cart/${storeId}`, {
        method: "DELETE",
        headers: get().getHeaders(),
      });
      await handleResponse(response);
      set({ cart: { items: [], cartTotal: 0 } });
    } catch (err) {
      console.error("Failed to clear cart:", err.message);
    }
  },
}));
