import Aquarius from "@/assets/svg/Aquarius";
import Aries from "@/assets/svg/Aries";
import Cancer from "@/assets/svg/Cancer";
import Capricorn from "@/assets/svg/Capricorn";
import Gemini from "@/assets/svg/Gemini";
import Leo from "@/assets/svg/Leo";
import Libra from "@/assets/svg/Libra";
import Pisces from "@/assets/svg/Pisces";
import Sagittarius from "@/assets/svg/Sagittarius";
import Scorpio from "@/assets/svg/Scorpio";
import Taurus from "@/assets/svg/Taurus";
import Virgo from "@/assets/svg/Virgo";
import { StorageKey } from "@/enums/storageKey.enum";
import { getStorageBoolean, setStorageItem } from "@/utils/storage";
import * as Haptics from "expo-haptics";
import { SymbolView } from "expo-symbols";
import { useEffect, useMemo, useState } from "react";
import { Pressable, Text, View } from "react-native";
import { Gesture, GestureDetector } from "react-native-gesture-handler";
import Animated, {
  Easing,
  useAnimatedReaction,
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from "react-native-reanimated";
import { useSafeAreaFrame } from "react-native-safe-area-context";
import { runOnJS } from "react-native-worklets";

export const ZODIAC_SIGNS = [
  { Icon: Aries, name: "Bélier", value: "aries", width: 50, height: 48 },
  { Icon: Taurus, name: "Taureau", value: "taurus", width: 50, height: 48 },
  { Icon: Gemini, name: "Gémeaux", value: "gemini", width: 47, height: 49 },
  { Icon: Cancer, name: "Cancer", value: "cancer", width: 46, height: 37 },
  { Icon: Leo, name: "Lion", value: "leo", width: 39, height: 49 },
  { Icon: Virgo, name: "Vierge", value: "virgo", width: 50, height: 60 },
  { Icon: Libra, name: "Balance", value: "libra", width: 47, height: 43 },
  { Icon: Scorpio, name: "Scorpion", value: "scorpio", width: 51, height: 61 },
  {
    Icon: Sagittarius,
    name: "Sagittaire",
    value: "sagittarius",
    width: 40,
    height: 40,
  },
  {
    Icon: Capricorn,
    name: "Capricorne",
    value: "capricorn",
    width: 49,
    height: 49,
  },
  {
    Icon: Aquarius,
    name: "Verseau",
    value: "aquarius",
    width: 50,
    height: 33,
  },
  { Icon: Pisces, name: "Poissons", value: "pisces", width: 40, height: 47 },
];

const STEP_ANGLE = 360 / ZODIAC_SIGNS.length;

type Props = {
  value: string;
  onChange: (value: string) => void;
  onIntroAnimatingChange?: (isAnimating: boolean) => void;
};

export function AstralSignPicker({
  value,
  onChange,
  onIntroAnimatingChange,
}: Props) {
  const { width } = useSafeAreaFrame();

  const ICON_SIZE = 52;
  const ITEM_WIDTH = 70;
  const ITEM_HEIGHT = ICON_SIZE + 20;
  const CIRCLE_SIZE = width;
  const RADIUS = CIRCLE_SIZE / 2 - ITEM_HEIGHT / 2 - 10;
  const CENTER = CIRCLE_SIZE / 2;

  const hasViewedPage = getStorageBoolean(StorageKey.ASTRAL_SIGN_PAGE_VIEWED);

  const initialIndex = Math.max(
    0,
    ZODIAC_SIGNS.findIndex((sign) => sign.value === value),
  );

  const [selectedIndex, setSelectedIndex] = useState(initialIndex);
  const [isIntroAnimating, setIsIntroAnimating] = useState(!hasViewedPage);

  const rotation = useSharedValue(0);
  const gestureStartAngle = useSharedValue(0);
  const gestureStartRotation = useSharedValue(0);

  const handleStepChange = (steps: number) => {
    const nextIndex =
      ((steps % ZODIAC_SIGNS.length) + ZODIAC_SIGNS.length) %
      ZODIAC_SIGNS.length;
    setSelectedIndex(nextIndex);
    onChange(ZODIAC_SIGNS[nextIndex].value);
    Haptics.selectionAsync();
  };

  useAnimatedReaction(
    () => Math.round(rotation.value / STEP_ANGLE),
    (steps, previousSteps) => {
      if (previousSteps !== null && steps !== previousSteps) {
        runOnJS(handleStepChange)(steps);
      }
    },
  );

  useEffect(() => {
    if (hasViewedPage) {
      return;
    }

    const timeout = setTimeout(() => {
      rotation.value = withTiming(
        360,
        { duration: 1500, easing: Easing.bezier(0.46, 0, 0.43, 1) },
        (finished) => {
          if (finished) {
            runOnJS(setIsIntroAnimating)(false);
            if (onIntroAnimatingChange) {
              runOnJS(onIntroAnimatingChange)(false);
            }
            runOnJS(setStorageItem)(StorageKey.ASTRAL_SIGN_PAGE_VIEWED, true);
          }
        },
      );
    }, 350);

    return () => clearTimeout(timeout);
  }, []);

  useEffect(() => {
    onIntroAnimatingChange?.(isIntroAnimating);
  }, [isIntroAnimating]);

  const handleSignPress = (index: number) => {
    const currentMod = ((rotation.value % 360) + 360) % 360;
    const targetMod = (((index * STEP_ANGLE) % 360) + 360) % 360;
    const diff = ((((targetMod - currentMod + 180) % 360) + 360) % 360) - 180;

    rotation.value = withTiming(rotation.value + diff, { duration: 250 });
  };

  const panGesture = Gesture.Pan()
    .enabled(!isIntroAnimating)
    .onStart((event) => {
      gestureStartAngle.value =
        (Math.atan2(event.y - CENTER, event.x - CENTER) * 180) / Math.PI;
      gestureStartRotation.value = rotation.value;
    })
    .onUpdate((event) => {
      const currentAngle =
        (Math.atan2(event.y - CENTER, event.x - CENTER) * 180) / Math.PI;
      const delta = currentAngle - gestureStartAngle.value;
      const targetRotation = gestureStartRotation.value + delta;

      const steps = Math.round(targetRotation / STEP_ANGLE);
      const snappedRotation = steps * STEP_ANGLE;

      if (snappedRotation !== rotation.value) {
        rotation.value = snappedRotation;
      }
    });

  const arrowAnimatedStyle = useAnimatedStyle(() => ({
    transform: [{ rotate: `${rotation.value}deg` }],
  }));

  const signLayouts = useMemo(
    () =>
      ZODIAC_SIGNS.map(({ Icon, width, height }, index) => {
        const positionAngle = ((index * STEP_ANGLE - 90) * Math.PI) / 180;
        const left = CENTER + RADIUS * Math.cos(positionAngle) - ITEM_WIDTH / 2;
        const top = CENTER + RADIUS * Math.sin(positionAngle) - ITEM_HEIGHT / 2;

        return { Icon, left, top, aspectRatio: width / height };
      }),
    [CENTER, RADIUS, ITEM_WIDTH, ITEM_HEIGHT],
  );

  return (
    <View className="gap-6 flex-1 justify-center">
      <Text className="font-noto-serif text-center font-bold text-3xl text-[#C9663D]">
        {ZODIAC_SIGNS[selectedIndex].name}
      </Text>

      <GestureDetector gesture={panGesture}>
        <View
          className="items-center justify-center"
          style={{ width: CIRCLE_SIZE, height: CIRCLE_SIZE }}
        >
          <Animated.View style={arrowAnimatedStyle}>
            <SymbolView
              size={width * 0.55}
              name="arrow.up"
              weight="semibold"
              tintColor="#000"
            />
          </Animated.View>

          {signLayouts.map(({ Icon, left, top }, index) => {
            const activeColor = index === selectedIndex ? "#C9663D" : "#000";

            return (
              <Pressable
                key={index}
                disabled={isIntroAnimating}
                onPress={() => handleSignPress(index)}
                style={{
                  top,
                  left,
                  position: "absolute",
                  width: ITEM_WIDTH,
                  height: ITEM_HEIGHT,
                  alignItems: "center",
                }}
              >
                <Icon
                  style={{ width: ICON_SIZE, height: ICON_SIZE }}
                  color={activeColor}
                />
              </Pressable>
            );
          })}
        </View>
      </GestureDetector>
    </View>
  );
}
