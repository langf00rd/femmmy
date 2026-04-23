import type { CycleEntry } from "@/lib/types";
import { AppBar } from "@/components/app-bar";
import { Calendar } from "@/components/Calendar";
import { SansText } from "@/components/text";
import { useCycles } from "@/context/cycle";
import { useRouter } from "expo-router";
import { XIcon } from "lucide-react-native";
import { useEffect, useState } from "react";
import { ScrollView, TouchableOpacity, View } from "react-native";

function transformPeriodsToCycles(data: any[]): CycleEntry[] {
  if (!data || data.length === 0) return [];
  
  const sorted = [...data].sort(
    (a, b) => new Date(a.start_dt).getTime() - new Date(b.start_dt).getTime(),
  );
  
  return data.map((record, index) => {
    const startDate = new Date(record.start_dt);
    const endDate = new Date(record.end_dt);
    const prevStart = sorted[index - 1] ? new Date(sorted[index - 1].start_dt) : null;
    const cycleLength = prevStart
      ? Math.round((startDate.getTime() - prevStart.getTime()) / (1000 * 60 * 60 * 24))
      : 28;
    
    return {
      id: record.id,
      periodStartDate: record.start_dt,
      periodEndDate: record.end_dt,
      cycleLength,
      symptoms: record.symptoms || [],
    };
  });
}

export default function Timeline() {
  const router = useRouter();
  const { fetchPeriods } = useCycles();
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [periodRecords, setPeriodRecords] = useState<any[]>([]);

  useEffect(() => {
    async function loadPeriods() {
      const data = await fetchPeriods();
      if (data) setPeriodRecords(data);
    }
    loadPeriods();
  }, [fetchPeriods]);

  const periodCycles = transformPeriodsToCycles(periodRecords);

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
          cycles={periodCycles}
          currentMonth={currentMonth}
          onMonthChange={setCurrentMonth}
        />
      </ScrollView>
    </View>
  );
}
