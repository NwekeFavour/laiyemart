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
  getCategories: async (storeId) => {
    set({ loading: true, error: null });
    const {token} = useAuthStore.getState()
    try {
      const res = await fetch(
        `${API_BASE}/api/category/store/${storeId}`);
      const data = await res.json();

      if (!res.ok) throw new Error(data.message);

      set({ categories: data.categories, loading: false });
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
  updateCategory: async ({ categoryId, name, image, isFeatured }) => {
    set({ loading: true, error: null });

    try {
      const formData = new FormData();
      if (name) formData.append("name", name);
      if (image) formData.append("image", image);
      if (typeof isFeatured === "boolean") {
        formData.append("isFeatured", isFeatured);
      }

      const res = await fetch(
        `${API_BASE}/categories/${categoryId}`,
        {
          method: "PUT",
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
          body: formData,
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

      return data.category;
    } catch (err) {
      set({ error: err.message, loading: false });
      throw err;
    }
  },

  /* =======================
     DELETE CATEGORY
  ======================= */
  deleteCategory: async (categoryId) => {
    set({ loading: true, error: null });

    try {
      const res = await fetch(
        `${API_BASE}/categories/${categoryId}`,
        {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );

      const data = await res.json();
      if (!res.ok) throw new Error(data.message);

      set((state) => ({
        categories: state.categories.filter(
          (c) => c._id !== categoryId
        ),
        loading: false,
      }));
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
