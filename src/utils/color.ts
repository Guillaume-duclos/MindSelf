export const darkenColor = (hex: string, amount: number): string => {
  const channel = (start: number) =>
    Math.max(
      0,
      Math.round(parseInt(hex.slice(start, start + 2), 16) * (1 - amount)),
    )
      .toString(16)
      .padStart(2, "0");

  return `#${channel(1)}${channel(3)}${channel(5)}`;
};
