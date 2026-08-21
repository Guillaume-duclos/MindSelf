import { MeshGradientView } from "expo-mesh-gradient";
import { useEffect } from "react";
import Animated, {
  cancelAnimation,
  Easing,
  interpolateColor,
  useAnimatedProps,
  useSharedValue,
  withRepeat,
  withTiming,
} from "react-native-reanimated";

type Props = {
  colors: string[];
  animated?: boolean;
};

const AnimatedMeshGradientView =
  Animated.createAnimatedComponent(MeshGradientView);

// Grid order matches columns=2, rows=2: top-left, top-right, bottom-left, bottom-right
const POINTS = [
  [0, 0],
  [1, 0],
  [0, 1],
  [1, 1],
];

// Where each grid point sits in the clockwise rotation order
// (top-left -> top-right -> bottom-right -> bottom-left).
const CYCLE_POSITION = [0, 1, 3, 2];

// Each corner rotates at a slightly different speed (not simple multiples
// of one another), so the exact starting configuration only recurs after
// their lowest common multiple — long enough to never read as "looping".
const CYCLE_DURATIONS = [8000, 8700, 9400, 10100];

export default function AnimatedGradientBackground({
  colors,
  animated = true,
}: Props) {
  const progresses = [
    useSharedValue(0),
    useSharedValue(0),
    useSharedValue(0),
    useSharedValue(0),
  ];

  useEffect(() => {
    if (!animated) {
      // withRepeat runs indefinitely on the UI thread — dropping this prop
      // to false doesn't stop it on its own, it just skips starting a new
      // one, so the in-flight loop needs to be cancelled explicitly here.
      progresses.forEach((progress) => cancelAnimation(progress));
      return;
    }

    progresses.forEach((progress, index) => {
      progress.value = withRepeat(
        withTiming(colors.length, {
          duration: CYCLE_DURATIONS[index],
          easing: Easing.linear,
        }),
        -1,
        false,
      );
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [animated]);

  const animatedProps = useAnimatedProps(() => {
    const colorsList = CYCLE_POSITION.map((cyclePosition, index) => {
      const virtual = (cyclePosition + progresses[index].value) % colors.length;
      const fromIndex = Math.floor(virtual);
      const toIndex = (fromIndex + 1) % colors.length;
      const t = virtual - fromIndex;

      return interpolateColor(t, [0, 1], [colors[fromIndex], colors[toIndex]]);
    });

    return { points: POINTS, colors: colorsList };
  });

  return (
    <AnimatedMeshGradientView
      style={{ flex: 1 }}
      columns={2}
      rows={2}
      animatedProps={animatedProps}
    />
  );
}
