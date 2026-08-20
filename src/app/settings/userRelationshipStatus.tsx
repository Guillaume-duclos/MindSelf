import { CustomButton } from "@/components/CustomButton";
import { CustomOptionsSelectPicker } from "@/components/CustomOptionsSelectPicker";
import { ScreenTitle } from "@/components/ScreenTitle";
import { ScreenHeader } from "@/components/ScreenHeader";
import { ScrollViewContainer } from "@/components/ScrollViewContainer";
import colors from "@/constants/colors";
import { StorageKey } from "@/enums/storageKey.enum";
import { getStorageString, setStorageItem } from "@/utils/storage";
import { LinearGradient } from "expo-linear-gradient";
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
    <Pressable className="flex-1 bg-cream-50" onPress={Keyboard.dismiss}>
      <ScreenHeader
        title="Statut relationnel"
        showBackButton
        showCloseButton={false}
        className="p-5"
      />

      <View className="flex-1 gap-6">
        <ScreenTitle
          title="Quel est ton statut relationnel ?"
          className="px-5 mt-10"
        />

        <ScrollViewContainer contentContainerClassName="px-10">
          <CustomOptionsSelectPicker
            options={OPTIONS}
            selectedValue={userRelationshipStatus}
            onValueChange={setUserRelationshipStatus}
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
