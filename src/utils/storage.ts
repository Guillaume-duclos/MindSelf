import { createMMKV } from "react-native-mmkv";
import { StorageKey } from "../enums/storageKey.enum";

// Exported so components can subscribe to changes via MMKV's reactive
// hooks (e.g. useMMKVObject) instead of doing one-shot reads.
export const storage = createMMKV();

// Get string value from storage
export const getStorageString = (key: StorageKey): string | undefined => {
  return key ? storage.getString(key) : undefined;
};

// Get number value from storage
export const getStorageNumber = (key: StorageKey): number | undefined => {
  return key ? storage.getNumber(key) : undefined;
};

// Get boolean value from storage
export const getStorageBoolean = (key: StorageKey): boolean | undefined => {
  return key ? storage.getBoolean(key) : undefined;
};

// Set item value from storage
export const setStorageItem = (
  key: StorageKey,
  value: string | number | boolean,
): void => {
  key && storage.set(key, value);
};

// Set object value from storage
export const setStorageObject = <T>(key: StorageKey, value: T): void => {
  key && storage.set(key, JSON.stringify(value));
};

// Get object value from storage
export const getStorageObject = <T>(key: StorageKey): T | undefined => {
  const value = key ? storage.getString(key) : undefined;
  return value ? (JSON.parse(value) as T) : undefined;
};

// Get if storage value exist
export const isStorageContains = (key: StorageKey): boolean | undefined => {
  return key ? storage.contains(key) : undefined;
};

// Get storage saved key
export const getStorageKeys = (): string[] => {
  return storage.getAllKeys();
};

// Remove storage value
export const removeStorageItem = (key: StorageKey): void => {
  key && storage.remove(key);
};

// Remove all storage values
export const removeAllStorage = (): void => {
  storage.clearAll();
};

// MMKV does not reliably return `undefined` when reading a key with the
// wrong typed getter, so each key's type must be known ahead of time
// instead of guessed at runtime.
const STORAGE_KEY_TYPE: Record<StorageKey, "string" | "number" | "boolean"> = {
  [StorageKey.LANGUAGE]: "string",
  [StorageKey.ASTRAL_SIGN_PAGE_VIEWED]: "boolean",
  [StorageKey.SHOW_SCROLL_DOWN_INDICATOR]: "boolean",
  [StorageKey.CURRENT_ONBOARDING_PAGE]: "string",
  [StorageKey.USER_NAME]: "string",
  [StorageKey.USER_NOTIFICATION_TIME_RANGE]: "string",
  [StorageKey.USER_AGE_RANGE]: "string",
  [StorageKey.USER_SEX]: "string",
  [StorageKey.USER_RELATIONSHIP_STATUS]: "string",
  [StorageKey.USER_PROFESSIONAL_STATUS]: "string",
  [StorageKey.USER_ASTRAL_SIGN]: "string",
  [StorageKey.ACTIVATE_FREE_TRIAL_END_NOTIFICATION]: "boolean",
  [StorageKey.SELECTED_THEME]: "string",
  [StorageKey.AFFIRMATION_STATS]: "string",
  [StorageKey.HAS_SEEN_SECOND_AFFIRMATION]: "boolean",
  [StorageKey.WIDGET_DISPLAY_BUTTONS]: "boolean",
  [StorageKey.WIDGET_AFFIRMATIONS_PER_DAY]: "number",
};

// Get every stored key/value, regardless of its type
export const getAllStorageEntries = (): Record<
  string,
  string | number | boolean | undefined
> => {
  return storage.getAllKeys().reduce(
    (entries, key) => {
      const type = STORAGE_KEY_TYPE[key as StorageKey];

      if (type === "boolean") {
        entries[key] = storage.getBoolean(key);
      } else if (type === "number") {
        entries[key] = storage.getNumber(key);
      } else {
        entries[key] = storage.getString(key);
      }

      return entries;
    },
    {} as Record<string, string | number | boolean | undefined>,
  );
};
