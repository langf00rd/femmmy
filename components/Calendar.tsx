import type { CycleEntry } from "@/lib/types";
import {
  addDays,
  addMonths,
  endOfMonth,
  endOfWeek,
  format,
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

function buildMonthGrid(
  currentMonth: Date,
): { month: Date; weeks: Date[][] }[] {
  const months: { month: Date; weeks: Date[][] }[] = [];
  for (let offset = -1; offset <= 10; offset++) {
    const month = addMonths(currentMonth, offset);
    months.push({ month, weeks: buildCalendarWeeks(month) });
  }
  return months;
}

const PREDICTED_FUTURE_CYCLES = 10;

interface PredictedDates {
  periodDates: Set<string>;
  fertileDates: Set<string>;
}

function getPredictedDates(cycles: CycleEntry[]): PredictedDates {
  if (cycles.length === 0) {
    return { periodDates: new Set(), fertileDates: new Set() };
  }

  const sorted = [...cycles].sort(
    (a, b) =>
      new Date(a.periodStartDate).getTime() -
      new Date(b.periodStartDate).getTime(),
  );

  const avgLength = Math.round(
    sorted.reduce((sum, c) => sum + c.cycleLength, 0) / sorted.length,
  );
  const avgDuration = Math.round(
    sorted.reduce((sum, c) => {
      const start = new Date(c.periodStartDate);
      const end = new Date(c.periodEndDate);
      return (
        sum + (end.getTime() - start.getTime()) / (1000 * 60 * 60 * 24) + 1
      );
    }, 0) / sorted.length,
  );

  const lastCycle = sorted[sorted.length - 1];
  const lastStart = new Date(lastCycle.periodStartDate);

  const periodDates = new Set<string>();
  const fertileDates = new Set<string>();

  for (let i = 1; i <= PREDICTED_FUTURE_CYCLES; i++) {
    const predictedStart = addDays(lastStart, avgLength * i);
    const predictedEnd = addDays(predictedStart, avgDuration - 1);

    for (
      let d = 0;
      d <= predictedEnd.getTime() - predictedStart.getTime();
      d += 86400000
    ) {
      const periodDate = new Date(predictedStart.getTime() + d);
      if (periodDate >= new Date()) {
        periodDates.add(format(periodDate, "yyyy-MM-dd"));
      }
    }

    const ovulationDate = subDays(predictedStart, 14);
    if (ovulationDate >= new Date()) {
      for (let d = -5; d <= 1; d++) {
        const fertileDate = addDays(ovulationDate, d);
        if (fertileDate >= new Date()) {
          fertileDates.add(format(fertileDate, "yyyy-MM-dd"));
        }
      }
    }
  }

  return { periodDates, fertileDates };
}

// ─── sub-components ───────────────────────────────────────────────────────────

interface DayCellProps {
  day: Date;
  currentMonth: Date;
  cycles: CycleEntry[];
  predictedDates: PredictedDates;
}

function DayCell({ day, currentMonth, cycles, predictedDates }: DayCellProps) {
  const today = isToday(day);
  const isCurrentMonth = isSameMonth(day, currentMonth);
  const dateKey = format(day, "yyyy-MM-dd");

  const inPeriod = cycles.some((cycle) => {
    const start = new Date(cycle.periodStartDate);
    const end = new Date(cycle.periodEndDate);
    const dayStr = format(day, "yyyy-MM-dd");
    return (
      dayStr >= format(start, "yyyy-MM-dd") &&
      dayStr <= format(end, "yyyy-MM-dd")
    );
  });
  const isPredictedPeriod =
    !inPeriod && predictedDates.periodDates.has(dateKey);
  const inFertileWindow = predictedDates.fertileDates.has(dateKey);

  const isPeriodHighlighted = inPeriod || isPredictedPeriod;
  const isFertileHighlighted = inFertileWindow && !isPeriodHighlighted;

  const cellBg = isPeriodHighlighted
    ? "bg-rose-100"
    : isFertileHighlighted
      ? "bg-emerald-100"
      : "bg-transparent";
  const cellBorder = today
    ? "border border-rose-400"
    : "border border-transparent";
  const textColor = !isCurrentMonth
    ? "text-neutral-300"
    : isPeriodHighlighted
      ? "text-rose-600"
      : isFertileHighlighted
        ? "text-emerald-700"
        : "text-neutral-800";
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
      </View>
    </View>
  );
}

// ─── legend ───────────────────────────────────────────────────────────────────

function Legend() {
  const items = [
    { color: "bg-rose-200", label: "Period" },
    { color: "bg-emerald-200", label: "Fertile window" },
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
  const monthGrid = useMemo(() => buildMonthGrid(currentMonth), [currentMonth]);
  const predictedDates = useMemo(() => getPredictedDates(cycles), [cycles]);

  return (
    <View className="bg-white">
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

      {monthGrid.map(({ month, weeks }) => (
        <View key={month.getTime()} className="p-4 border-b border-neutral-100">
          <Text className="text-sm font-semibold text-neutral-500 mb-2">
            {format(month, "MMMM yyyy")}
          </Text>

          <View className="flex-row mb-1">
            {WEEK_DAYS.map((day) => (
              <View key={day} className="flex-1 items-center py-1">
                <Text className="text-[11px] text-neutral-400 uppercase">
                  {day}
                </Text>
              </View>
            ))}
          </View>

          {weeks.map((week, i) => (
            <View key={i} className="flex-row">
              {week.map((day, j) => (
                <DayCell
                  key={j}
                  day={day}
                  currentMonth={month}
                  cycles={cycles}
                  predictedDates={predictedDates}
                />
              ))}
            </View>
          ))}
        </View>
      ))}
      {/*<Legend />*/}
    </View>
  );
}
