import { SymbolView } from "expo-symbols";
import { Text, View } from "react-native";

export function ActivitySummary() {
  const days = [
    {
      day: "l",
      completed: true,
    },
    {
      day: "m",
      completed: true,
    },
    {
      day: "m",
      completed: false,
    },
    {
      day: "j",
      completed: true,
    },
    {
      day: "v",
      completed: false,
    },
    {
      day: "s",
      completed: false,
    },
    {
      day: "d",
      completed: true,
    },
  ];

  return (
    <View className="gap-4 bg-[#F7E6DF] mx-6 px-6 py-6 rounded-3xl">
      <Text className="font-public-sans font-semibold text-4xl leading-none text-[#291C1A]">
        1 série
      </Text>

      <View className="flex-row justify-between">
        {days.map((item, index) => (
          <View key={index} className="gap-2">
            <View
              className={`items-center justify-center w-8 h-8 rounded-full bg-[${item.completed ? "#F7B194" : "#F7D4C6"}]`}
            >
              {item.completed && (
                <SymbolView
                  size={16}
                  weight="heavy"
                  name="checkmark"
                  tintColor="#FFFFFF"
                />
              )}
            </View>
            <Text className="font-public-sans uppercase text-[#291C1A] text-center">
              {item.day}
            </Text>
          </View>
        ))}
      </View>
    </View>
  );
}
