// store/bookingStore.ts

import { BookingStatus } from "@/types/customer.type";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";
import { supabase } from "../lib/supabase";

export interface Booking {
  id: string;
  user_id: string;
  service_id: string;
  customer_name: string;
  customer_phone: string;
  address: string;
  issue: string;
  status: BookingStatus;
  scheduled_at: string | null;
  quoted_price: number | null;
  final_price: number | null;
  created_at: string;
  // joined from services table
  services?: {
    label: string;
    icon: string;
    slug: string;
  };
}

export interface CreateBookingInput {
  service_id: string;
  customer_name: string;
  customer_phone: string;
  address: string;
  issue: string;
}

interface BookingState {
  bookings: Booking[];
  isLoading: boolean;
  isSubmitting: boolean;
  error: string | null;
  lastFetched: number | null;
  fetchBookings: (force?: boolean) => Promise<void>;
  createBooking: (input: CreateBookingInput) => Promise<Booking>;
  cancelBooking: (id: string) => Promise<void>;
  clearBookings: () => void;
}

const CACHE_TTL = 5 * 60 * 1000; // 5 minutes

export const useBookingStore = create<BookingState>()(
  persist(
    (set, get) => ({
      bookings: [],
      isLoading: false,
      isSubmitting: false,
      error: null,
      lastFetched: null,

      fetchBookings: async (force = false) => {
        const { lastFetched } = get();
        const isCacheValid =
          lastFetched && Date.now() - lastFetched < CACHE_TTL;

        // Use cache unless forced or cache expired
        if (isCacheValid && !force) return;

        set({ isLoading: true, error: null });
        try {
          const {
            data: { user },
          } = await supabase.auth.getUser();
          if (!user) throw new Error("Not authenticated");

          const { data, error } = await supabase
            .from("bookings")
            .select(
              `
              *,
              services (label, icon, slug)
            `,
            )
            .eq("user_id", user.id)
            .order("created_at", { ascending: false });

          if (error) throw error;
          set({ bookings: data ?? [], lastFetched: Date.now() });
        } catch (e: any) {
          set({ error: e.message });
        } finally {
          set({ isLoading: false });
        }
      },

      createBooking: async (input) => {
        set({ isSubmitting: true, error: null });
        try {
          const {
            data: { user },
          } = await supabase.auth.getUser();
          if (!user) throw new Error("Not authenticated");

          // Resolve service_id from slug if needed
          const { data, error } = await supabase
            .from("bookings")
            .insert({
              user_id: user.id,
              ...input,
            })
            .select(
              `
              *,
              services (label, icon, slug)
            `,
            )
            .single();

          if (error) throw error;

          // Prepend to local cache immediately
          set((state) => ({
            bookings: [data, ...state.bookings],
            lastFetched: Date.now(),
          }));

          return data;
        } catch (e: any) {
          set({ error: e.message });
          throw new Error(e.message);
        } finally {
          set({ isSubmitting: false });
        }
      },

      cancelBooking: async (id) => {
        set({ error: null });
        try {
          const { error } = await supabase
            .from("bookings")
            .update({ status: "cancelled" })
            .eq("id", id)
            .eq("status", "pending"); // RLS also enforces this

          if (error) throw error;

          // Update local cache
          set((state) => ({
            bookings: state.bookings.map((b) =>
              b.id === id ? { ...b, status: "cancelled" } : b,
            ),
          }));
        } catch (e: any) {
          set({ error: e.message });
          throw new Error(e.message);
        }
      },

      clearBookings: () =>
        set({ bookings: [], lastFetched: null, error: null }),
    }),
    {
      name: "booking-store",
      storage: createJSONStorage(() => AsyncStorage),
    },
  ),
);
