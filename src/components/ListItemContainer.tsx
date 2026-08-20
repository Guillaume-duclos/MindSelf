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
        <Text className="px-5 font-noto-serif font-semibold text-xl text-text-900">
          {title}
        </Text>
      )}

      {/* No horizontal padding here — each row owns its own (px-5), so its
      pressed-state background can span the full card width edge to edge
      instead of stopping short at a padding gap. overflow-hidden clips
      that full-bleed background to the card's rounded corners. */}
      <View className="w-full rounded-3xl border-continuous bg-cream-200 overflow-hidden">
        {items.map((item, index) => (
          <Fragment key={index}>
            {index > 0 && <View className="h-px mx-5 bg-text-900/10" />}
            {item}
          </Fragment>
        ))}
      </View>
    </View>
  );
}
