import { View } from "react-native";

type Props = {
  value: string;
  onChange: (value: string) => void;
};

export function CategoryPicker({ value, onChange }: Props) {
  return <View className="gap-6 flex-1 justify-center"></View>;
}
