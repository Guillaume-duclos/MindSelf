import { SymbolView } from "expo-symbols";
import { Pressable, Text } from "react-native";

type Props = {
  text: string;
  onPress: () => void;
};

export function ListItemLink({ text, onPress }: Props) {
  return (
    <Pressable
      onPress={onPress}
      className="flex-row items-center justify-between py-4 rounded-4xl border-continuous"
    >
      <Text className="font-public-sans text-lg">{text}</Text>
      <SymbolView name="chevron.forward" tintColor="#000000" size={16} />
    </Pressable>
  );
}
