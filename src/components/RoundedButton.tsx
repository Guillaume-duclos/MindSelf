import colors from "@/constants/colors";
import { GlassView } from "expo-glass-effect";
import { SFSymbol, SymbolView, SymbolWeight } from "expo-symbols";
import { Pressable, StyleProp, Text, ViewStyle } from "react-native";

type Props = {
  onPress?: () => void;
  iconName: SFSymbol;
  iconWeight?: SymbolWeight;
  iconTintColor?: string;
  iconSize?: number;
  iconClassName?: string;
  buttonSize?: number;
  label?: string;
  className?: string;
  style?: StyleProp<ViewStyle>;
};

export function RoundedButton({
  onPress,
  iconName,
  iconWeight = "medium",
  iconTintColor = colors.text[900],
  iconSize = 30,
  iconClassName,
  buttonSize = 68,
  label,
  className,
  style,
}: Props) {
  return (
    <Pressable
      className={`gap-2 items-center ${className ?? ""}`}
      style={style}
      onPress={onPress}
    >
      <GlassView
        isInteractive
        glassEffectStyle="regular"
        className="items-center justify-center rounded-full"
        style={{ height: buttonSize, width: buttonSize }}
      >
        <SymbolView
          name={{ ios: iconName }}
          weight={iconWeight}
          tintColor={iconTintColor}
          size={iconSize}
          className={iconClassName}
        />
      </GlassView>

      {label && (
        <Text className="text-center font-public-sans font-medium text-text-900 text-sm leading-4">
          {label}
        </Text>
      )}
    </Pressable>
  );
}
