import { create } from "zustand";
import { useAuthStore } from "../src/store/useAuthStore";

const API_BASE = import.meta.env.VITE_BACKEND_URL || "";

export const useCategoryStore = create((set, get) => ({
  categories: [],
  featuredProducts: [],
  loading: false,
  error: null,

  /* =======================
     CREATE CATEGORY
  ======================= */
  createCategory: async ({ storeId, name, image, isFeatured }) => {
    set({ loading: true, error: null });

    try {
      const formData = new FormData();
      formData.append("name", name);
      if (image) formData.append("image", image);
      if (typeof isFeatured === "boolean") {
        formData.append("isFeatured", isFeatured);
      }
        const { token } = useAuthStore.getState();

      const res = await fetch(
        `${API_BASE}/api/category/${storeId}`,
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${token}`,
          },
          body: formData,
        }
      );

      const data = await res.json();
      if (!res.ok) throw new Error(data.message);

      set((state) => ({
        categories: [data.category, ...state.categories],
        loading: false,
      }));

      return data.category;
    } catch (err) {
      set({ error: err.message, loading: false });
      throw err;
    }
  },

  /* =======================
     GET ALL CATEGORIES
  ======================= */
  getCategories: async () => {
    set({ loading: true, error: null });
    const {token} = useAuthStore.getState()
    try {
      const res = await fetch(
        `${API_BASE}/api/category/`, {
          headers: {
            "Authorization": `Bearer ${token}`,
            "Content-Type": "application/json"
          }
        });
      const data = await res.json();

      if (!res.ok) throw new Error(data.message);

      set({ categories: data, loading: false });
    } catch (err) {
      set({ error: err.message, loading: false });
    }
  },

  /* =======================
     GET SINGLE CATEGORY
  ======================= */
  getCategoryById: async (categoryId) => {
    set({ loading: true, error: null });

    try {
      const res = await fetch(
        `${API_BASE}/categories/${categoryId}`
      );
      const data = await res.json();

      if (!res.ok) throw new Error(data.message);

      set({ loading: false });
      return data.category;
    } catch (err) {
      set({ error: err.message, loading: false });
      throw err;
    }
  },

  /* =======================
     UPDATE CATEGORY
  ======================= */
  updateCategory: async (categoryId, formData) => { // Accept id directly for easier calling
    set({ submitting: true });
    try {
      const {token} = useAuthStore.getState()
      const res = await fetch(`${API_BASE}/api/category/${categoryId}`, {
        method: "PUT",
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: formData,
      });

      const data = await res.json(); // MUST await the json response

      if (!res.ok) {
        throw new Error(data.message || "Failed to update category");
      }

      // Fix: Use categoryId (the variable name) and data.category (from the response)
      const updatedCategories = get().categories.map((cat) =>
        cat._id === categoryId ? data.category : cat
      );

      set({ categories: updatedCategories, submitting: false });
      return { success: true };

    } catch (err) {
      set({ submitting: false }); // Ensure submitting is turned off on error
      return { success: false, error: err.message };
    }
  },

  /* =======================
     DELETE CATEGORY
  ======================= */
  deleteCategory: async (categoryId) => {
    set({ submitting: true });
    try {
      const {token} = useAuthStore.getState()
      const res = await fetch(
        `${API_BASE}/api/category/${categoryId}`, 
        {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

    set((state) => ({
      categories: state.categories.filter((cat) => cat._id !== categoryId),
      submitting: false
    }));
    return { success: true };
    } catch (err) {
      set({ error: err.message, loading: false });
      throw err;
    }
  },

  /* =======================
     TOGGLE FEATURED
  ======================= */
  toggleFeaturedCategory: async (categoryId) => {
    set({ loading: true, error: null });

    try {
      const res = await fetch(
        `${API_BASE}/categories/${categoryId}/toggle-featured`,
        {
          method: "PATCH",
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );

      const data = await res.json();
      if (!res.ok) throw new Error(data.message);

      set((state) => ({
        categories: state.categories.map((c) =>
          c._id === categoryId ? data.category : c
        ),
        loading: false,
      }));
    } catch (err) {
      set({ error: err.message, loading: false });
      throw err;
    }
  },

  /* =======================
     FEATURED CATEGORY PRODUCTS
  ======================= */
  getFeaturedCategoryProducts: async (storeId) => {
    set({ loading: true, error: null });

    try {
      const res = await fetch(
        `${API_BASE}/categories/featured-products/${storeId}`
      );

      const data = await res.json();
      if (!res.ok) throw new Error(data.message);

      set({
        featuredProducts: data.products,
        loading: false,
      });

      return data.products;
    } catch (err) {
      set({ error: err.message, loading: false });
    }
  },

  /* =======================
     RESET
  ======================= */
  clearCategoryState: () => {
    set({
      categories: [],
      featuredProducts: [],
      loading: false,
      error: null,
    });
  },
}));
