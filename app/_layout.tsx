// app/_layout.tsx
// Root layout — wraps all screens. Add providers here (auth, theme, etc.) as app grows.

import { Stack } from 'expo-router';
import Colors from '../constants/colors';

export default function RootLayout() {
  return (
    <Stack
      screenOptions={{
        headerStyle: { backgroundColor: Colors.bg.primary },
        headerTintColor: Colors.text.primary,
        headerTitleStyle: { fontWeight: '700', fontSize: 18 },
        headerShadowVisible: false,
        contentStyle: { backgroundColor: Colors.bg.primary },
      }}
    >
      <Stack.Screen name="index" options={{ headerShown: false }} />
      <Stack.Screen name="request" options={{ title: 'Service Request' }} />
      <Stack.Screen name="success" options={{ headerShown: false, gestureEnabled: false }} />
    </Stack>
  );
}
