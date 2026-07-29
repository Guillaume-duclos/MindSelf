import { Redirect } from "expo-router";
import { useWindowDimensions } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

export default function HomeScreen() {
  const { height } = useWindowDimensions();
  const { top, bottom } = useSafeAreaInsets();

  // TEMPORAIRE: force le lancement sur l'onboarding, à retirer une fois testé.
  return <Redirect href="/onboarding" />;

  // return (
  //   <LinearGradient
  //     className="flex-1"
  //     colors={["#FFF4F2", "#EFD5C9"]}
  //     start={{ x: 0, y: 0 }}
  //     end={{ x: 1, y: 1 }}
  //   >
  //     {/* <Image
  //       className="absolute inset-0 w-full h-full"
  //       source="https://picsum.photos/seed/696/3000/2000"
  //     /> */}

  //     <View
  //       className="absolute flex-1 flex-row items-center justify-between px-5 z-10"
  //       style={{ top }}
  //     >
  //       <View className="flex-1">
  //         <Text className="text-[#BA6A56] font-medium font-public-sans uppercase">
  //           Bon matin
  //         </Text>
  //         <Text className="text-[#291C1A] font-medium font-noto-serif text-3xl">
  //           Guillaume
  //         </Text>
  //       </View>

  //       <Link asChild href="/paywall">
  //         <Pressable>
  //           <GlassView
  //             isInteractive
  //             glassEffectStyle="regular"
  //             className="items-center rounded-full gap-2 flex-row justify-center px-5 border-continuous"
  //           >
  //             <Text className="text-center font-noto-serif font-bold text-[#291C1A] text-lg leading-[40px]">
  //               Get Premium
  //             </Text>
  //             <SymbolView
  //               name={{ ios: "crown" }}
  //               weight="medium"
  //               tintColor="#291C1A"
  //               size={26}
  //             />
  //           </GlassView>
  //         </Pressable>
  //       </Link>
  //     </View>

  //     <Link asChild href="/settings">
  //       <RoundedButton
  //         iconName="person"
  //         className="absolute left-10 z-10"
  //         style={{ bottom: bottom + 5 }}
  //       />
  //     </Link>

  //     <Link asChild href="/themes">
  //       <RoundedButton
  //         iconName="paintpalette"
  //         className="absolute right-10 z-10"
  //         style={{ bottom: bottom + 5 }}
  //       />
  //     </Link>

  //     <FlashList
  //       pagingEnabled
  //       data={affirmations}
  //       showsVerticalScrollIndicator={false}
  //       keyExtractor={(item, index) => `${index}-${item.text}`}
  //       renderItem={({ item }) => (
  //         <View className="items-center justify-center px-6" style={{ height }}>
  //           <AffirmationCard text={item.text} />
  //         </View>
  //       )}
  //     />
  //   </LinearGradient>
  // );
}
