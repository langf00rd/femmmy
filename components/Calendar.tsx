import { Colors } from "@/constants/theme";
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
import { ChevronLeftIcon, ChevronRightIcon } from "lucide-react-native";
import React, { useMemo } from "react";
import {
  StyleSheet,
  Text,
  TouchableOpacity,
  useColorScheme,
  View,
} from "react-native";

interface CalendarProps {
  cycles: CycleEntry[];
  currentMonth: Date;
  onMonthChange: (month: Date) => void;
}

export function Calendar({
  cycles,
  currentMonth,
  onMonthChange,
}: CalendarProps) {
  const colorScheme = useColorScheme();
  const colors = Colors[colorScheme === "dark" ? "dark" : "light"];

  const monthStart = startOfMonth(currentMonth);
  const monthEnd = endOfMonth(currentMonth);
  const calendarStart = startOfWeek(monthStart, { weekStartsOn: 1 });
  const calendarEnd = endOfWeek(monthEnd, { weekStartsOn: 1 });

  const days = useMemo(() => {
    const dayList: Date[] = [];
    let day = calendarStart;
    while (day <= calendarEnd) {
      dayList.push(day);
      day = addDays(day, 1);
    }
    return dayList;
  }, [calendarStart, calendarEnd]);

  const weeks = useMemo(() => {
    const weekList: Date[][] = [];
    for (let i = 0; i < days.length; i += 7) {
      weekList.push(days.slice(i, i + 7));
    }
    return weekList;
  }, [days]);

  const getDayInfo = (date: Date) => {
    const inPeriod = cycles.some((cycle) => {
      const start = new Date(cycle.periodStartDate);
      const end = new Date(cycle.periodEndDate);
      return date >= start && date <= end;
    });

    let isPredictedPeriod = false;
    let isOvulation = false;
    let inFertileWindow = false;

    if (cycles.length > 0) {
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

      if (isSameDay(date, predictedPeriod)) {
        isPredictedPeriod = true;
      }
      if (isSameDay(date, ovulation)) {
        isOvulation = true;
      }
      if (date >= fertileStart && date <= fertileEnd) {
        inFertileWindow = true;
      }
    }

    return { inPeriod, isPredictedPeriod, isOvulation, inFertileWindow };
  };

  const weekDays = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity
          onPress={() => onMonthChange(subMonths(currentMonth, 1))}
          style={styles.navButton}
        >
          <ChevronLeftIcon color={colors.tint} size={24} />
          {/*<Text style={[styles.navText, { color: colors.tint }]}>&lt;</Text>*/}
        </TouchableOpacity>
        <Text style={[styles.monthTitle, { color: colors.text }]}>
          {format(currentMonth, "MMMM yyyy")}
        </Text>
        <TouchableOpacity
          onPress={() => onMonthChange(addMonths(currentMonth, 1))}
          style={styles.navButton}
        >
          <ChevronRightIcon color={colors.tint} size={24} />
          {/*<Text style={[styles.navText, { color: colors.tint }]}>&gt;</Text>*/}
        </TouchableOpacity>
      </View>

      <View style={styles.weekDays}>
        {weekDays.map((day) => (
          <View key={day} style={styles.weekDayCell}>
            <Text style={[styles.weekDayText, { color: colors.icon }]}>
              {day}
            </Text>
          </View>
        ))}
      </View>

      {weeks.map((week, weekIndex) => (
        <View key={weekIndex} style={styles.week}>
          {week.map((day, dayIndex) => {
            const isCurrentMonth = isSameMonth(day, currentMonth);
            const today = isToday(day);
            const {
              inPeriod,
              isPredictedPeriod,
              isOvulation,
              inFertileWindow,
            } = getDayInfo(day);

            let backgroundColor = colors.background;
            let borderColor = colors.icon;
            let textColor = colors.text;

            if (inPeriod) {
              backgroundColor = colors.period;
              borderColor = colors.periodBorder;
              textColor = colors.periodBorder;
            } else if (inFertileWindow) {
              backgroundColor = colors.fertile;
              borderColor = colors.fertileBorder;
              textColor = colors.fertileBorder;
            }

            if (!isCurrentMonth) {
              textColor = colors.icon + "60";
            }

            return (
              <View
                key={dayIndex}
                style={[
                  styles.dayCell,
                  { backgroundColor },
                  // { backgroundColor, borderColor },
                  // today && { borderWidth: 2, borderColor: colors.tint },
                  { borderRadius: 99, margin: 5, borderWidth: 0 },
                ]}
              >
                <Text
                  style={[
                    styles.dayText,
                    { color: textColor, fontWeight: today ? "bold" : "normal" },
                  ]}
                >
                  {format(day, "d")}
                </Text>
                {isPredictedPeriod && (
                  <View
                    style={[styles.dot, { backgroundColor: colors.success }]}
                  />
                )}
                {isOvulation && (
                  <View
                    style={[styles.dot, { backgroundColor: colors.warning }]}
                  />
                )}
              </View>
            );
          })}
        </View>
      ))}
    </View>
  );
}

function subDays(date: Date, days: number): Date {
  return addDays(date, -days);
}

const styles = StyleSheet.create({
  container: {
    padding: 8,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 16,
  },
  navButton: {
    padding: 8,
  },
  navText: {
    fontSize: 20,
    fontWeight: "bold",
  },
  monthTitle: {
    fontSize: 18,
    fontWeight: "600",
  },
  weekDays: {
    flexDirection: "row",
    marginBottom: 4,
  },
  weekDayCell: {
    flex: 1,
    alignItems: "center",
    paddingVertical: 4,
  },
  weekDayText: {
    fontSize: 12,
    fontWeight: "600",
  },
  week: {
    flexDirection: "row",
  },
  dayCell: {
    flex: 1,
    aspectRatio: 1,
    margin: 2,
    borderRadius: 8,
    borderWidth: 1,
    alignItems: "center",
    justifyContent: "center",
    position: "relative",
  },
  dayText: {
    fontSize: 14,
  },
  dot: {
    position: "absolute",
    bottom: 4,
    width: 4,
    height: 4,
    borderRadius: 2,
  },
});
