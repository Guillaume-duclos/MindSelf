import { CustomButton } from "@/components/CustomButton";
import { CustomOptionsPicker } from "@/components/CustomOptionsPicker";
import option from "@/types/option";
import { useRouter } from "expo-router";
import { useState } from "react";
import { Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

const OPTIONS: option[] = [
  {
    label: "En couple",
    value: "En couple",
  },
  {
    label: "Célibataire mais ouvert",
    value: "Célibataire mais ouvert",
  },
  {
    label: "En court de séparation",
    value: "En court de séparation",
  },
  {
    label: "Dans une situation compliqué",
    value: "Dans une situation compliqué",
  },
  {
    label: "Pas intéressé pour le moment",
    value: "Pas intéressé pour le moment",
  },
];

export default function UserRelationship() {
  const router = useRouter();
  const [selectedValue, setSelectedValue] = useState(OPTIONS[0].value);

  return (
    <SafeAreaView className="flex-1 px-10 items-center bg-[#FAF3EF]">
      <View className="flex-1 items-center justify-center w-full gap-2">
        <Text className="font-noto-serif font-semibold text-3xl text-center">
          Quelle est ton statut relationnel ?
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
          onPress={() => router.push("/onboarding/userProfessionalSituation")}
        />
      </View>
    </SafeAreaView>
  );
}
