import { CustomButton } from "@/components/CustomButton";
import { SafeAreaViewContainer } from "@/components/SafeAreaViewContainer";
import { ScreenTitle } from "@/components/ScreenTitle";
import colors from "@/constants/colors";
import { useRouter } from "expo-router";
import { View } from "react-native";

export default function choseTheme() {
  const router = useRouter();

  return (
    <SafeAreaViewContainer className="flex-1 px-10 items-center bg-cream-50">
      <View className="flex-1 items-center justify-center w-full gap-10">
        <ScreenTitle title="Recevez des affirmations régulièrement" />

        <View className="w-full gap-4">
          <CustomButton
            label="Plus tard"
            tintColor={colors.cream[200]}
            textClassName="text-text-900"
            onPress={() => {}}
          />
        </View>
      </View>
    </SafeAreaViewContainer>
  );
}
