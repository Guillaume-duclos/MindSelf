import colors from "@/constants/colors";
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
          <SymbolView name="info.circle" tintColor={colors.text[900]} size={20} />
          <Text className="flex-1 font-public-sans text-lg leading-6 text-text-900">
            {text}
          </Text>
        </View>
      ) : (
        <Text className="flex-1 font-public-sans text-lg leading-6 text-text-900">
          {text}
        </Text>
      )}

      <SymbolView
        size={14}
        weight="semibold"
        tintColor={colors.text[900]}
        name="chevron.forward"
      />
    </Pressable>
  );
}
