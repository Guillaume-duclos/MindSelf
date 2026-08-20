import option from "@/types/option";
import { Pressable, Text, View } from "react-native";

type Props = {
  options: option[];
  selectedValue: string;
  onValueChange: (value: string) => void;
  fixedLabel?: string;
};

export function CustomOptionsSelectPicker({
  options,
  selectedValue,
  onValueChange,
}: Props) {
  return (
    <View className="gap-3 w-full">
      {options.map((item, index) => (
        <Pressable
          key={index}
          onPress={() => onValueChange(item.value)}
          className={`w-full h-16 items-center px-8 rounded-full border-continuous justify-center border-2 ${selectedValue === item.value ? "border-text-900" : "border-text-100"}`}
        >
          <Text
            className={`text-center font-public-sans text-xl text-text-900 ${selectedValue === item.value && "font-semibold"}`}
          >
            {item.label}
          </Text>
        </Pressable>
      ))}
    </View>
  );
}
