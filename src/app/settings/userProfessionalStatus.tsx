import { CustomButton } from "@/components/CustomButton";
import { CustomOptionsSelectPicker } from "@/components/CustomOptionsSelectPicker";
import { ScreenTitle } from "@/components/ScreenTitle";
import { ScreenHeader } from "@/components/ScreenHeader";
import { ScrollViewContainer } from "@/components/ScrollViewContainer";
import colors from "@/constants/colors";
import { StorageKey } from "@/enums/storageKey.enum";
import { useCloseSettingsModal } from "@/hooks/use-close-settings-modal";
import { useDisableSwipeDismiss } from "@/hooks/use-disable-swipe-dismiss";
import { getStorageString, setStorageItem } from "@/utils/storage";
import { LinearGradient } from "expo-linear-gradient";
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
  const closeSettingsModal = useCloseSettingsModal();

  useDisableSwipeDismiss();

  const [userProfessionalStatus, setUserProfessionalStatus] = useState(
    () => getStorageString(StorageKey.USER_PROFESSIONAL_STATUS) ?? "",
  );

  const handleSave = () => {
    setStorageItem(StorageKey.USER_PROFESSIONAL_STATUS, userProfessionalStatus);
    router.back();
  };

  return (
    <Pressable className="flex-1 bg-cream-50" onPress={Keyboard.dismiss}>
      <ScreenHeader
        title="Situation professionnelle"
        showBackButton
        showCloseButton
        onClose={closeSettingsModal}
        className="p-5"
      />

      <View className="flex-1 gap-6">
        <ScreenTitle
          title="Quelle est ta situation professionnelle ?"
          className="px-5 mt-10"
        />

        <ScrollViewContainer contentContainerClassName="px-10">
          <CustomOptionsSelectPicker
            options={OPTIONS}
            selectedValue={userProfessionalStatus}
            onValueChange={setUserProfessionalStatus}
          />
        </ScrollViewContainer>
      </View>

      <View className="px-10" style={{ paddingBottom: bottom }}>
        <LinearGradient
          className="absolute -top-10 left-0 right-0 h-10"
          colors={[`${colors.cream[50]}00`, colors.cream[50]]}
        />
        <CustomButton label="Sauvegarder" onPress={handleSave} />
      </View>
    </Pressable>
  );
}
