import { Text, View } from "react-native";

type Props = {
  title: string;
  description?: string;
  className?: string;
};

export function ScreenTitle({ title, description, className }: Props) {
  return (
    <View className={`gap-2 ${className}`}>
      <Text className="font-noto-serif font-semibold text-4xl text-center text-text-900">
        {title}
      </Text>

      {description && (
        <Text className="font-public-sans text-lg text-center leading-6 text-text-900">
          {description}
        </Text>
      )}
    </View>
  );
}
