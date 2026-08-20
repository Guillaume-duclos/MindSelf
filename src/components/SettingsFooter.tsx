import AppIcon from "@/assets/svg/AppIcon";
import * as Application from "expo-application";
import { Text, View } from "react-native";

export function SettingsFooter() {
  const appVersion = Application.nativeApplicationVersion;
  const buildVersion = Application.nativeBuildVersion;

  return (
    <View className="px-8 mt-10 gap-3 items-center">
      <AppIcon style={{ width: 70, height: 70 }} />

      <View className="flex-wrap">
        <Text className="font-public-sans font-medium text-sm text-slate-800 text-center">
          Version : {appVersion}
        </Text>
        <Text className="font-public-sans font-medium text-sm text-slate-800 text-center">
          Build : {buildVersion}
        </Text>
      </View>
    </View>
  );
}
