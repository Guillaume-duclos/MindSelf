import { useRef, useState } from "react";

const LONG_PRESS_DELAY = 500;

// Purely visual "is this being long-pressed" tracking, decoupled from
// Pressable's own `onLongPress` — that prop suppresses `onPress` on release
// once a long press is recognized, which broke navigation/toggling on these
// rows. A manual timer keeps the darken-on-hold effect without touching
// press/release semantics at all.
export function useLongPressStyle() {
  const [isLongPressed, setIsLongPressed] = useState(false);
  const timeoutRef = useRef<ReturnType<typeof setTimeout>>(undefined);

  const onPressIn = () => {
    timeoutRef.current = setTimeout(
      () => setIsLongPressed(true),
      LONG_PRESS_DELAY,
    );
  };

  const onPressOut = () => {
    clearTimeout(timeoutRef.current);
    setIsLongPressed(false);
  };

  return { isLongPressed, onPressIn, onPressOut };
}
