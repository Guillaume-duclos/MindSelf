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
import { FlashList, FlashListRef, ViewToken } from "@shopify/flash-list";
import { GlassView } from "expo-glass-effect";
import * as Haptics from "expo-haptics";
import { Image } from "expo-image";
import { LinearGradient } from "expo-linear-gradient";
import { useRouter } from "expo-router";
import { SymbolView } from "expo-symbols";
import { useEffect, useRef, useState } from "react";
import { Pressable, ScrollView, Text, View } from "react-native";
import { useMMKVObject } from "react-native-mmkv";
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from "react-native-reanimated";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import themes from "../data/themes.json";
import themesCategories from "../data/themesCategories.json";

const NUM_COLUMNS = 3;

type SectionEntry =
  | { type: "header"; title: string; value: string }
  | ({ type: "theme" } & Theme);

const categoryTitleByValue = new Map(
  themesCategories.map((category) => [category.value, category.title]),
);

const sections: SectionEntry[] = themes.flatMap((categoryGroup) => {
  if (categoryGroup.themes.length === 0) {
    return [];
  }

  const title =
    categoryTitleByValue.get(categoryGroup.category) ?? categoryGroup.category;

  return [
    { type: "header", title, value: categoryGroup.category } as const,
    ...categoryGroup.themes.map((theme) => {
      const isPremium = theme.isPremium === "true";

      if ("image" in theme) {
        return {
          type: "theme",
          category: Category.IMAGE,
          image: theme.image,
          isPremium,
        } as const;
      }

      const category =
        categoryGroup.category === Category.ANIMATED_GRADIENT
          ? Category.ANIMATED_GRADIENT
          : Category.GRADIENT;

      return {
        type: "theme",
        category,
        colors: theme.colors as [string, string],
        isPremium,
      } as const;
    }),
  ];
});

const categoryHeaderIndex: Record<string, number> = {};
const categoryByIndex: string[] = [];

{
  let currentCategory = "";

  sections.forEach((entry, index) => {
    if (entry.type === "header") {
      currentCategory = entry.value;
      categoryHeaderIndex[currentCategory] = index;
    }

    categoryByIndex[index] = currentCategory;
  });
}

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

export default function Share() {
  const router = useRouter();
  const { bottom } = useSafeAreaInsets();
  const [selectedTheme] = useMMKVObject<Theme>(
    StorageKey.SELECTED_THEME,
    storage,
  );
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

  const isProgrammaticScroll = useRef(false);

  const handleSelectTheme = (theme: Theme) => {
    Haptics.selectionAsync();
    setStorageObject(StorageKey.SELECTED_THEME, theme);
    updateAffirmationWidgetTimeline();
    router.back();
  };

  const scrollToCategory = async (categoryValue: string) => {
    setActiveCategory(categoryValue);

    const index = categoryHeaderIndex[categoryValue];

    if (index !== undefined) {
      isProgrammaticScroll.current = true;
      await listRef.current?.scrollToIndex({ index, animated: true });
      isProgrammaticScroll.current = false;
    }
  };

  const viewabilityConfig = useRef({
    itemVisiblePercentThreshold: 0,
    minimumViewTime: 100,
  }).current;

  const onViewableItemsChanged = useRef(
    ({ viewableItems }: { viewableItems: ViewToken<SectionEntry>[] }) => {
      if (isProgrammaticScroll.current) {
        return;
      }

      let minIndex = Infinity;

      for (const token of viewableItems) {
        if (token.isViewable && token.index != null && token.index < minIndex) {
          minIndex = token.index;
        }
      }

      const category = categoryByIndex[minIndex];

      if (category) {
        setActiveCategory((prev) => (prev === category ? prev : category));
      }
    },
  ).current;

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
            tintColor={isActive ? colors.ink : undefined}
            className="h-10 rounded-full justify-center px-5 border-continuous"
          >
            <Text
              className={`text-center font-noto-serif font-bold text-md ${
                isActive ? "text-white" : "text-ink"
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
        <Text className="text-center font-noto-serif font-bold text-ink text-md leading-[40px]">
          MindSelf
        </Text>
      </GlassView>
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
          className="px-3"
          numColumns={NUM_COLUMNS}
          contentContainerStyle={{ paddingBottom: bottom }}
          keyExtractor={(item, index) => `${item.type}-${index}`}
          getItemType={(item) => item.type}
          overrideItemLayout={(layout, item) => {
            if (item.type === "header") {
              layout.span = NUM_COLUMNS;
            }
          }}
          onScroll={handleScroll}
          scrollEventThrottle={32}
          onScrollBeginDrag={() => {
            isProgrammaticScroll.current = false;
          }}
          viewabilityConfig={viewabilityConfig}
          onViewableItemsChanged={onViewableItemsChanged}
          renderItem={({ item }) => {
            if (item.type === "header") {
              return (
                <Text className="font-noto-serif font-bold text-ink text-lg px-2 pb-2 pt-4">
                  {item.title}
                </Text>
              );
            }

            const theme: Theme =
              Category.IMAGE in item
                ? {
                    category: item.category,
                    image: item.image,
                    isPremium: item.isPremium,
                  }
                : {
                    category: item.category,
                    colors: item.colors,
                    isPremium: item.isPremium,
                  };

            const borderColor =
              selectedTheme && "colors" in selectedTheme
                ? darkenColor(selectedTheme.colors[1], 0.3)
                : colors.ink;

            return (
              <Pressable onPress={() => handleSelectTheme(theme)}>
                <View
                  className={`border-terracotta-400 border-continuous rounded-xl overflow-hidden m-3`}
                  style={{ boxShadow: `0px 4px 7px ${colors.taupe}` }}
                >
                  {Category.IMAGE in item ? (
                    <View className="h-48 border-continuous">
                      <Image
                        className="absolute inset-0 w-full h-full"
                        source={THEME_IMAGES[item.image]}
                        contentFit="cover"
                      />
                      <View className="flex-1 items-center justify-center">
                        {renderAffirmationCard()}
                      </View>
                    </View>
                  ) : item.category === Category.ANIMATED_GRADIENT ? (
                    <View className="h-48 border-continuous overflow-hidden">
                      <View className="absolute inset-0">
                        <AnimatedGradientBackground colors={item.colors} />
                      </View>
                      <View className="flex-1 items-center justify-center">
                        {renderAffirmationCard()}
                      </View>
                    </View>
                  ) : (
                    <LinearGradient
                      className="items-center justify-center h-48 border-continuous"
                      colors={item.colors}
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

                {item.isPremium && (
                  <SymbolView
                    name="crown"
                    weight="bold"
                    tintColor={colors.ink}
                    className="absolute -top-1 -right-1"
                  />
                )}
              </Pressable>
            );
          }}
        />
      </View>
    </View>
  );
}
