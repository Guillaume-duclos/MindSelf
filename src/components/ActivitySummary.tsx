import colors from "@/constants/colors";
import { StorageKey } from "@/enums/storageKey.enum";
import type { WeekActivity } from "@/utils/activity";
import { storage } from "@/utils/storage";
import { Host } from "@expo/ui";
import { Divider } from "@expo/ui/swift-ui";
import { background, opacity } from "@expo/ui/swift-ui/modifiers";
import { SymbolView } from "expo-symbols";
import { Text, View } from "react-native";
import { useMMKVNumber, useMMKVObject } from "react-native-mmkv";

// Monday to Sunday, matching the Monday-indexed week used in
// src/utils/activity.ts.
const DAY_LABELS = ["l", "m", "m", "j", "v", "s", "d"];

export function ActivitySummary() {
  const [openedDays] = useMMKVObject<WeekActivity>(
    StorageKey.ACTIVITY_OPENED_DAYS,
    storage,
  );
  const [completedWeeks] = useMMKVNumber(
    StorageKey.ACTIVITY_COMPLETED_WEEKS_COUNT,
    storage,
  );

  const days = DAY_LABELS.map((day, index) => ({
    day,
    completed: openedDays?.[index] ?? false,
  }));

  return (
    <View className="gap-3 ">
      <Text className="px-5 font-noto-serif font-semibold text-xl text-text-900">
        Mes objectifs
      </Text>

      <View className="bg-primary-100 py-6 rounded-3xl">
        <View className="px-6 flex-row justify-between">
          <Text className="font-noto-serif font-semibold text-4xl text-text-900 pt-0.5">
            <Text className="font-noto-serif text-5xl">
              {completedWeeks ?? 0}
            </Text>{" "}
            série
          </Text>
        </View>

        <Host matchContents={{ vertical: true }} className="w-full mt-2 mb-5">
          <Divider
            modifiers={[background(colors.primary[900]), opacity(0.2)]}
          />
        </Host>

        <View className="px-6 flex-row justify-between">
          {days.map((item, index) => (
            <View key={index} className="gap-2">
              <View
                className={`items-center justify-center w-8 h-8 rounded-full ${item.completed ? "bg-primary-400" : "bg-primary-200"}`}
              >
                {item.completed && (
                  <SymbolView
                    size={16}
                    weight="heavy"
                    name="checkmark"
                    tintColor={colors.primary[100]}
                  />
                )}
              </View>
              <Text className="font-public-sans uppercase font-semibold text-text-400 text-center text-md">
                {item.day}
              </Text>
            </View>
          ))}
        </View>
      </View>
    </View>
  );
}
