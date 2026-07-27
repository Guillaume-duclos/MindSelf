import { ActivitySummary } from "@/components/ActivitySummary";
import { ListItemContainer } from "@/components/ListItemContainer";
import { ListItemLink } from "@/components/ListItemLink";
import { ScreenHeader } from "@/components/ScreenHeader";
import { ScrollViewContainer } from "@/components/ScrollViewContainer";
import { SettingsFooter } from "@/components/SettingsFooter";
import { createModifier } from "@expo/ui/swift-ui/modifiers";
import { useRouter } from "expo-router";
import { View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

const plainRowModifiers = [
  createModifier("listRowBackground", { color: "clear" }),
  createModifier("listRowSeparator", { visibility: "hidden" }),
  createModifier("listRowInsets", {
    top: 0,
    leading: 0,
    bottom: 0,
    trailing: 0,
  }),
];

export default function HomeScreen() {
  const router = useRouter();
  const { bottom } = useSafeAreaInsets();

  return (
    <View className="flex-1 bg-[#FAF3EF]" style={{ paddingBottom: bottom }}>
      <ScreenHeader title="Mon profil" className="px-5" />

      <ScrollViewContainer>
        <ActivitySummary />

        <ListItemContainer title="Mon compte">
          <ListItemLink
            text="Mon compte"
            onPress={() => router.navigate("/settings/account")}
          />
        </ListItemContainer>

        <ListItemContainer title="Légale">
          <ListItemLink
            text="Conditions d'utilisation"
            onPress={() => router.navigate("/settings/account")}
          />
          <ListItemLink
            text="Politique de confidentialité"
            onPress={() => router.navigate("/settings/account")}
          />
        </ListItemContainer>

        <SettingsFooter />
      </ScrollViewContainer>
    </View>
  );
}
