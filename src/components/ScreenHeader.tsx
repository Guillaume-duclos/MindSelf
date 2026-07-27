import { useRouter } from "expo-router";
import { Text, View } from "react-native";
import { RoundedButton } from "./RoundedButton";

type Props = {
  title?: string;
  className?: string;
};

export function ScreenHeader({ title, className }: Props) {
  const router = useRouter();

  const goBack = (): void => {
    router.back();
  };

  return (
    <View
      className={`flex-row justify-end py-5 items-center z-10 ${className}`}
      style={title && { justifyContent: "space-between" }}
    >
      {title && (
        <Text className="font-noto-serif font-semibold text-[#2A2015] text-4xl">
          {title}
        </Text>
      )}

      <RoundedButton
        onPress={goBack}
        iconName="xmark"
        iconSize={24}
        buttonSize={42}
      />
    </View>
  );
}
