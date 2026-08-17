import colors from "@/constants/colors";
import { SymbolView } from "expo-symbols";
import { useEffect } from "react";
import { Text, View } from "react-native";
import Animated, {
  cancelAnimation,
  Easing,
  useAnimatedStyle,
  useSharedValue,
  withRepeat,
  withSequence,
  withTiming,
} from "react-native-reanimated";
import { useSafeAreaInsets } from "react-native-safe-area-context";

const HINT_RISE_OFFSET = 40;
const HINT_APPEAR_DURATION = 350;
const HINT_RISE_DURATION = 500;
const HINT_DISAPPEAR_DURATION = 500;
const HINT_PAUSE_DURATION = 3000;
// How long the hint takes to fade away once retired (`visible: false`),
// instead of vanishing abruptly mid-loop.
const HINT_FADE_OUT_DURATION = 300;

type Props = {
  visible: boolean;
};

export function SwipeUpHint({ visible }: Props) {
  const { bottom } = useSafeAreaInsets();

  const hintOpacity = useSharedValue(0);
  const hintOffsetY = useSharedValue(0);
  const hintAnimatedStyle = useAnimatedStyle(() => ({
    opacity: hintOpacity.value,
    transform: [{ translateY: hintOffsetY.value }],
  }));
  // The label stays static (no loop) while visible — it only animates once,
  // to fade away when the hint is retired. Starts already-hidden when
  // `visible` is false on mount (e.g. reopening the app after the hint was
  // already retired), instead of flashing visible for one frame before the
  // fade-out effect below kicks in.
  const hintTextOpacity = useSharedValue(visible ? 1 : 0);
  const hintTextAnimatedStyle = useAnimatedStyle(() => ({
    opacity: hintTextOpacity.value,
  }));

  useEffect(() => {
    if (!visible) {
      cancelAnimation(hintOpacity);
      cancelAnimation(hintOffsetY);
      cancelAnimation(hintTextOpacity);
      hintOpacity.value = withTiming(0, { duration: HINT_FADE_OUT_DURATION });
      hintTextOpacity.value = withTiming(0, {
        duration: HINT_FADE_OUT_DURATION,
      });
      return;
    }

    hintTextOpacity.value = 1;

    hintOpacity.value = withRepeat(
      withSequence(
        // Phase 1: appear in place.
        withTiming(1, {
          duration: HINT_APPEAR_DURATION,
          easing: Easing.in(Easing.quad),
        }),
        // Phase 2: stays fully visible while it rises.
        withTiming(1, { duration: HINT_RISE_DURATION }),
        // Phase 3: disappear.
        withTiming(0, {
          duration: HINT_DISAPPEAR_DURATION,
          easing: Easing.out(Easing.quad),
        }),
        withTiming(0, { duration: HINT_PAUSE_DURATION }),
      ),
      -1,
    );

    hintOffsetY.value = withRepeat(
      withSequence(
        // Phase 1: stays in place while it appears.
        withTiming(0, { duration: HINT_APPEAR_DURATION }),
        // Phase 2: rises.
        withTiming(-HINT_RISE_OFFSET, {
          duration: HINT_RISE_DURATION,
          easing: Easing.out(Easing.quad),
        }),
        // Phase 3: holds at the top while it disappears.
        withTiming(-HINT_RISE_OFFSET, { duration: HINT_DISAPPEAR_DURATION }),
        // Invisible at this point (opacity is 0) — snaps back down for the
        // next loop instead of animating back through the visible range.
        withTiming(0, { duration: 0 }),
        withTiming(0, { duration: HINT_PAUSE_DURATION }),
      ),
      -1,
    );
  }, [visible, hintOpacity, hintOffsetY, hintTextOpacity]);

  return (
    <View
      pointerEvents="none"
      style={{ bottom: bottom + 10 }}
      className="absolute z-10 w-full items-center gap-4"
    >
      <Animated.View style={hintAnimatedStyle}>
        <SymbolView
          size={42}
          name="hand.point.up.left"
          tintColor={colors.ink}
        />
      </Animated.View>

      <Animated.View style={hintTextAnimatedStyle}>
        <Text className="font-public-sans font-medium text-center w-32">
          Scroller pour en voir plus
        </Text>
      </Animated.View>
    </View>
  );
}
