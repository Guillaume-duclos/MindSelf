import { CustomButton } from "@/components/CustomButton";
import { CustomTextInput } from "@/components/CustomTextInput";
import { OnboardingTitle } from "@/components/OnboardingTitle";
import { useRouter } from "expo-router";
import { useState } from "react";
import { Keyboard, Pressable, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function UserName() {
  const router = useRouter();
  const [userName, setUserName] = useState("Guillaume");

  return (
    <Pressable className="flex-1" onPress={Keyboard.dismiss}>
      <SafeAreaView className="flex-1 px-5 items-center bg-[#FAF3EF]">
        <View className="flex-1 items-center justify-center w-full gap-10">
          <OnboardingTitle title="Quel est ton prénom ?" />

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
            onPress={() => router.push("/onboarding/activateNotification")}
          />
        </View>
      </SafeAreaView>
    </Pressable>
  );
}
