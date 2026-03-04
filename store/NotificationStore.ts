// store/notificationStore.ts

import AsyncStorage from "@react-native-async-storage/async-storage";
import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";
import { supabase } from "../lib/supabase";

export type NotificationType =
  | "booking_confirmed"
  | "booking_in_progress"
  | "booking_completed"
  | "booking_cancelled"
  | "referral_earned"
  | "referral_paid"
  | "general";

export interface Notification {
  id: string;
  user_id: string;
  type: NotificationType;
  title: string;
  body: string;
  is_read: boolean;
  metadata: Record<string, any> | null;
  created_at: string;
}

interface NotificationState {
  notifications: Notification[];
  unreadCount: number;
  isLoading: boolean;
  error: string | null;
  fetchNotifications: () => Promise<void>;
  markAsRead: (id: string) => Promise<void>;
  markAllAsRead: () => Promise<void>;
  clearNotifications: () => void;
}

export const useNotificationStore = create<NotificationState>()(
  persist(
    (set, get) => ({
      notifications: [],
      unreadCount: 0,
      isLoading: false,
      error: null,

      fetchNotifications: async () => {
        set({ isLoading: true, error: null });
        try {
          const {
            data: { user },
          } = await supabase.auth.getUser();
          if (!user) throw new Error("Not authenticated");

          const { data, error } = await supabase
            .from("notifications")
            .select("*")
            .eq("user_id", user.id)
            .order("created_at", { ascending: false })
            .limit(50);

          if (error) throw error;

          const notifications = data ?? [];
          const unreadCount = notifications.filter((n) => !n.is_read).length;

          set({ notifications, unreadCount });
        } catch (e: any) {
          set({ error: e.message });
        } finally {
          set({ isLoading: false });
        }
      },

      markAsRead: async (id) => {
        // Optimistic update
        set((state) => ({
          notifications: state.notifications.map((n) =>
            n.id === id ? { ...n, is_read: true } : n,
          ),
          unreadCount: Math.max(0, state.unreadCount - 1),
        }));

        try {
          const { error } = await supabase
            .from("notifications")
            .update({ is_read: true })
            .eq("id", id);

          if (error) throw error;
        } catch (e: any) {
          // Revert optimistic update on failure
          set((state) => ({
            notifications: state.notifications.map((n) =>
              n.id === id ? { ...n, is_read: false } : n,
            ),
            unreadCount: state.unreadCount + 1,
          }));
        }
      },

      markAllAsRead: async () => {
        const { notifications } = get();
        const unreadIds = notifications
          .filter((n) => !n.is_read)
          .map((n) => n.id);

        if (unreadIds.length === 0) return;

        // Optimistic update
        set((state) => ({
          notifications: state.notifications.map((n) => ({
            ...n,
            is_read: true,
          })),
          unreadCount: 0,
        }));

        try {
          const {
            data: { user },
          } = await supabase.auth.getUser();
          if (!user) return;

          const { error } = await supabase
            .from("notifications")
            .update({ is_read: true })
            .eq("user_id", user.id)
            .eq("is_read", false);

          if (error) throw error;
        } catch (e: any) {
          // Revert on failure — refetch to get correct state
          get().fetchNotifications();
        }
      },

      clearNotifications: () =>
        set({ notifications: [], unreadCount: 0, error: null }),
    }),
    {
      name: "notification-store",
      storage: createJSONStorage(() => AsyncStorage),
    },
  ),
);
