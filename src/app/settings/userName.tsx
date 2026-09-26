import { CustomButton } from "@/components/CustomButton";
import { CustomTextInput } from "@/components/CustomTextInput";
import { SafeAreaViewContainer } from "@/components/SafeAreaViewContainer";
import { ScreenTitle } from "@/components/ScreenTitle";
import { ScreenHeader } from "@/components/ScreenHeader";
import { StorageKey } from "@/enums/storageKey.enum";
import { useCloseSettingsModal } from "@/hooks/use-close-settings-modal";
import { useDisableSwipeDismiss } from "@/hooks/use-disable-swipe-dismiss";
import { useIsDirty } from "@/hooks/use-is-dirty";
import { getStorageString, setStorageItem } from "@/utils/storage";
import { useRouter } from "expo-router";
import { useState } from "react";
import { Keyboard, Pressable, View } from "react-native";

export default function UserName() {
  const router = useRouter();
  const closeSettingsModal = useCloseSettingsModal();

  useDisableSwipeDismiss();

  const [userName, setUserName] = useState(
    () => getStorageString(StorageKey.USER_NAME) ?? "",
  );
  const [isDirty, markDirty] = useIsDirty();

  const handleChangeUserName = (value: string) => {
    setUserName(value);
    markDirty();
  };

  const handleSave = () => {
    setStorageItem(StorageKey.USER_NAME, userName.trim());
    router.back();
  };

  return (
    <Pressable className="flex-1" onPress={Keyboard.dismiss}>
      <SafeAreaViewContainer className="flex-1 px-5">
        <ScreenHeader
          title="Nom d'utilisateur"
          showBackButton
          showCloseButton
          onClose={closeSettingsModal}
        />

        <View className="flex-1 justify-between mt-10 px-5 gap-10">
          <View className="gap-6">
            <ScreenTitle title="Quel est votre prénom ?" />
            <CustomTextInput
              value={userName}
              placeHolder="Prénom"
              onChangeText={handleChangeUserName}
            />
          </View>

          <CustomButton
            label="Sauvegarder"
            onPress={handleSave}
            disabled={!isDirty || !userName.trim()}
          />
        </View>
      </SafeAreaViewContainer>
    </Pressable>
  );
}
