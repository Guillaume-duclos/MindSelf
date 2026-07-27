import { ScreenHeader } from "@/components/ScreenHeader";
import { View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

export default function Account() {
  const { bottom } = useSafeAreaInsets();

  return (
    <View
      className="flex-1 bg-[#FAF3EF] px-5"
      style={{ paddingBottom: bottom }}
    >
      <ScreenHeader title="Widget" showBackButton showCloseButton={false} />
    </View>
  );
}
