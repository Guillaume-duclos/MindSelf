import PaywallContent from "@/components/PaywallContent";
import { ScreenHeader } from "@/components/ScreenHeader";
import { useRouter } from "expo-router";
import { View } from "react-native";

type Props = {
  className?: string;
};

export default function Paywall({ className }: Props) {
  const router = useRouter();

  return (
    <View className="flex-1">
      <ScreenHeader className="p-5" />
      <PaywallContent onPressActivateSubscription={() => router.back()} />
    </View>
  );
}
