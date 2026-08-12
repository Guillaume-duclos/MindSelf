import { CustomButton } from "@/components/CustomButton";
import { NotificationSetter } from "@/components/NotificationSetter";
import { OnboardingTitle } from "@/components/OnboardingTitle";
import colors from "@/constants/colors";
import { Page } from "@/enums/page.enum";
import { StorageKey } from "@/enums/storageKey.enum";
import NotificationTimeRange from "@/types/notificationTimeRange";
import { scheduleDailyAffirmationNotifications } from "@/utils/notifications";
import { setStorageItem, setStorageObject } from "@/utils/storage";
import { GlassView } from "expo-glass-effect";
import { LinearGradient } from "expo-linear-gradient";
import { useRouter } from "expo-router";
import { useState } from "react";
import { Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

const DEFAULT_TIME_RANGE: NotificationTimeRange = {
  count: "3",
  startTime: "09",
  endTime: "22",
};

export default function activateNotification() {
  const router = useRouter();

  const [timeRange, setTimeRange] =
    useState<NotificationTimeRange>(DEFAULT_TIME_RANGE);

  const activateNotification = async (): Promise<void> => {
    setStorageObject(StorageKey.USER_NOTIFICATION_TIME_RANGE, timeRange);

    setStorageItem(
      StorageKey.CURRENT_ONBOARDING_PAGE,
      Page.ONBOARDING_USER_AGE_RANGE,
    );

    await scheduleDailyAffirmationNotifications(timeRange);

    router.push("/onboarding/aboutYou");
  };

  const handleSkip = () => {
    setStorageItem(
      StorageKey.CURRENT_ONBOARDING_PAGE,
      Page.ONBOARDING_USER_AGE_RANGE,
    );

    router.push("/onboarding/aboutYou");
  };

  return (
    <SafeAreaView className="flex-1 px-10 items-center bg-cream-50">
      <View className="flex-1 items-center justify-center w-full gap-10">
        <OnboardingTitle title="Reçois des affirmations régulièrement" />

        <View className="w-full">
          <GlassView
            glassEffectStyle="regular"
            className="absolute left-6 right-6 h-16 -bottom-[20px] opacity-40 gap-2.5 flex-row items-center pl-3.5 pr-4 py-3 rounded-b-3xl border-continuous justify-center"
          />

          <GlassView
            glassEffectStyle="regular"
            className="absolute left-3 right-3 h-16 -bottom-[10px] opacity-50 gap-2.5 flex-row items-center pl-3.5 pr-4 py-3 rounded-b-3xl border-continuous justify-center"
          />

          <GlassView
            glassEffectStyle="regular"
            className="pl-3.5 pr-4 py-3 rounded-3xl border-continuous justify-center"
          >
            <View className="gap-2.5 flex-row items-center">
              <GlassView className="w-[38px] h-[38px] rounded-[10px] border-continuous overflow-hidden">
                <LinearGradient
                  colors={[colors.cream[100], colors.cream[300]]}
                  start={{ x: 0, y: 0 }}
                  end={{ x: 1, y: 1 }}
                  className="w-full h-full items-center justify-center"
                >
                  <Text className="font-noto-serif font-semibold text-[5px]">
                    MindSelf
                  </Text>
                </LinearGradient>
              </GlassView>

              <View className="flex-1">
                <View className="flex-row justify-between">
                  <Text className="font-semibold text-[15px] leading-[17px]">
                    MindSelf
                  </Text>
                  <Text className="text-[15px] leading-[17px]">
                    À l'instant
                  </Text>
                </View>

                <Text className="text-[15px] leading-[18px]">
                  Tout ce que j'entreprend est formidable
                </Text>
              </View>
            </View>
          </GlassView>
        </View>
      </View>

      <NotificationSetter value={timeRange} onChange={setTimeRange} />

      <View className="w-full gap-4">
        <CustomButton
          label="Activer les notifications"
          onPress={activateNotification}
        />
        <CustomButton
          label="Plus tard"
          tintColor={colors.cream[200]}
          textClassName="text-ink"
          onPress={handleSkip}
        />
      </View>
    </SafeAreaView>
  );
}
