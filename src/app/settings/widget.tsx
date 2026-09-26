import { CustomButton } from "@/components/CustomButton";
import { ListItemContainer } from "@/components/ListItemContainer";
import { ListItemLink } from "@/components/ListItemLink";
import { ListItemStepper } from "@/components/ListItemStepper";
import { ListItemSwitch } from "@/components/ListItemSwitch";
import { SafeAreaViewContainer } from "@/components/SafeAreaViewContainer";
import { ScreenHeader } from "@/components/ScreenHeader";
import { ScrollViewContainer } from "@/components/ScrollViewContainer";
import colors from "@/constants/colors";
import { StorageKey } from "@/enums/storageKey.enum";
import Category from "@/enums/themeCategory.enum";
import { useCloseSettingsModal } from "@/hooks/use-close-settings-modal";
import { useDisableSwipeDismiss } from "@/hooks/use-disable-swipe-dismiss";
import { useIsDirty } from "@/hooks/use-is-dirty";
import Theme from "@/types/theme";
import { pickRandomAffirmationText } from "@/utils/affirmations";
import { getImageAspectRatio } from "@/utils/image";
import {
  getStorageBoolean,
  getStorageNumber,
  getStorageString,
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
import { Pressable, Text, View } from "react-native";
import { useMMKVObject } from "react-native-mmkv";

const WIDGET_ILLUSTRATION = require("@/assets/images/widget-help/widget-illustration.webp");

export default function Widget() {
  const router = useRouter();
  const closeSettingsModal = useCloseSettingsModal();

  useDisableSwipeDismiss();

  const [selectedTheme] = useMMKVObject<Theme>(
    StorageKey.SELECTED_THEME,
    storage,
  );

  const [displayOneAffirmation, setDisplayOneAffirmation] = useState(
    () => getStorageBoolean(StorageKey.WIDGET_DISPLAY_ONE_AFFIRMATION) ?? false,
  );
  const [displayButtons, setDisplayButtons] = useState(
    () => getStorageBoolean(StorageKey.WIDGET_DISPLAY_BUTTONS) ?? true,
  );
  const [affirmationsPerDay, setAffirmationsPerDay] = useState(
    () => getStorageNumber(StorageKey.WIDGET_AFFIRMATIONS_PER_DAY) ?? 24,
  );
  const [isDirty, markDirty] = useIsDirty();

  const handleDisplayOneAffirmationChange = (value: boolean) => {
    setDisplayOneAffirmation(value);
    markDirty();
  };

  const handleDisplayButtonsChange = (value: boolean) => {
    setDisplayButtons(value);
    markDirty();
  };

  const handleAffirmationsPerDayChange = (value: number) => {
    setAffirmationsPerDay(value);
    markDirty();
  };

  const previewText = useMemo(() => pickRandomAffirmationText(), []);
  const [oneAffirmationText, setOneAffirmationText] = useState(
    () =>
      getStorageString(StorageKey.WIDGET_ONE_AFFIRMATION_TEXT) ??
      pickRandomAffirmationText(),
  );

  const handleShuffleOneAffirmation = () => {
    setOneAffirmationText(pickRandomAffirmationText());
    markDirty();
  };

  const handleSave = () => {
    setStorageItem(
      StorageKey.WIDGET_DISPLAY_ONE_AFFIRMATION,
      displayOneAffirmation,
    );
    setStorageItem(StorageKey.WIDGET_ONE_AFFIRMATION_TEXT, oneAffirmationText);
    setStorageItem(StorageKey.WIDGET_DISPLAY_BUTTONS, displayButtons);
    setStorageItem(StorageKey.WIDGET_AFFIRMATIONS_PER_DAY, affirmationsPerDay);
    updateAffirmationWidgetTimeline();
    router.back();
  };

  return (
    <SafeAreaViewContainer className="flex-1">
      <ScreenHeader
        title="Widget"
        showBackButton
        showCloseButton
        className="p-5"
        onClose={closeSettingsModal}
      />

      <ScrollViewContainer contentContainerClassName="gap-10 px-5">
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
              text="Afficher une seule affirmation"
              onValueChange={handleDisplayOneAffirmationChange}
            />

            {displayOneAffirmation ? (
              <View className="items-center justify-between px-5 py-4 rounded-4xl border-continuous gap-5">
                <Text className="w-full font-noto-serif font-semibold text-lg leading-6 text-text-900">
                  {oneAffirmationText}
                </Text>

                <View className="flex-row w-full justify-between">
                  <Pressable onPress={handleShuffleOneAffirmation}>
                    <GlassView className="gap-2 flex-1 items-center flex-row rounded-full px-3 py-2">
                      <SymbolView
                        size={22}
                        name="list.bullet"
                        tintColor={colors.primary[950]}
                      />

                      <Text>Choisir depuis la liste</Text>
                    </GlassView>
                  </Pressable>

                  <Pressable onPress={handleShuffleOneAffirmation}>
                    <GlassView className="rounded-full p-2">
                      <SymbolView
                        size={26}
                        name="shuffle"
                        tintColor={colors.primary[950]}
                      />
                    </GlassView>
                  </Pressable>
                </View>
              </View>
            ) : (
              <ListItemStepper
                text="Affirmation par jour"
                value={affirmationsPerDay}
                onValueChange={handleAffirmationsPerDayChange}
              />
            )}

            <ListItemSwitch
              value={displayButtons}
              text="Afficher les boutons"
              onValueChange={handleDisplayButtonsChange}
            />
          </ListItemContainer>

          <ListItemContainer>
            <ListItemLink
              text="Comment afficher le widget sur l'écran verrouillé ?"
              onPress={() => router.navigate("/settings/widgetHelp")}
            />
            <ListItemLink
              text="Comment afficher le widget sur l'écran d'accueil ?"
              onPress={() => router.navigate("/settings/widgetHelp")}
            />
          </ListItemContainer>
        </View>

        <View className="w-full">
          <CustomButton
            label="Sauvegarder"
            onPress={handleSave}
            disabled={!isDirty}
          />
        </View>
      </ScrollViewContainer>
    </SafeAreaViewContainer>
  );
}
