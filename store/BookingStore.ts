import { create } from "zustand";
import { api } from "../services/api";

interface BookingState {
  bookings: any[];
  lastFetched: number | null;
  fetchBookings: (force?: boolean) => Promise<void>;
  clear: () => void;
}

export const useBookingStore = create<BookingState>((set, get) => ({
  bookings: [],
  lastFetched: null,

  fetchBookings: async (force = false) => {
    if (!force && get().bookings.length > 0) return;

    const res = await api.get("/bookings");
    set({ bookings: res.data, lastFetched: Date.now() });
  },

  clear: () => set({ bookings: [], lastFetched: null }),
}));
