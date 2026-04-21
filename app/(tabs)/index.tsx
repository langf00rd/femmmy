import React, { useMemo } from 'react';
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  useColorScheme,
  TouchableOpacity,
} from 'react-native';
import { format, addDays, startOfDay, isSameDay } from 'date-fns';
import { useCycles } from '@/context/CycleContext';
import {
  getCurrentCycleDay,
  getDaysUntilNextPeriod,
  isInFertileWindow,
  isInMenstruation,
  getPredictionData,
} from '@/lib/predictions';
import { Colors } from '@/constants/theme';

function WeekStrip() {
  const { cycles } = useCycles();
  const colorScheme = useColorScheme();
  const colors = Colors[colorScheme === 'dark' ? 'dark' : 'light'];

  const days = useMemo(() => {
    const today = startOfDay(new Date());
    return Array.from({ length: 14 }, (_, i) => addDays(today, i - 3));
  }, []);

  const fertileWindow = useMemo(() => {
    if (cycles.length === 0) return null;
    return {
      start: startOfDay(
        addDays(
          startOfDay(new Date()),
          -5 + getDaysUntilNextPeriod(cycles) - 14
        )
      ),
      end: addDays(startOfDay(new Date()), -5 + getDaysUntilNextPeriod(cycles) - 14 + 1),
    };
  }, [cycles]);

  return (
    <ScrollView
      horizontal
      showsHorizontalScrollIndicator={false}
      contentContainerStyle={styles.weekStrip}
    >
      {days.map((day, index) => {
        const isToday = isSameDay(day, new Date());
        const inFertile = isInFertileWindow(day, cycles);
        const inPeriod = isInMenstruation(day, cycles);

        return (
          <View
            key={index}
            style={[
              styles.dayCard,
              inFertile && { backgroundColor: colors.fertile, borderColor: colors.fertileBorder },
              inPeriod && { backgroundColor: colors.period, borderColor: colors.periodBorder },
              isToday && styles.todayCard,
            ]}
          >
            <Text style={[styles.dayName, { color: colors.text }]}>
              {format(day, 'EEE')}
            </Text>
            <Text style={[styles.dayNumber, { color: colors.text }]}>
              {format(day, 'd')}
            </Text>
            {inFertile && (
              <Text style={[styles.dayLabel, { color: colors.fertileBorder }]}>
                fertile
              </Text>
            )}
            {inPeriod && (
              <Text style={[styles.dayLabel, { color: colors.periodBorder }]}>
                period
              </Text>
            )}
          </View>
        );
      })}
    </ScrollView>
  );
}

function StatsOverview() {
  const { cycles } = useCycles();
  const colorScheme = useColorScheme();
  const colors = Colors[colorScheme === 'dark' ? 'dark' : 'light'];

  const cycleDay = getCurrentCycleDay(cycles);
  const daysUntil = getDaysUntilNextPeriod(cycles);
  const predictions = cycles.length > 0 ? getPredictionData(cycles) : null;

  return (
    <View style={styles.statsContainer}>
      <View style={styles.statsRow}>
        <View style={[styles.statCard, { backgroundColor: colors.background }]}>
          <Text style={[styles.statValue, { color: colors.tint }]}>{cycleDay}</Text>
          <Text style={[styles.statLabel, { color: colors.icon }]}>Cycle Day</Text>
        </View>
        <View style={[styles.statCard, { backgroundColor: colors.background }]}>
          <Text style={[styles.statValue, { color: colors.tint }]}>{daysUntil}</Text>
          <Text style={[styles.statLabel, { color: colors.icon }]}>Days Until Period</Text>
        </View>
      </View>
      {predictions && (
        <View style={styles.statsRow}>
          <View style={[styles.statCard, { backgroundColor: colors.background }]}>
            <Text style={[styles.statValue, { color: colors.success }]}>
              {format(predictions.nextPeriodDate, 'MMM d')}
            </Text>
            <Text style={[styles.statLabel, { color: colors.icon }]}>Next Period</Text>
          </View>
          <View style={[styles.statCard, { backgroundColor: colors.background }]}>
            <Text style={[styles.statValue, { color: colors.warning }]}>
              {format(predictions.ovulationDate, 'MMM d')}
            </Text>
            <Text style={[styles.statLabel, { color: colors.icon }]}>Ovulation</Text>
          </View>
        </View>
      )}
    </View>
  );
}

export default function HomeScreen() {
  const colorScheme = useColorScheme();
  const colors = Colors[colorScheme === 'dark' ? 'dark' : 'light'];
  const { cycles } = useCycles();

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <Text style={[styles.title, { color: colors.text }]}>Cycle Tracker</Text>
        <Text style={[styles.subtitle, { color: colors.icon }]}>
          {cycles.length === 0
            ? 'Log your first period to get predictions'
            : 'Your cycle at a glance'}
        </Text>

        <WeekStrip />
        <StatsOverview />

        <View style={styles.legendContainer}>
          <Text style={[styles.legendTitle, { color: colors.text }]}>Legend</Text>
          <View style={styles.legendRow}>
            <View style={[styles.legendItem, { backgroundColor: colors.period }]} />
            <Text style={[styles.legendText, { color: colors.icon }]}>Period</Text>
            <View style={[styles.legendItem, { backgroundColor: colors.fertile }]} />
            <Text style={[styles.legendText, { color: colors.icon }]}>Fertile Window</Text>
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
    fontWeight: 'bold',
  },
  subtitle: {
    fontSize: 16,
    marginTop: 4,
    marginBottom: 24,
  },
  weekStrip: {
    flexDirection: 'row',
    gap: 8,
    paddingVertical: 8,
  },
  dayCard: {
    width: 60,
    height: 90,
    borderRadius: 12,
    padding: 8,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
  },
  todayCard: {
    borderWidth: 3,
  },
  dayName: {
    fontSize: 12,
    fontWeight: '600',
  },
  dayNumber: {
    fontSize: 20,
    fontWeight: 'bold',
    marginTop: 4,
  },
  dayLabel: {
    fontSize: 10,
    marginTop: 4,
    fontWeight: '600',
  },
  statsContainer: {
    marginTop: 24,
    gap: 12,
  },
  statsRow: {
    flexDirection: 'row',
    gap: 12,
  },
  statCard: {
    flex: 1,
    padding: 16,
    borderRadius: 12,
    alignItems: 'center',
  },
  statValue: {
    fontSize: 24,
    fontWeight: 'bold',
  },
  statLabel: {
    fontSize: 12,
    marginTop: 4,
  },
  legendContainer: {
    marginTop: 32,
    padding: 16,
  },
  legendTitle: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 12,
  },
  legendRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  legendItem: {
    width: 20,
    height: 20,
    borderRadius: 4,
  },
  legendText: {
    fontSize: 14,
  },
});