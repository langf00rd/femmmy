import { Button } from "@/components/button";
import Label from "@/components/label";
import { SansText } from "@/components/text";
import TextField from "@/components/text-field";
import { useCycles } from "@/context/cycle";
import { PERIOD_SYMPTOMS } from "@/lib/content";
import { COLORS } from "@/lib/theme";
import { differenceInDays, format, parseISO, startOfDay } from "date-fns";
import { useRouter } from "expo-router";
import { useState } from "react";
import {
  Alert,
  KeyboardAvoidingView,
  Platform,
  TouchableOpacity,
  View,
} from "react-native";

export default function PeriodInfoScreen() {
  const { addPeriod } = useCycles();
  const router = useRouter();
  const [selectedSymptoms, setSelectedSymptoms] = useState<string[]>([]);

  const today = startOfDay(new Date());
  const todayStr = format(today, "yyyy-MM-dd");

  const [periodStart, setPeriodStart] = useState(todayStr);
  const [periodEnd, setPeriodEnd] = useState(todayStr);
  const [isLoading, setIsLoading] = useState(false);

  const handleComplete = async () => {
    if (!periodStart || !periodEnd) {
      Alert.alert("Error", "Please enter both start and end dates");
      return;
    }

    setIsLoading(true);

    const start = parseISO(periodStart);
    const end = parseISO(periodEnd);

    console.log("[start]", start);
    console.log("[end]", end);

    if (end < start) {
      Alert.alert("Error", "End date must be on or after start date");
      setIsLoading(false);
      return;
    }

    try {
      await addPeriod(periodStart, periodEnd, selectedSymptoms);
      router.replace("/");
    } catch (err) {
      Alert.alert("Error", (err as Error).message);
    } finally {
      setIsLoading(false);
    }
  };

  const duration = () => {
    if (!periodStart || !periodEnd) return 0;
    try {
      return differenceInDays(parseISO(periodEnd), parseISO(periodStart)) + 1;
    } catch {
      return 0;
    }
  };

  const toggleSymptom = (symptom: string) => {
    setSelectedSymptoms((prev) =>
      prev.includes(symptom)
        ? prev.filter((s) => s !== symptom)
        : [...prev, symptom],
    );
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      className="flex-1"
      style={{ backgroundColor: COLORS.background }}
    >
      <View className="flex-1 justify-center px-6">
        <View className="mb-8">
          <SansText
            className="text-[2rem] mb-2"
            style={{ fontWeight: 700, color: COLORS.foreground }}
          >
            Last Period
          </SansText>
          <SansText style={{ color: COLORS.mutedForeground }}>
            Enter your most recent period dates to start tracking
          </SansText>
        </View>

        <View className="mb-6">
          <Label>Start Date</Label>
          <TextField
            value={periodStart}
            onChangeText={setPeriodStart}
            placeholder="YYYY-MM-DD"
            keyboardType="numbers-and-punctuation"
          />
        </View>

        <View className="mb-6">
          <Label>End Date</Label>
          <TextField
            value={periodEnd}
            onChangeText={setPeriodEnd}
            placeholder="YYYY-MM-DD"
            keyboardType="numbers-and-punctuation"
          />
        </View>

        {duration() > 0 && (
          <SansText className="mb-8 text-neutral-500">
            Duration: {duration()} day{duration() > 1 ? "s" : ""}
          </SansText>
        )}

        <View className="flex-row flex-wrap gap-2 mb-10">
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
                  className={isSelected ? "text-white" : "text-neutral-500"}
                >
                  {symptom}
                </SansText>
              </TouchableOpacity>
            );
          })}
        </View>

        <Button
          title={isLoading ? "Setting up..." : "Continue"}
          onPress={handleComplete}
          loading={isLoading}
          disabled={isLoading}
        />
      </View>
    </KeyboardAvoidingView>
  );
}
