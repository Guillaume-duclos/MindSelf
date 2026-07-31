import { AppIcon } from "@/components/AppIcon";
import { CustomButton } from "@/components/CustomButton";
import { useRouter } from "expo-router";
import { Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function Onboarding() {
  const router = useRouter();

  return (
    <SafeAreaView className="flex-1 px-10 items-center bg-[#FAF3EF]">
      <View className="flex-1 items-center justify-center w-full gap-20">
        <AppIcon />

        <View className="">
          <Text className="font-noto-serif font-semibold text-6xl leading-[60px] text-center">
            MindSelf
          </Text>
          <Text className="font-public-sans text-xl text-center">
            Bienvenue dans MindSelf
          </Text>
        </View>
      </View>

      <View className="w-full gap-4">
        <CustomButton
          label="Commencer"
          onPress={() => router.push("/onboarding/userName")}
        />

        <Text className="px-8 font-public-sans text-center font-medium text-[#F72A2015E6DF] opacity-50 text-sm leading-4">
          En continuant, vous acceptez les conditions{" "}
          <Text className="underline">d'utilisation</Text> et de{" "}
          <Text className="underline">confidentialité</Text>
        </Text>
      </View>
    </SafeAreaView>
  );
}
