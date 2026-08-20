import { AffirmationCard } from "@/components/AffirmationCard";
import AnimatedGradientBackground from "@/components/AnimatedGradientBackground";
import { HeartProgress } from "@/components/HeartProgress";
import { RoundedButton } from "@/components/RoundedButton";
import { SwipeUpHint } from "@/components/SwipeUpHint";
import colors from "@/constants/colors";
import { StorageKey } from "@/enums/storageKey.enum";
import Category from "@/enums/themeCategory.enum";
import Theme from "@/types/theme";
import { recordAffirmationSeen } from "@/utils/affirmationStats";
import { pickNextAffirmations } from "@/utils/affirmations";
import { getOnboardingResumeRoute } from "@/utils/onboarding";
import { storage } from "@/utils/storage";
import { THEME_IMAGES } from "@/utils/themeImages";
import { FlashList } from "@shopify/flash-list";
import { GlassView } from "expo-glass-effect";
import { Image } from "expo-image";
import { LinearGradient } from "expo-linear-gradient";
import { Link, Redirect } from "expo-router";
import { SymbolView } from "expo-symbols";
import { useEffect, useRef, useState } from "react";
import {
  Pressable,
  Text,
  useWindowDimensions,
  View,
  type ViewToken,
} from "react-native";
import {
  useMMKVBoolean,
  useMMKVNumber,
  useMMKVObject,
} from "react-native-mmkv";
import Animated, {
  cancelAnimation,
  Easing,
  useAnimatedStyle,
  useSharedValue,
  withDelay,
  withRepeat,
  withSequence,
  withTiming,
} from "react-native-reanimated";
import { useSafeAreaInsets } from "react-native-safe-area-context";

const FALL_DURATION = 130;
const MIN_BOUNCE_HEIGHT = 2;
const BOUNCE_RESTITUTION = 0.4;
const FIRST_CARD_RISE_OFFSET = -80;
const FIRST_CARD_ANIMATION_DELAY = 500;
// How fast the card snaps back to rest if the user scrolls away mid-bounce.
const FIRST_CARD_CANCEL_DURATION = 150;
// How often the fall-and-bounce replays, start to start.
const FIRST_CARD_ANIMATION_INTERVAL = 5000;

const buildFallAndBounceAnimations = (peakOffset: number) => {
  const animations = [
    withTiming(peakOffset, {
      duration: FALL_DURATION,
      easing: Easing.out(Easing.quad),
    }),
    withTiming(0, { duration: FALL_DURATION, easing: Easing.in(Easing.quad) }),
  ];
  let totalDuration = FALL_DURATION * 2;

  let bounceHeight = Math.abs(peakOffset) * BOUNCE_RESTITUTION;
  let bounceDuration = FALL_DURATION * Math.sqrt(BOUNCE_RESTITUTION);

  while (bounceHeight > MIN_BOUNCE_HEIGHT) {
    animations.push(
      withTiming(-bounceHeight, {
        duration: bounceDuration,
        easing: Easing.out(Easing.quad),
      }),
      withTiming(0, {
        duration: bounceDuration,
        easing: Easing.in(Easing.quad),
      }),
    );
    totalDuration += bounceDuration * 2;
    bounceHeight *= BOUNCE_RESTITUTION;
    bounceDuration *= Math.sqrt(BOUNCE_RESTITUTION);
  }

  // Pads the cycle out to a fixed interval so it replays on a steady
  // rhythm instead of firing back-to-back once the bounce settles.
  animations.push(
    withTiming(0, {
      duration: Math.max(FIRST_CARD_ANIMATION_INTERVAL - totalDuration, 0),
    }),
  );

  return animations;
};

const NEXT_BATCH_SIZE = 15;
const INITIAL_BATCH_SIZE = 20;
const RECENT_PICKS_EXCLUDE_WINDOW = 60;

export default function HomeScreen() {
  const { height } = useWindowDimensions();
  const { top, bottom } = useSafeAreaInsets();
  const [selectedTheme] = useMMKVObject<Theme>(
    StorageKey.SELECTED_THEME,
    storage,
  );
  const [queue, setQueue] = useState<string[]>(() =>
    pickNextAffirmations(INITIAL_BATCH_SIZE),
  );

  const loadMoreAffirmations = () => {
    setQueue((current) => {
      const exclude = new Set(current.slice(-RECENT_PICKS_EXCLUDE_WINDOW));
      return [...current, ...pickNextAffirmations(NEXT_BATCH_SIZE, exclude)];
    });
  };

  // Both the card bounce and the SwipeUpHint are a one-time "swipe up" cue:
  // they only make sense before the user has discovered scrolling works, so
  // the first time a second affirmation becomes visible retires them for
  // good. Persisted (not component state) so it stays retired across app
  // restarts — the dev menu's "replay" button resets this same key.
  const [hasSeenSecondAffirmation, setHasSeenSecondAffirmation] =
    useMMKVBoolean(StorageKey.HAS_SEEN_SECOND_AFFIRMATION, storage);

  // Grows with every new like today and resets to 0 each day (see
  // src/utils/dailyLikes.ts) — both keys are reactive, so the ring animates
  // live as the user likes affirmations without needing a manual refresh.
  const [dailyLikeCount] = useMMKVNumber(StorageKey.DAILY_LIKE_COUNT, storage);
  const [dayGoal] = useMMKVNumber(StorageKey.USER_DAY_GOAL, storage);

  const viewabilityConfig = useRef({ itemVisiblePercentThreshold: 90 }).current;
  const handleViewableItemsChanged = useRef(
    ({ viewableItems }: { viewableItems: ViewToken[] }) => {
      const visibleItem = viewableItems[0];
      const visibleText = visibleItem?.item as string | undefined;

      if (visibleText) {
        recordAffirmationSeen(visibleText);
      }

      if (visibleItem?.index != null && visibleItem.index > 0) {
        setHasSeenSecondAffirmation(true);
      }
    },
  ).current;

  const firstCardOffsetY = useSharedValue(0);
  const firstCardAnimatedStyle = useAnimatedStyle(() => ({
    transform: [{ translateY: firstCardOffsetY.value }],
  }));

  // Plays on arrival and then every 5s — until the user has seen a second
  // affirmation, at which point this stops re-arming the loop: the card
  // rises, then drops back to its resting position and bounces there, like
  // a ball thrown up and landing.
  useEffect(() => {
    if (hasSeenSecondAffirmation) return;

    firstCardOffsetY.value = withDelay(
      FIRST_CARD_ANIMATION_DELAY,
      withRepeat(
        withSequence(...buildFallAndBounceAnimations(FIRST_CARD_RISE_OFFSET)),
        -1,
      ),
    );
  }, [firstCardOffsetY, hasSeenSecondAffirmation]);

  // If the user scrolls away mid-bounce, cut the animation short instead of
  // letting it finish playing out on a card that's no longer in view.
  useEffect(() => {
    if (!hasSeenSecondAffirmation) return;

    cancelAnimation(firstCardOffsetY);
    firstCardOffsetY.value = withTiming(0, {
      duration: FIRST_CARD_CANCEL_DURATION,
    });
  }, [firstCardOffsetY, hasSeenSecondAffirmation]);

  // TEMPORAIRE: force le lancement sur l'onboarding, à retirer une fois testé.
  const resumeRoute = getOnboardingResumeRoute();

  if (resumeRoute !== "/") {
    return <Redirect href={resumeRoute} />;
  }

  return (
    <View className="flex-1">
      {selectedTheme && Category.IMAGE in selectedTheme ? (
        <Image
          className="absolute inset-0 w-full h-full"
          source={THEME_IMAGES[selectedTheme.image]}
          contentFit="cover"
        />
      ) : selectedTheme?.category === Category.ANIMATED_GRADIENT ? (
        <View className="absolute inset-0">
          <AnimatedGradientBackground colors={selectedTheme.colors} />
        </View>
      ) : (
        <LinearGradient
          className="absolute inset-0"
          colors={
            selectedTheme
              ? selectedTheme.colors
              : [colors.cream[100], colors.cream[300]]
          }
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
        />
      )}

      <View
        className="absolute flex-1 flex-row items-center justify-between px-10 z-10 gap-5"
        style={{ top }}
      >
        <View className="gap-3 flex-1 flex-row items-center">
          <HeartProgress
            size={36}
            goal={dayGoal ?? 0}
            likeCount={dailyLikeCount ?? 0}
          />
          <Text className="flex-1 text-text-900 font-semibold font-public-sans text-md leading-4">
            Ton objectif aujourd'hui
          </Text>
        </View>

        <Link asChild href="/paywall">
          <Pressable>
            <GlassView
              isInteractive
              glassEffectStyle="regular"
              className="items-center rounded-full gap-2 flex-row justify-center px-5 border-continuous"
            >
              <Text className="text-center font-noto-serif font-bold text-text-900 text-lg leading-[40px]">
                Get Premium
              </Text>
              <SymbolView
                name={{ ios: "crown" }}
                weight="medium"
                tintColor={colors.text[900]}
                size={26}
              />
            </GlassView>
          </Pressable>
        </Link>
      </View>

      <Link asChild href="/settings">
        <RoundedButton
          iconName="person"
          className="absolute left-10 z-10"
          style={{ bottom: bottom + 5 }}
        />
      </Link>

      <Link asChild href="/themes">
        <RoundedButton
          iconName="paintpalette"
          className="absolute right-10 z-10"
          style={{ bottom: bottom + 5 }}
        />
      </Link>

      <SwipeUpHint visible={!hasSeenSecondAffirmation} />

      <FlashList
        pagingEnabled
        data={queue}
        onEndReached={loadMoreAffirmations}
        onEndReachedThreshold={0.5}
        viewabilityConfig={viewabilityConfig}
        onViewableItemsChanged={handleViewableItemsChanged}
        showsVerticalScrollIndicator={false}
        keyExtractor={(item, index) => `${index}-${item}`}
        renderItem={({ item, index }) => (
          <Animated.View
            className="items-center justify-center px-6"
            style={[{ height }, index === 0 && firstCardAnimatedStyle]}
          >
            <AffirmationCard text={item} />
          </Animated.View>
        )}
      />
    </View>
  );
}
