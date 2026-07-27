import { AnimatedSplashOverlay } from "@/components/animated-icon";
import { Host } from "@expo/ui";
import { GlassView } from "expo-glass-effect";
import { Image } from "expo-image";
import { LinearGradient } from "expo-linear-gradient";
import { DarkTheme, DefaultTheme, Stack, ThemeProvider } from "expo-router";
import * as SplashScreen from "expo-splash-screen";
import { SymbolView } from "expo-symbols";
import { cssInterop } from "nativewind";
import { useColorScheme } from "react-native";
import "../global.css";

SplashScreen.preventAutoHideAsync();
cssInterop(LinearGradient, { className: "style" });
cssInterop(SymbolView, { className: "style" });
cssInterop(GlassView, { className: "style" });
cssInterop(Image, { className: "style" });
cssInterop(Host, { className: "style" });

export default function RootLayout() {
  const colorScheme = useColorScheme();

  return (
    <ThemeProvider value={colorScheme === "dark" ? DarkTheme : DefaultTheme}>
      <AnimatedSplashOverlay />
      <Stack screenOptions={{ headerShown: false }}>
        <Stack.Screen name="index" />
        <Stack.Screen name="settings" options={{ presentation: "modal" }} />
        <Stack.Screen name="account" options={{ presentation: "card" }} />
        <Stack.Screen name="share" options={{ presentation: "modal" }} />
        <Stack.Screen name="themes" options={{ presentation: "modal" }} />
        <Stack.Screen name="paywall" options={{ presentation: "modal" }} />
      </Stack>
    </ThemeProvider>
  );
}
