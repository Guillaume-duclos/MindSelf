import { CustomButton } from "@/components/CustomButton";
import { CustomOptionsPicker } from "@/components/CustomOptionsPicker";
import { OnboardingTitle } from "@/components/OnboardingTitle";
import { ScreenHeader } from "@/components/ScreenHeader";
import { StorageKey } from "@/enums/storageKey.enum";
import { getStorageString, setStorageItem } from "@/utils/storage";
import { useRouter } from "expo-router";
import { useState } from "react";
import { Keyboard, Pressable, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

const OPTIONS = [
  {
    label: "Étudiant",
    value: "student",
  },
  {
    label: "En recherche d'emploi",
    value: "job_seeking",
  },
  {
    label: "Employé",
    value: "employed",
  },
  {
    label: "Indépendant",
    value: "self_employed",
  },
  {
    label: "Retraité",
    value: "retired",
  },
  {
    label: "Parent au foyer",
    value: "stay_at_home_parent",
  },
  {
    label: "Autre",
    value: "other",
  },
];

export default function UserProfessionalStatus() {
  const router = useRouter();
  const { bottom } = useSafeAreaInsets();

  const [userProfessionalStatus, setUserProfessionalStatus] = useState(
    () => getStorageString(StorageKey.USER_PROFESSIONAL_STATUS) ?? "",
  );

  const handleSave = () => {
    setStorageItem(StorageKey.USER_PROFESSIONAL_STATUS, userProfessionalStatus);
    router.back();
  };

  return (
    <Pressable
      className="flex-1 bg-cream-50 px-5"
      style={{ paddingBottom: bottom }}
      onPress={Keyboard.dismiss}
    >
      <ScreenHeader
        title="Statut relationnel"
        showBackButton
        showCloseButton={false}
      />

      <View className="flex-1 justify-between mt-10 px-5 gap-10">
        <View className="gap-6">
          <OnboardingTitle title="Quelle est ta situation professionnelle ?" />
          <CustomOptionsPicker
            options={OPTIONS}
            selectedValue={userProfessionalStatus}
            onValueChange={setUserProfessionalStatus}
          />
        </View>

        <CustomButton label="Sauvegarder" onPress={handleSave} />
      </View>
    </Pressable>
  );
}
