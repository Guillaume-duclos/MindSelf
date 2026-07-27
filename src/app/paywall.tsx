import { ScreenHeader } from "@/components/ScreenHeader";
import { GlassView } from "expo-glass-effect";
import { LinearGradient } from "expo-linear-gradient";
import { SymbolView } from "expo-symbols";
import { Text, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

export default function Paywall() {
  const { bottom } = useSafeAreaInsets();

  const items = [
    {
      icon: "lock.open.fill",
      title: "Démarrez l'essaie gratuit",
      description:
        "Activation de votre essaie gratuit, aucun frais ne sera appliquer la première semaine",
    },
    {
      icon: "bell.fill",
      title: "Recevez un rappel",
      description: "Fin de votre essaie gratuit le 27 juillet",
    },
    {
      icon: "crown.fill",
      title: "Devenez membre premium",
      description:
        "Activation le 28 juillet, vous pouvez annuler votre abonement à tout moment",
    },
  ];

  return (
    <View
      className="px-5 flex-1 bg-[#FAF3EF]"
      style={{ paddingBottom: bottom }}
    >
      <ScreenHeader className="pb-0" />

      <View className="gap-3">
        <Text className="text-center font-noto-serif font-semibold text-[#2A2015] text-4xl">
          Débloquez tout le potentielle
        </Text>

        <Text className="px-5 text-center font-noto-seriffont-medium text-[#2A2015] text-lg leading-5">
          Découvrez les offres et démarrez votre essaie gratuit aujourd'hui
        </Text>
      </View>

      <View className="flex-1 mt-8">
        <GlassView
          tintColor="#F7E6DF"
          glassEffectStyle="regular"
          className="items-center px-5 py-10 gap-10 rounded-3xl border-continuous justify-center"
        >
          {items.map((item, index) => (
            <View className="flex-row w-full items-center gap-5" key={index}>
              <View className="w-12 h-12 items-center justify-center">
                {index === 0 && (
                  <SymbolView
                    size={32}
                    name={item.icon}
                    tintColor="#2A2015"
                    className="left-1"
                    weight="semibold"
                  />
                )}

                {index === 1 && (
                  <>
                    <LinearGradient
                      className="w-full h-full justify-center gap-1 rounded-lg border-continuous border border-[#2A2015]"
                      colors={["#FFF4F2", "#EFD5C9"]}
                      start={{ x: 0, y: 0 }}
                      end={{ x: 1, y: 1 }}
                    >
                      <Text className="font-public-sans text-center font-medium text-[#2A2015] text-xs">
                        Juil.
                      </Text>
                      <Text className="font-noto-serif text-center font-extrabold text-[#2A2015] text-xl leading-none">
                        27
                      </Text>
                    </LinearGradient>

                    <SymbolView
                      size={24}
                      name={item.icon}
                      tintColor="#2A2015"
                      className="absolute -bottom-3 -right-2.5"
                    />
                  </>
                )}

                {index === 2 && (
                  <>
                    <LinearGradient
                      className="w-full h-full justify-center gap-1 rounded-lg border-continuous border border-[#2A2015]"
                      colors={["#FFF4F2", "#EFD5C9"]}
                      start={{ x: 0, y: 0 }}
                      end={{ x: 1, y: 1 }}
                    >
                      <Text className="font-public-sans text-center font-medium text-[#2A2015] text-xs">
                        Juil.
                      </Text>
                      <Text className="font-noto-serif text-center font-extrabold text-[#2A2015] text-xl leading-none">
                        28
                      </Text>
                    </LinearGradient>

                    <SymbolView
                      size={26}
                      name={item.icon}
                      tintColor="#2A2015"
                      className="absolute -bottom-3 -right-2.5"
                    />
                  </>
                )}
              </View>

              <View className="flex-1">
                <Text className="font-noto-serif font-semibold text-[#2A2015] text-xl">
                  {item.title}
                </Text>
                <Text className="font-public-sans text-[#2A2015]">
                  {item.description}
                </Text>
              </View>
            </View>
          ))}
        </GlassView>
      </View>

      <View className="gap-3">
        <GlassView
          isInteractive
          tintColor="#F7E6DF"
          glassEffectStyle="regular"
          className="items-center px-5 py-5 rounded-full border-continuous justify-center"
        >
          <Text className="font-noto-serif font-semibold text-[#2A2015] text-xl">
            Voir toutes les offres
          </Text>
        </GlassView>

        <GlassView
          isInteractive
          tintColor="#2A2015"
          glassEffectStyle="regular"
          className="items-center px-5 py-5 rounded-full border-continuous justify-center"
        >
          <Text className="font-noto-serif font-semibold text-[#F7E6DF] text-xl">
            Démarrez l'essaie gratuit
          </Text>
        </GlassView>
      </View>

      <View className="mt-3 gap-5 flex-row justify-center">
        <Text className="font-public-sans font-medium text-[#F72A2015E6DF] opacity-50 text-sm">
          Conditions d'utilisation
        </Text>
        <Text className="font-public-sans font-medium text-[#F72A2015E6DF] opacity-50 text-sm">
          -
        </Text>
        <Text className="font-public-sans font-medium text-[#F72A2015E6DF] opacity-50 text-sm">
          Politique de confidentialité
        </Text>
      </View>
    </View>
  );
}
