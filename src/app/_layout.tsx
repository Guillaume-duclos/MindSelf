import colors from "@/constants/colors";
import { StorageKey } from "@/enums/storageKey.enum";
import {
  configureNotificationHandler,
  scheduleNotification,
} from "@/utils/notifications";
import {
  getAllStorageEntries,
  removeAllStorage,
  setStorageItem,
} from "@/utils/storage";
import { updateAffirmationWidgetTimeline } from "@/utils/widget";
import { Host } from "@expo/ui";
import { registerDevMenuItems } from "expo-dev-menu";
import { GlassView } from "expo-glass-effect";
import { Image } from "expo-image";
import { LinearGradient } from "expo-linear-gradient";
import { DarkTheme, DefaultTheme, Stack, ThemeProvider } from "expo-router";
import * as SplashScreen from "expo-splash-screen";
import { SymbolView } from "expo-symbols";
import { cssInterop } from "nativewind";
import { useColorScheme } from "react-native";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import "../global.css";

SplashScreen.preventAutoHideAsync();
cssInterop(LinearGradient, { className: "style" });
cssInterop(SymbolView, { className: "style" });
cssInterop(GlassView, { className: "style" });
cssInterop(Image, { className: "style" });
cssInterop(Host, { className: "style" });

configureNotificationHandler();
updateAffirmationWidgetTimeline();

if (__DEV__) {
  registerDevMenuItems([
    {
      name: "Vider le storage",
      callback: () => removeAllStorage(),
    },
    {
      name: "Logger le storage",
      callback: () => console.log("[Storage]", getAllStorageEntries()),
    },
    {
      name: "Tester une notification",
      callback: () =>
        scheduleNotification("Tout ce que j'entreprend est formidable"),
    },
    {
      name: "Rafraîchir le widget",
      callback: () => updateAffirmationWidgetTimeline(),
    },
    {
      name: "Rejouer les animations d'accueil",
      callback: () =>
        setStorageItem(StorageKey.HAS_SEEN_SECOND_AFFIRMATION, false),
    },
  ]);
}

export default function RootLayout() {
  const colorScheme = useColorScheme();

  return (
    <GestureHandlerRootView
      style={{ flex: 1 }}
      onLayout={() => SplashScreen.hideAsync()}
    >
      <ThemeProvider value={colorScheme === "dark" ? DarkTheme : DefaultTheme}>
        <Stack screenOptions={{ headerShown: false }}>
          <Stack.Screen name="onboarding" />
          <Stack.Screen name="index" />
          <Stack.Screen name="settings" options={{ presentation: "modal" }} />
          <Stack.Screen
            name="share"
            options={{
              presentation: "modal",
              contentStyle: { backgroundColor: colors.cream[50] },
            }}
          />
          <Stack.Screen name="themes" options={{ presentation: "modal" }} />
          <Stack.Screen
            name="paywall"
            options={{
              presentation: "modal",
              contentStyle: { backgroundColor: colors.cream[50] },
            }}
          />
        </Stack>
      </ThemeProvider>
    </GestureHandlerRootView>
  );
}
