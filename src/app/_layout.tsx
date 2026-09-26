import colors from "@/constants/colors";
import ColorScheme from "@/enums/colorScheme.enum";
import { recordAppOpenedToday } from "@/utils/activity";
import { resetDailyLikesIfNewDay } from "@/utils/dailyLikes";
import { registerDevMenu } from "@/utils/devMenu";
import { configureNotificationHandler } from "@/utils/notifications";
import { configurePurchases } from "@/utils/purchases";
import { updateAffirmationWidgetTimeline } from "@/utils/widget";
import { Host } from "@expo/ui";
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

// SplashScreen
SplashScreen.preventAutoHideAsync();

// NativeWind
cssInterop(LinearGradient, { className: "style" });
cssInterop(SymbolView, { className: "style" });
cssInterop(GlassView, { className: "style" });
cssInterop(Image, { className: "style" });
cssInterop(Host, { className: "style" });

// Divers
configureNotificationHandler();
configurePurchases();
updateAffirmationWidgetTimeline();
recordAppOpenedToday();
resetDailyLikesIfNewDay();
registerDevMenu();

export default function RootLayout() {
  const colorScheme = useColorScheme();

  return (
    <GestureHandlerRootView
      className="flex-1"
      onLayout={() => SplashScreen.hideAsync()}
    >
      <ThemeProvider
        value={colorScheme === ColorScheme.DARK ? DarkTheme : DefaultTheme}
      >
        <Stack
          screenOptions={{
            headerShown: false,
            contentStyle: { backgroundColor: colors.secondary[50] },
          }}
        >
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
