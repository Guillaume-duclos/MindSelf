import {
  GlassEffectStyleConfig,
  GlassStyle,
  GlassView,
  isLiquidGlassAvailable,
} from "expo-glass-effect";
import { ColorValue } from "react-native";
import Animated, {
  useAnimatedStyle,
  withSpring,
} from "react-native-reanimated";
import { JSX } from "react/jsx-runtime";

type Props = {
  children: JSX.Element;
  tintColor?: ColorValue;
  isInteractive?: boolean;
  isPressed?: boolean;
  glassEffectStyle?: GlassStyle | GlassEffectStyleConfig;
  className?: string;
};

const PRESSED_SCALE = 1.04;
const SPRING_CONFIG = { mass: 0.4, damping: 12, stiffness: 220 };

export function GlassViewContainer({
  children,
  tintColor,
  isInteractive,
  isPressed = false,
  glassEffectStyle = "regular",
  className,
}: Props) {
  const animatedStyle = useAnimatedStyle(() => ({
    transform: [
      {
        scale: withSpring(
          isInteractive && isPressed ? PRESSED_SCALE : 1,
          SPRING_CONFIG,
        ),
      },
    ],
  }));

  return isLiquidGlassAvailable() ? (
    <GlassView
      tintColor={tintColor}
      isInteractive={isInteractive}
      glassEffectStyle={glassEffectStyle}
      className={className}
    >
      {children}
    </GlassView>
  ) : (
    <Animated.View
      className={`${className} border-continuous`}
      style={[{ backgroundColor: tintColor }, animatedStyle]}
    >
      {children}
    </Animated.View>
  );
}
