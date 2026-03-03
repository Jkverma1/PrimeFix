import AsyncStorage from "@react-native-async-storage/async-storage";
import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";

interface AuthState {
  token: string | null;
  isLoggedIn: boolean;
  login: (token: string) => void;
  logout: () => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      token: null,
      isLoggedIn: false,
      login: (token) => set({ token, isLoggedIn: true }),
      logout: () => set({ token: null, isLoggedIn: false }),
    }),
    {
      name: "auth-store",
      storage: createJSONStorage(() => AsyncStorage),
    },
  ),
);
