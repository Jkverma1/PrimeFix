import { Stack } from "expo-router";

export default function BookingsLayout() {
  return (
    <Stack screenOptions={{ headerShown: false }}>
      <Stack.Screen name="index" options={{ headerShown: false }} />
      <Stack.Screen name="request" options={{ headerShown: false }} />
      <Stack.Screen
        name="success"
        options={{ headerShown: false, gestureEnabled: false }}
      />
    </Stack>
  );
}
