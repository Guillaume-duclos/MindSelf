import { CustomButton } from "@/components/CustomButton";
import { useRouter } from "expo-router";
import { Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function AboutYou() {
  const router = useRouter();

  return (
    <SafeAreaView className="flex-1 px-5 items-center bg-[#FAF3EF]">
      <View className="flex-1 items-center justify-center w-full gap-2">
        <Text className="font-noto-serif font-semibold text-3xl text-center">
          Parlons un peu de toi !
        </Text>
        <Text className="font-public-sans text-xl text-center leading-6">
          Quelques informations sur toi nous permetera d'affiner ton experience.
        </Text>
      </View>

      <View className="w-full gap-4">
        <CustomButton
          label="Continuer"
          onPress={() => router.push("/onboarding/personnalInformations")}
        />
      </View>
    </SafeAreaView>
  );
}
