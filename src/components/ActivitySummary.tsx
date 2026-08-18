import { StorageKey } from "@/enums/storageKey.enum";
import type { WeekActivity } from "@/utils/activity";
import { storage } from "@/utils/storage";
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
    <View className="gap-4 bg-cream-200 px-6 py-6 rounded-3xl">
      <View className="flex-row justify-between">
        <Text className="font-noto-serif font-semibold text-4xl leading-none text-ink">
          <Text className="font-noto-serif font-bold text-5xl">
            {completedWeeks ?? 0}
          </Text>{" "}
          série
        </Text>
      </View>

      {/* <Host matchContents={{ vertical: true }} className="w-full">
        <Divider modifiers={[background(colors.ink), opacity(0.2)]} />
      </Host> */}

      <View className="flex-row justify-between">
        {days.map((item, index) => (
          <View key={index} className="gap-2">
            <View
              className={`items-center justify-center w-8 h-8 rounded-full ${item.completed ? "bg-terracotta-200" : "bg-terracotta-100"}`}
            >
              {item.completed && (
                <SymbolView
                  size={16}
                  weight="heavy"
                  name="checkmark"
                  tintColor="white"
                />
              )}
            </View>
            <Text className="font-public-sans uppercase text-ink text-center text-md">
              {item.day}
            </Text>
          </View>
        ))}
      </View>
    </View>
  );
}
