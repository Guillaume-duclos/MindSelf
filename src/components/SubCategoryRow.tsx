import { ThemeCard, type ThemeJsonEntry } from "@/components/ThemeCard";
import Theme from "@/types/theme";
import { memo } from "react";
import { ScrollView, View } from "react-native";

type SubCategoryRowProps = {
  categoryValue: string;
  subCategoryTitle: string;
  themes: ThemeJsonEntry[];
  cardWidth: number;
  cardHeight: number;
  selectedTheme: Theme | undefined;
  onSelectTheme: (theme: Theme) => void;
  playingItem: ThemeJsonEntry | null;
  onToggleAnimation: (item: ThemeJsonEntry) => void;
};

export const SubCategoryRow = memo(function SubCategoryRow({
  categoryValue,
  subCategoryTitle,
  themes: subThemes,
  cardWidth,
  cardHeight,
  selectedTheme,
  onSelectTheme,
  playingItem,
  onToggleAnimation,
}: SubCategoryRowProps) {
  return (
    <ScrollView
      horizontal
      showsHorizontalScrollIndicator={false}
      contentContainerClassName="gap-4 px-5"
      className="py-3"
    >
      {subThemes.map((themeItem, index) => (
        <View key={index}>
          <ThemeCard
            categoryValue={categoryValue}
            item={themeItem}
            itemKey={`${categoryValue}:${subCategoryTitle}:${index}`}
            cardWidth={cardWidth}
            cardHeight={cardHeight}
            selectedTheme={selectedTheme}
            onSelect={onSelectTheme}
            playingItem={playingItem}
            onToggleAnimation={onToggleAnimation}
          />
        </View>
      ))}
    </ScrollView>
  );
});
