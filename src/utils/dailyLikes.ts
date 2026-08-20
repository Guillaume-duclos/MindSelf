import { StorageKey } from "@/enums/storageKey.enum";
import {
  getStorageNumber,
  getStorageString,
  setStorageItem,
} from "@/utils/storage";

const toDateKey = (date: Date): string => date.toISOString().slice(0, 10);

// Called once per app launch: if the stored count is from a previous day,
// it's stale — clear it so today starts back at 0 even if the user hasn't
// liked anything yet today.
export const resetDailyLikesIfNewDay = (): void => {
  const today = toDateKey(new Date());

  if (getStorageString(StorageKey.DAILY_LIKE_DATE) !== today) {
    setStorageItem(StorageKey.DAILY_LIKE_DATE, today);
    setStorageItem(StorageKey.DAILY_LIKE_COUNT, 0);
  }
};

// Called on every new like (not on unlike). Rolls over into today's count
// first if the stored day is stale, so this also self-heals if the app
// stayed open across midnight without a launch-time reset.
export const recordAffirmationLiked = (): void => {
  const today = toDateKey(new Date());
  const isNewDay = getStorageString(StorageKey.DAILY_LIKE_DATE) !== today;
  const count = isNewDay ? 0 : (getStorageNumber(StorageKey.DAILY_LIKE_COUNT) ?? 0);

  setStorageItem(StorageKey.DAILY_LIKE_DATE, today);
  setStorageItem(StorageKey.DAILY_LIKE_COUNT, count + 1);
};
