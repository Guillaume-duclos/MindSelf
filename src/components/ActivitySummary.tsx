import { Host } from "@expo/ui";
import { Divider } from "@expo/ui/swift-ui";
import { background, opacity } from "@expo/ui/swift-ui/modifiers";
import { SymbolView } from "expo-symbols";
import { Pressable, Text, View } from "react-native";

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
      <View className="flex-row justify-between">
        <Text className="font-noto-serif font-semibold text-4xl leading-none text-[#291C1A]">
          <Text className="font-noto-serif font-bold text-5xl">1</Text> série
        </Text>

        <Pressable className="px-4 rounded-full justify-center bg-[#291C1A] flex-row items-center gap-2">
          <SymbolView
            name="clock.arrow.trianglehead.counterclockwise.rotate.90"
            tintColor="#F7E6DF"
          />
          <Text className="text-[#F7E6DF] font-noto-serif font-semibold">
            Historique
          </Text>
        </Pressable>
      </View>

      <Host matchContents={{ vertical: true }} className="w-full my-1">
        <Divider modifiers={[background("#2A2015"), opacity(0.2)]} />
      </Host>

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
