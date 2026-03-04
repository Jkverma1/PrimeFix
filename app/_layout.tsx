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
  const { isLoggedIn, init } = useAuthStore();
  const [isReady, setIsReady] = useState(false);
  const rootNavRef = useNavigationContainerRef();

  useEffect(() => {
    async function prepare() {
      try {
        await init();
        await new Promise((resolve) => setTimeout(resolve, 800));
      } catch (e) {
        console.warn(e);
      } finally {
        await SplashScreen.hideAsync();
        setIsReady(true);
      }
    }
    prepare();
  }, []);

  const [navReady, setNavReady] = useState(false);
  useEffect(() => {
    if (rootNavRef?.isReady()) setNavReady(true);
  }, [rootNavRef?.isReady()]);

  useEffect(() => {
    if (!isReady || !navReady) return;

    const inAuthGroup = segments[0] === "(auth)";

    if (!isLoggedIn && !inAuthGroup) {
      router.replace("/(auth)");
    } else if (isLoggedIn && inAuthGroup) {
      router.replace("/(tabs)/(a-home)");
    }
  }, [isLoggedIn, segments, isReady, navReady]);

  if (!isReady) return null;

  return <Stack screenOptions={{ headerShown: false }} />;
}
