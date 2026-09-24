import colors from "@/constants/colors";
import { Page } from "@/enums/page.enum";
import { StorageKey } from "@/enums/storageKey.enum";
import { getRouteForPage } from "@/utils/onboarding";
import { getCurrentOffering, purchasePackage } from "@/utils/purchases";
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

  const packageOptions = [offering?.monthly, offering?.annual].filter(
    (option): option is PurchasesPackage => option != null,
  );

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
        <View className="gap-3">
          <GlassView
            tintColor={colors.cream[200]}
            glassEffectStyle="regular"
            className="items-center px-5 py-7 gap-6 rounded-3xl border-continuous justify-center"
          >
            <View className="gap-10">
              {items.map((item, index) => (
                <View
                  className="flex-row w-full items-center gap-5"
                  key={index}
                >
                  <View className="w-12 h-12 items-center justify-center">
                    {index === 0 && (
                      <SymbolView
                        size={32}
                        name={item.icon}
                        tintColor={colors.text[900]}
                        className="left-1"
                        weight="semibold"
                      />
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
              <Divider
                modifiers={[background(colors.text[900]), opacity(0.2)]}
              />
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
          </GlassView>
        </View>

        {/* PLAN SELECTOR */}
        {isLoadingOffering ? (
          <ActivityIndicator color={colors.text[900]} />
        ) : (
          packageOptions.length > 0 && (
            <View className="flex-row gap-3">
              {packageOptions.map((option) => {
                const isSelected =
                  selectedPackage?.identifier === option.identifier;
                const periodLabel = getPackagePeriodLabel(option.packageType);
                const monthlyEquivalent =
                  option.packageType === PACKAGE_TYPE.ANNUAL
                    ? option.product.pricePerMonthString
                    : null;

                return (
                  <Pressable
                    key={option.identifier}
                    className="flex-1"
                    disabled={isSelected}
                    onPress={() => setSelectedPackage(option)}
                  >
                    <GlassView
                      tintColor={colors.cream[200]}
                      glassEffectStyle="regular"
                      className={`items-center px-4 py-4 gap-1 rounded-2xl border-continuous border-2 ${
                        isSelected ? "border-text-900" : "border-text-100"
                      }`}
                    >
                      <Text
                        className={`font-noto-serif text-text-900 text-lg ${isSelected ? "font-semibold" : ""}`}
                      >
                        {periodLabel === "an" ? "Annuel" : "Mensuel"}
                      </Text>
                      <Text className="font-public-sans font-medium text-text-900">
                        {option.product.priceString} / {periodLabel}
                      </Text>
                      {monthlyEquivalent && (
                        <Text className="font-public-sans text-text-900 opacity-60 text-xs">
                          soit {monthlyEquivalent} / mois
                        </Text>
                      )}
                    </GlassView>
                  </Pressable>
                );
              })}
            </View>
          )
        )}
      </View>

      <View className="gap-3">
        <Pressable
          disabled={!selectedPackage || isPurchasing}
          onPress={handlePurchase}
        >
          <GlassView
            isInteractive
            tintColor={colors.text[900]}
            glassEffectStyle="regular"
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
      </View>

      <View className="mt-3 gap-5 flex-row justify-center">
        <Pressable onPress={onPressTermsOfUse}>
          <Text className="font-public-sans font-medium text-text-900 opacity-50 text-sm">
            Conditions d'utilisation
          </Text>
        </Pressable>
        <Text className="font-public-sans font-medium text-text-900 opacity-50 text-sm">
          -
        </Text>
        <Pressable onPress={onPressPravicyPolicy}>
          <Text className="font-public-sans font-medium text-text-900 opacity-50 text-sm">
            Politique de confidentialité
          </Text>
        </Pressable>
      </View>
    </View>
  );
}
