import { useRouter } from "expo-router";
import { Pressable, Text, View } from "react-native";
import { RoundedButton } from "./RoundedButton";

type Props = {
  title?: string;
  showBackButton?: boolean;
  showCloseButton?: boolean;
  showSkipButton?: boolean;
  className?: string;
  onSkip?: () => void;
  onBack?: () => void;
};

export function ScreenHeader({
  title,
  showBackButton,
  showCloseButton = true,
  showSkipButton = false,
  className = "py-5",
  onSkip,
  onBack,
}: Props) {
  const router = useRouter();

  const goBack = (): void => {
    if (onBack) {
      onBack();
    } else {
      router.back();
    }
  };

  const close = (): void => {
    router.back();
  };

  return (
    <View
      className={`flex-row w-full min-h-[42px] items-center justify-between z-10 ${className}`}
    >
      <View className="flex-row gap-5 items-center">
        {showBackButton && (
          <RoundedButton
            onPress={goBack}
            iconName="arrow.backward"
            iconSize={24}
            buttonSize={42}
            className="self-start"
          />
        )}
      </View>

      {/* Positioned independently of the side buttons (rather than living
      next to the back button in the left group) so it stays centered in the
      header no matter which buttons are enabled on either side. */}
      {title && (
        <View
          className="absolute inset-0 items-center justify-center px-14"
          pointerEvents="none"
        >
          <Text
            numberOfLines={1}
            adjustsFontSizeToFit
            minimumFontScale={0.1}
            className="font-noto-serif font-semibold text-ink text-2xl leading-[40px]"
          >
            {title}
          </Text>
        </View>
      )}

      <View className="flex-row gap-5 items-center">
        {showCloseButton && (
          <RoundedButton
            onPress={close}
            iconName="xmark"
            iconSize={24}
            buttonSize={42}
          />
        )}

        {showSkipButton && (
          <Pressable
            hitSlop={10}
            onPress={onSkip}
            className="self-stretch items-center justify-center"
          >
            <Text className="font-noto-serif font-medium">Passer</Text>
          </Pressable>
        )}
      </View>
    </View>
  );
}
