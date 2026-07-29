import * as Application from "expo-application";
import { Text, View } from "react-native";
import { AppIcon } from "./AppIcon";

export function SettingsFooter() {
  const appVersion = Application.nativeApplicationVersion;
  const buildVersion = Application.nativeBuildVersion;

  return (
    <View className="px-8 mt-8 gap-3 items-center">
      <AppIcon />

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
