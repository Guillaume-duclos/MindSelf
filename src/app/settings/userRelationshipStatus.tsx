import { CustomButton } from "@/components/CustomButton";
import { CustomOptionsSelectPicker } from "@/components/CustomOptionsSelectPicker";
import { SafeAreaViewContainer } from "@/components/SafeAreaViewContainer";
import { ScreenTitle } from "@/components/ScreenTitle";
import { ScreenHeader } from "@/components/ScreenHeader";
import { ScrollViewContainer } from "@/components/ScrollViewContainer";
import colors from "@/constants/colors";
import { StorageKey } from "@/enums/storageKey.enum";
import { useCloseSettingsModal } from "@/hooks/use-close-settings-modal";
import { useDisableSwipeDismiss } from "@/hooks/use-disable-swipe-dismiss";
import { useIsDirty } from "@/hooks/use-is-dirty";
import { getStorageString, setStorageItem } from "@/utils/storage";
import { LinearGradient } from "expo-linear-gradient";
import { useRouter } from "expo-router";
import { useState } from "react";
import { Keyboard, Pressable, View } from "react-native";

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
    label: "En cours de séparation",
    value: "breaking_up",
  },
  {
    label: "Dans une situation compliquée",
    value: "complicated",
  },
  {
    label: "Pas intéressé pour le moment",
    value: "not_interested",
  },
];

export default function UserRelationshipStatus() {
  const router = useRouter();
  const closeSettingsModal = useCloseSettingsModal();

  useDisableSwipeDismiss();

  const [userRelationshipStatus, setUserRelationshipStatus] = useState(
    () => getStorageString(StorageKey.USER_RELATIONSHIP_STATUS) ?? "",
  );
  const [isDirty, markDirty] = useIsDirty();

  const handleChangeUserRelationshipStatus = (value: string) => {
    setUserRelationshipStatus(value);
    markDirty();
  };

  const handleSave = () => {
    setStorageItem(StorageKey.USER_RELATIONSHIP_STATUS, userRelationshipStatus);
    router.back();
  };

  return (
    <Pressable className="flex-1" onPress={Keyboard.dismiss}>
      <SafeAreaViewContainer className="flex-1">
        <ScreenHeader
          title="Statut relationnel"
          showBackButton
          showCloseButton
          onClose={closeSettingsModal}
          className="p-5"
        />

        <View className="flex-1 gap-6">
          <ScreenTitle
            title="Quel est votre statut relationnel ?"
            className="px-5 mt-10"
          />

          <ScrollViewContainer contentContainerClassName="px-10">
            <CustomOptionsSelectPicker
              options={OPTIONS}
              selectedValue={userRelationshipStatus}
              onValueChange={handleChangeUserRelationshipStatus}
            />
          </ScrollViewContainer>
        </View>

        <View className="px-10">
          <LinearGradient
            className="absolute -top-10 left-0 right-0 h-10"
            colors={[`${colors.cream[50]}00`, colors.cream[50]]}
          />
          <CustomButton
            label="Sauvegarder"
            onPress={handleSave}
            disabled={!isDirty}
          />
        </View>
      </SafeAreaViewContainer>
    </Pressable>
  );
}
