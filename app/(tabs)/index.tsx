import { Calendar } from "@/components/calendar";
import { useCycles } from "@/context/CycleContext";
import { CalendarIcon, FlameIcon } from "lucide-react-native";
import { useMemo, useState } from "react";
import { ScrollView, Text, TouchableOpacity, View } from "react-native";

export default function HomeScreen() {
  const { cycles } = useCycles();
  const [currentMonth, setCurrentMonth] = useState(new Date());

  const greeting = useMemo(() => {
    const hour = new Date().getHours();
    if (hour >= 5 && hour < 12) return "good morning.";
    if (hour >= 12 && hour < 18) return "good afternoon.";
    return "good evening.";
  }, []);

  return (
    <View>
      <ScrollView>
        <View className="border-b border-b-neutral-200 bg-white pt-16">
          <View className="mb-5 flex items-center justify-between flex-row px-4">
            <View className="items-center border border-neutral-300 flex-row gap-2 px-2 py-1 rounded-full">
              <FlameIcon className="text-orange-500" color="orange" size={14} />
              <Text>18</Text>
            </View>
            <Text className="text-3xl font-medium">{greeting}</Text>
            <TouchableOpacity>
              <CalendarIcon className="hidden" />
            </TouchableOpacity>
          </View>
          <Calendar
            cycles={cycles}
            currentMonth={currentMonth}
            onMonthChange={setCurrentMonth}
          />
        </View>
      </ScrollView>
    </View>
  );
}
