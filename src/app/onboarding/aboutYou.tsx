import { CustomButton } from "@/components/CustomButton";
import { SafeAreaViewContainer } from "@/components/SafeAreaViewContainer";
import { ScreenTitle } from "@/components/ScreenTitle";
import { StorageKey } from "@/enums/storageKey.enum";
import { getStorageString } from "@/utils/storage";
import { useRouter } from "expo-router";
import { View } from "react-native";

export default function AboutYou() {
  const router = useRouter();
  const userName = getStorageString(StorageKey.USER_NAME);

  return (
    <SafeAreaViewContainer className="flex-1 px-10 items-center bg-cream-50">
      <View className="flex-1 items-center justify-center w-full gap-2">
        <ScreenTitle
          title={`Parlons un peu de vous${userName ? `, ${userName}` : ""} !`}
          description="Quelques informations sur vous nous permettront d'affiner votre expérience."
        />
      </View>

      <View className="w-full gap-4">
        <CustomButton
          label="Continuer"
          onPress={() => router.push("/onboarding/personnalInformations")}
        />
      </View>
    </SafeAreaViewContainer>
  );
}
