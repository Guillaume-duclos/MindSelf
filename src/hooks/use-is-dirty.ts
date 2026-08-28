import { useCallback, useState } from "react";

// Once a change is made this stays dirty for the rest of the screen's
// lifetime — markDirty never resets to false, even if a field is edited
// back to its original value, so a save button gated on this won't go back
// to disabled after the user has already touched something.
export function useIsDirty(): [boolean, () => void] {
  const [isDirty, setIsDirty] = useState(false);
  const markDirty = useCallback(() => setIsDirty(true), []);

  return [isDirty, markDirty];
}
