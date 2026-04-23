import { format } from "date-fns";
import { AppBar } from "@/components/app-bar";
import { Calendar } from "@/components/Calendar";
import { SansText } from "@/components/text";
import { computeCycle } from "@/lib/cycle-engine";
import { useCycles } from "@/context/cycle";
import { useRouter } from "expo-router";
import { XIcon } from "lucide-react-native";
import { useEffect, useMemo, useState } from "react";
import { ScrollView, TouchableOpacity, View } from "react-native";

export default function Timeline() {
  const router = useRouter();
  const { fetchPeriods } = useCycles();
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [periodRecords, setPeriodRecords] = useState<any[]>([]);
  const todayStr = useMemo(() => format(new Date(), "yyyy-MM-dd"), []);

  useEffect(() => {
    async function loadPeriods() {
      const data = await fetchPeriods();
      if (data) setPeriodRecords(data);
    }
    loadPeriods();
  }, [fetchPeriods]);

  const cycleData = useMemo(() => {
    const today = format(new Date(), "yyyy-MM-dd");
    return computeCycle({ periods: periodRecords, today });
  }, [periodRecords]);

  return (
    <View className="flex-1 bg-white">
      <AppBar
        className="border-b border-b-neutral-200/20"
        action={<View />}
        leading={
          <View className="flex-row items-center gap-5">
            <TouchableOpacity className="p-2" onPress={() => router.back()}>
              <XIcon size={26} />
            </TouchableOpacity>
            <SansText className="text-xl">Timeline</SansText>
          </View>
        }
      />
      <ScrollView>
        <Calendar
          cycleData={cycleData}
          currentMonth={currentMonth}
          onMonthChange={setCurrentMonth}
          today={todayStr}
        />
      </ScrollView>
    </View>
  );
}