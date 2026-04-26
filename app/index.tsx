import { AppBar } from "@/components/app-bar";
import { DayPicker } from "@/components/day-picker";
import { LogBottomSheet } from "@/components/log-bottom-sheet";
import { StatsOverview } from "@/components/stats-overview";
import { SansText } from "@/components/text";
import { useCycles } from "@/context/cycle";
import { useLocalFont } from "@/hooks/use-font";
import { computeCycle } from "@/lib/cycle-engine";
import { COLORS } from "@/lib/theme";
import { isoToReadable } from "@/lib/utils";
import BottomSheet from "@gorhom/bottom-sheet";
import { format } from "date-fns";
import { useRouter } from "expo-router";
import { CalendarDays, Plus } from "lucide-react-native";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { Alert, TouchableOpacity, View } from "react-native";

export default function HomeScreen() {
  useLocalFont();
  const router = useRouter();
  const { fetchPeriods } = useCycles();
  const bottomSheetRef = useRef<BottomSheet>(null);
  const [, setSheetOpen] = useState(false);
  const [periodRecords, setPeriodRecords] = useState<any[]>([]);

  useEffect(() => {
    async function loadPeriods() {
      try {
        const data = await fetchPeriods();
        if (data) setPeriodRecords(data);
      } catch (err) {
        console.error("[error fetching periods]", err);
        Alert.alert("Error", (err as Error).message);
      }
    }

    loadPeriods();
  }, [fetchPeriods]);

  const cycleData = useMemo(() => {
    const today = format(new Date(), "yyyy-MM-dd");
    return computeCycle({ periods: periodRecords, today });
  }, [periodRecords]);

  const greeting = useMemo(() => {
    const hour = new Date().getHours();
    if (hour >= 5 && hour < 12) return "good morning.";
    if (hour >= 12 && hour < 18) return "good afternoon.";
    return "good evening.";
  }, []);

  console.log("[greeting]", greeting);

  const todayStr = useMemo(() => format(new Date(), "yyyy-MM-dd"), []);

  const handleOpenBottomSheet = () => {
    setSheetOpen(true);
    bottomSheetRef.current?.expand();
  };

  const handleRefreshPeriods = useCallback(async () => {
    const data = await fetchPeriods();
    if (data) setPeriodRecords(data);
  }, [fetchPeriods]);

  const handleCloseBottomSheet = () => {
    setSheetOpen(false);
  };

  const todayReadable = useMemo(() => format(new Date(), "yyyy-MM-dd"), []);

  return (
    <View className="flex-1 " style={{ backgroundColor: COLORS.background }}>
      <AppBar
        className="-mt-2 -mb-4"
        titleSlot={
          <View>
            <SansText
              className="text-2xl"
              style={{
                fontWeight: 600,
              }}
            >
              {isoToReadable(todayReadable, { format: "mm-yy" })}
            </SansText>
          </View>
        }
        action={
          <View>
            <TouchableOpacity onPress={() => router.push("/timeline")}>
              <CalendarDays
                size={20}
                color={COLORS.mutedForeground}
              />
            </TouchableOpacity>
          </View>
        }
      />
      <DayPicker cycleData={cycleData} today={todayStr} />
      <StatsOverview cycleData={cycleData} />
      <TouchableOpacity
        style={{ backgroundColor: COLORS.primary }}
        className="absolute size-14 p-2 bottom-10 right-4 rounded-full flex-row items-center justify-center"
        onPress={handleOpenBottomSheet}
      >
        <Plus size={20} color="white" />
      </TouchableOpacity>
      <LogBottomSheet
        ref={bottomSheetRef}
        onClose={handleCloseBottomSheet}
        onSave={handleRefreshPeriods}
      />
    </View>
  );
}
