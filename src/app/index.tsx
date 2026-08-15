import { AffirmationCard } from "@/components/AffirmationCard";
import AnimatedGradientBackground from "@/components/AnimatedGradientBackground";
import { RoundedButton } from "@/components/RoundedButton";
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
import { useRef, useState } from "react";
import {
  Pressable,
  Text,
  useWindowDimensions,
  View,
  type ViewToken,
} from "react-native";
import { useMMKVObject } from "react-native-mmkv";
import { useSafeAreaInsets } from "react-native-safe-area-context";

// Enough to fill several screens up front, then topped up as the user
// scrolls so the weighting (fresh/liked/shared) reacts to what's already
// been shown in this session instead of being computed all at once.
const INITIAL_BATCH_SIZE = 20;
const NEXT_BATCH_SIZE = 15;
// Only the most recent picks are excluded from the next batch — a rolling
// short-term memory, not a permanent ban, so the pool can recycle over a
// long scroll session instead of running dry.
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

  const viewabilityConfig = useRef({ itemVisiblePercentThreshold: 90 }).current;
  const handleViewableItemsChanged = useRef(
    ({ viewableItems }: { viewableItems: ViewToken[] }) => {
      const visibleText = viewableItems[0]?.item as string | undefined;

      if (visibleText) {
        recordAffirmationSeen(visibleText);
      }
    },
  ).current;

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
        className="absolute flex-1 flex-row items-center justify-between px-5 z-10"
        style={{ top }}
      >
        <View className="flex-1">
          <Text className="text-terracotta-500 font-medium font-public-sans uppercase">
            Bon matin
          </Text>
          <Text className="text-ink font-medium font-noto-serif text-3xl">
            Guillaume
          </Text>
        </View>

        <Link asChild href="/paywall">
          <Pressable>
            <GlassView
              isInteractive
              glassEffectStyle="regular"
              className="items-center rounded-full gap-2 flex-row justify-center px-5 border-continuous"
            >
              <Text className="text-center font-noto-serif font-bold text-ink text-lg leading-[40px]">
                Get Premium
              </Text>
              <SymbolView
                name={{ ios: "crown" }}
                weight="medium"
                tintColor={colors.ink}
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

      <FlashList
        pagingEnabled
        data={queue}
        onEndReached={loadMoreAffirmations}
        onEndReachedThreshold={0.5}
        viewabilityConfig={viewabilityConfig}
        onViewableItemsChanged={handleViewableItemsChanged}
        showsVerticalScrollIndicator={false}
        keyExtractor={(item, index) => `${index}-${item}`}
        renderItem={({ item }) => (
          <View className="items-center justify-center px-6" style={{ height }}>
            <AffirmationCard text={item} />
          </View>
        )}
      />
    </View>
  );
}
