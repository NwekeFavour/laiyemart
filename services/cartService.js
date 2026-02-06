import { create } from "zustand";
import { useCustomerAuthStore } from "../src/store/useCustomerAuthStore";
import { getSubdomain } from "../storeResolver";

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
  addToCart: async (storeId, productId, quantity = 1) => {
  // 1. Clear previous errors and start loading
  set({ loading: true, error: null });

  try {
    const response = await fetch(`${API_URL}/api/cart/`, {
      method: "POST",
      headers: get().getHeaders(),
      // storeId can now safely be the Slug or the _id 
      // because our backend resolver handles both.
      body: JSON.stringify({ storeId, productId, quantity }),
    });

    const data = await response.json(); // Using standard json() or your handleResponse

    if (!response.ok) {
      // Catch "Store not found" or "Product out of stock"
      throw new Error(data.message || "Could not add item to cart");
    }

    if (data.success) {
      set({ cart: data.data });
      // Logic check: Ensure the cart we just got back matches the store we are in
      // This is vital for subaccount isolation!
    }
  } catch (err) {
    console.error("Sorry For the Inconvenience in seems, they might have been an error:", err.message);
    set({ error: err.message });
  } finally {
    set({ loading: false });
  }
},

  // 3. Update Quantity (Optimistic)
  updateQuantity: async (storeId, productId, newQuantity) => {
    // 1. OPTIMISTIC UPDATE (Instant UI change)
    set((state) => {
      if (!state.cart) return state;
      const updatedItems = state.cart.items.map((item) =>
        item.product._id === productId
          ? { ...item, quantity: newQuantity }
          : item,
      );
      const newTotal = updatedItems.reduce((acc, item) => {
        const price = item.priceAtAddition || item.product.price;
        return acc + item.quantity * price;
      }, 0);
      return {
        cart: { ...state.cart, items: updatedItems, cartTotal: newTotal },
      };
    });

    // 2. SERVER SYNC
    try {
      const response = await fetch(`${API_URL}/api/cart/quantity`, {
        method: "PATCH",
        headers: {
          ...get().getHeaders(),
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ storeId, productId, quantity: newQuantity }),
      });

      // Check if response is actually JSON before parsing
      const contentType = response.headers.get("content-type");
      if (!contentType || !contentType.includes("application/json")) {
        const text = await response.text(); // Get the HTML/Text error from server
        console.error("Server sent non-JSON response:", text);
        throw new Error("Server error: Check backend logs");
      }

      const result = await response.json();

      if (!response.ok || !result.success) {
        throw new Error(result?.message || "Failed to update quantity");
      }

      // 3. FINAL SYNC
      set({ cart: result.data });
    } catch (err) {
      console.error("Update Quantity Error:", err.message);
      // REVERT: If server fails, re-fetch the real cart so the UI doesn't stay wrong
      const currentStoreId = storeId;
      get().fetchCart(currentStoreId);

      toast.error("Could not update quantity. Please try again.");
    }
  },

  // 4. Remove Item
  removeItem: async (storeId, productId) => {
    set({ loading: true, error: null });
    try {
      const response = await fetch(
        `${API_URL}/api/cart/item/${storeId}/${productId}`,
        {
          method: "DELETE",
          headers: get().getHeaders(),
        },
      );

      const data = await handleResponse(response);

      if (data.success) {
        // Ensure we are setting the full cart object
        // data.data should look like { items: [...], cartTotal: 5000 }
        set({ cart: data.data });
      }
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
