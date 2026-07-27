import { Icon, IconName, ListItem, Text } from "@expo/ui";

type Props = {
  text: string;
  icon?: IconName;
  onPress: () => void;
};

export function ListItemLink({ text, icon, onPress }: Props) {
  return (
    <ListItem
      leading={icon && <Icon name={icon} color="#2A2015" />}
      trailing={<Icon name="chevron.right" size={14} color="#2A2015" />}
      onPress={onPress}
    >
      <Text textStyle={{ color: "#2A2015" }}>{text}</Text>
    </ListItem>
  );
}
