import { BottomInset } from "@/constants/theme";
import { ReactNode } from "react";
import { View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

type Props = {
  children: ReactNode;
  className?: string;
};

export function SafeAreaViewContainer({ children, className }: Props) {
  const insets = useSafeAreaInsets();

  return (
    <View
      className={className}
      style={{
        paddingTop: insets.top,
        paddingBottom: insets.bottom || BottomInset,
      }}
    >
      {children}
    </View>
  );
}
