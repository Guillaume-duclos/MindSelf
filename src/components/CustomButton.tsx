import colors from "@/constants/colors";
import { GlassView } from "expo-glass-effect";
import { Pressable, Text } from "react-native";

type Props = {
  onPress?: () => void;
  label: string;
  disabled?: boolean;
  className?: string;
  textClassName?: string;
  tintColor?: string;
};

export function CustomButton({
  onPress,
  label,
  disabled,
  className,
  textClassName = "text-cream-200",
  tintColor = colors.ink,
}: Props) {
  return (
    <Pressable
      onPress={onPress}
      disabled={disabled}
      className={`${disabled && "opacity-50"} ${className}`}
    >
      <GlassView
        tintColor={tintColor}
        isInteractive={!disabled}
        glassEffectStyle="regular"
        className="items-center px-8 py-5 rounded-full border-continuous justify-center"
      >
        <Text
          className={`font-noto-serif font-semibold text-xl ${textClassName}`}
        >
          {label}
        </Text>
      </GlassView>
    </Pressable>
  );
}
