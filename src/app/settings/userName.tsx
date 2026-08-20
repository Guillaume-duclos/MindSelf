import { CustomButton } from "@/components/CustomButton";
import { CustomTextInput } from "@/components/CustomTextInput";
import { ScreenTitle } from "@/components/ScreenTitle";
import { ScreenHeader } from "@/components/ScreenHeader";
import { StorageKey } from "@/enums/storageKey.enum";
import { useCloseSettingsModal } from "@/hooks/use-close-settings-modal";
import { useDisableSwipeDismiss } from "@/hooks/use-disable-swipe-dismiss";
import { getStorageString, setStorageItem } from "@/utils/storage";
import { useRouter } from "expo-router";
import { useState } from "react";
import { Keyboard, Pressable, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

export default function UserName() {
  const router = useRouter();
  const { bottom } = useSafeAreaInsets();
  const closeSettingsModal = useCloseSettingsModal();

  useDisableSwipeDismiss();

  const [userName, setUserName] = useState(
    () => getStorageString(StorageKey.USER_NAME) ?? "",
  );

  const handleSave = () => {
    setStorageItem(StorageKey.USER_NAME, userName.trim());
    router.back();
  };

  return (
    <Pressable
      className="flex-1 bg-cream-50 px-5"
      style={{ paddingBottom: bottom }}
      onPress={Keyboard.dismiss}
    >
      <ScreenHeader
        title="Nom d'utilisateur"
        showBackButton
        showCloseButton
        onClose={closeSettingsModal}
      />

      <View className="flex-1 justify-between mt-10 px-5 gap-10">
        <View className="gap-6">
          <ScreenTitle title="Quel est ton prénom ?" />
          <CustomTextInput
            value={userName}
            placeHolder="Prénom"
            onChangeText={setUserName}
          />
        </View>

        <CustomButton label="Sauvegarder" onPress={handleSave} />
      </View>
    </Pressable>
  );
}
