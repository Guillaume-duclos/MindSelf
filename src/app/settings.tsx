import { ActivitySummary } from "@/components/ActivitySummary";
import { FieldGroupSection } from "@/components/FieldGroupSection";
import { ListItemLink } from "@/components/ListItemLink";
import { ScreenHeader } from "@/components/ScreenHeader";
import { SettingsFooter } from "@/components/SettingsFooter";
import { FieldGroup, Host } from "@expo/ui";
import { createModifier } from "@expo/ui/swift-ui/modifiers";
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
  const { bottom } = useSafeAreaInsets();

  return (
    <View className="flex-1 bg-[#FAF3EF]" style={{ paddingBottom: bottom }}>
      <ScreenHeader title="Mon profil" className="px-5" />

      <ActivitySummary />

      <Host className="flex-1">
        <FieldGroup
          modifiers={[
            createModifier("scrollContentBackground", { visible: "hidden" }),
            createModifier("scrollIndicators", { visibility: "visible" }),
          ]}
        >
          {/* <Column modifiers={plainRowModifiers}>
            <RNHostView matchContents>
              <ActivitySummary />
            </RNHostView>
          </Column> */}

          <FieldGroupSection title="À propos">
            <>
              <ListItemLink text="Mon compte" onPress={() => {}} />
              <ListItemLink text="Widget" onPress={() => {}} />
              <ListItemLink text="Notification" onPress={() => {}} />
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

          {/* <Column modifiers={plainRowModifiers}>
            <RNHostView matchContents>
              <SettingsFooter />
            </RNHostView>
          </Column> */}
        </FieldGroup>
      </Host>

      <SettingsFooter />
    </View>
  );
}
