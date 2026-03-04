// store/AuthStore.ts

import AsyncStorage from "@react-native-async-storage/async-storage";
import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";
import { supabase } from "../lib/supabase";

interface AuthState {
  token: string | null;
  userId: string | null;
  isLoggedIn: boolean;
  login: (token: string, userId: string) => void;
  logout: () => Promise<void>;
  init: () => Promise<void>;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      token: null,
      userId: null,
      isLoggedIn: false,

      login: (token, userId) => set({ token, userId, isLoggedIn: true }),

      logout: async () => {
        await supabase.auth.signOut();

        // Clear all other stores
        const { useUserStore } = await import("./UserStore");
        const { useBookingStore } = await import("./BookingStore");
        const { useNotificationStore } = await import("./NotificationStore");
        const { useReferralStore } = await import("./ReferralStore");

        useUserStore.getState().clearProfile();
        useBookingStore.getState().clearBookings();
        useNotificationStore.getState().clearNotifications();
        useReferralStore.getState().clearReferrals();

        set({ token: null, userId: null, isLoggedIn: false });
      },

      init: async () => {
        const { data } = await supabase.auth.getSession();
        if (data.session) {
          set({
            token: data.session.access_token,
            userId: data.session.user.id,
            isLoggedIn: true,
          });
        }
      },
    }),
    {
      name: "auth-store",
      storage: createJSONStorage(() => AsyncStorage),
    },
  ),
);
