import { Page } from "@/enums/page.enum";
import { StorageKey } from "@/enums/storageKey.enum";
import { getStorageString } from "@/utils/storage";
import type { Href } from "expo-router";

const PAGE_ROUTES: Record<Page, Href> = {
  [Page.TERMS_OF_USE]: "/onboarding/termsOfUse",
  [Page.PRIVACY_POLICY]: "/onboarding/privacyPolicy",
  [Page.ONBOARDING_USER_NAME]: "/onboarding/userName",
  [Page.ONBOARDING_USER_NOTIFICATION_TIME_RANGE]:
    "/onboarding/activateNotification",
  [Page.ONBOARDING_USER_AGE_RANGE]: "/onboarding/personnalInformations",
  [Page.ONBOARDING_USER_SEX]: "/onboarding/personnalInformations",
  [Page.ONBOARDING_USER_RELATIONSHIP_STATUS]:
    "/onboarding/personnalInformations",
  [Page.ONBOARDING_USER_PROFESSIONAL_STATUS]:
    "/onboarding/personnalInformations",
  [Page.ONBOARDING_USER_ASTRAL_SIGN]: "/onboarding/personnalInformations",
  [Page.ACTIVATE_SUBSCRIPTION]: "/onboarding/activateSubscription",
  [Page.PAYWALL]: "/paywall",
  [Page.HOME]: "/",
};

// Get the route matching a given onboarding page.
export const getRouteForPage = (page: Page): Href => {
  return PAGE_ROUTES[page];
};

// Where to send the user back into the onboarding flow, based on the last
// page they reached before quitting the app.
export const getOnboardingResumeRoute = (): Href => {
  const currentPage = getStorageString(StorageKey.CURRENT_ONBOARDING_PAGE) as
    Page | undefined;

  if (currentPage && PAGE_ROUTES[currentPage]) {
    return PAGE_ROUTES[currentPage];
  }

  return "/onboarding";
};
