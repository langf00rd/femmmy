import { useCycles } from "@/context/cycle";
import { PERIOD_SYMPTOMS } from "@/lib/content";
import { COLORS } from "@/lib/theme";
import BottomSheet, {
  BottomSheetBackdrop,
  BottomSheetView,
} from "@gorhom/bottom-sheet";
import { differenceInDays, format, parseISO, startOfDay } from "date-fns";
import { forwardRef, React, useState } from "react";
import {
  Alert,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  View,
} from "react-native";
import { Button } from "./button";
import Label from "./label";
import { SansText } from "./text";
import TextField from "./text-field";

interface LogBottomSheetProps {
  onClose?: () => void;
  onSave?: () => void;
}

export const LogBottomSheet = forwardRef<BottomSheet, LogBottomSheetProps>(
  ({ onClose, onSave }, ref) => {
    const { addPeriod } = useCycles();

    const today = startOfDay(new Date());
    const todayStr = format(today, "yyyy-MM-dd");

    const [startDate, setStartDate] = useState(todayStr);
    const [endDate, setEndDate] = useState(todayStr);
    const [selectedSymptoms, setSelectedSymptoms] = useState<string[]>([]);
    const [isSubmitting, setIsSubmitting] = useState(false);

    const toggleSymptom = (symptom: string) => {
      setSelectedSymptoms((prev) =>
        prev.includes(symptom)
          ? prev.filter((s) => s !== symptom)
          : [...prev, symptom],
      );
    };

    const handleSave = async () => {
      if (!startDate || !endDate) {
        Alert.alert("Error", "Please select both start and end dates");
        return;
      }

      const start = parseISO(startDate);
      const end = parseISO(endDate);

      if (end < start) {
        Alert.alert("Error", "End date must be on or after start date");
        return;
      }

      setIsSubmitting(true);
      try {
        await addPeriod(startDate, endDate, selectedSymptoms);
        setStartDate(todayStr);
        setEndDate(todayStr);
        setSelectedSymptoms([]);
        (ref as React.RefObject<BottomSheet>)?.current?.close();
        onClose?.();
      } catch {
        Alert.alert("Error", "Failed to save period");
      } finally {
        setIsSubmitting(false);
        onSave?.();
      }
    };

    const periodDuration = () => {
      if (!startDate || !endDate) return 0;
      return differenceInDays(parseISO(endDate), parseISO(startDate)) + 1;
    };

    return (
      <BottomSheet
        ref={ref}
        index={-1}
        keyboardBehavior="interactive"
        keyboardBlurBehavior="restore"
        enablePanDownToClose
        backgroundStyle={{
          backgroundColor: COLORS.background,
        }}
        handleIndicatorStyle={styles.handleIndicator}
        backdropComponent={(props) => (
          <BottomSheetBackdrop
            {...props}
            appearsOnIndex={0}
            disappearsOnIndex={-1}
            opacity={0.5}
          />
        )}
      >
        <BottomSheetView
          className="flex-1"
          style={{
            backgroundColor: COLORS.background,
          }}
        >
          <ScrollView contentContainerStyle={styles.scrollContent}>
            <View className="mb-10">
              <SansText
                className="text-[1.3rem] mb-1.5"
                style={{ fontWeight: 500 }}
              >
                Log your period
              </SansText>
              <SansText
                className="leading-6"
                style={{
                  color: COLORS.mutedForeground,
                }}
              >
                Tell us about your period so we can help you better track your
                cycle
              </SansText>
            </View>

            <View className="mb-10">
              <View className="flex-row gap-2">
                <View className="flex-1">
                  <Label>Start Date</Label>
                  <TextField
                    value={startDate}
                    onChangeText={setStartDate}
                    placeholder="YYYY-MM-DD"
                    placeholderTextColor="#9ca3af"
                    keyboardType="numbers-and-punctuation"
                  />
                </View>
                <View className="flex-1">
                  <Label>End Date</Label>
                  <TextField
                    value={endDate}
                    onChangeText={setEndDate}
                    placeholder="YYYY-MM-DD"
                    placeholderTextColor="#9ca3af"
                    keyboardType="numbers-and-punctuation"
                  />
                </View>
              </View>
              {periodDuration() > 0 && (
                <SansText className="mt-2 text-neutral-400">
                  Duration: {periodDuration()} day
                  {periodDuration() > 1 ? "s" : ""}
                </SansText>
              )}
            </View>

            <View className="mb-20">
              <Label>Symptoms (optional)</Label>
              <View style={styles.symptomsGrid}>
                {PERIOD_SYMPTOMS.map((symptom) => {
                  const isSelected = selectedSymptoms.includes(symptom);
                  return (
                    <TouchableOpacity
                      key={symptom}
                      className={`p-1 rounded-full pb-[4px] px-4 border`}
                      onPress={() => toggleSymptom(symptom)}
                      style={{
                        borderColor: isSelected ? "#000" : COLORS.input,
                        backgroundColor: isSelected ? "#000" : undefined,
                      }}
                    >
                      <SansText
                        className={
                          isSelected ? "text-white" : "text-neutral-500"
                        }
                      >
                        {symptom}
                      </SansText>
                    </TouchableOpacity>
                  );
                })}
              </View>
            </View>

            <Button
              title={isSubmitting ? "Saving..." : "Save"}
              onPress={handleSave}
              disabled={isSubmitting}
              loading={isSubmitting}
            />

            {/*{cycles.length > 0 && (
              <View style={styles.historySection}>
                <Text style={styles.historyTitle}>Recent Entries</Text>
                {cycles
                  .slice()
                  .sort(
                    (a, b) =>
                      new Date(b.periodStartDate).getTime() -
                      new Date(a.periodStartDate).getTime(),
                  )
                  .slice(0, 5)
                  .map((cycle) => (
                    <View key={cycle.id} style={styles.historyItem}>
                      <Text style={styles.historyDate}>
                        {format(parseISO(cycle.periodStartDate), "MMM d")} -{" "}
                        {format(parseISO(cycle.periodEndDate), "MMM d, yyyy")}
                      </Text>
                      <Text style={styles.historyMeta}>
                        Cycle length: {cycle.cycleLength} days
                      </Text>
                    </View>
                  ))}
              </View>
            )}*/}
          </ScrollView>
        </BottomSheetView>
      </BottomSheet>
    );
  },
);

LogBottomSheet.displayName = "LogBottomSheet";

const styles = StyleSheet.create({
  background: {
    backgroundColor: "#fff",
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
  },
  handleIndicator: {
    backgroundColor: "#d1d5db",
    width: 40,
  },
  container: {
    flex: 1,
  },
  scrollContent: {
    padding: 24,
    paddingBottom: 40,
  },
  title: {
    fontSize: 28,
    fontWeight: "700",
    color: "#1f2937",
    textAlign: "center",
  },
  subtitle: {
    fontSize: 14,
    color: "#6b7280",
    textAlign: "center",
    marginTop: 4,
    marginBottom: 28,
  },
  formSection: {
    marginBottom: 20,
  },
  label: {
    fontSize: 14,
    fontWeight: "600",
    color: "#374151",
    marginBottom: 8,
    textTransform: "uppercase",
    letterSpacing: 0.5,
  },
  input: {
    borderWidth: 1,
    borderRadius: 12,
    padding: 16,
    fontSize: 16,
    backgroundColor: "#f9fafb",
    borderColor: "#e5e7eb",
    color: "#1f2937",
  },
  helperText: {
    fontSize: 12,
    color: "#6b7280",
    marginTop: 6,
  },
  symptomsGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 10,
  },
  symptomChip: {
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 24,
    borderWidth: 1.5,
    borderColor: "#fca5a5",
    backgroundColor: "#fff",
  },
  symptomText: {
    fontSize: 14,
    fontWeight: "500",
    color: "#dc2626",
  },
  historySection: {
    marginTop: 32,
    paddingTop: 24,
    borderTopWidth: 1,
    borderTopColor: "#e5e7eb",
  },
  historyTitle: {
    fontSize: 16,
    fontWeight: "600",
    color: "#374151",
    marginBottom: 12,
  },
  historyItem: {
    padding: 14,
    backgroundColor: "#f9fafb",
    borderRadius: 12,
    marginBottom: 8,
  },
  historyDate: {
    fontSize: 15,
    fontWeight: "600",
    color: "#1f2937",
  },
  historyMeta: {
    fontSize: 13,
    color: "#6b7280",
    marginTop: 4,
  },
});
