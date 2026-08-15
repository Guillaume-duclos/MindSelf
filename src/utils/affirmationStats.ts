import { StorageKey } from "@/enums/storageKey.enum";
import { getStorageObject, setStorageObject } from "@/utils/storage";

export type AffirmationStats = {
  seenCount: number;
  lastSeenAt: number;
  liked: boolean;
  sharedCount: number;
};

export type AffirmationStatsMap = Record<string, AffirmationStats>;

const DEFAULT_STATS: AffirmationStats = {
  seenCount: 0,
  lastSeenAt: 0,
  liked: false,
  sharedCount: 0,
};

// Affirmation text is used as the map key (guaranteed unique in
// affirmations.json) instead of introducing a separate id scheme.
const getStatsMap = (): AffirmationStatsMap =>
  getStorageObject<AffirmationStatsMap>(StorageKey.AFFIRMATION_STATS) ?? {};

const saveStatsMap = (statsMap: AffirmationStatsMap): void => {
  setStorageObject(StorageKey.AFFIRMATION_STATS, statsMap);
};

export const getAllAffirmationStats = (): AffirmationStatsMap => getStatsMap();

export const getAffirmationStats = (text: string): AffirmationStats =>
  getStatsMap()[text] ?? DEFAULT_STATS;

export const isAffirmationLiked = (text: string): boolean =>
  getAffirmationStats(text).liked;

export const recordAffirmationSeen = (text: string): void => {
  const statsMap = getStatsMap();
  const stats = statsMap[text] ?? DEFAULT_STATS;

  statsMap[text] = {
    ...stats,
    seenCount: stats.seenCount + 1,
    lastSeenAt: Date.now(),
  };

  saveStatsMap(statsMap);
};

export const toggleAffirmationLike = (text: string): boolean => {
  const statsMap = getStatsMap();
  const stats = statsMap[text] ?? DEFAULT_STATS;
  const liked = !stats.liked;

  statsMap[text] = { ...stats, liked };
  saveStatsMap(statsMap);

  return liked;
};

export const recordAffirmationShared = (text: string): void => {
  const statsMap = getStatsMap();
  const stats = statsMap[text] ?? DEFAULT_STATS;

  statsMap[text] = { ...stats, sharedCount: stats.sharedCount + 1 };
  saveStatsMap(statsMap);
};
