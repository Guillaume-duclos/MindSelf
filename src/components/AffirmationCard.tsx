import colors from "@/constants/colors";
import { GlassView } from "expo-glass-effect";
import * as Haptics from "expo-haptics";
import { Link } from "expo-router";
import { SymbolView } from "expo-symbols";
import { Ref, useState } from "react";
import { Pressable, Text, View } from "react-native";
import Animated, {
  interpolateColor,
  useAnimatedProps,
  useAnimatedStyle,
  useSharedValue,
  withDelay,
  withSequence,
  withSpring,
  withTiming,
} from "react-native-reanimated";
import { runOnJS } from "react-native-worklets";

const triggerLikeHaptic = () => {
  Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
};

const SCALE_UP_DURATION = 100;
const SCALE_DOWN_DURATION = 100;
const LIKE_COLOR_RESET_DELAY = 2000;
const LIKE_COLOR_RESET_DURATION = 800;

const AnimatedGlassView = Animated.createAnimatedComponent(GlassView);

const DEFAULT_TINT_COLOR = "white";
const LIKED_TINT_COLOR = colors.success;

type Props = {
  text: string;
  className?: string;
  showButtons?: boolean;
  isInteractive?: boolean;
  ref?: Ref<View>;
};

export function AffirmationCard({
  text,
  className,
  showButtons = true,
  isInteractive = false,
  ref,
}: Props) {
  const [liked, setLiked] = useState(false);
  const likeProgress = useSharedValue(0);
  const scale = useSharedValue(1);

  const animatedProps = useAnimatedProps(() => ({
    tintColor: interpolateColor(
      likeProgress.value,
      [0, 1],
      [DEFAULT_TINT_COLOR, LIKED_TINT_COLOR],
    ),
  }));

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
  }));

  const toggleLike = () => {
    const next = !liked;
    setLiked(next);

    if (next) {
      scale.value = withSequence(
        withTiming(1.05, { duration: SCALE_UP_DURATION }, (finished) => {
          if (finished) {
            runOnJS(triggerLikeHaptic)();
          }
        }),
        withSpring(1, {
          mass: 4,
          velocity: 0,
          damping: 105,
          stiffness: 1500,
          energyThreshold: 6e-9,
          overshootClamping: false,
        }),
      );
      likeProgress.value = withDelay(
        SCALE_UP_DURATION,
        withSequence(
          withTiming(1, { duration: SCALE_DOWN_DURATION }),
          withDelay(
            LIKE_COLOR_RESET_DELAY,
            withTiming(0, { duration: LIKE_COLOR_RESET_DURATION }),
          ),
        ),
      );
    } else {
      likeProgress.value = withTiming(0, { duration: 100 });
    }
  };

  return (
    <AnimatedGlassView
      ref={ref}
      isInteractive={isInteractive}
      glassEffectStyle="regular"
      animatedProps={animatedProps}
      style={animatedStyle}
      className={`items-center h-[55%] rounded-3xl border-continuous justify-center px-8 ${className}`}
    >
      <Text className="text-center font-noto-serif font-medium text-ink text-4xl leading-[40px]">
        {text}
      </Text>

      {showButtons && (
        <View className="flex-row gap-5 absolute items-center bottom-4 right-5">
          <Link href={{ pathname: "/share", params: { text } }} asChild>
            <Pressable>
              <SymbolView
                className="-top-1"
                name={{ ios: "square.and.arrow.up" }}
                weight="medium"
                tintColor={colors.terracotta[300]}
                size={38}
              />
            </Pressable>
          </Link>

          <Pressable onPress={toggleLike}>
            <SymbolView
              name={{ ios: liked ? "heart.fill" : "heart" }}
              weight="medium"
              tintColor={colors.terracotta[300]}
              size={35}
            />
          </Pressable>
        </View>
      )}
    </AnimatedGlassView>
  );
}
