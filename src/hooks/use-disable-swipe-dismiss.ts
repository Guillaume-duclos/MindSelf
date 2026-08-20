import { useFocusEffect, useNavigation } from "expo-router";
import { useCallback } from "react";

// For a screen that's merely pushed inside a stack presented as a modal
// (see src/app/_layout.tsx's "settings" screen), the native
// swipe-down-to-dismiss gesture belongs to that parent navigator, not to
// the pushed screen itself — pass `targetSelf: true` for a screen that is
// itself the modal (e.g. has its own `presentation: "modal"` option, like
// settings/widgetHelp.tsx) to target its own gesture instead.
//
// Disables the gesture only while the calling screen is focused, restoring
// it on blur/unmount so other screens stay swipe-dismissible as normal.
export function useDisableSwipeDismiss(targetSelf = false): void {
  const navigation = useNavigation();

  useFocusEffect(
    useCallback(() => {
      const target = targetSelf ? navigation : navigation.getParent();
      target?.setOptions({ gestureEnabled: false });

      return () => {
        target?.setOptions({ gestureEnabled: true });
      };
    }, [navigation, targetSelf]),
  );
}
