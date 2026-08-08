import affirmations from "@/data/affirmations.json";
import OS from "@/enums/os.enum";
import type NotificationTimeRange from "@/types/notificationTimeRange";
import * as Notifications from "expo-notifications";
import { Platform } from "react-native";

// Must run once, as early as possible (app startup), so the app knows how
// to present a notification that arrives while it's in the foreground.
export const configureNotificationHandler = (): void => {
  Notifications.setNotificationHandler({
    handleNotification: async () => ({
      shouldShowBanner: true,
      shouldShowList: true,
      shouldPlaySound: false,
      shouldSetBadge: false,
    }),
  });
};

// Android requires a channel to exist before a notification can be
// scheduled on it, iOS ignores this entirely.
const ensureAndroidChannel = async (): Promise<void> => {
  if (Platform.OS === OS.IOS) return;

  await Notifications.setNotificationChannelAsync("default", {
    name: "Affirmations",
    importance: Notifications.AndroidImportance.DEFAULT,
  });
};

// Returns whether we're allowed to schedule local notifications, prompting
// the user if permission hasn't been requested yet.
export const requestNotificationPermissions = async (): Promise<boolean> => {
  const { status: existingStatus } = await Notifications.getPermissionsAsync();

  if (existingStatus === Notifications.PermissionStatus.GRANTED) {
    return true;
  }

  const { status } = await Notifications.requestPermissionsAsync();

  return status === Notifications.PermissionStatus.GRANTED;
};

// Schedules a one-off notification a few seconds from now, useful to let
// the user confirm notifications are working end to end.
export const scheduleNotification = async (text: string): Promise<void> => {
  const granted = await requestNotificationPermissions();

  if (!granted) return;

  await ensureAndroidChannel();

  await Notifications.scheduleNotificationAsync({
    content: {
      title: "MindSelf",
      body: text,
    },
    trigger: {
      type: Notifications.SchedulableTriggerInputTypes.TIME_INTERVAL,
      seconds: 3,
    },
  });
};

const MINUTES_IN_DAY = 24 * 60;

// Keeps each pick away from its slot's edges so two adjacent notifications
// can never land closer together than the slot's margins allow.
const SLOT_JITTER_RATIO = 0.7;

type DailyTime = { hour: number; minute: number };

// Splits a `rangeMinutes` long duration into `count` equal slots and picks
// one random minute-offset per slot, so notifications land spread through
// the range instead of clustering together while still varying between
// activations.
const buildStratifiedOffsets = (
  rangeMinutes: number,
  count: number,
): number[] => {
  const slotSize = rangeMinutes / count;
  const jitterSize = slotSize * SLOT_JITTER_RATIO;
  const jitterMargin = (slotSize - jitterSize) / 2;

  return Array.from({ length: count }, (_, i) => {
    const slotStart = i * slotSize;
    return Math.floor(slotStart + jitterMargin + Math.random() * jitterSize);
  });
};

// Splits [startHour, endHour) into `count` equal slots and picks one random
// time per slot, so notifications land spread through the day instead of
// clustering together while still varying from one activation to the next.
const buildStratifiedDailyTimes = (
  startHour: number,
  endHour: number,
  count: number,
): DailyTime[] => {
  const startMinutes = startHour * 60;
  const rangeMinutes =
    ((endHour * 60 - startMinutes + MINUTES_IN_DAY) % MINUTES_IN_DAY) ||
    MINUTES_IN_DAY;

  return buildStratifiedOffsets(rangeMinutes, count).map((offsetMinutes) => {
    const totalMinutes = (startMinutes + offsetMinutes) % MINUTES_IN_DAY;

    return {
      hour: Math.floor(totalMinutes / 60),
      minute: totalMinutes % 60,
    };
  });
};

const pickRandomAffirmationText = (): string => {
  const index = Math.floor(Math.random() * affirmations.length);
  return affirmations[index].text;
};

// A DAILY trigger whose hour/minute has already gone by today only fires
// starting tomorrow, so on the day notifications are turned on, some of the
// `count` reminders can silently be skipped for the rest of today. This
// backfills those with one-off reminders spread across whatever's left of
// today's range, so the selected count is still met on day one.
const scheduleTodayCatchUps = async (
  dailyTimes: DailyTime[],
  startHour: number,
  endHour: number,
): Promise<void> => {
  // Range wraps past midnight (e.g. 22h -> 2h): "what's left of today" is
  // ambiguous here, so skip the catch-up and let the daily triggers settle
  // in naturally from tomorrow.
  if (endHour * 60 <= startHour * 60) return;

  const now = new Date();
  const endOfRangeToday = new Date(now);
  endOfRangeToday.setHours(endHour, 0, 0, 0);

  const remainingMinutes =
    (endOfRangeToday.getTime() - now.getTime()) / (60 * 1000);
  if (remainingMinutes <= 0) return;

  const missedCount = dailyTimes.filter(({ hour, minute }) => {
    const occursAt = new Date(now);
    occursAt.setHours(hour, minute, 0, 0);
    return occursAt <= now;
  }).length;
  if (missedCount === 0) return;

  const offsets = buildStratifiedOffsets(remainingMinutes, missedCount);

  await Promise.all(
    offsets.map((offsetMinutes) =>
      Notifications.scheduleNotificationAsync({
        content: {
          title: "MindSelf",
          body: pickRandomAffirmationText(),
        },
        trigger: {
          type: Notifications.SchedulableTriggerInputTypes.DATE,
          date: new Date(now.getTime() + offsetMinutes * 60 * 1000),
          channelId: "default",
        },
      }),
    ),
  );
};

// Cancels whatever was scheduled before and replaces it with `count` daily
// reminders, spread out between startTime and endTime.
export const scheduleDailyAffirmationNotifications = async (
  timeRange: NotificationTimeRange,
): Promise<void> => {
  const granted = await requestNotificationPermissions();
  if (!granted) return;

  await ensureAndroidChannel();
  await Notifications.cancelAllScheduledNotificationsAsync();

  const startHour = Number(timeRange.startTime);
  const endHour = Number(timeRange.endTime);
  const times = buildStratifiedDailyTimes(
    startHour,
    endHour,
    Number(timeRange.count),
  );

  await Promise.all(
    times.map(({ hour, minute }) =>
      Notifications.scheduleNotificationAsync({
        content: {
          title: "MindSelf",
          body: pickRandomAffirmationText(),
        },
        trigger: {
          type: Notifications.SchedulableTriggerInputTypes.DAILY,
          hour,
          minute,
          channelId: "default",
        },
      }),
    ),
  );

  await scheduleTodayCatchUps(times, startHour, endHour);
};
