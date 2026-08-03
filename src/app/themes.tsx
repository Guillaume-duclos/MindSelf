import { ScreenHeader } from "@/components/ScreenHeader";
import { FlashList, FlashListRef, ViewToken } from "@shopify/flash-list";
import { GlassView } from "expo-glass-effect";
import { LinearGradient } from "expo-linear-gradient";
import { useEffect, useRef, useState } from "react";
import { Pressable, ScrollView, Text, View } from "react-native";
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
  | { type: "header"; title: string }
  | { type: "theme"; colors: [string, string] };

const sections: SectionEntry[] = themesCategories.flatMap((category) => {
  const categoryThemes = themes.filter(
    (theme) => theme.category === category.value,
  );

  if (categoryThemes.length === 0) {
    return [];
  }

  return [
    { type: "header", title: category.title } as const,
    ...categoryThemes.map(
      (theme) =>
        ({ type: "theme", colors: theme.colors as [string, string] }) as const,
    ),
  ];
});

const categoryHeaderIndex: Record<string, number> = {};
const categoryByIndex: string[] = [];

{
  let currentCategory = "";

  sections.forEach((entry, index) => {
    if (entry.type === "header") {
      const category = themesCategories.find((c) => c.title === entry.title);
      currentCategory = category?.value ?? currentCategory;
      categoryHeaderIndex[currentCategory] = index;
    }

    categoryByIndex[index] = currentCategory;
  });
}

export default function Share() {
  const { bottom } = useSafeAreaInsets();
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
            tintColor={isActive ? "#291C1A" : undefined}
            className="h-10 rounded-full justify-center px-5 border-continuous"
          >
            <Text
              className={`text-center font-noto-serif font-bold text-md ${
                isActive ? "text-white" : "text-[#291C1A]"
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
    <View className="flex-1 bg-[#FAF3EF]">
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
            colors={["#FAF3EF", "#FAF3EF00"]}
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
                <Text className="font-noto-serif font-bold text-[#291C1A] text-lg px-2 pb-2 pt-4">
                  {item.title}
                </Text>
              );
            }

            return (
              <View className="border-[#F07E56] rounded-[18px] border-continuous m-1 p-1">
                <LinearGradient
                  className="items-center justify-center h-48 border border-[#291C1A] border-continuous rounded-xl"
                  colors={item.colors}
                  start={{ x: 0, y: 0 }}
                  end={{ x: 1, y: 1 }}
                >
                  <GlassView
                    isInteractive={false}
                    glassEffectStyle="regular"
                    className="items-center w-[80%] h-[65%] rounded-lg justify-center px-2 border-continuous"
                  >
                    <Text className="text-center font-noto-serif font-bold text-[#291C1A] text-md leading-[40px]">
                      MindSelf
                    </Text>
                  </GlassView>
                </LinearGradient>
              </View>
            );
          }}
        />
      </View>
    </View>
  );
}
