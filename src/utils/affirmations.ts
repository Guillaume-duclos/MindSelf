import affirmationCategories from "@/data/affirmations.json";
import {
  type AffirmationStatsMap,
  getAllAffirmationStats,
} from "@/utils/affirmationStats";

export const affirmations = affirmationCategories.flatMap(
  (category) => category.affirmations,
);

export const pickRandomAffirmationText = (): string => {
  const index = Math.floor(Math.random() * affirmations.length);
  return affirmations[index];
};

const HOUR_IN_MS = 60 * 60 * 1000;

// How long an affirmation takes to fully "recover" its weight after being
// seen — near-zero right after being shown, back to normal after 3 days.
const RECENCY_FULL_RECOVERY_HOURS = 72;
const RECENCY_FLOOR = 0.03;

// Each additional view compounds the penalty, so heavily-seen affirmations
// keep fading relative to fresher ones instead of just resetting.
const FREQUENCY_PENALTY = 0.35;

const LIKE_WEIGHT_MULTIPLIER = 1.8;
const MAX_SHARE_WEIGHT_MULTIPLIER = 1.4;

// A weight, never a hard filter — liked/fresh affirmations surface more
// often, overexposed ones fade, but nothing is ever fully excluded.
const getAffirmationWeight = (
  text: string,
  statsMap: AffirmationStatsMap,
): number => {
  const stats = statsMap[text];

  if (!stats || stats.seenCount === 0) {
    return stats?.liked ? LIKE_WEIGHT_MULTIPLIER : 1;
  }

  const hoursSinceSeen = (Date.now() - stats.lastSeenAt) / HOUR_IN_MS;
  const recencyFactor = Math.max(
    RECENCY_FLOOR,
    Math.min(1, hoursSinceSeen / RECENCY_FULL_RECOVERY_HOURS),
  );
  const frequencyFactor = 1 / (1 + stats.seenCount * FREQUENCY_PENALTY);

  let engagementBoost = 1;

  if (stats.liked) {
    engagementBoost *= LIKE_WEIGHT_MULTIPLIER;
  }

  if (stats.sharedCount > 0) {
    engagementBoost *= Math.min(
      MAX_SHARE_WEIGHT_MULTIPLIER,
      1 + stats.sharedCount * 0.15,
    );
  }

  return recencyFactor * frequencyFactor * engagementBoost;
};

// Weighted random sampling without replacement (roulette-wheel selection):
// each pick removes its candidate and the remaining pool is re-normalized,
// so higher-weight affirmations surface more often without ever being
// guaranteed or permanently excluded. `exclude` is a short-term dedupe for
// the current scroll session, not a "seen" filter — that's handled by the
// recency/frequency weighting itself.
export const pickNextAffirmations = (
  count: number,
  exclude: ReadonlySet<string> = new Set(),
): string[] => {
  const statsMap = getAllAffirmationStats();
  const eligible = affirmations.filter((text) => !exclude.has(text));
  const source = eligible.length > 0 ? eligible : affirmations;

  const pool = source.map((text) => ({
    text,
    weight: getAffirmationWeight(text, statsMap),
  }));

  const picked: string[] = [];
  const pickCount = Math.min(count, pool.length);

  for (let i = 0; i < pickCount; i++) {
    const totalWeight = pool.reduce((sum, candidate) => sum + candidate.weight, 0);
    let random = Math.random() * totalWeight;
    let index = pool.length - 1;

    for (let j = 0; j < pool.length; j++) {
      random -= pool[j].weight;
      if (random <= 0) {
        index = j;
        break;
      }
    }

    picked.push(pool[index].text);
    pool.splice(index, 1);
  }

  return picked;
};
