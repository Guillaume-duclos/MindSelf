import { ReactNode } from "react";
import { View } from "react-native";

type Props = {
  children: ReactNode;
};

export function OnboardingContentContainer({ children }: Props) {
  return <View className="flex-1 w-full px-5">{children}</View>;
}
