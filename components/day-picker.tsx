import type { CycleOutput } from "@/lib/cycle-engine";
import { format, getTime, parseISO } from "date-fns";
import { useMemo } from "react";
import { ScrollView, View } from "react-native";
import { SansText } from "./text";

interface DayPickerProps {
  cycleData: CycleOutput;
  today: string;
}

const PHASE_COLORS: Record<string, { bg: string; text: string; border: string }> = {
  period: { bg: "bg-rose-100", text: "text-rose-600", border: "border-transparent" },
  predicted_period: { bg: "bg-rose-100", text: "text-rose-600", border: "border-transparent" },
  ovulation: { bg: "bg-purple-100", text: "text-purple-700", border: "border-transparent" },
  fertile: { bg: "bg-emerald-100", text: "text-emerald-700", border: "border-transparent" },
  luteal: { bg: "bg-neutral-50", text: "text-neutral-800", border: "border-transparent" },
  delay: { bg: "bg-amber-100", text: "text-amber-600", border: "border-transparent" },
};

interface DayItemProps {
  date: Date;
  phase: string;
  isToday: boolean;
}

function DayItem({ date, phase, isToday }: DayItemProps) {
  const colors = PHASE_COLORS[phase] ?? PHASE_COLORS.luteal;

  return (
    <View className="w-12 items-center mx-1">
      <SansText className="text-[10px] text-neutral-400 mb-2">
        {format(date, "EEE")}
      </SansText>
      <View
        className={[
          "size-10 rounded-full flex-row items-center justify-center border-2",
          colors.bg,
          isToday ? "border-rose-400" : colors.border,
        ].join(" ")}
      >
        <SansText className={["text-sm font-bold", colors.text].join(" ")}>
          {format(date, "d")}
        </SansText>
      </View>
    </View>
  );
}

export function DayPicker({ cycleData, today }: DayPickerProps) {
  const todayDate = useMemo(() => parseISO(today), [today]);
  const days = useMemo(() => {
    const result: Date[] = [];
    for (let i = 0; i < 11; i++) {
      const d = new Date(todayDate);
      d.setDate(d.getDate() + i);
      result.push(d);
    }
    return result;
  }, [todayDate]);

  const phaseMap = useMemo(() => {
    if (!cycleData?.calendar) return new Map<string, string>();
    const map = new Map<string, string>();
    for (const day of cycleData.calendar) {
      map.set(day.date, day.phase);
    }
    return map;
  }, [cycleData]);

  return (
    <View className="bg-white border-b border-neutral-200/80 py-3">
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={{ paddingHorizontal: 8 }}
      >
        {days.map((date) => {
          const dateKey = format(date, "yyyy-MM-dd");
          const phase = phaseMap.get(dateKey) ?? "luteal";
          const isTodayDate = dateKey === today;
          return (
            <DayItem key={getTime(date)} date={date} phase={phase} isToday={isTodayDate} />
          );
        })}
      </ScrollView>
    </View>
  );
}