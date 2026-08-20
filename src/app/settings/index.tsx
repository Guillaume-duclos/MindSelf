import { ActivitySummary } from "@/components/ActivitySummary";
import { ListItemContainer } from "@/components/ListItemContainer";
import { ListItemLink } from "@/components/ListItemLink";
import { ScreenHeader } from "@/components/ScreenHeader";
import { ScrollViewContainer } from "@/components/ScrollViewContainer";
import { SettingsFooter } from "@/components/SettingsFooter";
import { useCloseSettingsModal } from "@/hooks/use-close-settings-modal";
import { createModifier } from "@expo/ui/swift-ui/modifiers";
import { useRouter } from "expo-router";
import { View } from "react-native";

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
  const closeSettingsModal = useCloseSettingsModal();

  return (
    <View className="flex-1 bg-cream-50">
      <ScreenHeader
        title="Mon profil"
        className="py-5 px-5"
        onClose={closeSettingsModal}
      />

      <ScrollViewContainer contentContainerClassName="px-5 gap-8">
        <ActivitySummary />

        <ListItemContainer title="Mon compte">
          <ListItemLink
            text="Mon compte"
            onPress={() => router.navigate("/settings/account")}
          />
          <ListItemLink
            text="Mes objectifs"
            onPress={() => router.navigate("/settings/dayGoal")}
          />
          <ListItemLink
            text="Widget"
            onPress={() => router.navigate("/settings/widget")}
          />
          <ListItemLink
            text="Notification"
            onPress={() => router.navigate("/settings/notification")}
          />
        </ListItemContainer>

        <ListItemContainer title="Mentions légales">
          <ListItemLink
            text="Conditions d'utilisation"
            onPress={() => router.navigate("/settings/termsOfUse")}
          />
          <ListItemLink
            text="Politique de confidentialité"
            onPress={() => router.navigate("/settings/privacyPolicy")}
          />
        </ListItemContainer>

        <SettingsFooter />
      </ScrollViewContainer>
    </View>
  );
}
