import { useCycles } from "@/context/cycle";
import { differenceInDays, format, parseISO, startOfDay } from "date-fns";
import React, { useState } from "react";
import {
  Alert,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";

const SYMPTOM_OPTIONS = [
  "Cramps",
  "Bloating",
  "Fatigue",
  "Headache",
  "Mood swings",
  "Breast tenderness",
  "Acne",
  "Back pain",
];

export default function LogPeriodScreen() {
  const { cycles, addCycle } = useCycles();

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
      await addCycle(startDate, endDate, selectedSymptoms);
      Alert.alert("Success", "Period logged successfully!", [
        {
          text: "OK",
          onPress: () => {
            setStartDate(todayStr);
            setEndDate(todayStr);
            setSelectedSymptoms([]);
          },
        },
      ]);
    } catch (error) {
      Alert.alert("Error", "Failed to save period");
    } finally {
      setIsSubmitting(false);
    }
  };

  const periodDuration = () => {
    if (!startDate || !endDate) return 0;
    return differenceInDays(parseISO(endDate), parseISO(startDate)) + 1;
  };

  return (
    <View style={[styles.container]}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <Text style={[styles.title]}>Log Period</Text>
        <Text style={[styles.subtitle]}>Record your menstrual cycle data</Text>

        <View style={styles.formSection}>
          <Text style={[styles.label]}>Start Date</Text>
          <TextInput
            style={[
              styles.input,
              // {
              //   backgroundColor: "red",
              //   borderColor: "red",
              //   color: "red",
              // },
            ]}
            value={startDate}
            onChangeText={setStartDate}
            placeholder="YYYY-MM-DD"
            placeholderTextColor={"red"}
            keyboardType="numbers-and-punctuation"
          />
        </View>

        <View style={styles.formSection}>
          <Text style={[styles.label]}>End Date</Text>
          <TextInput
            style={[
              styles.input,
              {
                // backgroundColor: "red",
                // borderColor: "red",
                // color: "red",
              },
            ]}
            value={endDate}
            onChangeText={setEndDate}
            placeholder="YYYY-MM-DD"
            placeholderTextColor={"red"}
            keyboardType="numbers-and-punctuation"
          />
          {periodDuration() > 0 && (
            <Text style={[styles.helperText]}>
              Duration: {periodDuration()} day{periodDuration() > 1 ? "s" : ""}
            </Text>
          )}
        </View>

        <View style={styles.formSection}>
          <Text style={[styles.label]}>Symptoms (optional)</Text>
          <View style={styles.symptomsGrid}>
            {SYMPTOM_OPTIONS.map((symptom) => {
              const isSelected = selectedSymptoms.includes(symptom);
              return (
                <TouchableOpacity
                  key={symptom}
                  style={[
                    styles.symptomChip,
                    {
                      backgroundColor: isSelected ? "red" : "red",
                      borderColor: "red",
                    },
                  ]}
                  onPress={() => toggleSymptom(symptom)}
                >
                  <Text
                    style={[
                      styles.symptomText,
                      { color: isSelected ? "#fff" : "red" },
                    ]}
                  >
                    {symptom}
                  </Text>
                </TouchableOpacity>
              );
            })}
          </View>
        </View>

        <TouchableOpacity
          style={[styles.saveButton, isSubmitting && styles.saveButtonDisabled]}
          onPress={handleSave}
          disabled={isSubmitting}
        >
          <Text style={styles.saveButtonText}>
            {isSubmitting ? "Saving..." : "Save Period"}
          </Text>
        </TouchableOpacity>

        {cycles.length > 0 && (
          <View style={styles.historySection}>
            <Text style={[styles.historyTitle]}>Recent Entries</Text>
            {cycles
              .slice()
              .sort(
                (a, b) =>
                  new Date(b.periodStartDate).getTime() -
                  new Date(a.periodStartDate).getTime(),
              )
              .slice(0, 5)
              .map((cycle) => (
                <View key={cycle.id} style={[styles.historyItem]}>
                  <Text style={[styles.historyDate]}>
                    {format(parseISO(cycle.periodStartDate), "MMM d")} -{" "}
                    {format(parseISO(cycle.periodEndDate), "MMM d, yyyy")}
                  </Text>
                  <Text style={[styles.historyMeta]}>
                    Cycle length: {cycle.cycleLength} days
                  </Text>
                </View>
              ))}
          </View>
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
    fontWeight: "bold",
  },
  subtitle: {
    fontSize: 16,
    marginTop: 4,
    marginBottom: 24,
  },
  formSection: {
    marginBottom: 20,
  },
  label: {
    fontSize: 16,
    fontWeight: "600",
    marginBottom: 8,
  },
  input: {
    borderWidth: 1,
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
  },
  helperText: {
    fontSize: 12,
    marginTop: 4,
  },
  symptomsGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8,
  },
  symptomChip: {
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 20,
    borderWidth: 1,
  },
  symptomText: {
    fontSize: 14,
    fontWeight: "500",
  },
  saveButton: {
    padding: 16,
    borderRadius: 12,
    alignItems: "center",
    marginTop: 16,
  },
  saveButtonDisabled: {
    opacity: 0.6,
  },
  saveButtonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "600",
  },
  historySection: {
    marginTop: 32,
  },
  historyTitle: {
    fontSize: 18,
    fontWeight: "600",
    marginBottom: 12,
  },
  historyItem: {
    padding: 12,
    borderBottomWidth: 1,
  },
  historyDate: {
    fontSize: 14,
    fontWeight: "500",
  },
  historyMeta: {
    fontSize: 12,
    marginTop: 4,
  },
});
