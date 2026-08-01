import { View } from "react-native";

type Props = {
  value: string;
  onChange: (value: string) => void;
  onIntroAnimatingChange?: (isAnimating: boolean) => void;
};

export function ThemePicker({
  value,
  onChange,
  onIntroAnimatingChange,
}: Props) {
  return <View className="gap-6 flex-1 justify-center"></View>;
}
