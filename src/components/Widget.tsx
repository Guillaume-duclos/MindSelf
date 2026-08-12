import { Image, Rectangle, Text, VStack, ZStack } from "@expo/ui/swift-ui";
import {
  aspectRatio,
  clipped,
  containerBackground,
  font,
  foregroundStyle,
  multilineTextAlignment,
  padding,
  resizable,
} from "@expo/ui/swift-ui/modifiers";
import { createWidget, type WidgetEnvironment } from "expo-widgets";

type AffirmationWidgetProps = {
  text: string;
  colors: [string, string];
  imageUri?: string;
};

const AffirmationWidget = (
  props: AffirmationWidgetProps,
  environment: WidgetEnvironment,
) => {
  "widget";

  const FONT_SIZE_BY_FAMILY: Partial<Record<string, number>> = {
    systemSmall: 14,
    systemMedium: 16,
    systemLarge: 20,
    systemExtraLarge: 22,
  };

  // Only this function's own source is sent to the widget extension (see
  // FONT_SIZE_BY_FAMILY above) — it can't import "@/constants/colors", so
  // `ink` is kept in sync with that file's value by hand.
  const ink = "#291C1A";

  return (
    <ZStack modifiers={[containerBackground(props.colors[0], "widget")]}>
      {props.imageUri ? (
        <Image
          uiImage={props.imageUri}
          modifiers={[
            resizable(),
            aspectRatio({ contentMode: "fill" }),
            clipped(),
          ]}
        />
      ) : (
        <Rectangle
          modifiers={[
            foregroundStyle({
              type: "linearGradient",
              colors: props.colors,
              startPoint: { x: 0, y: 0 },
              endPoint: { x: 1, y: 1 },
            }),
          ]}
        />
      )}
      <VStack modifiers={[padding({ all: 16 })]}>
        <Text
          modifiers={[
            font({
              weight: "semibold",
              family: "Noto Serif",
              size: FONT_SIZE_BY_FAMILY[environment.widgetFamily] ?? 16,
            }),
            foregroundStyle(ink),
            multilineTextAlignment("center"),
          ]}
        >
          {props.text}
        </Text>
      </VStack>
    </ZStack>
  );
};

export default createWidget("AffirmationWidget", AffirmationWidget);
