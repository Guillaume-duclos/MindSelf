import OS from "@/enums/os.enum";
import { StorageKey } from "@/enums/storageKey.enum";
import { setStorageItem } from "@/utils/storage";
import { Platform } from "react-native";
import Purchases, {
  CustomerInfo,
  LOG_LEVEL,
  PurchasesOffering,
  PurchasesPackage,
} from "react-native-purchases";

// TODO: no Android setup yet (no products, no RevenueCat app, no API key) —
// configuring the SDK with the iOS-only key on Android would crash at
// startup, so purchases stay disabled there until that's set up.
const REVENUECAT_API_KEY_IOS = "appl_oOBElQHuONVyQOdfiPjDHJnvESv";

// Entitlement identifier from the RevenueCat dashboard — grants access
// regardless of which package (monthly/yearly) or state (trial/paid) unlocked it.
export const PREMIUM_ENTITLEMENT_ID = "mindself_affirmations_premium";

export const isPremiumFromCustomerInfo = (
  customerInfo: CustomerInfo,
): boolean =>
  typeof customerInfo.entitlements.active[PREMIUM_ENTITLEMENT_ID] !==
  "undefined";

// Cached in MMKV (reactive via useMMKVBoolean) so screens can gate premium
// content synchronously instead of awaiting getCustomerInfo() everywhere.
const syncPremiumStatus = (customerInfo: CustomerInfo): void => {
  setStorageItem(
    StorageKey.IS_PREMIUM,
    isPremiumFromCustomerInfo(customerInfo),
  );
};

export const configurePurchases = (): void => {
  if (Platform.OS !== OS.IOS) {
    return;
  }

  if (__DEV__) {
    Purchases.setLogLevel(LOG_LEVEL.DEBUG);

    // TODO: remove once the Paid Apps agreement is active in App Store
    // Connect — until then, StoreKit can't fetch our products or customer
    // info at all, and the SDK logs several different ERROR-level messages
    // for that (offerings, customer info, ...), each of which Expo's dev
    // overlay surfaces as a red box. Rather than allowlisting every exact
    // message text (fragile), every SDK log is routed to console.log for
    // now so none of them can trigger a red/yellow box — still visible in
    // the Metro terminal if needed.
    Purchases.setLogHandler((logLevel, message) => {
      console.log(`[Purchases] ${logLevel}: ${message}`);
    });
  }

  Purchases.configure({ apiKey: REVENUECAT_API_KEY_IOS });
  Purchases.addCustomerInfoUpdateListener(syncPremiumStatus);

  Purchases.getCustomerInfo()
    .then(syncPremiumStatus)
    .catch((error) =>
      console.warn("[Purchases] getCustomerInfo failed", error),
    );
};

export const getCurrentOffering =
  async (): Promise<PurchasesOffering | null> => {
    const offerings = await Purchases.getOfferings();
    return offerings.current;
  };

export const purchasePackage = async (
  packageToPurchase: PurchasesPackage,
): Promise<CustomerInfo> => {
  const { customerInfo } = await Purchases.purchasePackage(packageToPurchase);
  syncPremiumStatus(customerInfo);
  return customerInfo;
};

export const restorePurchases = async (): Promise<CustomerInfo> => {
  const customerInfo = await Purchases.restorePurchases();
  syncPremiumStatus(customerInfo);
  return customerInfo;
};
