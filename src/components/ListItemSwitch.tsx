import { Host, Switch } from "@expo/ui";
import { Text, View } from "react-native";

type Props = {
  text: string;
  value: boolean;
  onValueChange: (value: boolean) => void;
};

export function ListItemSwitch({ text, value, onValueChange }: Props) {
  return (
    <View className="flex-row items-center justify-between py-4 px-5 rounded-4xl border-continuous gap-5">
      <Text className="flex-1 font-public-sans text-lg leading-6">{text}</Text>
      <Host matchContents>
        <Switch value={value} onValueChange={onValueChange} />
      </Host>
    </View>
  );
}
