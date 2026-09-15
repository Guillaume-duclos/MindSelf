import { Children, Fragment, ReactNode } from "react";
import { Text, View } from "react-native";

type Props = {
  title?: string;
  children: ReactNode;
  className?: string;
};

export function ListItemContainer({ title, children, className }: Props) {
  const items = Children.toArray(children);

  return (
    <View className={`gap-3 shadow-sm shadow-secondary-950/10 ${className}`}>
      {title && (
        <Text className="px-5 font-noto-serif font-semibold text-xl text-text-900">
          {title}
        </Text>
      )}

      <View className="w-full rounded-3xl border-continuous bg-secondary-50 overflow-hidden">
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
