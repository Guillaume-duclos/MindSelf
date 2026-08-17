import Widget from "@/components/Widget";
import colors from "@/constants/colors";
import { StorageKey } from "@/enums/storageKey.enum";
import type Theme from "@/types/theme";
import { recordAffirmationSeen } from "@/utils/affirmationStats";
import { pickNextAffirmations } from "@/utils/affirmations";
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

// Builds and pushes `affirmationsPerDay` evenly-spaced entries over the next
// 24 hours, so the widget keeps rotating content throughout the day even
// while the app isn't running — WidgetKit switches entries on its own at
// each date. E.g. 24/day changes hourly, 12/day changes every 2 hours.
// `pinnedText`, when given, takes the very next (immediate) slot instead of
// a weighted pick, while every later slot still follows the normal rotation.
const pushAffirmationTimeline = async (
  affirmationsPerDay: number,
  pinnedText?: string,
): Promise<void> => {
  const now = new Date();
  const background = await getWidgetBackground();
  const showButtons = getStorageBoolean(StorageKey.WIDGET_DISPLAY_BUTTONS) ?? true;
  const intervalMs = DAY_IN_MS / affirmationsPerDay;

  // Picked with the same freshness/like/share weighting as the home feed's
  // pickNextAffirmations, so the widget's rotation stays in sync with what
  // the app already knows about instead of scoring independently — and
  // "without replacement" also means no accidental repeat within one day.
  const pickCount = pinnedText ? affirmationsPerDay - 1 : affirmationsPerDay;
  const picked = pickNextAffirmations(
    pickCount,
    pinnedText ? new Set([pinnedText]) : undefined,
  );
  const texts = pinnedText ? [pinnedText, ...picked] : picked;

  // The widget runs in an isolated extension process with no access to app
  // storage, so it can't record its own "seen" events — this call, made
  // from the app process at generation time, is the closest proxy: these
  // affirmations are about to be shown over the next 24h.
  texts.forEach(recordAffirmationSeen);

  const entries = texts.map((text, i) => ({
    date: new Date(now.getTime() + i * intervalMs),
    props: {
      text,
      ...background,
      showButtons,
    },
  }));

  Widget.updateTimeline(entries);
};

const getAffirmationsPerDay = (): number =>
  getStorageNumber(StorageKey.WIDGET_AFFIRMATIONS_PER_DAY) ?? HOURS_IN_DAY;

export const updateAffirmationWidgetTimeline = async (): Promise<void> => {
  await pushAffirmationTimeline(getAffirmationsPerDay());
};

// Puts `text` on the widget right away (replacing whatever is currently
// shown), then lets the rest of the day's rotation continue as configured
// in the widget settings instead of freezing on this one affirmation.
export const pinAffirmationToWidget = async (text: string): Promise<void> => {
  await pushAffirmationTimeline(getAffirmationsPerDay(), text);
};
