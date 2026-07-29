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
import { CustomButton } from "@/components/CustomButton";
import { OnboardingTitle } from "@/components/OnboardingTitle";
import * as Haptics from "expo-haptics";
import { useRouter } from "expo-router";
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
import { SafeAreaView, useSafeAreaFrame } from "react-native-safe-area-context";
import { runOnJS } from "react-native-worklets";

const ZODIAC_SIGNS = [
  { Icon: Aries, name: "Bélier" },
  { Icon: Taurus, name: "Taureau" },
  { Icon: Gemini, name: "Gémeaux" },
  { Icon: Cancer, name: "Cancer" },
  { Icon: Leo, name: "Lion" },
  { Icon: Virgo, name: "Vierge" },
  { Icon: Libra, name: "Balance" },
  { Icon: Scorpio, name: "Scorpion" },
  { Icon: Sagittarius, name: "Sagittaire" },
  { Icon: Capricorn, name: "Capricorne" },
  { Icon: Aquarius, name: "Verseau" },
  { Icon: Pisces, name: "Poissons" },
];

const STEP_ANGLE = 360 / ZODIAC_SIGNS.length;

export default function UserAstralSign() {
  const router = useRouter();
  const { width } = useSafeAreaFrame();

  const ICON_SIZE = 52;
  const ITEM_WIDTH = 70;
  const ITEM_HEIGHT = ICON_SIZE + 20;
  const CIRCLE_SIZE = width * 0.95;
  const RADIUS = CIRCLE_SIZE / 2 - ITEM_HEIGHT / 2 - 10;
  const CENTER = CIRCLE_SIZE / 2;

  const [selectedIndex, setSelectedIndex] = useState(0);
  const [isIntroAnimating, setIsIntroAnimating] = useState(true);

  const rotation = useSharedValue(0);
  const gestureStartAngle = useSharedValue(0);
  const gestureStartRotation = useSharedValue(0);

  const handleStepChange = (steps: number) => {
    const nextIndex =
      ((steps % ZODIAC_SIGNS.length) + ZODIAC_SIGNS.length) %
      ZODIAC_SIGNS.length;
    setSelectedIndex(nextIndex);
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
    const timeout = setTimeout(() => {
      rotation.value = withTiming(
        360,
        { duration: 1600, easing: Easing.bezier(0.61, 0, 0.25, 1) },
        (finished) => {
          if (finished) {
            runOnJS(setIsIntroAnimating)(false);
          }
        },
      );
    }, 500);

    return () => clearTimeout(timeout);
  }, []);

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
      ZODIAC_SIGNS.map(({ Icon }, index) => {
        const positionAngle = ((index * STEP_ANGLE - 90) * Math.PI) / 180;
        const left =
          CENTER + RADIUS * Math.cos(positionAngle) - ITEM_WIDTH / 2;
        const top =
          CENTER + RADIUS * Math.sin(positionAngle) - ITEM_HEIGHT / 2;
        const rotationDeg = index * STEP_ANGLE;

        return { Icon, left, top, rotationDeg };
      }),
    [CENTER, RADIUS, ITEM_WIDTH, ITEM_HEIGHT],
  );

  return (
    <SafeAreaView className="flex-1 px-10 items-center bg-[#FAF3EF]">
      <View className="flex-1 items-center justify-center w-full gap-10">
        <OnboardingTitle
          title="Quel est ton signe astrologique ?"
          description="Fais pivoter la flèche ou clic sur un signe pour effectuer ta sélection."
        />

        <Text className="font-noto-serif font-bold text-3xl text-[#C9663D]">
          {ZODIAC_SIGNS[selectedIndex].name}
        </Text>

        <GestureDetector gesture={panGesture}>
          <View
            className="items-center justify-center"
            style={{ width: CIRCLE_SIZE, height: CIRCLE_SIZE }}
          >
            <Animated.View style={arrowAnimatedStyle}>
              <SymbolView
                size={230}
                name="arrow.up"
                weight="semibold"
                tintColor="#000"
              />
            </Animated.View>

            {signLayouts.map(({ Icon, left, top, rotationDeg }, index) => {
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
                    transform: [{ rotate: `${rotationDeg}deg` }],
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

      <View className="w-full gap-4">
        <CustomButton
          label="Continuer"
          disabled={isIntroAnimating}
          onPress={() => router.push("/onboarding/userProfessionalSituation")}
        />
      </View>
    </SafeAreaView>
  );
}
