import { FieldGroup, Text } from "@expo/ui";
import { createModifier } from "@expo/ui/swift-ui/modifiers";
import { JSX } from "react/jsx-runtime";

type Props = {
  title: string;
  children?: JSX.Element;
};

export function FieldGroupSection({ title, children }: Props) {
  return (
    <FieldGroup.Section
      modifiers={[createModifier("listRowBackground", { color: "#F7E6DF" })]}
    >
      <FieldGroup.SectionHeader>
        <Text textStyle={{ fontFamily: "Noto Serif" }}>{title}</Text>
      </FieldGroup.SectionHeader>

      {children}
    </FieldGroup.Section>
  );
}
