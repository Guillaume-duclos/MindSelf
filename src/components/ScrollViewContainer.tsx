import colors from "@/constants/colors";
import { LinearGradient } from "expo-linear-gradient";
import { ReactNode } from "react";
import { ScrollView, View, ViewStyle } from "react-native";
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from "react-native-reanimated";
import { useSafeAreaInsets } from "react-native-safe-area-context";

type Props = {
  children: ReactNode;
  contentContainerStyle?: ViewStyle;
  contentContainerClassName?: string;
};

export function ScrollViewContainer({
  children,
  contentContainerStyle,
  contentContainerClassName,
}: Props) {
  const { bottom } = useSafeAreaInsets();
  const topFadeOpacity = useSharedValue(0);

  const topFadeStyle = useAnimatedStyle(() => ({
    opacity: topFadeOpacity.value,
  }));

  const handleScroll = (event: {
    nativeEvent: { contentOffset: { y: number } };
  }) => {
    const isScrolled = event.nativeEvent.contentOffset.y > 0;
    topFadeOpacity.value = withTiming(isScrolled ? 1 : 0, { duration: 200 });
  };

  return (
    <View className="flex-1">
      <Animated.View
        className="h-10 absolute top-0 w-full z-10"
        style={topFadeStyle}
        pointerEvents="none"
      >
        <LinearGradient
          className="absolute top-0 left-0 right-0 h-10 z-10"
          colors={[colors.cream[50], `${colors.cream[50]}00`]}
        />
      </Animated.View>

      <ScrollView
        onScroll={handleScroll}
        scrollEventThrottle={32}
        onScrollEndDrag={handleScroll}
        onMomentumScrollEnd={handleScroll}
        contentContainerClassName={`px-5 gap-8 ${contentContainerClassName}`}
        contentContainerStyle={{
          paddingBottom: bottom,
          ...contentContainerStyle,
        }}
      >
        {children}
      </ScrollView>
    </View>
  );
}
