import { SymbolView } from "expo-symbols";
import { useState } from "react";
import { Pressable, Text } from "react-native";

type Props = {
  text: string;
  onValueChange: () => void;
};

export function ListItemSwitch({ text, onValueChange }: Props) {
  const [isActivated, setIsActivated] = useState(false);

  return (
    <Pressable
      onPress={onValueChange}
      className="flex-row items-center justify-between py-4 rounded-4xl border-continuous"
    >
      <Text className="font-public-sans text-lg">{text}</Text>
      <SymbolView name="chevron.forward" tintColor="#000000" size={16} />
    </Pressable>
  );
}
