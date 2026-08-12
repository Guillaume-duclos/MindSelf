import affirmations from "@/data/affirmations.json";

export const pickRandomAffirmationText = (): string => {
  const index = Math.floor(Math.random() * affirmations.length);
  return affirmations[index].text;
};
