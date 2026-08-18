import { StorageKey } from "@/enums/storageKey.enum";
import {
  getStorageNumber,
  getStorageObject,
  getStorageString,
  setStorageItem,
  setStorageObject,
} from "@/utils/storage";

const DAYS_IN_WEEK = 7;

// Index 0 = Monday ... 6 = Sunday, matching the l/m/m/j/v/s/d labels shown
// in ActivitySummary.
export type WeekActivity = boolean[];

const getWeekStartDate = (date: Date): Date => {
  const weekStart = new Date(date);
  const mondayIndexedDay = (date.getDay() + 6) % 7;
  weekStart.setDate(date.getDate() - mondayIndexedDay);
  weekStart.setHours(0, 0, 0, 0);
  return weekStart;
};

const toDateKey = (date: Date): string => date.toISOString().slice(0, 10);

const getTodayDayIndex = (date: Date): number => (date.getDay() + 6) % 7;

// Called once per app launch: marks today as opened for the current week.
// When the stored week doesn't match the current one, it rolls over into a
// fresh week — crediting a completed week first if every day of the
// previous one had been opened.
export const recordAppOpenedToday = (): void => {
  const now = new Date();
  const currentWeekStart = toDateKey(getWeekStartDate(now));
  const storedWeekStart = getStorageString(StorageKey.ACTIVITY_WEEK_START);

  let openedDays =
    getStorageObject<WeekActivity>(StorageKey.ACTIVITY_OPENED_DAYS) ??
    Array<boolean>(DAYS_IN_WEEK).fill(false);

  if (storedWeekStart !== currentWeekStart) {
    if (storedWeekStart && openedDays.every(Boolean)) {
      const completedWeeks =
        getStorageNumber(StorageKey.ACTIVITY_COMPLETED_WEEKS_COUNT) ?? 0;
      setStorageItem(
        StorageKey.ACTIVITY_COMPLETED_WEEKS_COUNT,
        completedWeeks + 1,
      );
    }

    openedDays = Array<boolean>(DAYS_IN_WEEK).fill(false);
    setStorageItem(StorageKey.ACTIVITY_WEEK_START, currentWeekStart);
  }

  openedDays[getTodayDayIndex(now)] = true;
  setStorageObject(StorageKey.ACTIVITY_OPENED_DAYS, openedDays);
};
