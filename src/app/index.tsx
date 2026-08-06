import { AffirmationCard } from "@/components/AffirmationCard";
import AnimatedGradientBackground from "@/components/AnimatedGradientBackground";
import { RoundedButton } from "@/components/RoundedButton";
import affirmations from "@/data/affirmations.json";
import { StorageKey } from "@/enums/storageKey.enum";
import Category from "@/enums/themeCategory.enum";
import Theme from "@/types/theme";
import { getOnboardingResumeRoute } from "@/utils/onboarding";
import { storage } from "@/utils/storage";
import { THEME_IMAGES } from "@/utils/themeImages";
import { FlashList } from "@shopify/flash-list";
import { GlassView } from "expo-glass-effect";
import { Image } from "expo-image";
import { LinearGradient } from "expo-linear-gradient";
import { Link, Redirect } from "expo-router";
import { SymbolView } from "expo-symbols";
import { Pressable, Text, useWindowDimensions, View } from "react-native";
import { useMMKVObject } from "react-native-mmkv";
import { useSafeAreaInsets } from "react-native-safe-area-context";

export default function HomeScreen() {
  const { height } = useWindowDimensions();
  const { top, bottom } = useSafeAreaInsets();
  const [selectedTheme] = useMMKVObject<Theme>(
    StorageKey.SELECTED_THEME,
    storage,
  );

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
          colors={selectedTheme ? selectedTheme.colors : ["#FFF4F2", "#EFD5C9"]}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
        />
      )}

      <View
        className="absolute flex-1 flex-row items-center justify-between px-5 z-10"
        style={{ top }}
      >
        <View className="flex-1">
          <Text className="text-[#BA6A56] font-medium font-public-sans uppercase">
            Bon matin
          </Text>
          <Text className="text-[#291C1A] font-medium font-noto-serif text-3xl">
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
              <Text className="text-center font-noto-serif font-bold text-[#291C1A] text-lg leading-[40px]">
                Get Premium
              </Text>
              <SymbolView
                name={{ ios: "crown" }}
                weight="medium"
                tintColor="#291C1A"
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
        data={affirmations}
        showsVerticalScrollIndicator={false}
        keyExtractor={(item, index) => `${index}-${item.text}`}
        renderItem={({ item }) => (
          <View className="items-center justify-center px-6" style={{ height }}>
            <AffirmationCard text={item.text} />
          </View>
        )}
      />
    </View>
  );
}
