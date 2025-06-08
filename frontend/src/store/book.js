import { create } from "zustand";

export const useProductStore = create((set) => ({
  products: [],
  setProducts: (products) => set({ products }),

  createProduct: async (newProduct) => {
    // Validate with correct field names
    if (!newProduct.title || !newProduct.author || !newProduct.price) {
      return {
        success: false,
        message:
          "Please fill in all required fields (title, author, publishYear).",
      };
    }

    try {
      const res = await fetch("/api/books", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          title: newProduct.title,
          author: newProduct.author,
          publishYear: newProduct.publishYear,
          price: newProduct.price,
          createdBy: newProduct.createdBy,
        }),
      });

      if (!res.ok) {
        const errorData = await res.json();
        return {
          success: false,
          message: errorData.message || "Failed to create book",
        };
      }

      const data = await res.json();
      set((state) => ({ products: [...state.products, data.data] }));
      return {
        success: true,
        message: "Book created successfully",
        data: data.data,
      };
    } catch (error) {
      console.error("Create product error:", error);
      return {
        success: false,
        message: "Network error. Please try again.",
      };
    }
  },

  fetchProducts: async () => {
    try {
      const res = await fetch("/api/books");
      const data = await res.json();
      set({ products: data.data });
      return { success: true, data: data.data };
    } catch (error) {
      console.error("Fetch products error:", error);
      return { success: false, message: "Failed to fetch books" };
    }
  },

  deleteProduct: async (pid) => {
    try {
      const res = await fetch(`/api/books/${pid}`, {
        method: "DELETE",
      });
      const data = await res.json();

      if (!data.success) {
        return { success: false, message: data.message };
      }

      set((state) => ({
        products: state.products.filter((product) => product._id !== pid),
      }));
      return { success: true, message: data.message };
    } catch (error) {
      console.error("Delete product error:", error);
      return { success: false, message: "Network error during deletion" };
    }
  },

  updateProduct: async (pid, updatedProduct) => {
    try {
      // Validate with correct field names
      if (
        !updatedProduct.title ||
        !updatedProduct.author ||
        !updatedProduct.price
      ) {
        return {
          success: false,
          message:
            "Please fill in all required fields (title, author, price. ).",
        };
      }

      const res = await fetch(`/api/books/${pid}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          title: updatedProduct.title,
          author: updatedProduct.author,
          publishYear: updatedProduct.publishYear,
          price: updatedProduct.price,
          updatedBy: updatedProduct.updatedBy,
        }),
      });

      const data = await res.json();

      if (!data.success) {
        return { success: false, message: data.message };
      }

      set((state) => ({
        products: state.products.map((product) =>
          product._id === pid ? data.data : product
        ),
      }));

      return { success: true, message: data.message };
    } catch (error) {
      console.error("Update product error:", error);
      return { success: false, message: "Network error during update" };
    }
  },
}));
