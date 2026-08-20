import { CustomButton } from "@/components/CustomButton";
import { ListItemContainer } from "@/components/ListItemContainer";
import { ListItemStepper } from "@/components/ListItemStepper";
import { ListItemSwitch } from "@/components/ListItemSwitch";
import { ScreenHeader } from "@/components/ScreenHeader";
import { ScreenTitle } from "@/components/ScreenTitle";
import { StorageKey } from "@/enums/storageKey.enum";
import { useCloseSettingsModal } from "@/hooks/use-close-settings-modal";
import { useDisableSwipeDismiss } from "@/hooks/use-disable-swipe-dismiss";
import {
  getStorageBoolean,
  getStorageNumber,
  setStorageItem,
} from "@/utils/storage";
import { useRouter } from "expo-router";
import { useState } from "react";
import { View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

const MIN_DAY_GOAL = 1;
const MAX_DAY_GOAL = 24;
const DEFAULT_DAY_GOAL = 3;

export default function DayGoal() {
  const router = useRouter();
  const { bottom } = useSafeAreaInsets();
  const closeSettingsModal = useCloseSettingsModal();

  useDisableSwipeDismiss();

  const [activeGoal, setActiveGoal] = useState(
    () => getStorageBoolean(StorageKey.USER_DAY_GOAL_ENABLED) ?? true,
  );
  const [dayGoal, setDayGoal] = useState(
    () => getStorageNumber(StorageKey.USER_DAY_GOAL) ?? DEFAULT_DAY_GOAL,
  );

  const handleSave = () => {
    setStorageItem(StorageKey.USER_DAY_GOAL_ENABLED, activeGoal);
    setStorageItem(StorageKey.USER_DAY_GOAL, Number(dayGoal));
    router.back();
  };

  return (
    <View className="flex-1 bg-cream-50 px-5" style={{ paddingBottom: bottom }}>
      <ScreenHeader
        title="Mes objectifs"
        showBackButton
        showCloseButton
        onClose={closeSettingsModal}
      />

      <View className="flex-1 justify-between mt-10 gap-10">
        <View className="gap-6">
          <ScreenTitle title="Quel est ton objectif journalier ?" />

          <ListItemContainer>
            <ListItemSwitch
              value={activeGoal}
              onValueChange={setActiveGoal}
              text="Définir un objectif journalier"
            />

            <ListItemStepper
              minValue={MIN_DAY_GOAL}
              maxValue={MAX_DAY_GOAL}
              value={dayGoal}
              onValueChange={setDayGoal}
              text="Like(s) par jour"
              className={!activeGoal ? "opacity-40" : undefined}
              disabled={!activeGoal}
            />
          </ListItemContainer>
        </View>

        <CustomButton label="Sauvegarder" onPress={handleSave} />
      </View>
    </View>
  );
}
