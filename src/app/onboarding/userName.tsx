import { CustomButton } from "@/components/CustomButton";
import { CustomTextInput } from "@/components/CustomTextInput";
import { ScreenTitle } from "@/components/ScreenTitle";
import { Page } from "@/enums/page.enum";
import { StorageKey } from "@/enums/storageKey.enum";
import { setStorageItem } from "@/utils/storage";
import { useRouter } from "expo-router";
import { useState } from "react";
import { Keyboard, Pressable, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function UserName() {
  const router = useRouter();
  const [userName, setUserName] = useState("");

  const handleContinue = () => {
    setStorageItem(StorageKey.USER_NAME, userName);
    setStorageItem(
      StorageKey.CURRENT_ONBOARDING_PAGE,
      Page.ONBOARDING_USER_NOTIFICATION_TIME_RANGE,
    );
    router.push("/onboarding/activateNotification");
  };

  return (
    <Pressable className="flex-1" onPress={Keyboard.dismiss}>
      <SafeAreaView className="flex-1 px-10 items-center bg-cream-50">
        <View className="flex-1 items-center justify-center w-full gap-10">
          <ScreenTitle title="Quel est ton prénom ?" />

          <CustomTextInput
            value={userName}
            placeHolder="Prénom"
            onChangeText={setUserName}
          />
        </View>

        <View className="w-full gap-4">
          <CustomButton
            label="Continuer"
            disabled={!userName.trim()}
            onPress={handleContinue}
          />
        </View>
      </SafeAreaView>
    </Pressable>
  );
}
