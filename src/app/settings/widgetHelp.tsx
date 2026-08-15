import { ScreenHeader } from "@/components/ScreenHeader";
import { ScrollViewContainer } from "@/components/ScrollViewContainer";
import { getImageAspectRatio } from "@/utils/image";
import { Host, Picker, Text as SegmentedText } from "@expo/ui/swift-ui";
import { pickerStyle, tag } from "@expo/ui/swift-ui/modifiers";
import { Image } from "expo-image";
import { SymbolView } from "expo-symbols";
import { useState } from "react";
import { Text, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

type WidgetHelpStep = {
  description: string;
  image?: number;
};

type WidgetHelpTab = {
  id: string;
  title: string;
  description: string;
  steps: WidgetHelpStep[];
};

// Segmented control labels are derived from `title` below instead of being
// duplicated in the component, so they can't drift out of sync with the
// step content they select.
const WIDGET_HELP_TABS: WidgetHelpTab[] = [
  {
    id: "option-1",
    title: "Remplacer l'icône",
    description:
      "Vous pouvez directement remplacer l'icône de l'application par la version du widget.",
    steps: [
      {
        description:
          "Effectuez un appuis prolonger sur l'icône de l'application, puis sélectionnez parmis les quatres premières icônes du menu le format souhaité pour le widget.",
        image: require("@/assets/images/widget-help/option-1/widget-help-step-1.webp"),
      },
      {
        description:
          "L'icône de l'application est ensuite remplacer par une version du widget avec la taille souhaité.",
        image: require("@/assets/images/widget-help/option-1/widget-help-step-2.webp"),
      },
    ],
  },
  {
    id: "option-2",
    title: "Séparer le widget",
    description:
      "Vous pouvez ajouter le widget tout en gardant l'icône de l'application visible.",
    steps: [
      {
        description:
          "Effectuez un appuis prolonger sur l'écran des applications pour faire appaitre plus d'options d'affichage.",
        image: require("@/assets/images/widget-help/option-2/widget-help-step-1.webp"),
      },
      {
        description:
          "Appuiyer sur l'iône d'ajout edu coin supérieur gauche de l'écran pour ouvrir un menu d'option. Sélectionnez ensuite la première option 'Ajouter un widget'.",
        image: require("@/assets/images/widget-help/option-2/widget-help-step-2.webp"),
      },
      {
        description:
          "Sélectionnez l'application 'MindSelf' dans la liste déroulante des applications.",
        image: require("@/assets/images/widget-help/option-2/widget-help-step-3.webp"),
      },
      {
        description:
          "Sélectionnez enfin un widget parmis les trois tailles proposés.",
        image: require("@/assets/images/widget-help/option-2/widget-help-step-4.webp"),
      },
      {
        description: "Le widget apparait ensuite sur l'écran des applications.",
        image: require("@/assets/images/widget-help/option-2/widget-help-step-5.webp"),
      },
    ],
  },
];

export default function WidgetHelp() {
  const { bottom } = useSafeAreaInsets();
  const [tabId, setTabId] = useState(WIDGET_HELP_TABS[0].id);

  const activeTab =
    WIDGET_HELP_TABS.find((tab) => tab.id === tabId) ?? WIDGET_HELP_TABS[0];

  return (
    <View className="flex-1 bg-cream-50">
      <ScreenHeader
        title="Afficher un widget"
        showBackButton
        showCloseButton={false}
        className="p-5"
      />

      <View className="px-5 pb-5">
        <Host matchContents={{ vertical: true }}>
          <Picker
            selection={tabId}
            onSelectionChange={(value) => setTabId(value as string)}
            modifiers={[pickerStyle("segmented")]}
          >
            {WIDGET_HELP_TABS.map((tab) => (
              <SegmentedText key={tab.id} modifiers={[tag(tab.id)]}>
                {tab.title}
              </SegmentedText>
            ))}
          </Picker>
        </Host>
      </View>

      <ScrollViewContainer
        contentContainerClassName="pt-0"
        contentContainerStyle={{ paddingBottom: bottom + 30 }}
      >
        <Text className="font-public-sans text-xl text-center font-semibold leading-6">
          {activeTab.description}
        </Text>

        {activeTab.steps.map((step, index) => (
          <View className="gap-3" key={`${tabId}-${index}`}>
            <View className="flex-row gap-5">
              <Text className="w-12 h-12 rounded-full text-center bg-slate-300 text-slate-600 font-black text-3xl font-noto-serif leading-[40px]">
                {index + 1}
              </Text>
              <Text className="flex-1 font-public-sans text-lg leading-6">
                {step.description}
              </Text>
            </View>

            {step.image && (
              <Image
                className="w-full"
                style={{ aspectRatio: getImageAspectRatio(step.image) }}
                contentFit="contain"
                source={step.image}
              />
            )}

            {index !== activeTab.steps.length - 1 && (
              <SymbolView
                size={50}
                weight="semibold"
                name="arrow.down"
                tintColor="#94a3b8"
                className="self-center mt-3"
              />
            )}
          </View>
        ))}
      </ScrollViewContainer>
    </View>
  );
}
