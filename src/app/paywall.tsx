import PaywallContent from "@/components/PaywallContent";
import { ScreenHeader } from "@/components/ScreenHeader";
import { View } from "react-native";

type Props = {
  className?: string;
};

export default function Paywall({ className }: Props) {
  return (
    <View className="flex-1">
      <ScreenHeader className="p-5" />
      <PaywallContent />
    </View>
  );
}
