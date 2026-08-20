import colors from "@/constants/colors";
import { useEffect, useRef, useState } from "react";
import { Text, View } from "react-native";
import Animated, {
  Easing,
  interpolateColor,
  useAnimatedProps,
  useAnimatedStyle,
  useSharedValue,
  withSequence,
  withTiming,
} from "react-native-reanimated";
import Svg, { Path } from "react-native-svg";
import { runOnJS } from "react-native-worklets";

const AnimatedView = Animated.createAnimatedComponent(View);
const AnimatedPath = Animated.createAnimatedComponent(Path);
const AnimatedText = Animated.createAnimatedComponent(Text);
const PROGRESS_ANIMATION_DURATION = 400;
// Old value: fades and shrinks out; new value: fades and grows back in.
const NUMBER_EXIT_DURATION = 100;
const NUMBER_ENTER_DURATION = 130;
const NUMBER_EXIT_SCALE = 0.6;
// Reaching the goal: the outline fades into a solid fill (same color as
// the progress stroke) and the whole icon pops with a little overshoot.
const COMPLETION_FILL_DURATION = 300;
const COMPLETION_POP_SCALE = 1.15;
const COMPLETION_POP_DURATION = 100;
const WHITE = "#FFFFFF";

// Traced from src/assets/eart.svg (100x93 viewBox) — outer boundary only.
// The original path is a compound shape (outer + inner heart boundary)
// meant to be filled as a single icon; stroking both subpaths drew two
// separate lines, so only the outer contour is kept here to get a single
// clean line to sweep around, exactly like CircularProgress's ring.
const HEART_PATH_D =
  "M0 31C0 26.4295 0.725713 22.2564 2.17714 18.4808C3.62857 14.672 5.65727 11.3932 8.26324 8.64423C10.9022 5.8953 13.97 3.77564 17.4666 2.28526C20.9632 0.761752 24.7237 0 28.7481 0C33.4653 0 37.6381 1.01015 41.2667 3.03045C44.8953 5.01763 47.7981 7.65064 49.9753 10.9295C52.2184 7.65064 55.1377 5.01763 58.7333 3.03045C62.3619 1.01015 66.5347 0 71.2519 0C75.3093 0 79.0698 0.761752 82.5334 2.28526C86.03 3.77564 89.0813 5.8953 91.6873 8.64423C94.2933 11.3932 96.322 14.672 97.7734 18.4808C99.2578 22.2564 100 26.4295 100 31C100 38.0545 98.1362 45.0593 94.4087 52.0144C90.6812 58.9696 85.4198 65.726 78.6244 72.2837C71.8621 78.8413 63.8628 85.101 54.6264 91.0625C53.8677 91.5593 53.0595 92.0064 52.2019 92.4038C51.3772 92.8013 50.635 93 49.9753 93C49.3815 93 48.6558 92.8013 47.7981 92.4038C46.9405 92.0064 46.1488 91.5593 45.4231 91.0625C36.1867 85.101 28.1544 78.8413 21.3261 72.2837C14.5308 65.726 9.26934 58.9696 5.54181 52.0144C1.84727 45.0593 0 38.0545 0 31Z";
const HEART_VIEWBOX_WIDTH = 100;
const HEART_VIEWBOX_HEIGHT = 93;

// Precomputed offline (numeric integration over this exact `d`'s cubic
// bezier segments) — same reasoning as CircularProgress's circumference,
// just for a heart-shaped path instead of a circle. Runtime measurement via
// Path.getTotalLength() crashes natively on this app/RN version, hence the
// hardcoded constant.
const HEART_PATH_LENGTH = 311.09;

// Shifts where along the path the reveal begins, in path-length units (0
// to HEART_PATH_LENGTH). The path's own `M` point (path-length 0) is the
// heart's left tip — tweak this to start the sweep somewhere else on the
// outline instead of re-authoring `d`.
const HEART_START_OFFSET = 71;

// A plain strokeDashoffset shift (the CircularProgress technique) only
// works when the reveal starts exactly at the path's own `M` point — once
// HEART_START_OFFSET moves that start elsewhere, the visible arc can wrap
// past the path's end back to its beginning, which a single dash/gap pair
// can't express. This computes the (up to) two arcs plus dashoffset needed
// to render that correctly for any start offset and progress.
const getHeartDashPattern = (
  progress: number,
): { dasharray: number[]; dashoffset: number } => {
  "worklet";

  const start = HEART_START_OFFSET % HEART_PATH_LENGTH;
  const onLength = HEART_PATH_LENGTH * progress;

  if (start + onLength <= HEART_PATH_LENGTH) {
    return {
      dasharray: [onLength, HEART_PATH_LENGTH * 2 - onLength],
      dashoffset: -start,
    };
  }

  // The reveal wraps past the path's end back to its start: split into the
  // wrapped leading arc (from position 0) and the trailing arc (up to the
  // path's end), with a gap of whatever's left in between.
  const wrappedArcLength = start + onLength - HEART_PATH_LENGTH;
  const gapLength = HEART_PATH_LENGTH - onLength;
  const trailingArcLength = HEART_PATH_LENGTH - start;

  return {
    dasharray: [
      wrappedArcLength,
      gapLength,
      trailingArcLength,
      HEART_PATH_LENGTH,
    ],
    dashoffset: 0,
  };
};

type Props = {
  // The percentage shown is derived here from these two, rather than the
  // caller precomputing a fraction — keeps "what counts as 100%" in one
  // place.
  likeCount: number;
  goal: number;
  size?: number;
  strokeWidth?: number;
  color?: string;
  trackColor?: string;
  textColor?: string;
};

export function HeartProgress({
  likeCount,
  goal,
  size = 44,
  strokeWidth = 14,
  color = colors.terracotta[400],
  trackColor = colors.terracotta[100],
  textColor = colors.text[900],
}: Props) {
  const progress = goal > 0 ? likeCount / goal : 0;
  const clampedProgress = Math.min(1, Math.max(0, progress));
  const animatedProgress = useSharedValue(clampedProgress);

  useEffect(() => {
    animatedProgress.value = withTiming(clampedProgress, {
      duration: PROGRESS_ANIMATION_DURATION,
    });
  }, [clampedProgress, animatedProgress]);

  const animatedProps = useAnimatedProps(() => {
    const { dasharray, dashoffset } = getHeartDashPattern(
      animatedProgress.value,
    );

    return {
      strokeDasharray: dasharray,
      strokeDashoffset: dashoffset,
      strokeOpacity: animatedProgress.value > 0 ? 1 : 0,
    };
  });

  // The displayed number only swaps once it's fully faded out, so the
  // outgoing and incoming digits never show at the same time — matches how
  // the opacity/scale animation below is sequenced.
  const [displayedLikeCount, setDisplayedLikeCount] = useState(likeCount);
  const numberOpacity = useSharedValue(1);
  const numberScale = useSharedValue(1);

  useEffect(() => {
    if (likeCount === displayedLikeCount) return;

    numberOpacity.value = withSequence(
      withTiming(0, { duration: NUMBER_EXIT_DURATION }, (finished) => {
        if (finished) {
          runOnJS(setDisplayedLikeCount)(likeCount);
        }
      }),
      withTiming(1, { duration: NUMBER_ENTER_DURATION }),
    );
    numberScale.value = withSequence(
      withTiming(NUMBER_EXIT_SCALE, { duration: NUMBER_EXIT_DURATION }),
      withTiming(1, { duration: NUMBER_ENTER_DURATION }),
    );
  }, [likeCount, displayedLikeCount, numberOpacity, numberScale]);

  const numberAnimatedStyle = useAnimatedStyle(() => ({
    opacity: numberOpacity.value,
    transform: [{ scale: numberScale.value }],
  }));

  // 0 = outline only, 1 = fully filled with `color` and white text — only
  // animates (and only pops the icon) on the transition into/out of
  // completion, not on every render while already complete.
  const isComplete = clampedProgress >= 1;
  const wasCompleteRef = useRef(isComplete);
  const fillProgress = useSharedValue(isComplete ? 1 : 0);
  const iconScale = useSharedValue(1);

  useEffect(() => {
    if (isComplete === wasCompleteRef.current) return;
    wasCompleteRef.current = isComplete;

    fillProgress.value = withTiming(isComplete ? 1 : 0, {
      duration: COMPLETION_FILL_DURATION,
    });

    if (isComplete) {
      iconScale.value = withSequence(
        withTiming(COMPLETION_POP_SCALE, {
          duration: COMPLETION_POP_DURATION,
          easing: Easing.out(Easing.quad),
        }),
        withTiming(1, {
          duration: COMPLETION_POP_DURATION,
          easing: Easing.in(Easing.quad),
        }),
      );
    }
  }, [isComplete, fillProgress, iconScale]);

  const iconAnimatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: iconScale.value }],
  }));

  const fillAnimatedProps = useAnimatedProps(() => ({
    fillOpacity: fillProgress.value,
  }));

  const numberColorAnimatedStyle = useAnimatedStyle(() => ({
    color: interpolateColor(fillProgress.value, [0, 1], [textColor, WHITE]),
  }));

  const padding = strokeWidth;
  const viewBoxWidth = HEART_VIEWBOX_WIDTH + padding * 2;
  const viewBoxHeight = HEART_VIEWBOX_HEIGHT + padding * 2;
  const height = (size * viewBoxHeight) / viewBoxWidth;

  return (
    <AnimatedView style={[{ width: size, height }, iconAnimatedStyle]}>
      <Svg
        width={size}
        height={height}
        viewBox={`${-padding} ${-padding} ${viewBoxWidth} ${viewBoxHeight}`}
      >
        <Path
          fill="none"
          d={HEART_PATH_D}
          stroke={trackColor}
          strokeWidth={strokeWidth}
        />
        <AnimatedPath
          fill="none"
          d={HEART_PATH_D}
          stroke={color}
          strokeWidth={strokeWidth}
          strokeLinecap="round"
          animatedProps={animatedProps}
        />
        <AnimatedPath
          fill={color}
          d={HEART_PATH_D}
          animatedProps={fillAnimatedProps}
        />
      </Svg>

      <View
        pointerEvents="none"
        className="absolute inset-0 items-center justify-center"
      >
        <AnimatedText
          style={[
            numberAnimatedStyle,
            numberColorAnimatedStyle,
            { fontSize: size * 0.32 },
          ]}
          className="font-public-sans font-bold"
        >
          {displayedLikeCount}
        </AnimatedText>
      </View>
    </AnimatedView>
  );
}
