import colors from "@/constants/colors";
import { Page } from "@/enums/page.enum";
import { StorageKey } from "@/enums/storageKey.enum";
import { getRouteForPage } from "@/utils/onboarding";
import { isPremiumFromCustomerInfo, restorePurchases } from "@/utils/purchases";
import { setStorageItem } from "@/utils/storage";
import { router } from "expo-router";
import { SymbolView } from "expo-symbols";
import { useState } from "react";
import { Alert, Pressable, Text, View } from "react-native";

export function RestorePurchasesButton() {
  const [isRestoring, setIsRestoring] = useState(false);

  const onPressActivateSubscription = (): void => {
    setStorageItem(StorageKey.CURRENT_ONBOARDING_PAGE, Page.HOME);
    router.push(getRouteForPage(Page.HOME));
  };

  const handleRestore = async (): Promise<void> => {
    if (isRestoring) {
      return;
    }

    setIsRestoring(true);

    try {
      const customerInfo = await restorePurchases();

      if (isPremiumFromCustomerInfo(customerInfo)) {
        onPressActivateSubscription?.();
      } else {
        Alert.alert(
          "Aucun abonnement trouvé",
          "Aucun achat actif n'a été retrouvé pour ce compte.",
        );
      }
    } catch {
      Alert.alert(
        "Restauration impossible",
        "Impossible de restaurer vos achats pour le moment. Réessayez plus tard.",
      );
    } finally {
      setIsRestoring(false);
    }
  };

  return (
    <Pressable className="gap-2 items-center" onPress={handleRestore}>
      <View className="gap-2 rounded-full flex-row items-center px-4 h-[42px]">
        <SymbolView
          size={24}
          weight="medium"
          name="cart.fill"
          tintColor={colors.text[900]}
        />
        <Text className="text-center font-public-sans font-medium text-text-900 text-lg">
          Restaurer un achat
        </Text>
      </View>
    </Pressable>
  );
}
