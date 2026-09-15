import colors from "@/constants/colors";
import { Stack } from "expo-router";

export default function SettingsLayout() {
  return (
    <Stack
      screenOptions={{
        headerShown: false,
        contentStyle: { backgroundColor: colors.secondary[100] },
      }}
    >
      <Stack.Screen name="index" />
      <Stack.Screen name="account" />
      <Stack.Screen name="widget" />
      <Stack.Screen name="widgetHelp" options={{ presentation: "modal" }} />
      <Stack.Screen name="notification" />
      <Stack.Screen name="termsOfUse" />
      <Stack.Screen name="privacyPolicy" />
      <Stack.Screen name="userName" />
      <Stack.Screen name="userSex" />
      <Stack.Screen name="userAgeRange" />
      <Stack.Screen name="userRelationshipStatus" />
      <Stack.Screen name="userProfessionalStatus" />
    </Stack>
  );
}
