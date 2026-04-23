import type { CycleOutput } from "@/lib/cycle-engine";
import {
  addMonths,
  endOfMonth,
  endOfWeek,
  format,
  isSameMonth,
  startOfMonth,
  startOfWeek,
} from "date-fns";
import { useMemo } from "react";
import { SansText } from "./text";
import { View } from "react-native";

interface CalendarProps {
  cycleData: CycleOutput;
  currentMonth: Date;
  onMonthChange: (month: Date) => void;
  today: string;
}

const WEEK_DAYS = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"] as const;

const PHASE_COLORS: Record<string, { bg: string; text: string; border: string }> = {
  period: { bg: "bg-rose-100", text: "text-rose-600", border: "border-transparent" },
  predicted_period: { bg: "bg-rose-100", text: "text-rose-600", border: "border-transparent" },
  ovulation: { bg: "bg-purple-100", text: "text-purple-700", border: "border-transparent" },
  fertile: { bg: "bg-emerald-100", text: "text-emerald-700", border: "border-transparent" },
  luteal: { bg: "bg-transparent", text: "text-neutral-800", border: "border-transparent" },
  delay: { bg: "bg-amber-100", text: "text-amber-600", border: "border-transparent" },
};

function buildCalendarWeeks(currentMonth: Date): Date[][] {
  const monthStart = startOfMonth(currentMonth);
  const monthEnd = endOfMonth(currentMonth);
  const calStart = startOfWeek(monthStart, { weekStartsOn: 1 });
  const calEnd = endOfWeek(monthEnd, { weekStartsOn: 1 });

  const days: Date[] = [];
  let cursor = new Date(calStart);
  while (cursor <= calEnd) {
    days.push(new Date(cursor));
    cursor.setDate(cursor.getDate() + 1);
  }

  const weeks: Date[][] = [];
  for (let i = 0; i < days.length; i += 7) weeks.push(days.slice(i, i + 7));
  return weeks;
}

function buildMonthGrid(
  currentMonth: Date,
): { month: Date; weeks: Date[][] }[] {
  const months: { month: Date; weeks: Date[][] }[] = [];
  for (let offset = 0; offset <= 2; offset++) {
    const month = addMonths(currentMonth, offset);
    months.push({ month, weeks: buildCalendarWeeks(month) });
  }
  return months;
}

interface DayCellProps {
  day: Date;
  currentMonth: Date;
  phase: string;
  isToday: boolean;
}

function DayCell({ day, currentMonth, phase, isToday }: DayCellProps) {
  const isCurrentMonth = isSameMonth(day, currentMonth);
  const colors = PHASE_COLORS[phase] ?? PHASE_COLORS.luteal;

  return (
    <View className="flex-1 aspect-square p-2">
      <View
        className={[
          "flex-1 items-center justify-center relative",
          colors.bg,
          isToday ? "border-2 border-rose-400" : "border border-transparent",
          "rounded-full",
        ].join(" ")}
      >
        <SansText
          className={["text-[13px] leading-none font-medium", isCurrentMonth ? colors.text : "text-neutral-300"].join(
            " ",
          )}
        >
          {format(day, "d")}
        </SansText>
      </View>
    </View>
  );
}

export function Calendar({ cycleData, currentMonth, today }: CalendarProps) {
  const monthGrid = useMemo(() => buildMonthGrid(currentMonth), [currentMonth]);

  const phaseMap = useMemo(() => {
    if (!cycleData?.calendar) return new Map<string, string>();
    const map = new Map<string, string>();
    for (const day of cycleData.calendar) {
      map.set(day.date, day.phase);
    }
    return map;
  }, [cycleData]);

  return (
    <View className="bg-white">
      {monthGrid.map(({ month, weeks }) => (
        <View
          key={month.getTime()}
          className="py-4 border-b border-neutral-100"
        >
          <SansText className="text-sm ml-4 text-neutral-400 mb-4">
            {format(month, "MMMM yyyy")}
          </SansText>

          <View className="flex-row mb-1">
            {WEEK_DAYS.map((day) => (
              <View key={day} className="flex-1 items-center py-1">
                <SansText className="text-[11px] text-neutral-400 uppercase">
                  {day}
                </SansText>
              </View>
            ))}
          </View>

          {weeks.map((week, i) => (
            <View key={i} className="flex-row">
              {week.map((day, j) => {
                const dateKey = format(day, "yyyy-MM-dd");
                const phase = phaseMap.get(dateKey) ?? "luteal";
                const isTodayDate = dateKey === today;
                return (
                  <DayCell
                    key={j}
                    day={day}
                    currentMonth={month}
                    phase={phase}
                    isToday={isTodayDate}
                  />
                );
              })}
            </View>
          ))}
        </View>
      ))}
    </View>
  );
}