import { Children, Fragment, ReactNode } from "react";
import { Text, View } from "react-native";

type Props = {
  title?: string;
  children: ReactNode;
};

export function ListItemContainer({ title, children }: Props) {
  const items = Children.toArray(children);

  return (
    <View className="gap-3">
      {title && (
        <Text className="px-5 font-noto-serif font-semibold text-xl">
          {title}
        </Text>
      )}

      <View className="w-full px-5 rounded-3xl border-continuous bg-cream-200">
        {items.map((item, index) => (
          <Fragment key={index}>
            {index > 0 && <View className="h-px bg-ink/10" />}
            {item}
          </Fragment>
        ))}
      </View>
    </View>
  );
}
