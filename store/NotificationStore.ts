import { create } from "zustand";
import { api } from "../services/api";

interface NotificationState {
  badge: number;
  notifications: any[];
  fetchedOnce: boolean;
  incrementBadge: () => void;
  fetchIfNeeded: () => Promise<void>;
  clear: () => void;
}

export const useNotificationStore = create<NotificationState>((set, get) => ({
  badge: 0,
  notifications: [],
  fetchedOnce: false,

  incrementBadge: () => set({ badge: get().badge + 1 }),

  fetchIfNeeded: async () => {
    if (get().fetchedOnce) return;

    const res = await api.get("/notifications");
    set({ notifications: res.data, fetchedOnce: true });
  },

  clear: () => set({ badge: 0, notifications: [], fetchedOnce: false }),
}));
