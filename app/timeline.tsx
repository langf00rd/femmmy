import { Calendar } from "@/components/Calendar";
import { useCycles } from "@/context/cycle";
import { computeCycle } from "@/lib/cycle-engine";
import { format } from "date-fns";
import { useEffect, useMemo, useState } from "react";
import { ScrollView } from "react-native";

export default function Timeline() {
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
    <ScrollView className="pt-10 bg-white">
      <Calendar
        cycleData={cycleData}
        currentMonth={currentMonth}
        onMonthChange={setCurrentMonth}
        today={todayStr}
      />
    </ScrollView>
  );
}
