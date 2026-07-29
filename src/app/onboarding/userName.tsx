import { CustomButton } from "@/components/CustomButton";
import { CustomTextInput } from "@/components/CustomTextInput";
import { useRouter } from "expo-router";
import { useState } from "react";
import { Keyboard, Pressable, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function UserName() {
  const router = useRouter();
  const [userName, setUserName] = useState("");

  return (
    <Pressable className="flex-1" onPress={Keyboard.dismiss}>
      <SafeAreaView className="flex-1 px-10 items-center bg-[#FAF3EF]">
        <View className="flex-1 items-center justify-center w-full gap-10">
          <Text className="font-noto-serif font-semibold text-3xl text-center">
            Quelle est votre prénom ?
          </Text>

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
