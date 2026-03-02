import { Stack } from "expo-router";

export default function AccountLayout() {
  return (
    <Stack screenOptions={{ headerShown: false }}>
      <Stack.Screen name="notifications" options={{ headerShown: false }} />
    </Stack>
  );
}
