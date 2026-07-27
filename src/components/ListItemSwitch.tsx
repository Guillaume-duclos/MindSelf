import { Icon, IconName, ListItem, Switch, Text } from "@expo/ui";
import { useState } from "react";

type Props = {
  text: string;
  icon?: IconName;
  onValueChange: () => void;
};

export function ListItemSwitch({ text, icon, onValueChange }: Props) {
  const [isActivated, setIsActivated] = useState(false);

  return (
    <ListItem
      leading={icon && <Icon name={icon} color="#2A2015" />}
      trailing={<Switch value={isActivated} onValueChange={setIsActivated} />}
      onPress={onValueChange}
    >
      <Text textStyle={{ color: "#2A2015" }}>{text}</Text>
    </ListItem>
  );
}
