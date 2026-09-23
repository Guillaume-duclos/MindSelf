import { StorageKey } from "@/enums/storageKey.enum";
import { scheduleNotification } from "@/utils/notifications";
import {
  getAllStorageEntries,
  removeAllStorage,
  setStorageItem,
} from "@/utils/storage";
import { updateAffirmationWidgetTimeline } from "@/utils/widget";
import { registerDevMenuItems } from "expo-dev-menu";

export const registerDevMenu = (): void => {
  if (!__DEV__) {
    return;
  }

  registerDevMenuItems([
    {
      name: "Vider le storage",
      callback: () => removeAllStorage(),
    },
    {
      name: "Logger le storage",
      callback: () => console.log("[Storage]", getAllStorageEntries()),
    },
    {
      name: "Tester une notification",
      callback: () =>
        scheduleNotification("Tout ce que j'entreprend est formidable"),
    },
    {
      name: "Rafraîchir le widget",
      callback: () => updateAffirmationWidgetTimeline(),
    },
    {
      name: "Rejouer les animations d'accueil",
      callback: () =>
        setStorageItem(StorageKey.HAS_SEEN_SECOND_AFFIRMATION, false),
    },
    {
      name: "Réinitialiser l'objectif journalier",
      callback: () => {
        setStorageItem(StorageKey.DAILY_LIKE_COUNT, 0);
        setStorageItem(StorageKey.DAILY_LIKE_DATE, "");
      },
    },
  ]);
};
