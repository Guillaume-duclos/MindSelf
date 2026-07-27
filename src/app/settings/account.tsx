import { ListItemContainer } from "@/components/ListItemContainer";
import { ListItemLink } from "@/components/ListItemLink";
import { ScreenHeader } from "@/components/ScreenHeader";
import { useRouter } from "expo-router";
import { ScrollView, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

export default function Account() {
  const router = useRouter();
  const { bottom } = useSafeAreaInsets();

  return (
    <View className="flex-1 bg-[#FAF3EF]" style={{ paddingBottom: bottom }}>
      <ScreenHeader
        title="Mon compte"
        showBackButton
        showCloseButton={false}
        className="px-5"
      />

      <ScrollView contentContainerClassName="flex-1 px-5 gap-10">
        <ListItemContainer title="Informations personnelles">
          <ListItemLink
            text="Prénom"
            onPress={() => router.navigate("/settings/account")}
          />
          <ListItemLink
            text="Genre"
            onPress={() => router.navigate("/settings/account")}
          />
          <ListItemLink
            text="Email"
            onPress={() => router.navigate("/settings/account")}
          />
          <ListItemLink
            text="Langue"
            onPress={() => router.navigate("/settings/account")}
          />
        </ListItemContainer>
      </ScrollView>
    </View>
  );
}
