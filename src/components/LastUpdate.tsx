import { Text } from "react-native";

type Props = {
  date: string;
};

export function LastUpdate({ date }: Props) {
  return (
    <Text className="font-noto-serif text-lg text-text-900">
      Dernière mise à jour : {date}
    </Text>
  );
}
