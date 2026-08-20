import { ListItemContainer } from "@/components/ListItemContainer";
import { ListItemLink } from "@/components/ListItemLink";
import { ListItemStepper } from "@/components/ListItemStepper";
import { ListItemSwitch } from "@/components/ListItemSwitch";
import { ScreenHeader } from "@/components/ScreenHeader";
import colors from "@/constants/colors";
import { StorageKey } from "@/enums/storageKey.enum";
import Category from "@/enums/themeCategory.enum";
import Theme from "@/types/theme";
import { pickRandomAffirmationText } from "@/utils/affirmations";
import { getImageAspectRatio } from "@/utils/image";
import {
  getStorageBoolean,
  getStorageNumber,
  setStorageItem,
  storage,
} from "@/utils/storage";
import { THEME_IMAGES } from "@/utils/themeImages";
import { updateAffirmationWidgetTimeline } from "@/utils/widget";
import { GlassView } from "expo-glass-effect";
import { Image } from "expo-image";
import { LinearGradient } from "expo-linear-gradient";
import { useRouter } from "expo-router";
import { SymbolView } from "expo-symbols";
import { useMemo, useState } from "react";
import { Text, View } from "react-native";
import { useMMKVObject } from "react-native-mmkv";
import { useSafeAreaInsets } from "react-native-safe-area-context";

const WIDGET_ILLUSTRATION = require("@/assets/images/widget-help/widget-illustration.webp");

export default function Widget() {
  const router = useRouter();
  const { bottom } = useSafeAreaInsets();
  const [selectedTheme] = useMMKVObject<Theme>(
    StorageKey.SELECTED_THEME,
    storage,
  );

  const [displayOneAffirmation, setDisplayOneAffirmation] = useState(false);
  const [displayButtons, setDisplayButtons] = useState(
    () => getStorageBoolean(StorageKey.WIDGET_DISPLAY_BUTTONS) ?? true,
  );
  const [affirmationsPerDay, setAffirmationsPerDay] = useState(
    () => getStorageNumber(StorageKey.WIDGET_AFFIRMATIONS_PER_DAY) ?? 24,
  );

  const handleDisplayButtonsChange = (value: boolean) => {
    setDisplayButtons(value);
    setStorageItem(StorageKey.WIDGET_DISPLAY_BUTTONS, value);
    updateAffirmationWidgetTimeline();
  };

  const handleAffirmationsPerDayChange = (value: number) => {
    setAffirmationsPerDay(value);
    setStorageItem(StorageKey.WIDGET_AFFIRMATIONS_PER_DAY, value);
    updateAffirmationWidgetTimeline();
  };

  const previewText = useMemo(() => pickRandomAffirmationText(), []);

  return (
    <View className="flex-1 bg-cream-50 px-5" style={{ paddingBottom: bottom }}>
      <ScreenHeader title="Widget" showBackButton showCloseButton={false} />

      <View className="gap-12">
        <View
          className="w-[92%] self-center"
          style={{ aspectRatio: getImageAspectRatio(WIDGET_ILLUSTRATION) }}
        >
          <Image
            className="absolute inset-0"
            contentFit="contain"
            source={WIDGET_ILLUSTRATION}
          />

          <GlassView className="absolute top-[27%] left-[11.3%] z-10 w-[77.6%] h-[40%] rounded-[22px] overflow-hidden justify-center items-center p-4">
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
              className="font-noto-serif font-semibold text-text-900 text-center text-lg"
              numberOfLines={3}
            >
              {previewText}
            </Text>

            {displayButtons && (
              <View className="flex-row gap-5 absolute items-center bottom-2 right-4">
                <SymbolView
                  className="-top-1"
                  name={{ ios: "square.and.arrow.up" }}
                  weight="medium"
                  tintColor={colors.text[900]}
                  size={28}
                />
                <SymbolView
                  name={"heart"}
                  weight="medium"
                  tintColor={colors.text[900]}
                  size={25}
                />
              </View>
            )}
          </GlassView>
        </View>

        <ListItemContainer>
          <ListItemSwitch
            value={displayOneAffirmation}
            text="Bloquer à une seule affirmation"
            onValueChange={setDisplayOneAffirmation}
          />

          {!displayOneAffirmation && (
            <ListItemStepper
              text="Affirmation par jour"
              value={affirmationsPerDay}
              onValueChange={handleAffirmationsPerDayChange}
            />
          )}

          {!displayOneAffirmation && (
            <ListItemSwitch
              value={displayButtons}
              text="Afficher les boutons"
              onValueChange={handleDisplayButtonsChange}
            />
          )}
        </ListItemContainer>

        <ListItemContainer>
          <ListItemLink
            leftIcon="info.circle"
            text="Comment afficher le widget ?"
            onPress={() => router.navigate("/settings/widgetHelp")}
          />
        </ListItemContainer>
      </View>
    </View>
  );
}
