import NotificationTimeRange from "@/types/notificationTimeRange";
import option from "@/types/option";
import { Text, View } from "react-native";
import { CustomOptionsPicker } from "./CustomOptionsPicker";

type Props = {
  value: NotificationTimeRange;
  onChange: (value: NotificationTimeRange) => void;
  className?: string;
};

const COUNT_OPTIONS: option[] = Array.from({ length: 20 }, (_, i) => {
  const count = String(i + 1);
  return { label: count, value: count };
});

const HOUR_OPTIONS: option[] = Array.from({ length: 24 }, (_, i) => {
  const hour = String(i).padStart(2, "0");
  return { label: hour, value: hour };
});

export function NotificationSetter({ value, onChange, className }: Props) {
  const handleStartTimeChange = (startTime: string) => {
    const hour = Number(startTime);
    const endTime =
      hour >= Number(value.endTime)
        ? String((hour + 1) % 24).padStart(2, "0")
        : value.endTime;

    onChange({ ...value, startTime, endTime });
  };

  return (
    <View className={`flex-row ${className}`}>
      <View className="flex-1">
        <Text className="text-center text-xl font-public-sans font-semibold leading-6">
          Rappels par {"\n"}jour
        </Text>

        <CustomOptionsPicker
          options={COUNT_OPTIONS}
          selectedValue={value.count}
          onValueChange={(count) => onChange({ ...value, count })}
        />
      </View>

      <View className="flex-1">
        <Text className="text-center text-xl font-public-sans font-semibold leading-6">
          Heure de {"\n"}début
        </Text>

        <CustomOptionsPicker
          options={HOUR_OPTIONS}
          selectedValue={value.startTime}
          onValueChange={handleStartTimeChange}
          fixedLabel="h"
        />
      </View>

      <View className="flex-1">
        <Text className="text-center text-xl font-public-sans font-semibold leading-6">
          Heure de{"\n"}fin
        </Text>

        <CustomOptionsPicker
          options={HOUR_OPTIONS}
          selectedValue={value.endTime}
          onValueChange={(endTime) => onChange({ ...value, endTime })}
          fixedLabel="h"
        />
      </View>
    </View>
  );
}
