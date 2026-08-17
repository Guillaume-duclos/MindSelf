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
    label: "Homme",
    value: "male",
  },
  {
    label: "Femme",
    value: "female",
  },
  {
    label: "Non précisé",
    value: "unspecified",
  },
];

export default function UserSex() {
  const router = useRouter();
  const { bottom } = useSafeAreaInsets();

  const [userSex, setUserSex] = useState(
    () => getStorageString(StorageKey.USER_SEX) ?? "",
  );

  const handleSave = () => {
    setStorageItem(StorageKey.USER_SEX, userSex);
    router.back();
  };

  return (
    <Pressable
      className="flex-1 bg-cream-50 px-5"
      style={{ paddingBottom: bottom }}
      onPress={Keyboard.dismiss}
    >
      <ScreenHeader title="Genre" showBackButton showCloseButton={false} />

      <View className="flex-1 justify-between mt-10 px-5 gap-10">
        <View className="gap-6">
          <OnboardingTitle title="De quel côté es tu ?" />
          <CustomOptionsPicker
            options={OPTIONS}
            selectedValue={userSex}
            onValueChange={setUserSex}
          />
        </View>

        <CustomButton label="Sauvegarder" onPress={handleSave} />
      </View>
    </Pressable>
  );
}
