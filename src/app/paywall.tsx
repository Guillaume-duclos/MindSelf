import PaywallContent from "@/components/PaywallContent";
import { ScreenHeader } from "@/components/ScreenHeader";
import { useRouter } from "expo-router";
import { View } from "react-native";

export default function Paywall() {
  const router = useRouter();

  return (
    <View className="flex-1">
      <ScreenHeader className="p-5" />
      <PaywallContent onPressActivateSubscription={() => router.back()} />
    </View>
  );
}
