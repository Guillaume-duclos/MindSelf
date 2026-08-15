import { Text, View } from "react-native";

type Props = {
  title: string;
  text: string;
};

export function ParagraphSection({ title, text }: Props) {
  return (
    <View className="gap-2">
      <Text className="font-noto-serif text-3xl font-bold">{title}</Text>
      <Text className="font-noto-serif text-lg">{text}</Text>
    </View>
  );
}
