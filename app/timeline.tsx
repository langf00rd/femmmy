import { Calendar } from "@/components/calendar";
import { useCycles } from "@/context/cycle";
import { useState } from "react";
import { ScrollView, View } from "react-native";

export default function Timeline() {
  const { cycles } = useCycles();
  const [currentMonth, setCurrentMonth] = useState(new Date());
  return (
    <View className="flex-1 bg-white">
      <ScrollView>
        <Calendar
          cycles={cycles}
          currentMonth={currentMonth}
          onMonthChange={setCurrentMonth}
        />
      </ScrollView>
    </View>
  );
}
