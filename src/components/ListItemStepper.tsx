import { Host } from "@expo/ui";
import { Stepper } from "@expo/ui/swift-ui";
import { Text, View } from "react-native";

type Props = {
  text: string;
  value: number;
  minValue?: number;
  maxValue?: number;
  onValueChange: (value: number) => void;
};

export function ListItemStepper({
  text,
  value,
  minValue = 1,
  maxValue = 24,
  onValueChange,
}: Props) {
  return (
    <View className="flex-row items-center justify-between py-4 px-5 rounded-4xl border-continuous gap-5">
      <Text className="flex-1 font-public-sans text-lg leading-6 text-text-900">{text}</Text>

      <View className="flex-row items-center gap-3">
        <Text className="font-public-sans font-semibold text-lg text-text-900">{value}</Text>

        <Host matchContents>
          <Stepper
            label=""
            value={value}
            min={minValue}
            max={maxValue}
            onValueChange={onValueChange}
          />
        </Host>
      </View>
    </View>
  );
}
