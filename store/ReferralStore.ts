// store/referralStore.ts

import AsyncStorage from "@react-native-async-storage/async-storage";
import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";
import { supabase } from "../lib/supabase";

export type ReferralStatus = "pending" | "earned" | "paid";

export interface Referral {
  id: string;
  referrer_id: string;
  referred_id: string;
  status: ReferralStatus;
  reward_amount: number;
  earned_at: string | null;
  paid_at: string | null;
  created_at: string;
  // joined
  profiles?: {
    phone: string;
    full_name: string | null;
  };
}

export interface ReferralSummary {
  total_referrals: number;
  earned_count: number;
  paid_count: number;
  total_earned: number;
  total_paid: number;
}

interface ReferralState {
  referrals: Referral[];
  summary: ReferralSummary | null;
  referralCode: string | null;
  isLoading: boolean;
  error: string | null;
  fetchReferrals: () => Promise<void>;
  setReferralCode: (code: string) => void;
  applyReferralCode: (code: string) => Promise<void>;
  clearReferrals: () => void;
}

export const useReferralStore = create<ReferralState>()(
  persist(
    (set, get) => ({
      referrals: [],
      summary: null,
      referralCode: null,
      isLoading: false,
      error: null,

      fetchReferrals: async () => {
        set({ isLoading: true, error: null });
        try {
          const {
            data: { user },
          } = await supabase.auth.getUser();
          if (!user) throw new Error("Not authenticated");

          const { data: referrals, error: refError } = await supabase
            .from("referrals")
            .select(
              `
              *,
              profiles!referrals_referred_id_fkey (phone, full_name)
            `,
            )
            .eq("referrer_id", user.id)
            .order("created_at", { ascending: false });

          if (refError) throw refError;

          const { data: summary, error: sumError } = await supabase
            .from("referral_summary")
            .select("*")
            .eq("referrer_id", user.id)
            .single();

          const defaultSummary: ReferralSummary = {
            total_referrals: 0,
            earned_count: 0,
            paid_count: 0,
            total_earned: 0,
            total_paid: 0,
          };

          set({
            referrals: referrals ?? [],
            summary: summary ?? defaultSummary,
          });
        } catch (e: any) {
          set({ error: e.message });
        } finally {
          set({ isLoading: false });
        }
      },

      setReferralCode: (code) => set({ referralCode: code }),

      applyReferralCode: async (code) => {
        set({ isLoading: true, error: null });
        try {
          const {
            data: { user },
          } = await supabase.auth.getUser();
          if (!user) throw new Error("Not authenticated");

          const { data: referrer, error: findError } = await supabase
            .from("profiles")
            .select("id")
            .eq("referral_code", code.toUpperCase())
            .single();

          if (findError || !referrer) {
            throw new Error("Invalid referral code.");
          }

          if (referrer.id === user.id) {
            throw new Error("You cannot use your own referral code.");
          }

          const { error: updateError } = await supabase
            .from("profiles")
            .update({ referred_by: referrer.id })
            .eq("id", user.id)
            .is("referred_by", null); 

          if (updateError) throw updateError;

          set({ referralCode: code });
        } catch (e: any) {
          set({ error: e.message });
          throw new Error(e.message);
        } finally {
          set({ isLoading: false });
        }
      },

      clearReferrals: () => set({ referrals: [], summary: null, error: null }),
    }),
    {
      name: "referral-store",
      storage: createJSONStorage(() => AsyncStorage),
    },
  ),
);
