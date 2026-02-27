// app/_layout.tsx
// Root layout — wraps all screens. Splash + navigation config.

import { Stack } from "expo-router";
import * as SplashScreen from "expo-splash-screen";
import { useEffect } from "react";
import Colors from "../constants/colors";

SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  useEffect(() => {
    async function prepare() {
      try {
        await new Promise((resolve) => setTimeout(resolve, 1200));
      } catch (e) {
        console.warn(e);
      } finally {
        await SplashScreen.hideAsync();
      }
    }

    prepare();
  }, []);

  return (
    <Stack
      screenOptions={{
        headerStyle: { backgroundColor: Colors.bg.primary },
        headerTintColor: Colors.text.primary,
        headerTitleStyle: { fontWeight: "700", fontSize: 18 },
        headerShadowVisible: false,
        contentStyle: { backgroundColor: Colors.bg.primary },
      }}
    >
      <Stack.Screen name="index" options={{ headerShown: false }} />
      <Stack.Screen name="request" options={{ title: "Service Request" }} />
      <Stack.Screen
        name="success"
        options={{ headerShown: false, gestureEnabled: false }}
      />
    </Stack>
  );
}
