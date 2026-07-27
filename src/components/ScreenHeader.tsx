import { useRouter } from "expo-router";
import { Text, View } from "react-native";
import { RoundedButton } from "./RoundedButton";

type Props = {
  title?: string;
  showBackButton?: boolean;
  showCloseButton?: boolean;
  className?: string;
};

export function ScreenHeader({
  title,
  showBackButton,
  showCloseButton = true,
  className,
}: Props) {
  const router = useRouter();

  const goBack = (): void => {
    router.back();
  };

  const close = (): void => {
    router.back();
  };

  return (
    <View
      className={`flex-row justify-end py-5 items-center z-10 ${className}`}
      style={title && { justifyContent: "space-between" }}
    >
      <View className="flex-row gap-5 items-center">
        {showBackButton && (
          <RoundedButton
            onPress={goBack}
            iconName="arrow.backward"
            iconSize={24}
            buttonSize={42}
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
    </View>
  );
}
