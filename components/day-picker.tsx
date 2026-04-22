import type { CycleEntry } from "@/lib/types";
import { eachDayOfInterval, endOfMonth, format, isToday } from "date-fns";
import { useMemo } from "react";
import { ScrollView, Text, View } from "react-native";

interface DayPickerProps {
  cycles: CycleEntry[];
}

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

  for (let i = 1; i <= 3; i++) {
    const predictedStart = new Date(lastStart);
    predictedStart.setDate(predictedStart.getDate() + avgLength * i);
    const predictedEnd = new Date(predictedStart);
    predictedEnd.setDate(predictedEnd.getDate() + avgDuration - 1);

    const days = eachDayOfInterval({
      start: predictedStart,
      end: predictedEnd,
    });
    days.forEach((day) => {
      if (day >= new Date()) {
        periodDates.add(format(day, "yyyy-MM-dd"));
      }
    });

    const ovulationDate = new Date(predictedStart);
    ovulationDate.setDate(ovulationDate.getDate() - 14);
    if (ovulationDate >= new Date()) {
      for (let d = -5; d <= 1; d++) {
        const fertileDate = new Date(ovulationDate);
        fertileDate.setDate(fertileDate.getDate() + d);
        if (fertileDate >= new Date()) {
          fertileDates.add(format(fertileDate, "yyyy-MM-dd"));
        }
      }
    }
  }

  return { periodDates, fertileDates };
}

interface DayItemProps {
  date: Date;
  cycles: CycleEntry[];
  predictedDates: PredictedDates;
}

function DayItem({ date, cycles, predictedDates }: DayItemProps) {
  const dateKey = format(date, "yyyy-MM-dd");
  const today = isToday(date);

  const inPeriod = cycles.some((cycle) => {
    const start = new Date(cycle.periodStartDate);
    const end = new Date(cycle.periodEndDate);
    const dayStr = format(date, "yyyy-MM-dd");
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

  const pillBg = isPeriodHighlighted
    ? "bg-rose-100"
    : isFertileHighlighted
      ? "bg-emerald-100"
      : "bg-neutral-50";
  const pillBorder = today
    ? "border-rose-400"
    : isFertileHighlighted
      ? "border-emerald-400"
      : "border-transparent";
  const textColor = isPeriodHighlighted
    ? "text-rose-600"
    : isFertileHighlighted
      ? "text-emerald-700"
      : "text-neutral-800";
  const todayUnderline = today ? "border-b-2 border-rose-400" : "";

  return (
    <View className="w-12 items-center mx-1">
      <Text className="text-[10px] text-neutral-400 font-medium mb-1">
        {format(date, "EEE")}
      </Text>
      <View
        className={[
          "w-10 h-10 rounded-full items-center justify-center border",
          pillBg,
          pillBorder,
          todayUnderline,
        ].join(" ")}
      >
        <Text className={["text-sm font-medium", textColor].join(" ")}>
          {format(date, "d")}
        </Text>
      </View>
    </View>
  );
}

export function DayPicker({ cycles }: DayPickerProps) {
  const days = useMemo(() => {
    const now = new Date();
    const start = now;
    const end = endOfMonth(now);
    return eachDayOfInterval({ start, end });
  }, []);

  const predictedDates = useMemo(() => getPredictedDates(cycles), [cycles]);

  return (
    <View className="bg-white border-b border-b-neutral-200 py-3">
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={{ paddingHorizontal: 8 }}
      >
        {days.map((date) => (
          <DayItem
            key={date.getTime()}
            date={date}
            cycles={cycles}
            predictedDates={predictedDates}
          />
        ))}
      </ScrollView>
    </View>
  );
}
