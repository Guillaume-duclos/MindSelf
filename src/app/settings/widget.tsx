import { CustomOptionsPicker } from "@/components/CustomOptionsPicker";
import { ScreenHeader } from "@/components/ScreenHeader";
import colors from "@/constants/colors";
import { StorageKey } from "@/enums/storageKey.enum";
import Category from "@/enums/themeCategory.enum";
import option from "@/types/option";
import Theme from "@/types/theme";
import { pickRandomAffirmationText } from "@/utils/affirmations";
import { storage } from "@/utils/storage";
import { THEME_IMAGES } from "@/utils/themeImages";
import { GlassView } from "expo-glass-effect";
import { Image } from "expo-image";
import { LinearGradient } from "expo-linear-gradient";
import { useRouter } from "expo-router";
import { useMemo } from "react";
import { Text, View } from "react-native";
import { useMMKVObject } from "react-native-mmkv";
import { useSafeAreaInsets } from "react-native-safe-area-context";

const HOUR_OPTIONS: option[] = Array.from({ length: 24 }, (_, i) => {
  return { label: String(i + 1), value: String(i + 1) };
});

export default function Account() {
  const router = useRouter();

  const { bottom } = useSafeAreaInsets();
  const [selectedTheme] = useMMKVObject<Theme>(
    StorageKey.SELECTED_THEME,
    storage,
  );

  const previewText = useMemo(() => pickRandomAffirmationText(), []);

  return (
    <View className="flex-1 bg-cream-50 px-5" style={{ paddingBottom: bottom }}>
      <ScreenHeader title="Widget" showBackButton showCloseButton={false} />

      <View className="gap-12">
        <Image
          className="h-96"
          contentFit="contain"
          source={require("@/assets/images/widget-illustration.png")}
        />

        <GlassView className="absolute top-[91px] left-[55px] z-10 w-[285px] h-[134px] rounded-[22px] overflow-hidden justify-center items-center p-4">
          {selectedTheme && Category.IMAGE in selectedTheme ? (
            <Image
              contentFit="cover"
              className="absolute inset-0"
              source={THEME_IMAGES[selectedTheme.image]}
            />
          ) : (
            <LinearGradient
              className="absolute inset-0"
              colors={
                selectedTheme && "colors" in selectedTheme
                  ? selectedTheme.colors
                  : [colors.cream[100], colors.cream[300]]
              }
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
            />
          )}
          <Text
            className="font-noto-serif font-semibold text-ink text-center text-base"
            numberOfLines={3}
          >
            {previewText}
          </Text>
        </GlassView>

        <View className="">
          <Text className="text-center text-xl font-public-sans font-semibold leading-6">
            Actualiser le widget toutes les :
          </Text>

          <CustomOptionsPicker
            options={HOUR_OPTIONS}
            selectedValue={"3"}
            onValueChange={() => {}}
            fixedLabel="heures"
          />
        </View>

        {/* <ListItemContainer>
          <ListItemLink
            text="Comment afficher le widget ?"
            onPress={() => router.navigate("/settings/account")}
          />
        </ListItemContainer> */}
      </View>
    </View>
  );
}
