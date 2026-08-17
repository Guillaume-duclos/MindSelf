import { CustomButton } from "@/components/CustomButton";
import { CustomOptionsPicker } from "@/components/CustomOptionsPicker";
import { OnboardingTitle } from "@/components/OnboardingTitle";
import { ScreenHeader } from "@/components/ScreenHeader";
import { StorageKey } from "@/enums/storageKey.enum";
import { getStorageString, setStorageItem } from "@/utils/storage";
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

  const [userAgeRange, setUserAgeRange] = useState(
    () => getStorageString(StorageKey.USER_AGE_RANGE) ?? "",
  );

  const handleSave = () => {
    setStorageItem(StorageKey.USER_AGE_RANGE, userAgeRange);
    router.back();
  };

  return (
    <Pressable
      className="flex-1 bg-cream-50 px-5"
      style={{ paddingBottom: bottom }}
      onPress={Keyboard.dismiss}
    >
      <ScreenHeader title="Age" showBackButton showCloseButton={false} />

      <View className="flex-1 justify-between mt-10 px-5 gap-10">
        <View className="gap-6">
          <OnboardingTitle title="Dans quelle tranche d'âge te situe tu ?" />
          <CustomOptionsPicker
            options={OPTIONS}
            selectedValue={userAgeRange}
            onValueChange={setUserAgeRange}
          />
        </View>

        <CustomButton label="Sauvegarder" onPress={handleSave} />
      </View>
    </Pressable>
  );
}
