import { AppBar } from "@/components/app-bar";
import { Calendar } from "@/components/calendar";
import { useCycles } from "@/context/cycle";
import { useRouter } from "expo-router";
import { ChevronLeft } from "lucide-react-native";
import { useState } from "react";
import { ScrollView, Text, TouchableOpacity, View } from "react-native";

export default function Timeline() {
  const router = useRouter();
  const { cycles } = useCycles();
  const [currentMonth, setCurrentMonth] = useState(new Date());
  return (
    <View className="flex-1 bg-white">
      <AppBar
        className="border-b border-b-neutral-200/20"
        action={<View />}
        leading={
          <View className="flex-row items-center gap-5">
            <TouchableOpacity className="p-2" onPress={() => router.back()}>
              <ChevronLeft size={24} color="#374151" />
            </TouchableOpacity>
            <Text className="text-xl font-medium">Timeline</Text>
          </View>
        }
      />
      {/*<View className="pt-12 pb-3 px-4 flex-row items-center border-b border-neutral-100">
        <TouchableOpacity onPress={() => router.back()}>
          <ChevronLeft size={24} color="#374151" />
        </TouchableOpacity>
        <Text className="ml-3 text-xl font-semibold"></Text>
      </View>*/}
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
