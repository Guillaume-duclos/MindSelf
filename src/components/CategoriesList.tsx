import colors from "@/constants/colors";
import affirmationCategories from "@/data/affirmations.json";
import { StorageKey } from "@/enums/storageKey.enum";
import { toggleCategory } from "@/utils/categories";
import { storage } from "@/utils/storage";
import { updateAffirmationWidgetTimeline } from "@/utils/widget";
import * as Haptics from "expo-haptics";
import { SFSymbol, SymbolView } from "expo-symbols";
import { useState } from "react";
import { Alert, LayoutChangeEvent, Pressable, Text, View } from "react-native";
import { useMMKVObject } from "react-native-mmkv";

// Best-fit SF Symbol per category name from affirmations.json.
const CATEGORY_ICON: Record<string, SFSymbol> = {
  "Confiance en soi": "person.fill.checkmark",
  "Amour et relations": "heart.fill",
  "Réussite et abondance": "trophy.fill",
  "Santé et bien-être": "leaf.fill",
  "Gratitude et joie de vivre": "face.smiling.fill",
  "Résilience et croissance personnelle":
    "arrow.triangle.2.circlepath.circle.fill",
  "Créativité et inspiration": "lightbulb.fill",
  "Harmonie et paix intérieure": "figure.mind.and.body.circle.fill",
};

const Categories = affirmationCategories.map(({ category }) => ({
  icon: CATEGORY_ICON[category] ?? "gear",
  name: category,
}));

const GAP = 10;
const COLUMNS = 2;

export function CategoriesList() {
  const [containerWidth, setContainerWidth] = useState(0);
  const tileWidth = (containerWidth - GAP * (COLUMNS - 1)) / COLUMNS;

  const handleContainerLayout = (event: LayoutChangeEvent) => {
    setContainerWidth(event.nativeEvent.layout.width);
  };

  const [disabledCategories] = useMMKVObject<string[]>(
    StorageKey.DISABLED_AFFIRMATION_CATEGORIES,
    storage,
  );

  const handleToggleCategory = (name: string) => {
    Haptics.selectionAsync();
    const didToggle = toggleCategory(name);

    if (!didToggle) {
      Alert.alert(
        "Impossible de désactiver",
        "Au moins une catégorie doit rester active pour continuer à recevoir des affirmations.",
      );
      return;
    }

    updateAffirmationWidgetTimeline();
  };

  const renderCategories = () => {
    return Categories.map((category, index) => {
      const isEnabled = !disabledCategories?.includes(category.name);

      return (
        <Pressable
          key={index}
          style={{ width: tileWidth }}
          onPress={() => handleToggleCategory(category.name)}
          className="px-3 pt-6 pb-10 gap-2 items-center justify-center rounded-3xl bg-secondary-50 shadow-sm shadow-secondary-950/10"
        >
          <SymbolView
            size={34}
            weight="semibold"
            name={category.icon}
            tintColor={colors.primary[900]}
          />
          <Text
            numberOfLines={2}
            className="font-noto-serif text-primary-900 font-semibold text-center"
          >
            {category.name}
          </Text>

          <SymbolView
            size={26}
            weight="semibold"
            name={isEnabled ? "checkmark.circle.fill" : "circle"}
            tintColor={isEnabled ? colors.primary[400] : colors.primary[200]}
            className="absolute right-2 bottom-2"
          />
        </Pressable>
      );
    });
  };

  return (
    <View
      onLayout={handleContainerLayout}
      style={{ gap: GAP }}
      className="flex-row flex-wrap"
    >
      {containerWidth > 0 && renderCategories()}
    </View>
  );
}
