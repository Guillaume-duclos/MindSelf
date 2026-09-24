import PaywallContent from "@/components/PaywallContent";
import { RestorePurchasesButton } from "@/components/RestorePurchasesButton";
import { ScreenHeader } from "@/components/ScreenHeader";
import { useRouter } from "expo-router";
import { View } from "react-native";

export default function Paywall() {
  const router = useRouter();

  return (
    <View className="flex-1">
      <ScreenHeader className="px-5 pt-5">
        <RestorePurchasesButton />
      </ScreenHeader>
      <PaywallContent onPressActivateSubscription={() => router.back()} />
    </View>
  );
}
