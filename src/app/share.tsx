import { AffirmationCard } from "@/components/AffirmationCard";
import AnimatedGradientBackground from "@/components/AnimatedGradientBackground";
import { RoundedButton } from "@/components/RoundedButton";
import { ScreenHeader } from "@/components/ScreenHeader";
import colors from "@/constants/colors";
import { StorageKey } from "@/enums/storageKey.enum";
import Category from "@/enums/themeCategory.enum";
import Theme from "@/types/theme";
import { storage } from "@/utils/storage";
import { THEME_IMAGES } from "@/utils/themeImages";
import * as Clipboard from "expo-clipboard";
import { File, Paths } from "expo-file-system";
import * as Haptics from "expo-haptics";
import { Image } from "expo-image";
import { LinearGradient } from "expo-linear-gradient";
import * as MediaLibrary from "expo-media-library";
import { useLocalSearchParams } from "expo-router";
import * as Sharing from "expo-sharing";
import { useRef } from "react";
import { View } from "react-native";
import { useMMKVObject } from "react-native-mmkv";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { captureRef } from "react-native-view-shot";

export default function Share() {
  const { text } = useLocalSearchParams<{ text: string }>();
  const { bottom } = useSafeAreaInsets();
  const cardRef = useRef<View>(null);

  const [selectedTheme] = useMMKVObject<Theme>(
    StorageKey.SELECTED_THEME,
    storage,
  );

  const copyInClipboard = async (text: string): Promise<void> => {
    await Clipboard.setStringAsync(text);
    await Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
  };

  const captureCardImage = async (): Promise<string> => {
    const uri = await captureRef(cardRef, { format: "png", quality: 1 });
    const capturedImage = new File(uri);
    const namedImage = new File(
      Paths.cache,
      `mindself-affirmation-${Date.now()}.png`,
    );

    await capturedImage.copy(namedImage);

    return namedImage.uri;
  };

  const saveImage = async (): Promise<void> => {
    const { status } = await MediaLibrary.requestPermissionsAsync(true);

    if (status !== MediaLibrary.PermissionStatus.GRANTED) {
      return;
    }

    const uri = await captureCardImage();

    await MediaLibrary.Asset.create(uri);
    await Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
  };

  const shareImage = async (): Promise<void> => {
    const isAvailable = await Sharing.isAvailableAsync();

    if (!isAvailable) {
      return;
    }

    const uri = await captureCardImage();

    await Sharing.shareAsync(uri, {
      mimeType: "image/png",
      UTI: "public.png",
    });
  };

  const addToWidget = async (): Promise<void> => {};

  return (
    <View className="flex-1 px-5">
      <ScreenHeader title="Partager" />

      <View
        ref={cardRef}
        className="flex-1 rounded-3xl border-continuous overflow-hidden"
      >
        {selectedTheme && Category.IMAGE in selectedTheme ? (
          <Image
            className="absolute inset-0 w-full h-full"
            source={THEME_IMAGES[selectedTheme.image]}
            contentFit="cover"
          />
        ) : selectedTheme?.category === Category.ANIMATED_GRADIENT ? (
          <View className="absolute inset-0">
            <AnimatedGradientBackground colors={selectedTheme.colors} />
          </View>
        ) : (
          <LinearGradient
            className="absolute inset-0"
            colors={
              selectedTheme
                ? selectedTheme.colors
                : [colors.cream[100], colors.cream[300]]
            }
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
          />
        )}

        <View className="flex-1 px-12 py-28">
          <AffirmationCard
            text={text}
            className="flex-1"
            showButtons={false}
            isInteractive={false}
          />
        </View>
      </View>

      <View
        className="flex-row justify-evenly pt-10"
        style={{ paddingBottom: bottom }}
      >
        <RoundedButton
          iconName="square.and.arrow.down"
          label="Enregistrer l'image"
          className="flex-1"
          iconClassName="-top-0.5"
          onPress={saveImage}
        />
        <RoundedButton
          iconName="square.and.arrow.up"
          label="Partager"
          className="flex-1"
          iconClassName="-top-0.5"
          onPress={shareImage}
        />
        <RoundedButton
          iconName="square.on.square"
          label="Copier le texte"
          className="flex-1"
          onPress={() => copyInClipboard(text)}
        />
        <RoundedButton
          iconName="widget.large.badge.plus"
          label="Ajouter au widget"
          className="flex-1"
          iconClassName="left-0.5"
          onPress={addToWidget}
        />
      </View>
    </View>
  );
}
