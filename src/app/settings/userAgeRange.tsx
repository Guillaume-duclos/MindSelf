import { CustomButton } from "@/components/CustomButton";
import { CustomOptionsSelectPicker } from "@/components/CustomOptionsSelectPicker";
import { ScreenTitle } from "@/components/ScreenTitle";
import { ScreenHeader } from "@/components/ScreenHeader";
import { ScrollViewContainer } from "@/components/ScrollViewContainer";
import colors from "@/constants/colors";
import { StorageKey } from "@/enums/storageKey.enum";
import { useCloseSettingsModal } from "@/hooks/use-close-settings-modal";
import { useDisableSwipeDismiss } from "@/hooks/use-disable-swipe-dismiss";
import { getStorageString, setStorageItem } from "@/utils/storage";
import { LinearGradient } from "expo-linear-gradient";
import { useRouter } from "expo-router";
import { useState } from "react";
import { Keyboard, Pressable, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

const OPTIONS = [
  {
    label: "Moins de 18 ans",
    value: "under_18",
  },
  {
    label: "18-24 ans",
    value: "18_24",
  },
  {
    label: "25-34 ans",
    value: "25_34",
  },
  {
    label: "35-44 ans",
    value: "35_44",
  },
  {
    label: "45-54 ans",
    value: "45_54",
  },
  {
    label: "55 ans et plus",
    value: "55_plus",
  },
];

export default function UserAgeRange() {
  const router = useRouter();
  const { bottom } = useSafeAreaInsets();
  const closeSettingsModal = useCloseSettingsModal();

  useDisableSwipeDismiss();

  const [userAgeRange, setUserAgeRange] = useState(
    () => getStorageString(StorageKey.USER_AGE_RANGE) ?? "",
  );

  const handleSave = () => {
    setStorageItem(StorageKey.USER_AGE_RANGE, userAgeRange);
    router.back();
  };

  return (
    <Pressable className="flex-1 bg-cream-50" onPress={Keyboard.dismiss}>
      <ScreenHeader
        title="Age"
        showBackButton
        showCloseButton
        onClose={closeSettingsModal}
        className="p-5"
      />

      <View className="flex-1 gap-6">
        <ScreenTitle
          title="Dans quelle tranche d'âge te situe tu ?"
          className="px-5 mt-10"
        />

        <ScrollViewContainer contentContainerClassName="px-10">
          <CustomOptionsSelectPicker
            options={OPTIONS}
            selectedValue={userAgeRange}
            onValueChange={setUserAgeRange}
          />
        </ScrollViewContainer>
      </View>

      <View className="px-10" style={{ paddingBottom: bottom }}>
        <LinearGradient
          className="absolute -top-10 left-0 right-0 h-10"
          colors={[`${colors.cream[50]}00`, colors.cream[50]]}
        />
        <CustomButton label="Sauvegarder" onPress={handleSave} />
      </View>
    </Pressable>
  );
}
