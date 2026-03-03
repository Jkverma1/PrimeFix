import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import AsyncStorage from "@react-native-async-storage/async-storage";

interface User {
  id: string;
  name: string;
  phone: string;
}

interface UserState {
  user: User | null;
  setUser: (user: User) => void;
  clear: () => void;
}

export const useUserStore = create<UserState>()(
  persist(
    (set) => ({
      user: null,
      setUser: (user) => set({ user }),
      clear: () => set({ user: null }),
    }),
    {
      name: "user-store",
      storage: createJSONStorage(() => AsyncStorage),
    },
  ),
);
