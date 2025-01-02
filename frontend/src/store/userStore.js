import { create } from "zustand";
import toast from "react-hot-toast";
import axiosInstance from "../lib/axios.js";

export const useUserStore = create((set) => ({
  user: null,
  loading: false,
  checkingAuth: true,
  signUp: async ({ name, email, password, confirmPassword }) => {
    set({ loading: true });
    if (password !== confirmPassword) {
      set({ loading: false });
      return toast.error("Passwords do not match");
    }

    if (password.length < 6) {
      set({ loading: false });
      return toast.error("Password must be at least 6 characters");
    }

    try {
      const response = await axiosInstance.post("/auth/signup", {
        name,
        email,
        password,
      });

      set({ user: response.data.user, loading: false });
      return toast.success(response.data.message);
    } catch (error) {
      set({ loading: false });
      // Use message from the backend error response
      return toast.error(
        error.response?.data?.message || "Something went wrong"
      );
    }
  },
  login: async ({ email, password }) => {
    set({ loading: true });
    try {
      const response = await axiosInstance.post("/auth/login", {
        email,
        password,
      });
      set({ user: response.data.user });
      toast.success(response.data.message);
    } catch (error) {
      toast.error(error.response?.data?.error || "Something went wrong");
    } finally {
      set({ loading: false });
    }
  },

  logout: async () => {
    set({ loading: true });
    try {
      const response = await axiosInstance.post("/auth/logout");
      set({ user: null, loading: false });
      return toast.success(response.data.message);
    } catch (error) {
      set({ loading: false });
      return toast.error(error.response?.data?.error || "Something went wrong");
    }
  },
  checkAuth: async (user) => {
    set({ checkingAuth: true });
    try {
      const response = await axiosInstance.get("/auth/profile", { user });
      set({ user: response.data.user, checkingAuth: false });
    } catch (error) {
      set({ checkingAuth: false, user: null });
      return toast.error(
        error.response?.data?.error || "User authentication failed"
      );
    }
  },
}));
