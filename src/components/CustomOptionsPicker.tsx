import option from "@/types/option";
import { Host, Picker } from "@expo/ui";
import { PlatformColor, Text, View } from "react-native";

type Props = {
  options: option[];
  selectedValue: string;
  onValueChange: (value: string) => void;
  fixedLabel?: string;
};

export function CustomOptionsPicker({
  options,
  selectedValue,
  onValueChange,
  fixedLabel,
}: Props) {
  return (
    <View className="w-full">
      <Host className="w-full" matchContents={{ vertical: true }}>
        <Picker
          appearance="wheel"
          selectedValue={selectedValue}
          onValueChange={onValueChange}
        >
          {options.map((item: option, index: number) => (
            <Picker.Item key={index} label={item.label} value={item.value} />
          ))}
        </Picker>
      </Host>

      {fixedLabel && (
        <View
          pointerEvents="none"
          className="absolute right-8 inset-y-0 justify-center"
        >
          <Text
            className="text-[18px]"
            style={{ color: PlatformColor("label") }}
          >
            {fixedLabel}
          </Text>
        </View>
      )}
    </View>
  );
}
