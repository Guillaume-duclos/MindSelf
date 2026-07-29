import { Stack } from "expo-router";

export default function SettingsLayout() {
  return (
    <Stack screenOptions={{ headerShown: false }}>
      <Stack.Screen name="index" />
      <Stack.Screen name="userName" />
      <Stack.Screen name="activateNotification" />
      <Stack.Screen name="aboutYou" />
      <Stack.Screen name="userAge" />
      <Stack.Screen name="userGender" />
      <Stack.Screen name="userRelationship" />
      <Stack.Screen name="userProfessionalSituation" />
      <Stack.Screen name="userAstralSign" />
    </Stack>
  );
}
