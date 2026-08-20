import { CustomButton } from "@/components/CustomButton";
import { NotificationSetter } from "@/components/NotificationSetter";
import { ScreenHeader } from "@/components/ScreenHeader";
import colors from "@/constants/colors";
import { StorageKey } from "@/enums/storageKey.enum";
import NotificationTimeRange from "@/types/notificationTimeRange";
import { scheduleDailyAffirmationNotifications } from "@/utils/notifications";
import { getStorageObject, setStorageObject } from "@/utils/storage";
import * as Notifications from "expo-notifications";
import { useFocusEffect, useRouter } from "expo-router";
import { SymbolView } from "expo-symbols";
import { useCallback, useEffect, useState } from "react";
import { AppState, Linking, Text, View } from "react-native";
import Animated, {
  Easing,
  useAnimatedStyle,
  useSharedValue,
  withDelay,
  withSequence,
  withTiming,
} from "react-native-reanimated";
import { useSafeAreaInsets } from "react-native-safe-area-context";

const DEFAULT_TIME_RANGE: NotificationTimeRange = {
  count: "3",
  startTime: "09",
  endTime: "22",
};

const getStoredTimeRange = (): NotificationTimeRange =>
  getStorageObject<NotificationTimeRange>(
    StorageKey.USER_NOTIFICATION_TIME_RANGE,
  ) ?? DEFAULT_TIME_RANGE;

export default function Account() {
  const router = useRouter();
  const { bottom } = useSafeAreaInsets();

  const [isActive, setIsActive] = useState(false);
  const [timeRange, setTimeRange] =
    useState<NotificationTimeRange>(getStoredTimeRange);

  const checkPermission = useCallback(() => {
    Notifications.getPermissionsAsync().then(({ status }) => {
      setIsActive(status === Notifications.PermissionStatus.GRANTED);
    });
  }, []);

  // Covers navigating back to this screen from elsewhere in the app.
  useFocusEffect(checkPermission);

  // Covers coming back from the native Settings app: that's a
  // background/foreground transition, not a navigation event, so
  // useFocusEffect alone never sees it.
  useEffect(() => {
    const subscription = AppState.addEventListener("change", (nextState) => {
      if (nextState === "active") checkPermission();
    });

    return () => subscription.remove();
  }, [checkPermission]);

  // expo-symbols doesn't expose SF Symbols' native "wiggle" bell-ring effect
  // (it animates the clapper as a separate layer from the bell body, which
  // isn't reproducible with a single flat icon) — this approximates it with
  // a damped swing of the whole icon, pivoting from its top like a real bell.
  const bellRotation = useSharedValue(0);

  useEffect(() => {
    bellRotation.value = withDelay(
      500,
      withSequence(
        withTiming(15, { duration: 100, easing: Easing.out(Easing.quad) }),
        withTiming(-12, { duration: 100 }),
        withTiming(9, { duration: 90 }),
        withTiming(-6, { duration: 90 }),
        withTiming(3, { duration: 80 }),
        withTiming(0, { duration: 80 }),
      ),
    );
  }, []);

  const bellAnimatedStyle = useAnimatedStyle(() => ({
    transform: [{ rotate: `${bellRotation.value}deg` }],
  }));

  const activateNotifications = (): void => {
    Linking.openSettings();
  };

  const saveChanges = async (): Promise<void> => {
    setStorageObject(StorageKey.USER_NOTIFICATION_TIME_RANGE, timeRange);
    await scheduleDailyAffirmationNotifications(timeRange);

    router.back();
  };

  return (
    <View className="flex-1 px-5" style={{ paddingBottom: bottom }}>
      <ScreenHeader
        showBackButton
        title="Notification"
        showCloseButton={false}
      />

      <View className="gap-16 flex-1 items-center justify-center mb-6">
        <View className="gap-8">
          <Animated.View
            style={[bellAnimatedStyle, { transformOrigin: "50% 0%" }]}
            className="self-center"
          >
            <SymbolView size={100} name="bell.fill" tintColor={colors.text[900]} />
          </Animated.View>

          <View className="gap-4">
            <Text className="font-noto-serif font-semibold text-center text-3xl text-text-900">
              Configure tes notifications
            </Text>

            <Text className="font-public-sans text-center text-xl leading-6 text-text-900">
              Sélectionne la plage horaire pendant laquelle tu veux recevoir tes
              affirmations journalières
            </Text>
          </View>
        </View>

        <NotificationSetter
          value={timeRange}
          onChange={setTimeRange}
          className="items-center"
        />
      </View>

      <View className="w-full gap-4">
        <CustomButton
          label={isActive ? "Sauvegarder" : "Activer les notifications"}
          onPress={isActive ? saveChanges : activateNotifications}
        />
      </View>
    </View>
  );
}
