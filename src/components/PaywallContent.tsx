import colors from "@/constants/colors";
import { Page } from "@/enums/page.enum";
import { StorageKey } from "@/enums/storageKey.enum";
import { getRouteForPage } from "@/utils/onboarding";
import { getStorageBoolean, setStorageItem } from "@/utils/storage";
import { Host, Switch } from "@expo/ui";
import { Divider } from "@expo/ui/swift-ui";
import { background, opacity } from "@expo/ui/swift-ui/modifiers";
import { GlassView } from "expo-glass-effect";
import { LinearGradient } from "expo-linear-gradient";
import { useRouter } from "expo-router";
import { SFSymbol, SymbolView } from "expo-symbols";
import { useState } from "react";
import { Pressable, Text, View, ViewStyle } from "react-native";
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

  const reminderDate = getDateInDays(6);
  const subscriptionDate = getDateInDays(7);

  const items: { icon: SFSymbol; title: string; description: string }[] = [
    {
      icon: "lock.open.fill",
      title: "Démarrez l'essaie gratuit",
      description:
        "Activation de votre essaie gratuit, aucun frais ne sera appliquer la première semaine",
    },
    {
      icon: "bell.fill",
      title: "Recevez un rappel",
      description: `Recevez un rappel le ${formatLongDate(reminderDate)}`,
    },
    {
      icon: "crown.fill",
      title: "Devenez membre premium",
      description: `Activation le ${formatLongDate(subscriptionDate)}, vous pouvez annuler votre abonement à tout moment`,
    },
  ];

  return (
    <View
      className={`px-5 flex-1 ${className}`}
      style={{ paddingBottom: bottom, ...style }}
    >
      <View className={`gap-10 flex-1 ${contentClassName}`}>
        {/* TITLE */}
        <View className="gap-3">
          <Text className="text-center font-noto-serif font-semibold text-text-900 text-4xl">
            Débloquez tout le potentielle
          </Text>

          <Text className="px-5 text-center font-noto-seriffont-medium text-text-900 text-lg leading-6">
            Découvrez les offres et démarrez votre essaie gratuit aujourd'hui
          </Text>
        </View>

        {/* TIMELINE CARD */}
        <View>
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
      </View>

      <View className="gap-3">
        <GlassView
          isInteractive
          tintColor={colors.cream[200]}
          glassEffectStyle="regular"
          className="items-center px-5 py-5 rounded-full border-continuous justify-center"
        >
          <Text className="font-noto-serif font-semibold text-text-900 text-xl">
            Voir toutes les offres
          </Text>
        </GlassView>

        <Pressable onPress={onPressActivateSubscription}>
          <GlassView
            isInteractive
            tintColor={colors.text[900]}
            glassEffectStyle="regular"
            className="items-center px-5 py-5 rounded-full border-continuous justify-center"
          >
            <Text className="font-noto-serif font-semibold text-cream-200 text-xl">
              Démarrez l'essaie
            </Text>
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
