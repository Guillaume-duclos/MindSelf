import { AffirmationCard } from "@/components/AffirmationCard";
import { RoundedButton } from "@/components/RoundedButton";
import { ScreenHeader } from "@/components/ScreenHeader";
import * as Clipboard from "expo-clipboard";
import * as Haptics from "expo-haptics";
import { LinearGradient } from "expo-linear-gradient";
import * as MediaLibrary from "expo-media-library";
import { useLocalSearchParams } from "expo-router";
import { useRef } from "react";
import { Share as NativeShare, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { captureRef } from "react-native-view-shot";

export default function Share() {
  const { text } = useLocalSearchParams<{ text: string }>();
  const { bottom } = useSafeAreaInsets();
  const cardRef = useRef<View>(null);

  const shareText = (text: string): void => {
    NativeShare.share({ message: text });
  };

  const copyInClipboard = async (text: string): Promise<void> => {
    await Clipboard.setStringAsync(text);
    await Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
  };

  const saveImage = async (): Promise<void> => {
    const { status } = await MediaLibrary.requestPermissionsAsync(true);

    if (status !== MediaLibrary.PermissionStatus.GRANTED) {
      return;
    }

    const uri = await captureRef(cardRef, { format: "png", quality: 1 });

    await MediaLibrary.Asset.create(uri);
    await Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
  };

  const addToWidget = async (): Promise<void> => {};

  return (
    <LinearGradient
      className="flex-1 px-5"
      colors={["#FFF4F2", "#EFD5C9"]}
      start={{ x: 0, y: 0 }}
      end={{ x: 1, y: 1 }}
    >
      <ScreenHeader title="Partager" />

      <View className="flex-1 p-6">
        <AffirmationCard
          ref={cardRef}
          text={text}
          className="flex-1"
          showButtons={false}
          isInteractive={false}
        />
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
          onPress={() => shareText(text)}
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
    </LinearGradient>
  );
}
