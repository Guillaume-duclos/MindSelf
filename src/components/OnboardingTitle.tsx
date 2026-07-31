import { Text, View } from "react-native";

type Props = {
  title: string;
  description?: string;
};

export function OnboardingTitle({ title, description }: Props) {
  return (
    <View className="gap-2">
      <Text className="font-noto-serif font-semibold text-4xl text-center">
        {title}
      </Text>

      {description && (
        <Text className="font-public-sans text-lg text-center leading-6">
          {description}
        </Text>
      )}
    </View>
  );
}
