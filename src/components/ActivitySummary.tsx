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
    <View className="gap-4 bg-[#F7E6DF] px-6 py-6 rounded-3xl">
      <Text className="font-noto-serif font-semibold text-4xl leading-none text-[#291C1A]">
        <Text className="font-noto-serif font-bold text-5xl">1</Text> série
      </Text>

      <View className="flex-row justify-between">
        {days.map((item, index) => (
          <View key={index} className="gap-2">
            <View
              className={`items-center justify-center w-8 h-8 rounded-full ${item.completed ? "bg-[#F7B194]" : "bg-[#F7D4C6]"}`}
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
            <Text className="font-public-sans uppercase text-[#291C1A] text-center text-md">
              {item.day}
            </Text>
          </View>
        ))}
      </View>
    </View>
  );
}
