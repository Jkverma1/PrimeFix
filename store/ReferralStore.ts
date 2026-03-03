import { create } from "zustand";
import { api } from "../services/api";

interface ReferralState {
  referrals: any[];
  fetched: boolean;
  fetchReferrals: (force?: boolean) => Promise<void>;
  clear: () => void;
}

export const useReferralStore = create<ReferralState>((set, get) => ({
  referrals: [],
  fetched: false,

  fetchReferrals: async (force = false) => {
    if (!force && get().fetched) return;

    const res = await api.get("/referrals");
    set({ referrals: res.data, fetched: true });
  },

  clear: () => set({ referrals: [], fetched: false }),
}));
