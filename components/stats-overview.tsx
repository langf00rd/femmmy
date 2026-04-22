import { useCycles } from "@/context/cycle";
import {
  calculateAverageCycleLength,
  calculateAveragePeriodDuration,
  getPredictionData,
} from "@/lib/predictions";
import { format } from "date-fns";
import { ScrollView, View } from "react-native";
import { SansText } from "./text";

// ─── Sub-components ───────────────────────────────────────────────────────────

function StatCard({
  label,
  value,
  unit,
  accent,
}: {
  label: string;
  value: string;
  unit?: string;
  accent: string;
}) {
  return (
    <View className="flex-1 bg-white rounded-md p-5 items-center shadow-sm shadow-neutral-100 border border-neutral-50">
      <SansText className={`text-4xl tracking-tight ${accent}`}>
        {value}
      </SansText>
      {unit && (
        <SansText className="text-xs text-neutral-400 mt-1">{unit}</SansText>
      )}
      <SansText className="text-xs text-neutral-500 text-center mt-3 leading-4">
        {label}
      </SansText>
    </View>
  );
}

function PredictionCard({
  label,
  startDate,
  endDate,
  accent,
}: {
  label: string;
  startDate: Date;
  endDate?: Date;
  accent: string;
}) {
  return (
    <View className="bg-white rounded-md p-5 border border-neutral-50 shadow-sm shadow-neutral-100">
      <SansText className="text-neutral-400 text-sm uppercase mb-3">
        {label}
      </SansText>
      <SansText
        className={`text-2xl tracking-tight ${accent}`}
        style={{ fontWeight: 500 }}
      >
        {format(startDate, "MMM d, yyyy")}
      </SansText>
      {endDate && (
        <SansText className="text-sm text-neutral-400 mt-1">
          → {format(endDate, "MMM d")}
        </SansText>
      )}
    </View>
  );
}

function SectionTitle({ children }: { children: string }) {
  return (
    <SansText
      className="text-[11px] text-neutral-400 uppercase tracking-widest mb-3 mt-7 px-1"
      style={{ fontWeight: 600 }}
    >
      {children}
    </SansText>
  );
}

// ─── Main Component ───────────────────────────────────────────────────────────

export function StatsOverview() {
  const { cycles } = useCycles();

  const avgCycleLength = calculateAverageCycleLength(cycles);
  const avgPeriodDuration = calculateAveragePeriodDuration(cycles);
  const predictions = cycles.length > 0 ? getPredictionData(cycles) : null;

  if (cycles.length === 0) {
    return (
      <View className="flex-1 items-center justify-center px-8">
        <View className="w-14 h-14 rounded-full bg-rose-50 items-center justify-center mb-4">
          <SansText className="text-2xl">🌸</SansText>
        </View>
        <SansText className="text-base text-neutral-700 text-center">
          No data yet
        </SansText>
        <SansText className="text-sm text-neutral-400 text-center mt-2 leading-5">
          Log at least one period to start seeing insights
        </SansText>
      </View>
    );
  }

  return (
    <ScrollView
      className="flex-1"
      contentContainerClassName="px-4 pb-28"
      showsVerticalScrollIndicator={false}
    >
      <SectionTitle>Averages</SectionTitle>
      <View className="flex-row gap-3">
        <StatCard
          label="Avg Cycle Length"
          value={String(avgCycleLength)}
          unit="days"
          accent="text-rose-500"
        />
        <StatCard
          label="Avg Period Duration"
          value={String(avgPeriodDuration)}
          unit="days"
          accent="text-rose-400"
        />
      </View>

      {predictions && (
        <>
          <SectionTitle>Predictions</SectionTitle>
          <View className="gap-3">
            <PredictionCard
              label="Next Period"
              startDate={predictions.nextPeriodDate}
              accent="text-rose-500"
            />
            <PredictionCard
              label="Ovulation Day"
              startDate={predictions.ovulationDate}
              accent="text-amber-500"
            />
            <PredictionCard
              label="Fertile Window"
              startDate={predictions.fertileWindowStart}
              endDate={predictions.fertileWindowEnd}
              accent="text-violet-500"
            />
          </View>
        </>
      )}

      <SectionTitle>Summary</SectionTitle>
      <View className="bg-white rounded-md p-5 border border-neutral-50 shadow-sm shadow-neutral-100 gap-2">
        <View className="flex-row items-center justify-between">
          <SansText className="text-sm text-neutral-400">
            Cycles logged
          </SansText>
          <SansText className="text-sm text-neutral-700">
            {cycles.length}
          </SansText>
        </View>
        <View className="h-px bg-neutral-100" />
        <View className="flex-row items-center justify-between">
          <SansText className="text-sm text-neutral-400">Based on</SansText>
          <SansText className="text-sm text-neutral-700">
            {Math.min(cycles.length, 6)} most recent cycle
            {Math.min(cycles.length, 6) !== 1 ? "s" : ""}
          </SansText>
        </View>
      </View>
    </ScrollView>
  );
}

// import { useCycles } from "@/context/cycle";
// import {
//   calculateAverageCycleLength,
//   calculateAveragePeriodDuration,
//   getPredictionData,
// } from "@/lib/predictions";
// import { format } from "date-fns";
// import { ScrollView, StyleSheet, Text, View } from "react-native";

// export function StatsOverview() {
//   const { cycles } = useCycles();

//   const avgCycleLength = calculateAverageCycleLength(cycles);
//   const avgPeriodDuration = calculateAveragePeriodDuration(cycles);
//   const predictions = cycles.length > 0 ? getPredictionData(cycles) : null;

//   if (cycles.length === 0) {
//     return (
//       <View style={styles.emptyState}>
//         <Text style={styles.emptyText}>
//           Log at least one period to see insights
//         </Text>
//       </View>
//     );
//   }

//   return (
//     <ScrollView
//       style={styles.container}
//       contentContainerStyle={styles.scrollContent}
//     >
//       <Text style={styles.sectionTitle}>Averages</Text>
//       <View style={styles.statsGrid}>
//         <StatCard
//           label="Average Cycle Length"
//           value={String(avgCycleLength)}
//           unit="days"
//           color="#dc2626"
//         />
//         <StatCard
//           label="Average Period Duration"
//           value={String(avgPeriodDuration)}
//           unit="days"
//           color="#dc2626"
//         />
//       </View>

//       <Text style={styles.sectionTitle}>Predictions</Text>
//       {predictions && (
//         <View style={styles.predictionsContainer}>
//           <PredictionCard
//             label="Next Period"
//             startDate={predictions.nextPeriodDate}
//             color="#dc2626"
//           />
//           <PredictionCard
//             label="Ovulation Day"
//             startDate={predictions.ovulationDate}
//             color="#f59e0b"
//           />
//           <PredictionCard
//             label="Fertile Window"
//             startDate={predictions.fertileWindowStart}
//             endDate={predictions.fertileWindowEnd}
//             color="#8b5cf6"
//           />
//         </View>
//       )}

//       <Text style={styles.sectionTitle}>Data Summary</Text>
//       <View style={styles.summaryCard}>
//         <Text style={styles.summaryText}>
//           {cycles.length} cycle{cycles.length !== 1 ? "s" : ""} logged
//         </Text>
//         <Text style={styles.summaryText}>
//           Based on {Math.min(cycles.length, 6)} most recent cycle
//           {Math.min(cycles.length, 6) !== 1 ? "s" : ""}
//         </Text>
//       </View>
//     </ScrollView>
//   );
// }

// function StatCard({
//   label,
//   value,
//   unit,
//   color,
// }: {
//   label: string;
//   value: string;
//   unit?: string;
//   color: string;
// }) {
//   return (
//     <View style={styles.statCard}>
//       <Text style={[styles.statValue, { color }]}>{value}</Text>
//       {unit && <Text style={styles.statUnit}>{unit}</Text>}
//       <Text style={styles.statLabel}>{label}</Text>
//     </View>
//   );
// }

// function PredictionCard({
//   label,
//   startDate,
//   endDate,
//   color,
// }: {
//   label: string;
//   startDate: Date;
//   endDate?: Date;
//   color: string;
// }) {
//   return (
//     <View style={styles.predictionCard}>
//       <Text style={styles.predictionLabel}>{label}</Text>
//       <Text style={[styles.predictionDate, { color }]}>
//         {format(startDate, "MMM d, yyyy")}
//       </Text>
//       {endDate && (
//         <Text style={styles.predictionDateRange}>
//           to {format(endDate, "MMM d")}
//         </Text>
//       )}
//     </View>
//   );
// }

// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//   },
//   scrollContent: {
//     paddingBottom: 100,
//   },
//   emptyState: {
//     padding: 32,
//     alignItems: "center",
//   },
//   emptyText: {
//     fontSize: 16,
//     color: "#6b7280",
//   },
//   sectionTitle: {
//     fontSize: 18,
//     fontWeight: "600",
//     marginBottom: 12,
//     marginTop: 24,
//     color: "#1f2937",
//   },
//   statsGrid: {
//     flexDirection: "row",
//     gap: 12,
//   },
//   statCard: {
//     flex: 1,
//     backgroundColor: "#fff",
//     padding: 20,
//     borderRadius: 16,
//     alignItems: "center",
//     shadowColor: "#000",
//     shadowOffset: { width: 0, height: 1 },
//     shadowOpacity: 0.05,
//     shadowRadius: 3,
//     elevation: 2,
//   },
//   statValue: {
//     fontSize: 32,
//     fontWeight: "700",
//   },
//   statUnit: {
//     fontSize: 14,
//     color: "#6b7280",
//     marginTop: 2,
//   },
//   statLabel: {
//     fontSize: 13,
//     color: "#374151",
//     marginTop: 8,
//     textAlign: "center",
//   },
//   predictionsContainer: {
//     gap: 12,
//   },
//   predictionCard: {
//     backgroundColor: "#fff",
//     padding: 20,
//     borderRadius: 16,
//     shadowColor: "#000",
//     shadowOffset: { width: 0, height: 1 },
//     shadowOpacity: 0.05,
//     shadowRadius: 3,
//     elevation: 2,
//   },
//   predictionLabel: {
//     fontSize: 13,
//     fontWeight: "500",
//     color: "#6b7280",
//     textTransform: "uppercase",
//     letterSpacing: 0.5,
//   },
//   predictionDate: {
//     fontSize: 22,
//     fontWeight: "700",
//     marginTop: 6,
//   },
//   predictionDateRange: {
//     fontSize: 14,
//     color: "#6b7280",
//     marginTop: 2,
//   },
//   summaryCard: {
//     backgroundColor: "#fff",
//     padding: 20,
//     borderRadius: 16,
//     alignItems: "center",
//     shadowColor: "#000",
//     shadowOffset: { width: 0, height: 1 },
//     shadowOpacity: 0.05,
//     shadowRadius: 3,
//     elevation: 2,
//   },
//   summaryText: {
//     fontSize: 15,
//     color: "#374151",
//     marginBottom: 4,
//   },
// });
