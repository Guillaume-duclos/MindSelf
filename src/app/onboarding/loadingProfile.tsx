import { useRouter } from "expo-router";
import { useEffect } from "react";
import { Text, View } from "react-native";
import Animated, {
  Easing,
  useAnimatedStyle,
  useSharedValue,
  withRepeat,
  withSequence,
  withTiming,
} from "react-native-reanimated";
import { SafeAreaView } from "react-native-safe-area-context";

const BALL_SIZE = 40;
const PIVOT_OFFSET = 64;
const PEAK_ANGLE = 38;
const SWING_OUT_DURATION = 450;
const SWING_IN_DURATION = 400;
const HALF_CYCLE = SWING_OUT_DURATION + SWING_IN_DURATION;

function Ball() {
  return (
    <View
      className="rounded-full bg-text-950"
      style={{ width: BALL_SIZE, height: BALL_SIZE }}
    />
  );
}

function PendulumSlot({
  children,
  style,
}: {
  children: React.ReactNode;
  style?: React.ComponentProps<typeof Animated.View>["style"];
}) {
  return (
    <View style={{ width: BALL_SIZE, height: BALL_SIZE }}>
      <Animated.View
        style={[
          {
            position: "absolute",
            top: -PIVOT_OFFSET,
            left: BALL_SIZE / 2,
            width: 0,
            height: 0,
            alignItems: "center",
          },
          style,
        ]}
      >
        <View style={{ height: PIVOT_OFFSET }} />
        {children}
      </Animated.View>
    </View>
  );
}

function EndBall({ direction }: { direction: "left" | "right" }) {
  const rotation = useSharedValue(0);

  const sign = direction === "left" ? 1 : -1;
  const idleFirst = direction === "left" ? 0 : HALF_CYCLE;
  const idleAfter = direction === "left" ? HALF_CYCLE : 0;

  useEffect(() => {
    rotation.value = withRepeat(
      withSequence(
        withTiming(0, { duration: idleFirst }),
        withTiming(sign * PEAK_ANGLE, {
          duration: SWING_OUT_DURATION,
          easing: Easing.out(Easing.quad),
        }),
        withTiming(0, {
          duration: SWING_IN_DURATION,
          easing: Easing.in(Easing.quad),
        }),
        withTiming(0, { duration: idleAfter }),
      ),
      -1,
    );
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const pivotStyle = useAnimatedStyle(() => ({
    transform: [{ rotate: `${rotation.value}deg` }],
  }));

  return (
    <PendulumSlot style={pivotStyle}>
      <Ball />
    </PendulumSlot>
  );
}

function MiddleBall() {
  return (
    <PendulumSlot>
      <Ball />
    </PendulumSlot>
  );
}

export default function loadingProfile() {
  const router = useRouter();
  const rowWidth = BALL_SIZE * 5;

  useEffect(() => {
    const timeout = setTimeout(() => {
      router.push("/onboarding/activateSubscription");
    }, 5000);

    return () => clearTimeout(timeout);
  }, [router]);

  return (
    <SafeAreaView className="flex-1 px-10 items-center bg-cream-50 justify-center w-full gap-10">
      <View className="flex-row" style={{ width: rowWidth }}>
        <EndBall direction="left" />
        <MiddleBall />
        <MiddleBall />
        <MiddleBall />
        <EndBall direction="right" />
      </View>

      <Text className="font-noto-serif font-semibold text-2xl text-text-900">
        Chargement de ton profil...
      </Text>
    </SafeAreaView>
  );
}
