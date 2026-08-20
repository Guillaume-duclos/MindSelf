import { CustomButton } from "@/components/CustomButton";
import { CustomOptionsWheelPicker } from "@/components/CustomOptionsWheelPicker";
import { ScreenTitle } from "@/components/ScreenTitle";
import { ScreenHeader } from "@/components/ScreenHeader";
import { StorageKey } from "@/enums/storageKey.enum";
import { getStorageNumber, setStorageItem } from "@/utils/storage";
import { useRouter } from "expo-router";
import { useState } from "react";
import { View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

const MIN_DAY_GOAL = 1;
const MAX_DAY_GOAL = 24;
const DEFAULT_DAY_GOAL = 1;

const OPTIONS = Array.from(
  { length: MAX_DAY_GOAL - MIN_DAY_GOAL + 1 },
  (_, index) => {
    const value = String(MIN_DAY_GOAL + index);
    return { label: value, value };
  },
);

export default function DayGoal() {
  const router = useRouter();
  const { bottom } = useSafeAreaInsets();

  const [dayGoal, setDayGoal] = useState(() =>
    String(getStorageNumber(StorageKey.USER_DAY_GOAL) ?? DEFAULT_DAY_GOAL),
  );

  const handleSave = () => {
    setStorageItem(StorageKey.USER_DAY_GOAL, Number(dayGoal));
    router.back();
  };

  return (
    <View className="flex-1 bg-cream-50 px-5" style={{ paddingBottom: bottom }}>
      <ScreenHeader
        title="Mes objectifs"
        showBackButton
        showCloseButton={false}
      />

      <View className="flex-1 justify-between mt-10 px-5 gap-10">
        <View className="gap-6">
          <ScreenTitle title="Quel est ton objectif journalier ?" />
          <CustomOptionsWheelPicker
            options={OPTIONS}
            selectedValue={dayGoal}
            onValueChange={setDayGoal}
          />
        </View>

        <CustomButton label="Sauvegarder" onPress={handleSave} />
      </View>
    </View>
  );
}
