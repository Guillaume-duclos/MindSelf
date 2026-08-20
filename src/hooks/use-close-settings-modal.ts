import { useNavigation } from "expo-router";

// `router.dismissAll()` dispatches POP_TO_TOP on the closest navigator, which
// for any screen inside settings/_layout.tsx is the nested settings Stack —
// not the root Stack that presents "settings" as a modal — so it only pops
// back to settings/index instead of closing the whole modal. Popping the
// "settings" screen off the ROOT stack (its parent navigator) removes the
// nested stack along with it, closing the modal in one step regardless of
// how deep the current screen is nested inside it.
export function useCloseSettingsModal(): () => void {
  const navigation = useNavigation();

  return () => {
    navigation.getParent()?.goBack();
  };
}
