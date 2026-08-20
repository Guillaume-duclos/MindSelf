import PaywallContent from "@/components/PaywallContent";
import { Page } from "@/enums/page.enum";
import { StorageKey } from "@/enums/storageKey.enum";
import { getRouteForPage } from "@/utils/onboarding";
import { setStorageItem } from "@/utils/storage";
import { useRouter } from "expo-router";
import { useSafeAreaInsets } from "react-native-safe-area-context";

export default function activateSubscription() {
  const router = useRouter();
  const { top } = useSafeAreaInsets();

  const onPressActivateSubscription = (): void => {
    setStorageItem(StorageKey.CURRENT_ONBOARDING_PAGE, Page.HOME);
    router.push(getRouteForPage(Page.HOME));
  };

  return (
    <PaywallContent
      style={{ paddingTop: top }}
      contentClassName="justify-center"
      onPressActivateSubscription={onPressActivateSubscription}
    />
  );
}
