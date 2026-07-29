import { CustomButton } from "@/components/CustomButton";
import { CustomOptionsPicker } from "@/components/CustomOptionsPicker";
import option from "@/types/option";
import { useRouter } from "expo-router";
import { useState } from "react";
import { Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

const OPTIONS: option[] = [
  {
    label: "Moins de 18 ans",
    value: "Moins de 18 ans",
  },
  {
    label: "18-24 ans",
    value: "18-24 ans",
  },
  {
    label: "25-34 ans",
    value: "25-34 ans",
  },
  {
    label: "35-44 ans",
    value: "35-44 ans",
  },
  {
    label: "45-54 ans",
    value: "45-54 ans",
  },
  {
    label: "55 ans et plus",
    value: "55 ans et plus",
  },
];

export default function UserAge() {
  const router = useRouter();
  const [selectedValue, setSelectedValue] = useState(OPTIONS[0].value);

  return (
    <SafeAreaView className="flex-1 px-10 items-center bg-[#FAF3EF]">
      <View className="flex-1 items-center justify-center w-full gap-2">
        <Text className="font-noto-serif font-semibold text-3xl text-center">
          Quelle age avez vous ?
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
          onPress={() => router.push("/onboarding/userGender")}
        />
      </View>
    </SafeAreaView>
  );
}
