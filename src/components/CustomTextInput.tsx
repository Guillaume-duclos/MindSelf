import { TextInput, View } from "react-native";

type Props = {
  placeHolder: string;
  value?: string;
  onChangeText?: (text: string) => void;
};

export function CustomTextInput({ placeHolder, value, onChangeText }: Props) {
  return (
    <View className="w-full h-16 items-center px-8 rounded-full border-continuous justify-center border-2">
      <TextInput
        value={value}
        placeholder={placeHolder}
        onChangeText={onChangeText}
        placeholderTextColor="#00000088"
        className="w-full h-full text-xl leading-[21px]"
      />
    </View>
  );
}
