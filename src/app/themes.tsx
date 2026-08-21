import { ScreenHeader } from "@/components/ScreenHeader";
import { SubCategoryRow } from "@/components/SubCategoryRow";
import { type ThemeJsonEntry } from "@/components/ThemeCard";
import colors from "@/constants/colors";
import { StorageKey } from "@/enums/storageKey.enum";
import Theme from "@/types/theme";
import { setStorageObject, storage } from "@/utils/storage";
import { updateAffirmationWidgetTimeline } from "@/utils/widget";
import { FlashList, FlashListRef } from "@shopify/flash-list";
import { GlassView } from "expo-glass-effect";
import * as Haptics from "expo-haptics";
import { LinearGradient } from "expo-linear-gradient";
import { useRouter } from "expo-router";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import {
  PixelRatio,
  Pressable,
  ScrollView,
  Text,
  useWindowDimensions,
  View,
} from "react-native";
import { useMMKVObject } from "react-native-mmkv";
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from "react-native-reanimated";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import themes from "../data/themes.json";
import themesCategories from "../data/themesCategories.json";

// Matches the horizontal ScrollView's `px-5 gap-4` below — cards are sized
// so the viewport (screenWidth) cuts into the 4th card at the initial
// scroll position, creating the "peek" of more content to come.
const LIST_LEFT_PADDING = 20;
const CARD_GAP = 16;
const CARD_PEEK_WIDTH = 12;
const CARD_ASPECT_RATIO = 176 / 132;
const VISIBLE_CARD_COUNT = 3;

type SectionEntry =
  | { type: "header"; title: string; value: string }
  | {
      type: "subCategory";
      categoryValue: string;
      title: string;
      themes: ThemeJsonEntry[];
    }
  | { type: "divider" };

const categoryTitleByValue = new Map(
  themesCategories.map((category) => [category.value, category.title]),
);

const sections: SectionEntry[] = themes.flatMap((categoryGroup) => {
  if (categoryGroup.subCategories.length === 0) {
    return [];
  }

  const title =
    categoryTitleByValue.get(categoryGroup.category) ?? categoryGroup.category;

  return [
    { type: "header", title, value: categoryGroup.category } as const,
    ...categoryGroup.subCategories.flatMap(
      (subCategory, index) =>
        [
          ...(index > 0 ? [{ type: "divider" } as const] : []),
          {
            type: "subCategory",
            categoryValue: categoryGroup.category,
            title: subCategory.title,
            themes: subCategory.themes,
          } as const,
        ] as const,
    ),
  ];
});

const categoryHeaderIndex: Record<string, number> = {};

sections.forEach((entry, index) => {
  if (entry.type === "header") {
    categoryHeaderIndex[entry.value] = index;
  }
});

export default function Themes() {
  const router = useRouter();
  const { bottom } = useSafeAreaInsets();
  const { width: screenWidth } = useWindowDimensions();
  const [selectedTheme] = useMMKVObject<Theme>(
    StorageKey.SELECTED_THEME,
    storage,
  );
  // Only one card's mesh gradient animates at a time, tracked here so
  // starting a new one can pause whichever card was previously playing.
  const [playingItem, setPlayingItem] = useState<ThemeJsonEntry | null>(null);

  // Sized so exactly 3 cards are fully visible plus a peek of the 4th,
  // regardless of screen width. Rounded to the nearest native pixel so the
  // rendered card width exactly matches the snap offsets computed from it.
  const cardWidth = useMemo(() => {
    const gapsCount = VISIBLE_CARD_COUNT;

    return PixelRatio.roundToNearestPixel(
      (screenWidth -
        LIST_LEFT_PADDING -
        gapsCount * CARD_GAP -
        CARD_PEEK_WIDTH) /
        VISIBLE_CARD_COUNT,
    );
  }, [screenWidth]);
  const cardHeight = cardWidth * CARD_ASPECT_RATIO;
  const topFadeOpacity = useSharedValue(0);
  const listRef = useRef<FlashListRef<SectionEntry>>(null);
  const categoryScrollRef = useRef<ScrollView>(null);
  const categoryScrollWidth = useRef(0);
  const categoryPillLayouts = useRef<
    Record<string, { x: number; width: number }>
  >({});

  const [activeCategory, setActiveCategory] = useState<string | null>(
    themesCategories[0]?.value ?? null,
  );

  useEffect(() => {
    if (!activeCategory) {
      return;
    }

    const layout = categoryPillLayouts.current[activeCategory];

    if (!layout) {
      return;
    }

    const targetX = layout.x - (categoryScrollWidth.current - layout.width) / 2;

    categoryScrollRef.current?.scrollTo({
      x: Math.max(0, targetX),
      animated: true,
    });
  }, [activeCategory]);

  const topFadeStyle = useAnimatedStyle(() => ({
    opacity: topFadeOpacity.value,
  }));

  const handleScroll = (event: {
    nativeEvent: { contentOffset: { y: number } };
  }) => {
    const isScrolled = event.nativeEvent.contentOffset.y > 0;
    topFadeOpacity.value = withTiming(isScrolled ? 1 : 0, { duration: 200 });
  };

  const handleSelectTheme = useCallback(
    (theme: Theme) => {
      Haptics.selectionAsync();
      setStorageObject(StorageKey.SELECTED_THEME, theme);
      updateAffirmationWidgetTimeline();
      router.back();
    },
    [router],
  );

  const handleToggleAnimation = useCallback((item: ThemeJsonEntry) => {
    setPlayingItem((previous) => (previous === item ? null : item));
  }, []);

  const scrollToCategory = (categoryValue: string) => {
    setActiveCategory(categoryValue);

    const index = categoryHeaderIndex[categoryValue];

    if (index !== undefined) {
      listRef.current?.scrollToIndex({ index, animated: true });
    }
  };

  const renderCategoryItem = () => {
    return themesCategories.map((category, index) => {
      const isActive = category.value === activeCategory;

      return (
        <Pressable
          key={index}
          onPress={() => scrollToCategory(category.value)}
          onLayout={(event) => {
            const { x, width } = event.nativeEvent.layout;
            categoryPillLayouts.current[category.value] = { x, width };
          }}
        >
          <GlassView
            isInteractive
            glassEffectStyle="regular"
            tintColor={isActive ? colors.text[900] : undefined}
            className="h-10 rounded-full justify-center px-5 border-continuous"
          >
            <Text
              className={`text-center font-noto-serif font-bold text-md ${
                isActive ? "text-white" : "text-text-900"
              }`}
            >
              {category.title}
            </Text>
          </GlassView>
        </Pressable>
      );
    });
  };

  return (
    <View className="flex-1 bg-cream-50">
      <ScreenHeader title="Thèmes" className="py-5 px-5" />

      <ScrollView
        ref={categoryScrollRef}
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        contentContainerClassName="gap-3 px-5 py-2"
        className="grow-0"
        onLayout={(event) => {
          categoryScrollWidth.current = event.nativeEvent.layout.width;
        }}
      >
        {renderCategoryItem()}
      </ScrollView>

      <View className="flex-1">
        <Animated.View
          className="h-10 absolute top-0 w-full z-10"
          style={topFadeStyle}
          pointerEvents="none"
        >
          <LinearGradient
            className="h-full w-full"
            colors={[colors.cream[50], `${colors.cream[50]}00`]}
          />
        </Animated.View>

        <FlashList
          ref={listRef}
          data={sections}
          contentContainerStyle={{ paddingBottom: bottom }}
          keyExtractor={(item, index) => `${item.type}-${index}`}
          getItemType={(item) => item.type}
          onScroll={handleScroll}
          renderItem={({ item }) => {
            if (item.type === "header") {
              return (
                <Text className="font-noto-serif font-bold text-text-900 text-2xl px-5 pb-2 pt-6">
                  {item.title}
                </Text>
              );
            }

            if (item.type === "divider") {
              return (
                <View className="w-full mx-5 my-2 h-[0.5] bg-text-900/25" />
              );
            }

            return (
              <SubCategoryRow
                categoryValue={item.categoryValue}
                subCategoryTitle={item.title}
                themes={item.themes}
                cardWidth={cardWidth}
                cardHeight={cardHeight}
                selectedTheme={selectedTheme}
                onSelectTheme={handleSelectTheme}
                playingItem={playingItem}
                onToggleAnimation={handleToggleAnimation}
              />
            );
          }}
        />
      </View>
    </View>
  );
}
