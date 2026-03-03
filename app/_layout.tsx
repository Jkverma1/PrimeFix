// app/_layout.tsx

import {
  Stack,
  useNavigationContainerRef,
  useRouter,
  useSegments,
} from "expo-router";
import * as SplashScreen from "expo-splash-screen";
import { useEffect, useState } from "react";
import { useAuthStore } from "../store/AuthStore";

SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  const router = useRouter();
  const segments = useSegments();
  const { isLoggedIn } = useAuthStore();
  const [isNavigationReady, setIsNavigationReady] = useState(false);
  const rootNavRef = useNavigationContainerRef();

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

  useEffect(() => {
    if (rootNavRef?.isReady()) {
      setIsNavigationReady(true);
    }
  }, [rootNavRef?.isReady()]);

  useEffect(() => {
    if (!isNavigationReady) return;

    const inAuthGroup = segments[0] === "(auth)";

    if (!isLoggedIn && !inAuthGroup) {
      router.replace("/(auth)");
    } else if (isLoggedIn && inAuthGroup) {
      router.replace("/(tabs)/(a-home)");
    }
  }, [isLoggedIn, segments, isNavigationReady]);

  return <Stack screenOptions={{ headerShown: false }} />;
}
