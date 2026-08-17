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
    label: "En couple",
    value: "in_relationship",
  },
  {
    label: "Célibataire mais ouvert",
    value: "single_open",
  },
  {
    label: "En court de séparation",
    value: "breaking_up",
  },
  {
    label: "Dans une situation compliqué",
    value: "complicated",
  },
  {
    label: "Pas intéressé pour le moment",
    value: "not_interested",
  },
];

export default function UserRelationshipStatus() {
  const router = useRouter();
  const { bottom } = useSafeAreaInsets();

  const [userRelationshipStatus, setUserRelationshipStatus] = useState(
    () => getStorageString(StorageKey.USER_RELATIONSHIP_STATUS) ?? "",
  );

  const handleSave = () => {
    setStorageItem(StorageKey.USER_RELATIONSHIP_STATUS, userRelationshipStatus);
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
          <OnboardingTitle title="Quel est ton statut relationnel ?" />
          <CustomOptionsPicker
            options={OPTIONS}
            selectedValue={userRelationshipStatus}
            onValueChange={setUserRelationshipStatus}
          />
        </View>

        <CustomButton label="Sauvegarder" onPress={handleSave} />
      </View>
    </Pressable>
  );
}
