import { CustomButton } from "@/components/CustomButton";
import { CustomOptionsPicker } from "@/components/CustomOptionsPicker";
import { OnboardingTitle } from "@/components/OnboardingTitle";
import { Page } from "@/enums/page.enum";
import { StorageKey } from "@/enums/storageKey.enum";
import option from "@/types/option";
import { setStorageItem, setStorageObject } from "@/utils/storage";
import { GlassView } from "expo-glass-effect";
import { LinearGradient } from "expo-linear-gradient";
import { useRouter } from "expo-router";
import { useState } from "react";
import { Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

const COUNT_OPTIONS: option[] = Array.from({ length: 20 }, (_, i) => {
  const count = String(i + 1);
  return { label: count, value: count };
});

const HOUR_OPTIONS: option[] = Array.from({ length: 24 }, (_, i) => {
  const hour = String(i).padStart(2, "0");
  return { label: hour, value: hour };
});

export default function activateNotification() {
  const router = useRouter();

  const [selectedCount, setSelectedCount] = useState(COUNT_OPTIONS[2].value);
  const [selectedStartTime, setSelectedStartTime] = useState(
    HOUR_OPTIONS[9].value,
  );
  const [selectedEndTime, setSelectedEndTime] = useState(
    HOUR_OPTIONS[22].value,
  );

  const handleStartTimeChange = (value: string) => {
    setSelectedStartTime(value);
    const hour = Number(value);

    if (hour > Number(selectedEndTime)) {
      setSelectedEndTime(String((hour + 1) % 24).padStart(2, "0"));
    }
  };

  const activateNotification = (): void => {
    setStorageObject(StorageKey.USER_NOTIFICATION_TIME_RANGE, {
      count: selectedCount,
      startTime: selectedStartTime,
      endTime: selectedEndTime,
    });
    setStorageItem(
      StorageKey.CURRENT_ONBOARDING_PAGE,
      Page.ONBOARDING_USER_AGE_RANGE,
    );
  };

  const handleSkip = () => {
    setStorageItem(
      StorageKey.CURRENT_ONBOARDING_PAGE,
      Page.ONBOARDING_USER_AGE_RANGE,
    );
    router.push("/onboarding/aboutYou");
  };

  return (
    <SafeAreaView className="flex-1 px-10 items-center bg-[#FAF3EF]">
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
                  colors={["#FFF4F2", "#EFD5C9"]}
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

      <View className="flex-1 flex-row">
        <View className="flex-1">
          <Text className="text-center text-xl font-public-sans font-semibold leading-6">
            Rappels par jour
          </Text>

          <CustomOptionsPicker
            options={COUNT_OPTIONS}
            selectedValue={selectedCount}
            onValueChange={setSelectedCount}
          />
        </View>

        <View className="flex-1">
          <Text className="text-center text-xl font-public-sans font-semibold leading-6">
            Heure de début
          </Text>

          <CustomOptionsPicker
            options={HOUR_OPTIONS}
            selectedValue={selectedStartTime}
            onValueChange={handleStartTimeChange}
            fixedLabel="h"
          />
        </View>

        <View className="flex-1">
          <Text className="text-center text-xl font-public-sans font-semibold leading-6">
            Heure de{"\n"}fin
          </Text>

          <CustomOptionsPicker
            options={HOUR_OPTIONS}
            selectedValue={selectedEndTime}
            onValueChange={setSelectedEndTime}
            fixedLabel="h"
          />
        </View>
      </View>

      <View className="w-full gap-4">
        <CustomButton
          label="Activer les notifications"
          onPress={activateNotification}
        />
        <CustomButton
          label="Plus tard"
          tintColor="#F7E6DF"
          textClassName="text-[#2A2015]"
          onPress={handleSkip}
        />
      </View>
    </SafeAreaView>
  );
}
