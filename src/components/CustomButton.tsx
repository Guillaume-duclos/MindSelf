import colors from "@/constants/colors";
import { GlassView } from "expo-glass-effect";
import { useRef } from "react";
import { Pressable, Text } from "react-native";

type Props = {
  onPress?: () => void;
  label: string;
  disabled?: boolean;
  className?: string;
  textClassName?: string;
  tintColor?: string;
};

const DOUBLE_PRESS_GUARD_MS = 400;

export function CustomButton({
  onPress,
  label,
  disabled,
  className,
  textClassName = "text-cream-200",
  tintColor = colors.text[950],
}: Props) {
  const lastPressRef = useRef(0);

  const handlePress = () => {
    const now = Date.now();

    if (now - lastPressRef.current < DOUBLE_PRESS_GUARD_MS) {
      return;
    }

    lastPressRef.current = now;
    onPress?.();
  };

  return (
    <Pressable
      onPress={handlePress}
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
