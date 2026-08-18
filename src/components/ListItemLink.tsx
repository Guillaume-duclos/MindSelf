import { useLongPressStyle } from "@/hooks/use-long-press-style";
import { SymbolView } from "expo-symbols";
import { Pressable, Text, View } from "react-native";

type Props = {
  text: string;
  leftIcon?: string;
  onPress: () => void;
};

export function ListItemLink({ text, leftIcon, onPress }: Props) {
  const { isLongPressed, onPressIn, onPressOut } = useLongPressStyle();

  return (
    <Pressable
      onPress={onPress}
      onPressIn={onPressIn}
      onPressOut={onPressOut}
      className={`flex-row items-center justify-between py-4 px-5 rounded-4xl border-continuous gap-5 ${isLongPressed ? "bg-cream-300" : ""}`}
    >
      {leftIcon ? (
        <View className="flex-1 flex-row items-center gap-2">
          <SymbolView name="info.circle" tintColor="black" size={20} />
          <Text className="flex-1 font-public-sans text-lg leading-6">
            {text}
          </Text>
        </View>
      ) : (
        <Text className="flex-1 font-public-sans text-lg leading-6">
          {text}
        </Text>
      )}

      <SymbolView name="chevron.forward" tintColor="black" size={16} />
    </Pressable>
  );
}
