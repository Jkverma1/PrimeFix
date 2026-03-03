import AsyncStorage from "@react-native-async-storage/async-storage";

export const storage = {
  async set<T>(key: string, value: T): Promise<void> {
    try {
      await AsyncStorage.setItem(key, JSON.stringify(value));
    } catch (err) {
      console.warn("Storage set error:", key, err);
    }
  },

  async get<T>(key: string): Promise<T | null> {
    try {
      const value = await AsyncStorage.getItem(key);
      return value ? JSON.parse(value) : null;
    } catch (err) {
      console.warn("Storage get error:", key, err);
      return null;
    }
  },

  async remove(key: string): Promise<void> {
    try {
      await AsyncStorage.removeItem(key);
    } catch (err) {
      console.warn("Storage remove error:", key, err);
    }
  },

  async clear(): Promise<void> {
    try {
      await AsyncStorage.clear();
    } catch (err) {
      console.warn("Storage clear error:", err);
    }
  },
};
