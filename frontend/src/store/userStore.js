import { create } from "zustand";
import toast from "react-hot-toast";
import axiosInstance from "../lib/axios.js";

export const useUserStore = create((set, get) => ({
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
  checkAuth: async () => {
    set({ checkingAuth: true });
    try {
      const response = await axiosInstance.get("/auth/profile");
      set({ user: response.data, checkingAuth: false });
    } catch (error) {
      set({ checkingAuth: false, user: null });
      return toast.error(
        error.response?.data?.error || "User authentication failed"
      );
    }
  },
  refreshToken: async () => {
    // Prevent multiple simultaneous refresh attempts
    if (get().checkingAuth) return;

    set({ checkingAuth: true });
    try {
      const response = await axiosInstance.post("/auth/refresh");
      set({ checkingAuth: false });
      return response.data;
    } catch (error) {
      set({ user: null, checkingAuth: false });
      throw error;
    }
  },
}));
let refreshPromise = null;

axiosInstance.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      try {
        // If a refresh is already in progress, wait for it to complete
        if (refreshPromise) {
          await refreshPromise;
          return axiosInstance(originalRequest);
        }

        // Start a new refresh process
        refreshPromise = useUserStore.getState().refreshToken();
        await refreshPromise;
        refreshPromise = null;

        return axiosInstance(originalRequest);
      } catch (refreshError) {
        // If refresh fails, redirect to login or handle as needed
        useUserStore.getState().logout();
        return Promise.reject(refreshError);
      }
    }
    return Promise.reject(error);
  }
);
