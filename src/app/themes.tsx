import AnimatedGradientBackground from "@/components/AnimatedGradientBackground";
import { ScreenHeader } from "@/components/ScreenHeader";
import colors from "@/constants/colors";
import { StorageKey } from "@/enums/storageKey.enum";
import Category from "@/enums/themeCategory.enum";
import Theme from "@/types/theme";
import { darkenColor } from "@/utils/color";
import { setStorageObject, storage } from "@/utils/storage";
import { THEME_IMAGES } from "@/utils/themeImages";
import { updateAffirmationWidgetTimeline } from "@/utils/widget";
import { FlashList, FlashListRef } from "@shopify/flash-list";
import { GlassView } from "expo-glass-effect";
import * as Haptics from "expo-haptics";
import { Image } from "expo-image";
import { LinearGradient } from "expo-linear-gradient";
import { useRouter } from "expo-router";
import { SymbolView } from "expo-symbols";
import { useEffect, useMemo, useRef, useState } from "react";
import {
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

type ThemeJsonEntry =
  | { isPremium: string; colors: string[] }
  | { isPremium: string; image: string };

type SectionEntry =
  | { type: "header"; title: string; value: string }
  | {
      type: "subCategory";
      categoryValue: string;
      title: string;
      themes: ThemeJsonEntry[];
    };

const categoryTitleByValue = new Map(
  themesCategories.map((category) => [category.value, category.title]),
);

const themeFromJsonEntry = (
  categoryValue: string,
  item: ThemeJsonEntry,
): Theme => {
  const isPremium = item.isPremium === "true";

  if ("image" in item) {
    return { category: Category.IMAGE, image: item.image, isPremium };
  }

  const category =
    categoryValue === Category.ANIMATED_GRADIENT
      ? Category.ANIMATED_GRADIENT
      : Category.GRADIENT;

  return { category, colors: item.colors as [string, string], isPremium };
};

const sections: SectionEntry[] = themes.flatMap((categoryGroup) => {
  if (categoryGroup.subCategories.length === 0) {
    return [];
  }

  const title =
    categoryTitleByValue.get(categoryGroup.category) ?? categoryGroup.category;

  return [
    { type: "header", title, value: categoryGroup.category } as const,
    ...categoryGroup.subCategories.map(
      (subCategory) =>
        ({
          type: "subCategory",
          categoryValue: categoryGroup.category,
          title: subCategory.title,
          themes: subCategory.themes,
        }) as const,
    ),
  ];
});

const categoryHeaderIndex: Record<string, number> = {};

sections.forEach((entry, index) => {
  if (entry.type === "header") {
    categoryHeaderIndex[entry.value] = index;
  }
});

const isSameTheme = (a: Theme, b: Theme | undefined): boolean => {
  if (!b) {
    return false;
  }

  if ("image" in a && "image" in b) {
    return a.image === b.image;
  }

  if ("colors" in a && "colors" in b) {
    return a.colors[0] === b.colors[0] && a.colors[1] === b.colors[1];
  }

  return false;
};

export default function Themes() {
  const router = useRouter();
  const { bottom } = useSafeAreaInsets();
  const { width: screenWidth } = useWindowDimensions();
  const [selectedTheme] = useMMKVObject<Theme>(
    StorageKey.SELECTED_THEME,
    storage,
  );

  // Sized so exactly 3 cards are fully visible plus a peek of the 4th,
  // regardless of screen width.
  const cardWidth = useMemo(() => {
    const gapsCount = VISIBLE_CARD_COUNT;

    return (
      (screenWidth -
        LIST_LEFT_PADDING -
        gapsCount * CARD_GAP -
        CARD_PEEK_WIDTH) /
      VISIBLE_CARD_COUNT
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

  const handleSelectTheme = (theme: Theme) => {
    Haptics.selectionAsync();
    setStorageObject(StorageKey.SELECTED_THEME, theme);
    updateAffirmationWidgetTimeline();
    router.back();
  };

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

  const renderAffirmationCard = () => {
    return (
      <GlassView
        isInteractive={false}
        glassEffectStyle="regular"
        className="items-center w-[80%] h-[75%] rounded-lg justify-center px-2 border-continuous"
      >
        <Text className="text-center font-noto-serif font-bold text-text-900 text-md leading-[40px]">
          MindSelf
        </Text>
      </GlassView>
    );
  };

  const renderThemeCard = (categoryValue: string, item: ThemeJsonEntry) => {
    const theme = themeFromJsonEntry(categoryValue, item);

    const borderColor =
      selectedTheme && "colors" in selectedTheme
        ? darkenColor(selectedTheme.colors[1], 0.3)
        : colors.text[900];

    return (
      <Pressable onPress={() => handleSelectTheme(theme)}>
        <View
          className="border-terracotta-400 border-continuous rounded-xl overflow-hidden"
          style={{
            width: cardWidth,
            height: cardHeight,
            boxShadow: `0px 4px 7px ${colors.taupe}`,
          }}
        >
          {"image" in theme ? (
            <View className="flex-1 border-continuous">
              <Image
                className="absolute inset-0 w-full h-full"
                source={THEME_IMAGES[theme.image]}
                contentFit="cover"
              />
              <View className="flex-1 items-center justify-center">
                {renderAffirmationCard()}
              </View>
            </View>
          ) : theme.category === Category.ANIMATED_GRADIENT ? (
            <View className="flex-1 border-continuous overflow-hidden">
              <View className="absolute inset-0">
                <AnimatedGradientBackground colors={theme.colors} />
              </View>
              <View className="flex-1 items-center justify-center">
                {renderAffirmationCard()}
              </View>
            </View>
          ) : (
            <LinearGradient
              className="flex-1 items-center justify-center border-continuous"
              colors={theme.colors}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
            >
              {renderAffirmationCard()}
            </LinearGradient>
          )}
        </View>

        {isSameTheme(theme, selectedTheme) && (
          <View
            className="border-[3px] absolute top-0 left-0 right-0 bottom-0 rounded-[16px] border-continuous"
            style={{ borderColor }}
          />
        )}

        {theme.isPremium && (
          <SymbolView
            name="crown"
            weight="bold"
            tintColor={colors.text[900]}
            className="absolute -top-1 -right-1"
          />
        )}
      </Pressable>
    );
  };

  return (
    <View className="flex-1 bg-cream-50">
      <ScreenHeader title="Thèmes" className="py-5 px-5" />

      <ScrollView
        ref={categoryScrollRef}
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        contentContainerClassName="gap-3 px-5 pt-2 pb-5"
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
          scrollEventThrottle={32}
          renderItem={({ item }) => {
            if (item.type === "header") {
              return (
                <Text className="font-noto-serif font-bold text-text-900 text-2xl px-5 pb-2 pt-2">
                  {item.title}
                </Text>
              );
            }

            return (
              <View className="mt-4">
                <Text className="font-noto-serif font-semibold text-text-900 text-md px-5">
                  {item.title}
                </Text>

                <ScrollView
                  horizontal
                  snapToInterval={cardWidth + CARD_GAP}
                  decelerationRate="fast"
                  showsHorizontalScrollIndicator={false}
                  contentContainerClassName="gap-4 px-5"
                  className="py-3"
                >
                  {item.themes.map((themeItem, index) => (
                    <View key={index}>
                      {renderThemeCard(item.categoryValue, themeItem)}
                    </View>
                  ))}
                </ScrollView>
              </View>
            );
          }}
        />
      </View>
    </View>
  );
}
