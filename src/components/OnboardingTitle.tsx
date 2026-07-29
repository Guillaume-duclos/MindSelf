import { Text, View } from "react-native";

type Props = {
  title: string;
  description?: string;
};

export function OnboardingTitle({ title, description }: Props) {
  return (
    <View className="gap-2">
      <Text className="font-noto-serif font-semibold text-4xl text-center">
        Quel est ton signe astrologique ?
      </Text>

      {description && (
        <Text className="font-public-sans text-lg text-center leading-6">
          Fais pivoter la flèche ou clic sur un signe pour effectuer ta
          sélection.
        </Text>
      )}
    </View>
  );
}
