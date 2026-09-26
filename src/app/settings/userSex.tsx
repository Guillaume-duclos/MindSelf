import { CustomButton } from "@/components/CustomButton";
import { CustomOptionsSelectPicker } from "@/components/CustomOptionsSelectPicker";
import { SafeAreaViewContainer } from "@/components/SafeAreaViewContainer";
import { ScreenTitle } from "@/components/ScreenTitle";
import { ScreenHeader } from "@/components/ScreenHeader";
import { ScrollViewContainer } from "@/components/ScrollViewContainer";
import colors from "@/constants/colors";
import { StorageKey } from "@/enums/storageKey.enum";
import { useCloseSettingsModal } from "@/hooks/use-close-settings-modal";
import { useDisableSwipeDismiss } from "@/hooks/use-disable-swipe-dismiss";
import { useIsDirty } from "@/hooks/use-is-dirty";
import { getStorageString, setStorageItem } from "@/utils/storage";
import { LinearGradient } from "expo-linear-gradient";
import { useRouter } from "expo-router";
import { useState } from "react";
import { Keyboard, Pressable, View } from "react-native";

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
  const closeSettingsModal = useCloseSettingsModal();

  useDisableSwipeDismiss();

  const [userSex, setUserSex] = useState(
    () => getStorageString(StorageKey.USER_SEX) ?? "",
  );
  const [isDirty, markDirty] = useIsDirty();

  const handleChangeUserSex = (value: string) => {
    setUserSex(value);
    markDirty();
  };

  const handleSave = () => {
    setStorageItem(StorageKey.USER_SEX, userSex);
    router.back();
  };

  return (
    <Pressable className="flex-1" onPress={Keyboard.dismiss}>
      <SafeAreaViewContainer className="flex-1">
        <ScreenHeader
          title="Genre"
          showBackButton
          showCloseButton
          onClose={closeSettingsModal}
          className="p-5"
        />

        <View className="flex-1 gap-6">
          <ScreenTitle
            title="De quel côté êtes-vous ?"
            className="px-5 mt-10"
          />

          <ScrollViewContainer contentContainerClassName="px-10">
            <CustomOptionsSelectPicker
              options={OPTIONS}
              selectedValue={userSex}
              onValueChange={handleChangeUserSex}
            />
          </ScrollViewContainer>
        </View>

        <View className="px-10">
          <LinearGradient
            className="absolute -top-10 left-0 right-0 h-10"
            colors={[`${colors.cream[50]}00`, colors.cream[50]]}
          />
          <CustomButton
            label="Sauvegarder"
            onPress={handleSave}
            disabled={!isDirty}
          />
        </View>
      </SafeAreaViewContainer>
    </Pressable>
  );
}
