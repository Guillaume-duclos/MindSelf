import colors from "@/constants/colors";
import { Stack } from "expo-router";

export default function SettingsLayout() {
  return (
    <Stack screenOptions={{ headerShown: false }}>
      <Stack.Screen name="index" />
      <Stack.Screen name="account" />
      <Stack.Screen name="widget" />
      <Stack.Screen name="widgetHelp" options={{ presentation: "modal" }} />
      <Stack.Screen
        name="notification"
        options={{
          contentStyle: { backgroundColor: colors.cream[50] },
        }}
      />
      <Stack.Screen
        name="termsOfUse"
        options={{ contentStyle: { backgroundColor: colors.cream[50] } }}
      />
      <Stack.Screen
        name="privacyPolicy"
        options={{ contentStyle: { backgroundColor: colors.cream[50] } }}
      />
      <Stack.Screen
        name="userName"
        options={{ contentStyle: { backgroundColor: colors.cream[50] } }}
      />
      <Stack.Screen
        name="userSex"
        options={{ contentStyle: { backgroundColor: colors.cream[50] } }}
      />
      <Stack.Screen
        name="userAgeRange"
        options={{ contentStyle: { backgroundColor: colors.cream[50] } }}
      />
      <Stack.Screen
        name="userRelationshipStatus"
        options={{ contentStyle: { backgroundColor: colors.cream[50] } }}
      />
      <Stack.Screen
        name="userProfessionalStatus"
        options={{ contentStyle: { backgroundColor: colors.cream[50] } }}
      />
    </Stack>
  );
}
