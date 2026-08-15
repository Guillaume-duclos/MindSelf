import Widget from "@/components/Widget";
import colors from "@/constants/colors";
import { StorageKey } from "@/enums/storageKey.enum";
import type Theme from "@/types/theme";
import { pickRandomAffirmationText } from "@/utils/affirmations";
import {
  getStorageBoolean,
  getStorageNumber,
  getStorageObject,
} from "@/utils/storage";
import { THEME_WIDGET_IMAGES } from "@/utils/themeImages";
import { Asset } from "expo-asset";
import { File } from "expo-file-system";
import { widgetsDirectory } from "expo-widgets";

const HOURS_IN_DAY = 24;
const DAY_IN_MS = HOURS_IN_DAY * 60 * 60 * 1000;

// Matches the fallback gradient used on the home screen (src/app/index.tsx)
// when the user hasn't picked a theme yet.
const DEFAULT_BACKGROUND_COLORS: [string, string] = [
  colors.cream[100],
  colors.cream[300],
];

const WIDGET_BACKGROUND_IMAGE_FILENAME = "affirmation-widget-background.webp";

type WidgetBackground = {
  colors: [string, string];
  imageUri?: string;
};

// The widget extension is a separate process and can only read files from
// the shared App Group container (expo-widgets' `widgetsDirectory`), not
// the app's own asset bundle — so an image theme has to be copied there
// before the widget can display it.
const copyThemeImageToWidgetsDirectory = async (
  image: string,
): Promise<string | undefined> => {
  const assetModule = THEME_WIDGET_IMAGES[image];

  if (!widgetsDirectory || !assetModule) {
    return undefined;
  }

  try {
    const asset = await Asset.fromModule(assetModule).downloadAsync();

    if (!asset.localUri) {
      return undefined;
    }

    const destination = new File(
      widgetsDirectory,
      WIDGET_BACKGROUND_IMAGE_FILENAME,
    );

    if (destination.exists) {
      destination.delete();
    }

    await new File(asset.localUri).copy(destination);

    return destination.uri;
  } catch {
    return undefined;
  }
};

// The widget runs in a separate process and can't read the app's theme
// storage directly, so we resolve its background here and pass it along
// as timeline props. Animated-gradient themes fall back to their static
// colors, since the widget can't animate.
const getWidgetBackground = async (): Promise<WidgetBackground> => {
  const theme = getStorageObject<Theme>(StorageKey.SELECTED_THEME);

  if (theme && "image" in theme) {
    const imageUri = await copyThemeImageToWidgetsDirectory(theme.image);

    if (imageUri) {
      return { colors: DEFAULT_BACKGROUND_COLORS, imageUri };
    }
  }

  if (theme && "colors" in theme) {
    return { colors: theme.colors };
  }

  return { colors: DEFAULT_BACKGROUND_COLORS };
};

// Schedules `affirmationsPerDay` evenly-spaced entries over the next 24
// hours, so the widget keeps rotating content throughout the day even while
// the app isn't running — WidgetKit switches entries on its own at each
// date. E.g. 24/day changes hourly, 12/day changes every 2 hours.
export const updateAffirmationWidgetTimeline = async (): Promise<void> => {
  const now = new Date();
  const background = await getWidgetBackground();
  const showButtons = getStorageBoolean(StorageKey.WIDGET_DISPLAY_BUTTONS) ?? true;
  const affirmationsPerDay =
    getStorageNumber(StorageKey.WIDGET_AFFIRMATIONS_PER_DAY) ?? HOURS_IN_DAY;
  const intervalMs = DAY_IN_MS / affirmationsPerDay;

  const entries = Array.from({ length: affirmationsPerDay }, (_, i) => ({
    date: new Date(now.getTime() + i * intervalMs),
    props: {
      text: pickRandomAffirmationText(),
      ...background,
      showButtons,
    },
  }));

  Widget.updateTimeline(entries);
};
