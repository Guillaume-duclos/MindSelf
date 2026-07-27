import { FieldGroupSection } from "@/components/FieldGroupSection";
import { ListItemLink } from "@/components/ListItemLink";
import { ScreenHeader } from "@/components/ScreenHeader";
import { SettingsFooter } from "@/components/SettingsFooter";
import { FieldGroup, Host } from "@expo/ui";
import { createModifier } from "@expo/ui/swift-ui/modifiers";
import { View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

export default function HomeScreen() {
  const { bottom } = useSafeAreaInsets();

  return (
    <View className="flex-1 bg-[#FAF3EF]" style={{ paddingBottom: bottom }}>
      <ScreenHeader title="Mon profil" className="px-5" />

      <Host className="flex-1">
        <FieldGroup
          style={{ backgroundColor: "#FAF3EF" }}
          modifiers={[
            createModifier("scrollContentBackground", { visible: "hidden" }),
            createModifier("scrollIndicators", { visibility: "visible" }),
          ]}
        >
          <FieldGroupSection title="À propos">
            <>
              <ListItemLink text="Mon compte" onPress={() => {}} />
              <ListItemLink text="Mon compte" onPress={() => {}} />
              <ListItemLink text="Mon compte" onPress={() => {}} />
            </>
          </FieldGroupSection>

          <FieldGroupSection title="Paramètres">
            <>
              <ListItemLink
                text="Conditions d'utilisation"
                onPress={() => {}}
              />
              <ListItemLink
                text="Politique de confidentialité"
                onPress={() => {}}
              />
            </>
          </FieldGroupSection>
        </FieldGroup>
      </Host>

      <SettingsFooter />
    </View>
  );
}
