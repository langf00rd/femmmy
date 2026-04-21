import { Calendar } from "@/components/Calendar";
import { Colors } from "@/constants/theme";
import { useCycles } from "@/context/CycleContext";
import {
  getCurrentCycleDay,
  getDaysUntilNextPeriod,
  getPredictionData,
} from "@/lib/predictions";
import { format } from "date-fns";
import React, { useState } from "react";
import {
  ScrollView,
  StyleSheet,
  Text,
  useColorScheme,
  View,
} from "react-native";

function StatsOverview() {
  const { cycles } = useCycles();
  const colorScheme = useColorScheme();
  const colors = Colors[colorScheme === "dark" ? "dark" : "light"];

  const cycleDay = getCurrentCycleDay(cycles);
  const daysUntil = getDaysUntilNextPeriod(cycles);
  const predictions = cycles.length > 0 ? getPredictionData(cycles) : null;

  return (
    <View style={styles.statsContainer}>
      <View style={styles.statsRow}>
        <View style={[styles.statCard, { backgroundColor: colors.background }]}>
          <Text style={[styles.statValue, { color: colors.tint }]}>
            {cycleDay}
          </Text>
          <Text style={[styles.statLabel, { color: colors.icon }]}>
            Cycle Day
          </Text>
        </View>
        <View style={[styles.statCard, { backgroundColor: colors.background }]}>
          <Text style={[styles.statValue, { color: colors.tint }]}>
            {daysUntil}
          </Text>
          <Text style={[styles.statLabel, { color: colors.icon }]}>
            Days Until Period
          </Text>
        </View>
      </View>
      {predictions && (
        <View style={styles.statsRow}>
          <View
            style={[styles.statCard, { backgroundColor: colors.background }]}
          >
            <Text style={[styles.statValue, { color: colors.success }]}>
              {format(predictions.nextPeriodDate, "MMM d")}
            </Text>
            <Text style={[styles.statLabel, { color: colors.icon }]}>
              Next Period
            </Text>
          </View>
          <View
            style={[styles.statCard, { backgroundColor: colors.background }]}
          >
            <Text style={[styles.statValue, { color: colors.warning }]}>
              {format(predictions.ovulationDate, "MMM d")}
            </Text>
            <Text style={[styles.statLabel, { color: colors.icon }]}>
              Ovulation
            </Text>
          </View>
        </View>
      )}
    </View>
  );
}

export default function HomeScreen() {
  const colorScheme = useColorScheme();
  const colors = Colors[colorScheme === "dark" ? "dark" : "light"];
  const { cycles } = useCycles();
  const [currentMonth, setCurrentMonth] = useState(new Date());

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <Text style={[styles.title, { color: colors.text }]}>
          Cycle Tracker
        </Text>
        <Text style={[styles.subtitle, { color: colors.icon }]}>
          {cycles.length === 0
            ? "Log your first period to get predictions"
            : "Your cycle at a glance"}
        </Text>

        <Calendar
          cycles={cycles}
          currentMonth={currentMonth}
          onMonthChange={setCurrentMonth}
        />
        <StatsOverview />

        <View style={styles.legendContainer}>
          <Text style={[styles.legendTitle, { color: colors.text }]}>
            Legend
          </Text>
          <View style={styles.legendRow}>
            <View
              style={[styles.legendDot, { backgroundColor: colors.period }]}
            />
            <Text style={[styles.legendText, { color: colors.icon }]}>
              Period
            </Text>
            <View
              style={[styles.legendDot, { backgroundColor: colors.fertile }]}
            />
            <Text style={[styles.legendText, { color: colors.icon }]}>
              Fertile
            </Text>
            <View
              style={[styles.legendDot, { backgroundColor: colors.success }]}
            />
            <Text style={[styles.legendText, { color: colors.icon }]}>
              Predicted
            </Text>
            <View
              style={[styles.legendDot, { backgroundColor: colors.warning }]}
            />
            <Text style={[styles.legendText, { color: colors.icon }]}>
              Ovulation
            </Text>
          </View>
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollContent: {
    padding: 16,
    paddingTop: 60,
  },
  title: {
    fontSize: 32,
    fontWeight: "bold",
  },
  subtitle: {
    fontSize: 16,
    marginTop: 4,
    marginBottom: 16,
  },
  statsContainer: {
    marginTop: 24,
    gap: 12,
  },
  statsRow: {
    flexDirection: "row",
    gap: 12,
  },
  statCard: {
    flex: 1,
    padding: 16,
    borderRadius: 12,
    alignItems: "center",
  },
  statValue: {
    fontSize: 24,
    fontWeight: "bold",
  },
  statLabel: {
    fontSize: 12,
    marginTop: 4,
  },
  legendContainer: {
    marginTop: 24,
    padding: 16,
  },
  legendTitle: {
    fontSize: 16,
    fontWeight: "600",
    marginBottom: 12,
  },
  legendRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 16,
  },
  legendDot: {
    width: 12,
    height: 12,
    borderRadius: 6,
  },
  legendText: {
    fontSize: 12,
  },
});
