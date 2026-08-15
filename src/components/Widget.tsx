import {
  Button,
  HStack,
  Image,
  Link,
  Rectangle,
  Spacer,
  Text,
  VStack,
  ZStack,
} from "@expo/ui/swift-ui";
import {
  aspectRatio,
  buttonStyle,
  clipped,
  containerBackground,
  containerRelativeFrame,
  font,
  foregroundStyle,
  multilineTextAlignment,
  offset,
  padding,
  resizable,
} from "@expo/ui/swift-ui/modifiers";
import { createWidget, type WidgetEnvironment } from "expo-widgets";

type AffirmationWidgetProps = {
  text: string;
  colors: [string, string];
  imageUri?: string;
  liked?: boolean;
  showButtons?: boolean;
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

  // Less bottom padding pulls the buttons closer to the bottom edge — the
  // small widget is short enough that the default padding left them
  // sitting noticeably higher than on the other sizes.
  const BUTTONS_BOTTOM_PADDING_BY_FAMILY: Partial<Record<string, number>> = {
    systemSmall: 8,
    systemMedium: 14,
    systemLarge: 14,
    systemExtraLarge: 14,
  };

  // Only this function's own source is sent to the widget extension (see
  // FONT_SIZE_BY_FAMILY above) — it can't import "@/constants/colors", so
  // these are kept in sync with that file's values by hand.
  const ink = "#291C1A";
  const terracotta = "#F7A07C";

  return (
    <ZStack modifiers={[containerBackground(props.colors[0], "widget")]}>
      {props.imageUri ? (
        <Image
          uiImage={props.imageUri}
          modifiers={[
            resizable(),
            containerRelativeFrame({ axes: "both" }),
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

      {(props.showButtons ?? true) && (
        <VStack>
          <Spacer />
          <HStack
            spacing={20}
            modifiers={[
              padding({
                top: 14,
                horizontal: 14,
                bottom:
                  BUTTONS_BOTTOM_PADDING_BY_FAMILY[environment.widgetFamily] ??
                  14,
              }),
            ]}
          >
            <Spacer />

            {/* WidgetKit only allows a single global widgetURL for the whole
            widget, so a Link (not the widgetURL modifier) is what gives this
            icon its own independent tap target that opens the share screen —
            everywhere else on the widget keeps its default "just open the
            app" behavior. */}
            <Link
              destination={`mindself:///share?text=${encodeURIComponent(props.text)}`}
            >
              <Image
                systemName="square.and.arrow.up"
                modifiers={[
                  font({ size: 22, weight: "medium" }),
                  foregroundStyle(terracotta),
                  offset({ y: -1.5 }),
                ]}
              />
            </Link>

            {/* Interactive widget buttons (iOS 17+ AppIntent) run in the
            background: no navigation or share sheet, only a state change.
            The returned object is merged into this entry's props and
            re-rendered. */}
            <Button
              onPress={() => ({ liked: !props.liked })}
              modifiers={[buttonStyle("plain")]}
            >
              <Image
                systemName={props.liked ? "heart.fill" : "heart"}
                modifiers={[
                  font({ size: 22, weight: "medium" }),
                  foregroundStyle(terracotta),
                ]}
              />
            </Button>
          </HStack>
        </VStack>
      )}
    </ZStack>
  );
};

export default createWidget("AffirmationWidget", AffirmationWidget);
