import colors from "@/constants/colors";
import { Page } from "@/enums/page.enum";
import { StorageKey } from "@/enums/storageKey.enum";
import { getRouteForPage } from "@/utils/onboarding";
import {
  getCurrentOffering,
  isPremiumFromCustomerInfo,
  purchasePackage,
  restorePurchases,
} from "@/utils/purchases";
import { getStorageBoolean, setStorageItem } from "@/utils/storage";
import { Host, Switch } from "@expo/ui";
import { Divider } from "@expo/ui/swift-ui";
import { background, opacity } from "@expo/ui/swift-ui/modifiers";
import { GlassView } from "expo-glass-effect";
import { LinearGradient } from "expo-linear-gradient";
import { useRouter } from "expo-router";
import { SFSymbol, SymbolView } from "expo-symbols";
import { useEffect, useState } from "react";
import {
  ActivityIndicator,
  Alert,
  Pressable,
  Text,
  View,
  ViewStyle,
} from "react-native";
import {
  PACKAGE_TYPE,
  PURCHASES_ERROR_CODE,
  PurchasesOffering,
  PurchasesPackage,
} from "react-native-purchases";
import { useSafeAreaInsets } from "react-native-safe-area-context";

type Props = {
  style?: ViewStyle;
  className?: string;
  contentClassName?: string;
  onPressActivateSubscription?: () => void;
};

const getDateInDays = (daysFromNow: number): Date => {
  const date = new Date();
  date.setDate(date.getDate() + daysFromNow);
  return date;
};

const formatLongDate = (date: Date): string =>
  new Intl.DateTimeFormat("fr-FR", { day: "numeric", month: "long" }).format(
    date,
  );

const formatShortMonth = (date: Date): string =>
  new Intl.DateTimeFormat("fr-FR", { month: "short" }).format(date);

const getPackagePeriodLabel = (packageType: PACKAGE_TYPE): string => {
  switch (packageType) {
    case PACKAGE_TYPE.ANNUAL:
      return "an";
    case PACKAGE_TYPE.MONTHLY:
      return "mois";
    default:
      return "";
  }
};

const isPurchaseCancelledError = (error: unknown): boolean =>
  typeof error === "object" &&
  error !== null &&
  "code" in error &&
  (error as { code: unknown }).code ===
    PURCHASES_ERROR_CODE.PURCHASE_CANCELLED_ERROR;

const plans = [
  {
    title: "Mensuel",
    price: "6,99$",
    frequencyLabel: "mois",
  },
  {
    title: "Annuel",
    price: "36,99$",
    frequencyLabel: "an",
  },
];

export default function PaywallContent({
  style,
  className,
  contentClassName,
  onPressActivateSubscription,
}: Props) {
  const router = useRouter();
  const { bottom } = useSafeAreaInsets();
  const [isReminderEnabled, setIsReminderEnabled] = useState(
    () =>
      getStorageBoolean(StorageKey.ACTIVATE_FREE_TRIAL_END_NOTIFICATION) ??
      false,
  );
  const [offering, setOffering] = useState<PurchasesOffering | null>(null);
  const [selectedPackage, setSelectedPackage] =
    useState<PurchasesPackage | null>(null);
  const [isLoadingOffering, setIsLoadingOffering] = useState(true);
  const [isPurchasing, setIsPurchasing] = useState(false);
  const [isRestoring, setIsRestoring] = useState(false);
  const [selectedPlan, setSelectedPlan] = useState(0);

  useEffect(() => {
    let isMounted = true;

    getCurrentOffering()
      .then((currentOffering) => {
        if (!isMounted) {
          return;
        }

        setOffering(currentOffering);
        setSelectedPackage(
          currentOffering?.annual ?? currentOffering?.monthly ?? null,
        );
      })
      .catch((error) => {
        console.warn("[Paywall] getCurrentOffering failed", error);
      })
      .finally(() => {
        if (isMounted) {
          setIsLoadingOffering(false);
        }
      });

    return () => {
      isMounted = false;
    };
  }, []);

  const handleReminderChange = (value: boolean) => {
    setIsReminderEnabled(value);
    setStorageItem(StorageKey.ACTIVATE_FREE_TRIAL_END_NOTIFICATION, value);
  };

  const onPressTermsOfUse = (): void => {
    router.push(getRouteForPage(Page.TERMS_OF_USE));
  };

  const onPressPravicyPolicy = (): void => {
    router.push(getRouteForPage(Page.PRIVACY_POLICY));
  };

  const handlePurchase = async (): Promise<void> => {
    if (!selectedPackage || isPurchasing) {
      return;
    }

    setIsPurchasing(true);

    try {
      await purchasePackage(selectedPackage);
      onPressActivateSubscription?.();
    } catch (error) {
      if (!isPurchaseCancelledError(error)) {
        Alert.alert(
          "Achat impossible",
          "Une erreur est survenue pendant l'achat. Réessayez plus tard.",
        );
      }
    } finally {
      setIsPurchasing(false);
    }
  };

  const handleRestore = async (): Promise<void> => {
    if (isRestoring) {
      return;
    }

    setIsRestoring(true);

    try {
      const customerInfo = await restorePurchases();

      if (isPremiumFromCustomerInfo(customerInfo)) {
        onPressActivateSubscription?.();
      } else {
        Alert.alert(
          "Aucun abonnement trouvé",
          "Aucun achat actif n'a été retrouvé pour ce compte.",
        );
      }
    } catch {
      Alert.alert(
        "Restauration impossible",
        "Impossible de restaurer vos achats pour le moment. Réessayez plus tard.",
      );
    } finally {
      setIsRestoring(false);
    }
  };

  const reminderDate = getDateInDays(6);
  const subscriptionDate = getDateInDays(7);

  const items: { icon: SFSymbol; title: string; description: string }[] = [
    {
      icon: "lock.open.fill",
      title: "Démarrez l'essai gratuit",
      description:
        "Activation de votre essai gratuit, aucun frais ne sera appliqué la première semaine",
    },
    {
      icon: "bell.fill",
      title: "Recevez un rappel",
      description: `Recevez un rappel le ${formatLongDate(reminderDate)}`,
    },
    {
      icon: "crown.fill",
      title: "Devenez membre premium",
      description: selectedPackage
        ? `Activation le ${formatLongDate(subscriptionDate)} à ${selectedPackage.product.priceString} par ${getPackagePeriodLabel(selectedPackage.packageType)}, vous pouvez annuler votre abonnement à tout moment`
        : `Activation le ${formatLongDate(subscriptionDate)}, vous pouvez annuler votre abonnement à tout moment`,
    },
  ];

  return (
    <View
      className={`px-5 flex-1 ${className}`}
      style={{ paddingBottom: bottom, ...style }}
    >
      <View className={`gap-10 flex-1 pb-5 justify-center ${contentClassName}`}>
        {/* TITLE */}
        <View className="gap-3">
          <Text className="text-center font-noto-serif font-semibold text-text-900 text-4xl">
            Débloquez tout le potentiel
          </Text>

          <Text className="px-5 text-center font-noto-serif font-medium text-text-900 text-lg leading-6">
            Découvrez les offres et démarrez votre essai gratuit aujourd'hui
          </Text>
        </View>

        {/* TIMELINE CARD */}
        <View className="items-center px-5 py-7 gap-6 rounded-3xl border-continuous justify-center">
          <View className="gap-10 border">
            <View className="w-1 top-5 bottom-5 bg-text-900 absolute left-[19px] h-auto rounded-full" />

            {items.map((item, index) => (
              <View key={index} className="flex-row w-full items-center gap-5">
                <View className="w-12 h-12 items-center justify-center">
                  {index === 0 && (
                    <View className="border bg-cream-50">
                      <SymbolView
                        size={32}
                        name={item.icon}
                        tintColor={colors.text[900]}
                        className="left-1"
                        weight="semibold"
                      />
                    </View>
                  )}

                  {index === 1 && (
                    <>
                      <LinearGradient
                        className="w-full h-full justify-center gap-1 rounded-lg border-continuous border border-text-900"
                        colors={[colors.cream[100], colors.cream[300]]}
                        start={{ x: 0, y: 0 }}
                        end={{ x: 1, y: 1 }}
                      >
                        <Text className="font-public-sans text-center font-medium text-text-900 text-xs">
                          {formatShortMonth(reminderDate)}
                        </Text>
                        <Text className="font-noto-serif text-center font-extrabold text-text-900 text-xl leading-none">
                          {reminderDate.getDate()}
                        </Text>
                      </LinearGradient>

                      <SymbolView
                        size={24}
                        name={item.icon}
                        tintColor={colors.text[900]}
                        className="absolute -bottom-3 -right-2.5"
                      />
                    </>
                  )}

                  {index === 2 && (
                    <>
                      <LinearGradient
                        className="w-full h-full justify-center gap-1 rounded-lg border-continuous border border-text-900"
                        colors={[colors.cream[100], colors.cream[300]]}
                        start={{ x: 0, y: 0 }}
                        end={{ x: 1, y: 1 }}
                      >
                        <Text className="font-public-sans text-center font-medium text-text-900 text-xs">
                          {formatShortMonth(subscriptionDate)}
                        </Text>
                        <Text className="font-noto-serif text-center font-extrabold text-text-900 text-xl leading-none">
                          {subscriptionDate.getDate()}
                        </Text>
                      </LinearGradient>

                      <SymbolView
                        size={26}
                        name={item.icon}
                        tintColor={colors.text[900]}
                        className="absolute -bottom-3 -right-2.5"
                      />
                    </>
                  )}
                </View>

                <View className="flex-1">
                  <Text className="font-noto-serif font-semibold text-text-900 text-xl">
                    {item.title}
                  </Text>
                  <Text className="font-public-sans text-text-900">
                    {item.description}
                  </Text>
                </View>
              </View>
            ))}
          </View>

          <Host matchContents={{ vertical: true }} className="w-full mt-2">
            <Divider modifiers={[background(colors.text[900]), opacity(0.2)]} />
          </Host>

          <View className="flex-row items-center justify-between w-full">
            <Text className="font-noto-serif font-semibold text-text-900 text-xl">
              Activer le rappel
            </Text>

            <Host matchContents={{ vertical: true, horizontal: true }}>
              <Switch
                value={isReminderEnabled}
                onValueChange={handleReminderChange}
              />
            </Host>
          </View>
        </View>
      </View>

      {/* PLAN SELECTOR */}
      <GlassView
        glassEffectStyle="regular"
        tintColor={colors.cream[200]}
        className="gap-5 p-6 pb-4 rounded-3xl border-continuous"
      >
        <View className="flex-row gap-4 justify-evenly">
          {plans.map((plan, index) => {
            const [integerPart, decimalPart] = plan.price.split(",");
            const isSelected = selectedPlan === index;

            return (
              <Pressable
                key={index}
                className="flex-1"
                onPress={() => setSelectedPlan(index)}
              >
                <View
                  className={`gap-3 px-5 py-4 rounded-3xl border-continuous border-2 ${
                    isSelected ? "border-text-900" : "border-text-200"
                  }`}
                >
                  <View className="flex-row justify-between items-center">
                    <Text className="font-public-sans font-medium text-xl text-text-900">
                      {plan.title}
                    </Text>
                    <SymbolView
                      name={isSelected ? "checkmark.circle.fill" : "circle"}
                      tintColor={
                        isSelected ? colors.text[900] : colors.text[200]
                      }
                    />
                  </View>

                  <Text className="font-public-sans font-bold text-text-900">
                    <Text className="text-4xl">{integerPart}</Text>
                    <Text className="text-lg">,{decimalPart}</Text>
                    <Text className="text-lg font-medium text-text-500">
                      {" "}
                      / {plan.frequencyLabel}
                    </Text>
                  </Text>
                </View>
              </Pressable>
            );
          })}
        </View>

        <View className="gap-3">
          <Pressable
            disabled={!selectedPackage || isPurchasing}
            onPress={handlePurchase}
          >
            <GlassView
              isInteractive
              glassEffectStyle="regular"
              tintColor={colors.text[900]}
              className="items-center px-5 py-5 rounded-full border-continuous justify-center"
              style={{ opacity: !selectedPackage || isPurchasing ? 0.6 : 1 }}
            >
              {isPurchasing ? (
                <ActivityIndicator color={colors.cream[200]} />
              ) : (
                <Text className="font-noto-serif font-semibold text-cream-200 text-xl">
                  Démarrer l'essai gratuit
                </Text>
              )}
            </GlassView>
          </Pressable>

          <Pressable
            className="items-center self-center px-5"
            onPress={handleRestore}
          >
            <Text className="text-center font-public-sans text-text-900 text-lg">
              Restaurer un achat
            </Text>
          </Pressable>
        </View>
      </GlassView>

      {/* LEGALS PAGES LINKS */}
      <View className="mt-5 gap-5 flex-row justify-center">
        <Pressable onPress={onPressTermsOfUse}>
          <Text className="font-public-sans font-medium text-text-900 opacity-50 text-[13px]">
            Conditions d'utilisation
          </Text>
        </Pressable>
        <Text className="font-public-sans font-medium text-text-900 opacity-50 text-[13px]">
          -
        </Text>
        <Pressable onPress={onPressPravicyPolicy}>
          <Text className="font-public-sans font-medium text-text-900 opacity-50 text-[13px]">
            Politique de confidentialité
          </Text>
        </Pressable>
      </View>
    </View>
  );
}
