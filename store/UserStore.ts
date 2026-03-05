// store/userStore.ts

import AsyncStorage from "@react-native-async-storage/async-storage";
import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";
import { supabase } from "../lib/supabase";

export interface UserProfile {
  id: string;
  phone: string;
  full_name: string | null;
  avatar_url: string | null;
  referral_code: string;
  referred_by: string | null;
  created_at: string;
  is_admin: boolean;
}

export interface SavedAddress {
  id: string;
  user_id: string;
  label: string;
  address: string;
  is_default: boolean;
  created_at: string;
}

interface UserState {
  profile: UserProfile | null;
  addresses: SavedAddress[];
  isLoading: boolean;
  error: string | null;

  // Profile
  fetchProfile: () => Promise<void>;
  updateProfile: (data: { full_name?: string }) => Promise<void>;

  // Addresses
  fetchAddresses: () => Promise<void>;
  addAddress: (data: {
    label: string;
    address: string;
    is_default?: boolean;
  }) => Promise<void>;
  updateAddress: (
    id: string,
    data: { label?: string; address?: string },
  ) => Promise<void>;
  deleteAddress: (id: string) => Promise<void>;
  setDefaultAddress: (id: string) => Promise<void>;

  clearProfile: () => void;
}

export const useUserStore = create<UserState>()(
  persist(
    (set, get) => ({
      profile: null,
      addresses: [],
      isLoading: false,
      error: null,

      // ── Profile ───────────────────────────────────────────

      fetchProfile: async () => {
        set({ isLoading: true, error: null });
        try {
          const {
            data: { user },
          } = await supabase.auth.getUser();
          if (!user) throw new Error("Not authenticated");

          const { data, error } = await supabase
            .from("profiles")
            .select("*")
            .eq("id", user.id)
            .single();

          if (error) throw error;
          set({ profile: data });
        } catch (e: any) {
          set({ error: e.message });
        } finally {
          set({ isLoading: false });
        }
      },

      updateProfile: async (updates) => {
        set({ isLoading: true, error: null });
        try {
          const {
            data: { user },
          } = await supabase.auth.getUser();
          if (!user) throw new Error("Not authenticated");

          const { data, error } = await supabase
            .from("profiles")
            .update(updates)
            .eq("id", user.id)
            .select()
            .single();

          if (error) throw error;
          set({ profile: data });
        } catch (e: any) {
          set({ error: e.message });
          throw new Error(e.message);
        } finally {
          set({ isLoading: false });
        }
      },

      // ── Addresses ─────────────────────────────────────────

      fetchAddresses: async () => {
        try {
          const {
            data: { user },
          } = await supabase.auth.getUser();
          if (!user) return;

          const { data, error } = await supabase
            .from("addresses")
            .select("*")
            .eq("user_id", user.id)
            .order("is_default", { ascending: false })
            .order("created_at", { ascending: true });

          if (error) throw error;
          set({ addresses: data ?? [] });
        } catch (e: any) {
          set({ error: e.message });
        }
      },

      addAddress: async ({ label, address, is_default = false }) => {
        try {
          const {
            data: { user },
          } = await supabase.auth.getUser();
          if (!user) throw new Error("Not authenticated");

          const { addresses } = get();

          // If this is first address or marked default, clear others first
          const makeDefault = is_default || addresses.length === 0;

          if (makeDefault && addresses.length > 0) {
            await supabase
              .from("addresses")
              .update({ is_default: false })
              .eq("user_id", user.id);
          }

          const { data, error } = await supabase
            .from("addresses")
            .insert({
              user_id: user.id,
              label,
              address,
              is_default: makeDefault,
            })
            .select()
            .single();

          if (error) throw error;

          set((state) => ({
            addresses: makeDefault
              ? [
                  data,
                  ...state.addresses.map((a) => ({ ...a, is_default: false })),
                ]
              : [...state.addresses, data],
          }));
        } catch (e: any) {
          set({ error: e.message });
          throw new Error(e.message);
        }
      },

      updateAddress: async (id, updates) => {
        try {
          const { data, error } = await supabase
            .from("addresses")
            .update(updates)
            .eq("id", id)
            .select()
            .single();

          if (error) throw error;

          set((state) => ({
            addresses: state.addresses.map((a) => (a.id === id ? data : a)),
          }));
        } catch (e: any) {
          set({ error: e.message });
          throw new Error(e.message);
        }
      },

      deleteAddress: async (id) => {
        try {
          const { error } = await supabase
            .from("addresses")
            .delete()
            .eq("id", id);

          if (error) throw error;

          set((state) => ({
            addresses: state.addresses.filter((a) => a.id !== id),
          }));
        } catch (e: any) {
          set({ error: e.message });
          throw new Error(e.message);
        }
      },

      setDefaultAddress: async (id) => {
        try {
          const {
            data: { user },
          } = await supabase.auth.getUser();
          if (!user) throw new Error("Not authenticated");

          // Clear all defaults first
          await supabase
            .from("addresses")
            .update({ is_default: false })
            .eq("user_id", user.id);

          // Set new default
          const { data, error } = await supabase
            .from("addresses")
            .update({ is_default: true })
            .eq("id", id)
            .select()
            .single();

          if (error) throw error;

          set((state) => ({
            addresses: state.addresses.map((a) => ({
              ...a,
              is_default: a.id === id,
            })),
          }));
        } catch (e: any) {
          set({ error: e.message });
          throw new Error(e.message);
        }
      },

      clearProfile: () => set({ profile: null, addresses: [], error: null }),
    }),
    {
      name: "user-store",
      storage: createJSONStorage(() => AsyncStorage),
    },
  ),
);
