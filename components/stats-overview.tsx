import type { CycleOutput } from "@/lib/cycle-engine";
import { isoToReadable } from "@/lib/utils";
import { ScrollView, View } from "react-native";
import { SansText } from "./text";

interface StatsOverviewProps {
  cycleData: CycleOutput;
}

function StatCard({
  label,
  value,
  unit,
  isDateValue = false,
}: {
  label: string;
  value: string | null;
  unit?: string;
  isDateValue?: boolean;
}) {
  if (!value) {
    return (
      <View className="flex-1 bg-gray-100/80 p-5 rounded-xl items-center shadow-sm shadow-neutral-100 border border-neutral-200/40">
        <SansText
          className="text-left w-full text-neutral-500 mb-5"
          style={{ fontWeight: 500 }}
        >
          {label}
        </SansText>
        <SansText className="text-neutral-400">—</SansText>
      </View>
    );
  }

  return (
    <View className="flex-1 bg-gray-100/80 px-4 py-4 rounded-xl items-center shadow-sm shadow-neutral-100 border border-neutral-200/40">
      <SansText
        className="text-left w-full text-neutral-500 mb-5"
        style={{ fontWeight: 500 }}
      >
        {label}
      </SansText>
      <View className="flex-row items-end w-full justify-end">
        <SansText
          className={`text-[4rem] text-gray-700 tracking-tight leading-[01]`}
          style={{
            fontWeight: 500,
            fontSize: isDateValue ? 21 : 34,
          }}
        >
          {value}
        </SansText>
        {unit && (
          <SansText className="text-md ml-1 text-gray-700 relative -top-1">
            {unit}
          </SansText>
        )}
      </View>
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

export function StatsOverview({ cycleData }: StatsOverviewProps) {
  const hasData = cycleData && cycleData.calendar.length > 0;

  if (!hasData) {
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
      <View>
        <SectionTitle>Averages</SectionTitle>
        <View className="flex-row gap-3">
          <StatCard
            label="Cycle Length (Avg.)"
            value={String(cycleData.avgCycleLength)}
            unit="days"
          />
          <StatCard
            label="Period Duration (Avg.)"
            value={String(cycleData.avgPeriodLength)}
            unit="days"
          />
        </View>
      </View>

      <View>
        <SectionTitle>Predictions</SectionTitle>
        <View className="gap-3">
          <View className="flex-row gap-3">
            <StatCard
              isDateValue
              label="Next Period"
              value={isoToReadable(cycleData.nextPeriod, { format: "mm-dd" })}
            />
            <StatCard
              isDateValue
              label="Ovulation Day"
              value={isoToReadable(cycleData.ovulation, { format: "mm-dd" })}
            />
          </View>
          <StatCard
            isDateValue
            label="Fertile Window"
            value={`${isoToReadable(cycleData.fertileWindowStart, { format: "mm-dd" })} - ${isoToReadable(cycleData.fertileWindowEnd, { format: "mm-dd" })}`}
          />
        </View>
      </View>

      {/*<View>
        <SectionTitle>Summary</SectionTitle>
        <StatCard
          isDateValue
          label="Next Period"
          value={isoToReadable(cycleData.nextPeriod, { format: "mm-dd" })}
        />
      </View>*/}
      {/*<View className="p-5 border border-neutral-200/80 gap-2">
        {cycleData.isDelayed && (
          <>
            <View className="flex-row items-center justify-between">
              <SansText className="text-amber-600">⚠️ Period is late</SansText>
            </View>
            <View className="h-px bg-neutral-100" />
          </>
        )}
        <View className="flex-row items-center justify-between">
          <SansText className="text-neutral-400">Current cycle day</SansText>
          <SansText className="text-neutral-700">
            {cycleData.anchor
              ? Math.max(
                  1,
                  Math.floor(
                    (new Date().getTime() -
                      new Date(cycleData.anchor).getTime()) /
                      (1000 * 60 * 60 * 24),
                  ) + 1,
                )
              : "—"}
          </SansText>
        </View>
      </View>*/}
    </ScrollView>
  );
}
