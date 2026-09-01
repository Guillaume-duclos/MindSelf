import affirmationCategories from "@/data/affirmations.json";
import { StorageKey } from "@/enums/storageKey.enum";
import { getStorageObject, setStorageObject } from "@/utils/storage";

export const ALL_CATEGORY_NAMES = affirmationCategories.map(
  (category) => category.category,
);

// Stores the disabled ones (not the enabled ones) so that a category added
// to affirmations.json later is enabled by default without needing any
// migration of existing users' storage.
export const getDisabledCategories = (): string[] =>
  getStorageObject<string[]>(StorageKey.DISABLED_AFFIRMATION_CATEGORIES) ??
  [];

export const isCategoryEnabled = (category: string): boolean =>
  !getDisabledCategories().includes(category);

// Never lets the last enabled category be turned off — an empty pool would
// break every affirmation-picking surface (home feed, notifications,
// widgets), which all read from the same category list. Returns false when
// the toggle was refused for that reason, so the caller can tell the user.
export const toggleCategory = (category: string): boolean => {
  const disabled = getDisabledCategories();
  const isCurrentlyEnabled = !disabled.includes(category);

  if (isCurrentlyEnabled) {
    const enabledCount = ALL_CATEGORY_NAMES.length - disabled.length;

    if (enabledCount <= 1) {
      return false;
    }

    setStorageObject(StorageKey.DISABLED_AFFIRMATION_CATEGORIES, [
      ...disabled,
      category,
    ]);
  } else {
    setStorageObject(
      StorageKey.DISABLED_AFFIRMATION_CATEGORIES,
      disabled.filter((disabledCategory) => disabledCategory !== category),
    );
  }

  return true;
};
