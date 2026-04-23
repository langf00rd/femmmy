import type { CycleEntry } from "@/lib/types";
import { AppBar } from "@/components/app-bar";
import { DayPicker } from "@/components/day-picker";
import { LogBottomSheet } from "@/components/log-bottom-sheet";
import { StatsOverview } from "@/components/stats-overview";
import { useCycles } from "@/context/cycle";
import { useLocalFont } from "@/hooks/use-font";
import { COLORS } from "@/lib/theme";
import BottomSheet from "@gorhom/bottom-sheet";
import { useRouter } from "expo-router";
import { CalendarDays, Plus, Settings2 } from "lucide-react-native";
import { useEffect, useMemo, useRef, useState } from "react";
import { TouchableOpacity, View } from "react-native";

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

export default function HomeScreen() {
  useLocalFont();
  const { cycles, fetchPeriods } = useCycles();
  const router = useRouter();
  const bottomSheetRef = useRef<BottomSheet>(null);
  const [, setSheetOpen] = useState(false);

  const [periodRecords, setPeriodRecords] = useState<any[]>([]);

  useEffect(() => {
    async function loadPeriods() {
      const data = await fetchPeriods();
      if (data) setPeriodRecords(data);
    }
    loadPeriods();
  }, [fetchPeriods]);

  const periodCycles = useMemo(
    () => transformPeriodsToCycles(periodRecords),
    [periodRecords],
  );

  const greeting = useMemo(() => {
    const hour = new Date().getHours();
    if (hour >= 5 && hour < 12) return "good morning.";
    if (hour >= 12 && hour < 18) return "good afternoon.";
    return "good evening.";
  }, []);

  const handleOpenBottomSheet = () => {
    setSheetOpen(true);
    bottomSheetRef.current?.expand();
  };

  const handleCloseBottomSheet = () => {
    setSheetOpen(false);
  };

  return (
    <View className="flex-1 " style={{ backgroundColor: COLORS.background }}>
      <AppBar
        title={greeting}
        action={
          <View className="flex-row gap-10">
            <TouchableOpacity onPress={() => router.push("/timeline")}>
              <CalendarDays size={20} />
            </TouchableOpacity>
            <TouchableOpacity onPress={() => router.push("/settings")}>
              <Settings2 size={20} />
            </TouchableOpacity>
          </View>
        }
      />
      <DayPicker cycles={periodCycles} />
      <StatsOverview />
      <TouchableOpacity
        style={{ backgroundColor: COLORS.primary }}
        className="absolute size-14 p-2 bottom-10 right-4 rounded-full flex-row items-center justify-center"
        onPress={handleOpenBottomSheet}
      >
        <Plus size={20} color="white" />
      </TouchableOpacity>
      <LogBottomSheet ref={bottomSheetRef} onClose={handleCloseBottomSheet} />
    </View>
  );
}
