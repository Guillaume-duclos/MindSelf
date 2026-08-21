import { Stack } from "expo-router";

export default function SettingsLayout() {
  return (
    <Stack screenOptions={{ headerShown: false, gestureEnabled: true }}>
      <Stack.Screen name="index" />
      <Stack.Screen name="userName" />
      <Stack.Screen name="activateNotification" />
      <Stack.Screen name="aboutYou" />
      <Stack.Screen name="personnalInformations" />
      <Stack.Screen name="activateSubscription" />
      <Stack.Screen name="choseTheme" />
      <Stack.Screen name="loadingProfile" />
      <Stack.Screen name="privacyPolicy" options={{ presentation: "modal" }} />
      <Stack.Screen name="termsOfUse" options={{ presentation: "modal" }} />
    </Stack>
  );
}
