import * as Application from "expo-application";
import { GlassView } from "expo-glass-effect";
import { LinearGradient } from "expo-linear-gradient";
import { Text, View } from "react-native";

export function SettingsFooter() {
  const appVersion = Application.nativeApplicationVersion;
  const buildVersion = Application.nativeBuildVersion;

  return (
    <View className="px-10 gap-3 items-center">
      <GlassView className="w-20 h-20 rounded-2xl border-continuous overflow-hidden">
        <LinearGradient
          colors={["#FFF4F2", "#EFD5C9"]}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          className="w-full h-full items-center justify-center"
        >
          <Text className="font-noto-serif font-semibold text-sm">
            MindSelf
          </Text>
        </LinearGradient>
      </GlassView>

      <View className="flex-row flex-wrap justify-center gap-2">
        <Text className="font-public-sans font-medium text-sm text-slate-800">
          Author : Guillaume Duclos
        </Text>
        <Text className="font-public-sans font-medium text-sm text-slate-800">
          -
        </Text>
        <Text className="font-public-sans font-medium text-sm text-slate-800">
          Version : {appVersion}
        </Text>
        <Text className="font-public-sans font-medium text-sm text-slate-800">
          -
        </Text>
        <Text className="font-public-sans font-medium text-sm text-slate-800">
          Build : {buildVersion}
        </Text>
      </View>
    </View>
  );
}
