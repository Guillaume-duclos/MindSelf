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
  showSkipButton = true,
  className,
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
      className={`flex-row w-full min-h-[42px] py-5 items-center z-10 ${showBackButton && !title ? "justify-start" : "justify-end"} ${className}`}
      style={(showSkipButton || title) && { justifyContent: "space-between" }}
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

        {title && (
          <Text className="font-noto-serif font-semibold text-[#2A2015] text-4xl leading-[41px]">
            {title}
          </Text>
        )}
      </View>

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
          className="self-stretch items-center justify-center pl-5"
        >
          <Text className="font-noto-serif font-medium">Passer</Text>
        </Pressable>
      )}
    </View>
  );
}
