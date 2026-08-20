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
    label: "Homme",
    value: "male",
  },
  {
    label: "Femme",
    value: "female",
  },
  {
    label: "Non précisé",
    value: "unspecified",
  },
];

export default function UserSex() {
  const router = useRouter();
  const { bottom } = useSafeAreaInsets();

  const [userSex, setUserSex] = useState(
    () => getStorageString(StorageKey.USER_SEX) ?? "",
  );

  const handleSave = () => {
    setStorageItem(StorageKey.USER_SEX, userSex);
    router.back();
  };

  return (
    <Pressable className="flex-1 bg-cream-50" onPress={Keyboard.dismiss}>
      <ScreenHeader
        title="Genre"
        showBackButton
        showCloseButton={false}
        className="p-5"
      />

      <View className="flex-1 gap-6">
        <ScreenTitle title="De quel côté es tu ?" className="px-5 mt-10" />

        <ScrollViewContainer contentContainerClassName="px-10">
          <CustomOptionsSelectPicker
            options={OPTIONS}
            selectedValue={userSex}
            onValueChange={setUserSex}
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
