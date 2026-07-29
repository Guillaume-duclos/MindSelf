import { CustomButton } from "@/components/CustomButton";
import { CustomOptionsPicker } from "@/components/CustomOptionsPicker";
import option from "@/types/option";
import { useRouter } from "expo-router";
import { useState } from "react";
import { Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

const OPTIONS: option[] = [
  {
    label: "Homme",
    value: "Homme",
  },
  {
    label: "Femme",
    value: "Femme",
  },
  {
    label: "Non précisé",
    value: "Non précisé",
  },
];

export default function UserGender() {
  const router = useRouter();
  const [selectedValue, setSelectedValue] = useState(OPTIONS[0].value);

  return (
    <SafeAreaView className="flex-1 px-10 items-center bg-[#FAF3EF]">
      <View className="flex-1 items-center justify-center w-full gap-2">
        <Text className="font-noto-serif font-semibold text-3xl text-center">
          Quelle est ton sexe ?
        </Text>

        <CustomOptionsPicker
          options={OPTIONS}
          selectedValue={selectedValue}
          onValueChange={setSelectedValue}
        />
      </View>

      <View className="w-full gap-4">
        <CustomButton
          label="Continuer"
          onPress={() => router.push("/onboarding/userRelationship")}
        />
      </View>
    </SafeAreaView>
  );
}
