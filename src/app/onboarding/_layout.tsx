import { Stack } from "expo-router";

export default function SettingsLayout() {
  return (
    <Stack screenOptions={{ headerShown: false, gestureEnabled: false }}>
      <Stack.Screen name="index" />
      <Stack.Screen name="userName" />
      <Stack.Screen name="activateNotification" />
      <Stack.Screen name="aboutYou" />
      <Stack.Screen name="personnalInformations" />
    </Stack>
  );
}
