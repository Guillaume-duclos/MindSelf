import { AnimatedSplashOverlay } from "@/components/animated-icon";
import { removeAllStorage } from "@/utils/storage";
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

if (__DEV__) {
  registerDevMenuItems([
    {
      name: "Vider le storage",
      callback: () => removeAllStorage(),
    },
  ]);
}

export default function RootLayout() {
  const colorScheme = useColorScheme();

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <ThemeProvider value={colorScheme === "dark" ? DarkTheme : DefaultTheme}>
        <AnimatedSplashOverlay />

        <Stack screenOptions={{ headerShown: false }}>
          <Stack.Screen name="onboarding" />
          <Stack.Screen name="index" />
          <Stack.Screen name="settings" options={{ presentation: "modal" }} />
          <Stack.Screen name="share" options={{ presentation: "modal" }} />
          <Stack.Screen name="themes" options={{ presentation: "modal" }} />
          <Stack.Screen name="paywall" options={{ presentation: "modal" }} />
        </Stack>
      </ThemeProvider>
    </GestureHandlerRootView>
  );
}
