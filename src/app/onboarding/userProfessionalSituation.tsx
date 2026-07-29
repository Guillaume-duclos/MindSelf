import { CustomButton } from "@/components/CustomButton";
import { CustomOptionsPicker } from "@/components/CustomOptionsPicker";
import { OnboardingTitle } from "@/components/OnboardingTitle";
import option from "@/types/option";
import { useRouter } from "expo-router";
import { useState } from "react";
import { View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

const OPTIONS: option[] = [
  {
    label: "Étudiant",
    value: "Étudiant",
  },
  {
    label: "En recherche d'emploi",
    value: "En recherche d'emploi",
  },
  {
    label: "Employé",
    value: "Employé",
  },
  {
    label: "Indépendant",
    value: "Indépendant",
  },
  {
    label: "Retraité",
    value: "Retraité",
  },
  {
    label: "Parent au foyer",
    value: "Parent au foyer",
  },
  {
    label: "Autre",
    value: "Autre",
  },
];

export default function UserProfessionalSituation() {
  const router = useRouter();
  const [selectedValue, setSelectedValue] = useState(OPTIONS[0].value);

  return (
    <SafeAreaView className="flex-1 px-10 items-center bg-[#FAF3EF]">
      <View className="flex-1 items-center justify-center w-full gap-2">
        <OnboardingTitle title="Quelle est ta situation professionnelle ?" />

        <CustomOptionsPicker
          options={OPTIONS}
          selectedValue={selectedValue}
          onValueChange={setSelectedValue}
        />
      </View>

      <View className="w-full gap-4">
        <CustomButton label="Continuer" />
      </View>
    </SafeAreaView>
  );
}
