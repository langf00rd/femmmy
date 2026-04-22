import React from 'react';
import { View, Text, ScrollView, StyleSheet } from 'react-native';
import { format, differenceInDays, parseISO } from 'date-fns';
import { useCycles } from '@/context/CycleContext';
import {
  getPredictionData,
  calculateAverageCycleLength,
  calculateAveragePeriodDuration,
} from '@/lib/predictions';
import { Colors } from '@/constants/theme';

function StatCard({
  label,
  value,
  unit,
  color,
}: {
  label: string;
  value: string;
  unit?: string;
  color: string;
}) {
  const colors = Colors.light;

  return (
    <View style={[styles.statCard, { backgroundColor: colors.background }]}>
      <Text style={[styles.statValue, { color }]}>{value}</Text>
      {unit && <Text style={[styles.statUnit, { color: colors.icon }]}>{unit}</Text>}
      <Text style={[styles.statLabel, { color: colors.icon }]}>{label}</Text>
    </View>
  );
}

function PredictionCard({
  label,
  startDate,
  endDate,
  color,
}: {
  label: string;
  startDate: Date;
  endDate?: Date;
  color: string;
}) {
  const colors = Colors.light;

  return (
    <View style={[styles.predictionCard, { backgroundColor: colors.background }]}>
      <Text style={[styles.predictionLabel, { color: colors.icon }]}>{label}</Text>
      <Text style={[styles.predictionDate, { color }]}>
        {format(startDate, 'MMM d, yyyy')}
      </Text>
      {endDate && (
        <Text style={[styles.predictionDateRange, { color: colors.icon }]}>
          to {format(endDate, 'MMM d')}
        </Text>
      )}
    </View>
  );
}

export default function InsightsScreen() {
  const { cycles } = useCycles();
  const colors = Colors.light;

  const avgCycleLength = calculateAverageCycleLength(cycles);
  const avgPeriodDuration = calculateAveragePeriodDuration(cycles);
  const predictions =
    cycles.length > 0 ? getPredictionData(cycles) : null;

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <Text style={[styles.title, { color: colors.text }]}>Insights</Text>
        <Text style={[styles.subtitle, { color: colors.icon }]}>
          Your cycle analytics
        </Text>

        {cycles.length === 0 ? (
          <View style={styles.emptyState}>
            <Text style={[styles.emptyText, { color: colors.icon }]}>
              Log at least one period to see insights
            </Text>
          </View>
        ) : (
          <>
            <Text style={[styles.sectionTitle, { color: colors.text }]}>Averages</Text>
            <View style={styles.statsGrid}>
              <StatCard
                label="Average Cycle Length"
                value={String(avgCycleLength)}
                unit="days"
                color={colors.tint}
              />
              <StatCard
                label="Average Period Duration"
                value={String(avgPeriodDuration)}
                unit="days"
                color={colors.tint}
              />
            </View>

            <Text style={[styles.sectionTitle, { color: colors.text }]}>Predictions</Text>
            {predictions && (
              <View style={styles.predictionsContainer}>
                <PredictionCard
                  label="Next Period"
                  startDate={predictions.nextPeriodDate}
                  color={colors.success}
                />
                <PredictionCard
                  label="Ovulation Day"
                  startDate={predictions.ovulationDate}
                  color={colors.warning}
                />
                <PredictionCard
                  label="Fertile Window"
                  startDate={predictions.fertileWindowStart}
                  endDate={predictions.fertileWindowEnd}
                  color={colors.fertileBorder}
                />
              </View>
            )}

            <Text style={[styles.sectionTitle, { color: colors.text }]}>Data Summary</Text>
            <View style={[styles.summaryCard, { backgroundColor: colors.background }]}>
              <Text style={[styles.summaryText, { color: colors.text }]}>
                {cycles.length} cycle{cycles.length !== 1 ? 's' : ''} logged
              </Text>
              <Text style={[styles.summaryText, { color: colors.icon }]}>
                Based on {Math.min(cycles.length, 6)} most recent cycle
                {Math.min(cycles.length, 6) !== 1 ? 's' : ''}
              </Text>
            </View>
          </>
        )}
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
  emptyState: {
    padding: 32,
    alignItems: 'center',
  },
  emptyText: {
    fontSize: 16,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 12,
    marginTop: 8,
  },
  statsGrid: {
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
    fontSize: 28,
    fontWeight: 'bold',
  },
  statUnit: {
    fontSize: 14,
    marginTop: 2,
  },
  statLabel: {
    fontSize: 12,
    marginTop: 8,
    textAlign: 'center',
  },
  predictionsContainer: {
    gap: 12,
  },
  predictionCard: {
    padding: 16,
    borderRadius: 12,
  },
  predictionLabel: {
    fontSize: 12,
    fontWeight: '500',
  },
  predictionDate: {
    fontSize: 20,
    fontWeight: 'bold',
    marginTop: 4,
  },
  predictionDateRange: {
    fontSize: 14,
    marginTop: 2,
  },
  summaryCard: {
    padding: 16,
    borderRadius: 12,
  },
  summaryText: {
    fontSize: 14,
    textAlign: 'center',
  },
});