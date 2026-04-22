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
  isDateValue = false,
}: {
  label: string;
  value: string | Date;
  unit?: string;
  isDateValue?: boolean;
}) {
  return (
    <View className="flex-1 bg-white p-5 rounded-md items-center shadow-sm shadow-neutral-100 border border-neutral-200/80">
      <SansText
        className="text-left w-full text-neutral-500 mb-5"
        style={{ fontWeight: 500 }}
      >
        {label}
      </SansText>
      <View className="flex-row items-end w-full justify-end">
        <SansText
          className={`text-[4rem] tracking-tight leading-[01]`}
          style={{
            fontWeight: 500,
            fontSize: isDateValue ? 24 : 40,
          }}
        >
          {isDateValue ? format(value, "MMM d, yyyy") : String(value)}
        </SansText>
        {unit && (
          <SansText className="text-sm ml-1 text-neutral-400 relative -top-1">
            {unit}
          </SansText>
        )}
      </View>
    </View>
  );
}

// function PredictionCard({
//   label,
//   startDate,
//   endDate,
//   // accent,
// }: {
//   label: string;
//   startDate: Date;
//   endDate?: Date;
//   // accent: string;
// }) {
//   return (
//     <View className="bg-white rounded-md p-5 border border-neutral-50 shadow-sm shadow-neutral-100">
//       <SansText className="text-neutral-400 text-sm mb-3">{label}</SansText>
//       <SansText
//         className={`text-2xl tracking-tight`}
//         style={{ fontWeight: 500 }}
//       >
//         {format(startDate, "MMM d, yyyy")}
//       </SansText>
//       {endDate && (
//         <SansText className="text-sm text-neutral-400 mt-1">
//           → {format(endDate, "MMM d")}
//         </SansText>
//       )}
//     </View>
//   );
// }

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
      <View className="flex-1 items-center justify-center px-8 -mt-20">
        <View className="w-14 h-14 rounded-full bg-rose-50 items-center justify-center mb-4">
          <SansText className="text-2xl">🌸</SansText>
        </View>
        <SansText className="text-base text-neutral-700 text-center">
          No data yet
        </SansText>
        <SansText className="text-neutral-400 text-center mt-2 leading-5">
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
          label="Cycle Length (Avg.)"
          value={String(avgCycleLength)}
          unit="days"
          // accent="text-rose-500"
        />
        <StatCard
          label="Period Duration (Avg.)"
          value={String(avgPeriodDuration)}
          unit="days"
          // accent="text-rose-400"
        />
      </View>

      {predictions && (
        <>
          <SectionTitle>Predictions</SectionTitle>
          <View className="gap-3">
            <StatCard
              isDateValue
              label="🌱 Fertile Window"
              value={predictions.fertileWindowStart}
              // endDate={predictions.fertileWindowEnd}
            />
            <StatCard
              isDateValue
              label="⛳ Ovulation Day"
              value={predictions.ovulationDate}
            />
            <StatCard
              isDateValue
              label="🩸 Next Period"
              value={predictions.nextPeriodDate}
            />
          </View>
        </>
      )}

      <SectionTitle>Summary</SectionTitle>
      <View className="bg-white rounded-md p-5 shadow-sm shadow-neutral-100 border border-neutral-200/80 gap-2">
        <View className="flex-row items-center justify-between">
          <SansText className="text-neutral-400">Cycles logged</SansText>
          <SansText className="text-neutral-700">{cycles.length}</SansText>
        </View>
        <View className="h-px bg-neutral-100" />
        <View className="flex-row items-center justify-between">
          <SansText className="text-neutral-400">Based on</SansText>
          <SansText className="text-neutral-700">
            {Math.min(cycles.length, 6)} most recent cycle
            {Math.min(cycles.length, 6) !== 1 ? "s" : ""}
          </SansText>
        </View>
      </View>
    </ScrollView>
  );
}
