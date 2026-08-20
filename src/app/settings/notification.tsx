import { CustomButton } from "@/components/CustomButton";
import { ListItemContainer } from "@/components/ListItemContainer";
import { ListItemSwitch } from "@/components/ListItemSwitch";
import { NotificationSetter } from "@/components/NotificationSetter";
import { ScreenHeader } from "@/components/ScreenHeader";
import colors from "@/constants/colors";
import { StorageKey } from "@/enums/storageKey.enum";
import { useCloseSettingsModal } from "@/hooks/use-close-settings-modal";
import { useDisableSwipeDismiss } from "@/hooks/use-disable-swipe-dismiss";
import NotificationTimeRange from "@/types/notificationTimeRange";
import { scheduleDailyAffirmationNotifications } from "@/utils/notifications";
import {
  getStorageBoolean,
  getStorageObject,
  setStorageItem,
  setStorageObject,
} from "@/utils/storage";
import * as Notifications from "expo-notifications";
import { useRouter } from "expo-router";
import { SymbolView } from "expo-symbols";
import { useEffect, useState } from "react";
import { Text, View } from "react-native";
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
  const closeSettingsModal = useCloseSettingsModal();

  useDisableSwipeDismiss();

  // App-level preference — independent of the OS permission status, and
  // shared with the onboarding activation screen, so toggling it here is
  // the same choice as the one made (or skipped) during onboarding.
  const [notificationsEnabled, setNotificationsEnabled] = useState(
    () => getStorageBoolean(StorageKey.NOTIFICATIONS_ENABLED) ?? false,
  );
  const [timeRange, setTimeRange] =
    useState<NotificationTimeRange>(getStoredTimeRange);

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

  const saveChanges = async (): Promise<void> => {
    setStorageItem(StorageKey.NOTIFICATIONS_ENABLED, notificationsEnabled);
    setStorageObject(StorageKey.USER_NOTIFICATION_TIME_RANGE, timeRange);

    if (notificationsEnabled) {
      await scheduleDailyAffirmationNotifications(timeRange);
    } else {
      await Notifications.cancelAllScheduledNotificationsAsync();
    }

    router.back();
  };

  return (
    <View className="flex-1 px-5" style={{ paddingBottom: bottom }}>
      <ScreenHeader
        showBackButton
        title="Notification"
        showCloseButton
        onClose={closeSettingsModal}
      />

      <View className="gap-16 flex-1 items-center justify-center mb-6">
        <View className="gap-8">
          <Animated.View
            style={[bellAnimatedStyle, { transformOrigin: "50% 0%" }]}
            className="self-center"
          >
            <SymbolView
              size={100}
              name="bell.fill"
              tintColor={colors.text[950]}
            />
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

        <View className="gap-7 w-full">
          <ListItemContainer className="w-full">
            <ListItemSwitch
              value={notificationsEnabled}
              text="Activer les notifications"
              onValueChange={setNotificationsEnabled}
            />
          </ListItemContainer>

          <NotificationSetter
            value={timeRange}
            onChange={setTimeRange}
            disabled={!notificationsEnabled}
            className={`items-center ${!notificationsEnabled && "opacity-40"}`}
          />
        </View>
      </View>

      <View className="w-full">
        <CustomButton label="Sauvegarder" onPress={saveChanges} />
      </View>
    </View>
  );
}
