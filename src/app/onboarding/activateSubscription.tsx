import Paywall from "@/components/paywall";
import { Page } from "@/enums/page.enum";
import { getRouteForPage } from "@/utils/onboarding";
import { useRouter } from "expo-router";

export default function activateSubscription() {
  const router = useRouter();

  const onPressTermsOfUse = (): void => {
    router.push(getRouteForPage(Page.TERMS_OF_USE));
  };

  const onPressPravicyPolicy = (): void => {
    router.push(getRouteForPage(Page.PRIVACY_POLICY));
  };

  return (
    <Paywall
      onPressTermsOfUse={onPressTermsOfUse}
      onPressPravicyPolicy={onPressPravicyPolicy}
    />
  );
}
