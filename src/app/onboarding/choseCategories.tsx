import { CategoriesList } from "@/components/CategoriesList";
import { CustomButton } from "@/components/CustomButton";
import { SafeAreaViewContainer } from "@/components/SafeAreaViewContainer";
import { ScreenTitle } from "@/components/ScreenTitle";
import { ScrollViewContainer } from "@/components/ScrollViewContainer";
import { Page } from "@/enums/page.enum";
import { StorageKey } from "@/enums/storageKey.enum";
import { getRouteForPage } from "@/utils/onboarding";
import { setStorageItem } from "@/utils/storage";
import { useRouter } from "expo-router";

export default function choseCategories() {
  const router = useRouter();

  const navigateToNextPage = (): void => {
    setStorageItem(
      StorageKey.CURRENT_ONBOARDING_PAGE,
      Page.ACTIVATE_SUBSCRIPTION,
    );

    router.push(getRouteForPage(Page.ACTIVATE_SUBSCRIPTION));
  };

  return (
    <SafeAreaViewContainer className="flex-1 gap-6 px-10 items-center bg-cream-50">
      <ScreenTitle title="Sélectionnez les catégories pour vos affirmations" />

      <ScrollViewContainer
        contentContainerClassName="flex-grow justify-center"
        contentContainerStyle={{ paddingBottom: 0 }}
      >
        <CategoriesList />
      </ScrollViewContainer>

      <CustomButton
        label="Continuer"
        className="w-full"
        onPress={navigateToNextPage}
      />
    </SafeAreaViewContainer>
  );
}
