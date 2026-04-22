import type { CycleEntry } from "@/lib/types";
import {
  addDays,
  addMonths,
  endOfMonth,
  endOfWeek,
  format,
  isSameDay,
  isSameMonth,
  isToday,
  startOfMonth,
  startOfWeek,
  subMonths,
} from "date-fns";
import { ChevronLeft, ChevronRight } from "lucide-react-native";
import React, { useMemo } from "react";
import { Text, TouchableOpacity, View } from "react-native";

// ─── types ────────────────────────────────────────────────────────────────────

interface CalendarProps {
  cycles: CycleEntry[];
  currentMonth: Date;
  onMonthChange: (month: Date) => void;
}

interface DayInfo {
  inPeriod: boolean;
  isPredictedPeriod: boolean;
  isOvulation: boolean;
  inFertileWindow: boolean;
}

// ─── helpers ──────────────────────────────────────────────────────────────────

const subDays = (date: Date, n: number) => addDays(date, -n);

const WEEK_DAYS = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"] as const;

function buildCalendarWeeks(currentMonth: Date): Date[][] {
  const monthStart = startOfMonth(currentMonth);
  const monthEnd = endOfMonth(currentMonth);
  const calStart = startOfWeek(monthStart, { weekStartsOn: 1 });
  const calEnd = endOfWeek(monthEnd, { weekStartsOn: 1 });

  const days: Date[] = [];
  let cursor = calStart;
  while (cursor <= calEnd) {
    days.push(cursor);
    cursor = addDays(cursor, 1);
  }

  const weeks: Date[][] = [];
  for (let i = 0; i < days.length; i += 7) weeks.push(days.slice(i, i + 7));
  return weeks;
}

function getDayInfo(date: Date, cycles: CycleEntry[]): DayInfo {
  const inPeriod = cycles.some((cycle) => {
    const start = new Date(cycle.periodStartDate);
    const end = new Date(cycle.periodEndDate);
    return date >= start && date <= end;
  });

  if (cycles.length === 0) {
    return {
      inPeriod,
      isPredictedPeriod: false,
      isOvulation: false,
      inFertileWindow: false,
    };
  }

  const sorted = [...cycles].sort(
    (a, b) =>
      new Date(b.periodStartDate).getTime() -
      new Date(a.periodStartDate).getTime(),
  );
  const lastStart = new Date(sorted[0].periodStartDate);
  const avgLength =
    sorted.reduce((sum, c) => sum + c.cycleLength, 0) / sorted.length;

  const predictedPeriod = addDays(lastStart, Math.round(avgLength));
  const ovulation = subDays(predictedPeriod, 14);
  const fertileStart = subDays(ovulation, 5);
  const fertileEnd = addDays(ovulation, 1);

  return {
    inPeriod,
    isPredictedPeriod: isSameDay(date, predictedPeriod),
    isOvulation: isSameDay(date, ovulation),
    inFertileWindow: date >= fertileStart && date <= fertileEnd,
  };
}

// ─── sub-components ───────────────────────────────────────────────────────────

interface DayCellProps {
  day: Date;
  currentMonth: Date;
  cycles: CycleEntry[];
}

function DayCell({ day, currentMonth, cycles }: DayCellProps) {
  const today = isToday(day);
  const isCurrentMonth = isSameMonth(day, currentMonth);
  const { inPeriod, isPredictedPeriod, isOvulation, inFertileWindow } =
    getDayInfo(day, cycles);

  // ── cell background ──────────────────────────────────────────────────────
  const cellBg = (() => {
    if (inPeriod) return "bg-rose-100";
    if (inFertileWindow) return "bg-emerald-50";
    return "bg-transparent";
  })();

  const cellBorder = (() => {
    if (today) return "border border-rose-400";
    if (inPeriod) return "border border-rose-200";
    if (inFertileWindow) return "border border-emerald-200";
    return "border border-transparent";
  })();

  // ── text color ───────────────────────────────────────────────────────────
  const textColor = (() => {
    if (!isCurrentMonth) return "text-neutral-300";
    if (inPeriod) return "text-rose-600";
    if (inFertileWindow) return "text-emerald-700";
    if (today) return "text-rose-500";
    return "text-neutral-800";
  })();

  const textWeight = today ? "font-bold" : "font-normal";

  return (
    <View className="flex-1 aspect-square p-2">
      <View
        className={[
          "flex-1 items-center justify-center relative",
          cellBg,
          cellBorder,
          "rounded-full",
        ].join(" ")}
      >
        <Text
          className={["text-[13px] leading-none", textColor, textWeight].join(
            " ",
          )}
        >
          {format(day, "d")}
        </Text>

        {/* indicator dots */}
        {(isPredictedPeriod || isOvulation) && (
          <View className="absolute bottom-[5px] flex-row gap-x-[2px] items-center">
            {isPredictedPeriod && (
              <View className="size-1.5 rounded-full bg-rose-400" />
            )}
            {isOvulation && (
              <View className="size-1.5 rounded-full bg-amber-400" />
            )}
          </View>
        )}
      </View>
    </View>
  );
}

// ─── legend ───────────────────────────────────────────────────────────────────

function Legend() {
  const items = [
    { color: "bg-rose-300", label: "Period" },
    { color: "bg-emerald-200", label: "Fertile window" },
    { color: "bg-rose-400", label: "Predicted period" },
    { color: "bg-amber-400", label: "Ovulation" },
  ] as const;

  return (
    <View className="flex-row flex-wrap gap-x-4 gap-y-2 px-1 pt-3 pb-1">
      {items.map(({ color, label }) => (
        <View key={label} className="flex-row items-center gap-x-1.5">
          <View className={["w-2.5 h-2.5 rounded-full", color].join(" ")} />
          <Text className="text-[11px] text-neutral-400 font-medium">
            {label}
          </Text>
        </View>
      ))}
    </View>
  );
}

// ─── Main Component ───────────────────────────────────────────────────────────

export function Calendar({
  cycles,
  currentMonth,
  onMonthChange,
}: CalendarProps) {
  const weeks = useMemo(() => buildCalendarWeeks(currentMonth), [currentMonth]);

  return (
    <View className="bg-white overflow-hidden shadow-sm shadow-neutral-200">
      {/* header */}
      <View className="flex-row items-center justify-between px-4 py-4 border-b border-neutral-100">
        <TouchableOpacity
          onPress={() => onMonthChange(subMonths(currentMonth, 1))}
        >
          <ChevronLeft size={18} color="#9ca3af" strokeWidth={2.5} />
        </TouchableOpacity>

        <Text className="font-semibold tracking-tight">
          {format(currentMonth, "MMMM yyyy")}
        </Text>

        <TouchableOpacity
          onPress={() => onMonthChange(addMonths(currentMonth, 1))}
        >
          <ChevronRight size={18} color="#9ca3af" strokeWidth={2.5} />
        </TouchableOpacity>
      </View>

      {/* body */}
      <View className="p-4">
        {/* week day labels */}
        <View className="flex-row mb-1">
          {WEEK_DAYS.map((day) => (
            <View key={day} className="flex-1 items-center py-1">
              <Text className="text-[11px] text-neutral-400 uppercase">
                {day}
              </Text>
            </View>
          ))}
        </View>

        {/* calendar grid */}
        {weeks.map((week, i) => (
          <View key={i} className="flex-row">
            {week.map((day, j) => (
              <DayCell
                key={j}
                day={day}
                currentMonth={currentMonth}
                cycles={cycles}
              />
            ))}
          </View>
        ))}

        {/* legend */}
        <Legend />
      </View>
    </View>
  );
}
