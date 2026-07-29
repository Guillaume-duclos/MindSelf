import { GlassView } from "expo-glass-effect";
import { LinearGradient } from "expo-linear-gradient";
import { Text } from "react-native";

type Props = {
  className?: string;
};

export function AppIcon({ className }: Props) {
  return (
    <GlassView
      className={`w-40 h-40 rounded-[36px] border-continuous overflow-hidden ${className}`}
    >
      <LinearGradient
        colors={["#FFF4F2", "#EFD5C9"]}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        className="w-full h-full items-center justify-center"
      >
        <Text className="font-noto-serif font-semibold text-2xl">MindSelf</Text>
      </LinearGradient>
    </GlassView>
  );
}
