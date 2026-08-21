import AnimatedGradientBackground from "@/components/AnimatedGradientBackground";
import colors from "@/constants/colors";
import Category from "@/enums/themeCategory.enum";
import Theme from "@/types/theme";
import { darkenColor } from "@/utils/color";
import { THEME_IMAGES } from "@/utils/themeImages";
import { GlassView } from "expo-glass-effect";
import { Image } from "expo-image";
import { LinearGradient } from "expo-linear-gradient";
import { useRouter } from "expo-router";
import { SymbolView } from "expo-symbols";
import { memo } from "react";
import { Pressable, Text, View } from "react-native";

export type ThemeJsonEntry =
  | { isPremium: string; colors: string[] }
  | { isPremium: string; image: string };

const themeFromJsonEntry = (
  categoryValue: string,
  item: ThemeJsonEntry,
  key: string,
): Theme => {
  const isPremium = item.isPremium === "true";

  if ("image" in item) {
    return { category: Category.IMAGE, image: item.image, isPremium, key };
  }

  const category =
    categoryValue === Category.ANIMATED_GRADIENT
      ? Category.ANIMATED_GRADIENT
      : Category.GRADIENT;

  return {
    category,
    colors: item.colors as [string, string],
    isPremium,
    key,
  };
};

// Themes coming from the picker always carry a `key` (see types/theme.ts),
// so this is the common case — the content-based fallback only matters for
// a Theme value built somewhere that doesn't have one.
const isSameTheme = (a: Theme, b: Theme | undefined): boolean => {
  if (!b) {
    return false;
  }

  if (a.key !== undefined && b.key !== undefined) {
    return a.key === b.key;
  }

  if ("image" in a && "image" in b) {
    return a.image === b.image;
  }

  if ("colors" in a && "colors" in b) {
    return a.colors[0] === b.colors[0] && a.colors[1] === b.colors[1];
  }

  return false;
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

type ThemeCardProps = {
  categoryValue: string;
  item: ThemeJsonEntry;
  itemKey: string;
  cardWidth: number;
  cardHeight: number;
  selectedTheme: Theme | undefined;
  onSelect: (theme: Theme) => void;
  playingItem: ThemeJsonEntry | null;
  onToggleAnimation: (item: ThemeJsonEntry) => void;
};

export const ThemeCard = memo(function ThemeCard({
  categoryValue,
  item,
  itemKey,
  cardWidth,
  cardHeight,
  selectedTheme,
  onSelect,
  playingItem,
  onToggleAnimation,
}: ThemeCardProps) {
  const theme = themeFromJsonEntry(categoryValue, item, itemKey);
  // Only one card animates at a time — mesh gradients are expensive to
  // render, so starting a new one pauses whichever card was playing.
  const isAnimating = playingItem === item;
  const router = useRouter();

  const borderColor =
    selectedTheme && "colors" in selectedTheme
      ? darkenColor(selectedTheme.colors[1], 0.3)
      : colors.text[900];

  const handlePress = () => {
    if (theme.isPremium) {
      router.push("/paywall");
      return;
    }

    onSelect(theme);
  };

  return (
    <Pressable onPress={handlePress}>
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
              <AnimatedGradientBackground
                colors={theme.colors}
                animated={isAnimating}
              />
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
          className="border-[3px] absolute -inset-2.5 rounded-[18px] border-continuous"
          style={{ borderColor }}
        />
      )}

      {theme.isPremium && (
        <View className="absolute items-center flex-row -top-3 -right-2 p-1 pl-1.5 bg-cream-50 border-cream-300 border rounded-full">
          <Text className="font-public-sans text-text-900 text-xs font-semibold">
            Premium
          </Text>
          <SymbolView
            size={13}
            weight="bold"
            name="lock.fill"
            tintColor={colors.text[900]}
          />
        </View>
      )}

      {theme.category === Category.ANIMATED_GRADIENT && (
        <View className="absolute inset-0 w-full h-full items-center justify-center">
          <Pressable
            className="w-12 h-12 rounded-full bg-black/25 items-center justify-center"
            onPress={(event) => {
              event.stopPropagation();
              onToggleAnimation(item);
            }}
          >
            <SymbolView
              size={40}
              name={isAnimating ? "pause.circle" : "play.circle"}
              tintColor={colors.white}
            />
          </Pressable>
        </View>
      )}
    </Pressable>
  );
});
