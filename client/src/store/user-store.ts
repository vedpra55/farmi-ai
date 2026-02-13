import { create } from "zustand";
import { devtools, persist } from "zustand/middleware";
import { IUser, ICropDetail } from "@/types/user";
import axios from "@/lib/axios";

interface UserState {
  user: IUser | null;
  token: string | null;
  isLoading: boolean;
  error: string | null;
  fetchUser: (token?: string | null) => Promise<void>;
  setToken: (token: string | null) => void;
  setUser: (user: IUser) => void;
  clearUser: () => void;
  addCrop: (
    crop: Omit<ICropDetail, "_id">,
    token?: string | null,
  ) => Promise<void>;
  updateCrop: (
    cropId: string,
    crop: Partial<ICropDetail>,
    token?: string | null,
  ) => Promise<void>;
  deleteCrop: (cropId: string, token?: string | null) => Promise<void>;
}

const authHeaders = (token?: string | null) =>
  token ? { Authorization: `Bearer ${token}` } : {};

export const useUserStore = create<UserState>()(
  devtools(
    persist(
      (set) => ({
        user: null,
        token: null,
        isLoading: false,
        error: null,

        fetchUser: async (token) => {
          set({ isLoading: true, error: null });
          try {
            const response = await axios.get("/user/me", {
              headers: authHeaders(token),
            });
            const userData = response?.data ?? response;
            set({ user: userData, isLoading: false });
          } catch (error) {
            const message =
              error instanceof Error ? error.message : "Failed to fetch user";
            console.error("Failed to fetch user:", error);
            set({ error: message, isLoading: false, user: null });
          }
        },

        setToken: (token) => set({ token }),
        setUser: (user) => set({ user }),
        clearUser: () => set({ user: null, token: null, error: null }),

        addCrop: async (crop, token) => {
          set({ isLoading: true, error: null });
          try {
            const response = await axios.post("/user/crops", crop, {
              headers: authHeaders(token),
            });
            const userData = response?.data ?? response;
            set({ user: userData, isLoading: false });
          } catch (error) {
            const message =
              error instanceof Error ? error.message : "Failed to add crop";
            set({ error: message, isLoading: false });
            throw error;
          }
        },

        updateCrop: async (cropId, crop, token) => {
          set({ isLoading: true, error: null });
          try {
            const response = await axios.put(`/user/crops/${cropId}`, crop, {
              headers: authHeaders(token),
            });
            const userData = response?.data ?? response;
            set({ user: userData, isLoading: false });
          } catch (error) {
            const message =
              error instanceof Error ? error.message : "Failed to update crop";
            set({ error: message, isLoading: false });
            throw error;
          }
        },

        deleteCrop: async (cropId, token) => {
          set({ isLoading: true, error: null });
          try {
            const response = await axios.delete(`/user/crops/${cropId}`, {
              headers: authHeaders(token),
            });
            const userData = response?.data ?? response;
            set({ user: userData, isLoading: false });
          } catch (error) {
            const message =
              error instanceof Error ? error.message : "Failed to delete crop";
            set({ error: message, isLoading: false });
            throw error;
          }
        },
      }),
      {
        name: "user-storage",
        partialize: (state) => ({ user: state.user, token: state.token }),
      },
    ),
  ),
);
