import PaywallContent from "@/components/PaywallContent";
import { ScreenHeader } from "@/components/ScreenHeader";
import { Page } from "@/enums/page.enum";
import { StorageKey } from "@/enums/storageKey.enum";
import { getRouteForPage } from "@/utils/onboarding";
import { setStorageItem } from "@/utils/storage";
import { useRouter } from "expo-router";
import { View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

export default function activateSubscription() {
  const router = useRouter();
  const insets = useSafeAreaInsets();

  const onPressActivateSubscription = (): void => {
    setStorageItem(StorageKey.CURRENT_ONBOARDING_PAGE, Page.HOME);
    router.push(getRouteForPage(Page.HOME));
  };

  const navigateToHomeScreen = (): void => {
    setStorageItem(StorageKey.CURRENT_ONBOARDING_PAGE, Page.HOME);
    router.push(getRouteForPage(Page.HOME));
  };

  return (
    <View className="flex-1" style={{ paddingTop: insets.top }}>
      <ScreenHeader
        showSkipButton
        className="px-5 py-0"
        showCloseButton={false}
        onSkip={navigateToHomeScreen}
      />
      <PaywallContent
        contentClassName="justify-center"
        onPressActivateSubscription={onPressActivateSubscription}
      />
    </View>
  );
}
