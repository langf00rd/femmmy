import { Button } from "@/components/button";
import Label from "@/components/label";
import { SansText } from "@/components/text";
import TextField from "@/components/text-field";
import { useAuth } from "@/context/auth";
import { useCycles } from "@/context/cycle";
import { COLORS } from "@/lib/theme";
import { useRouter } from "expo-router";
import { useState } from "react";
import { Alert, KeyboardAvoidingView, Platform, View } from "react-native";

export default function PersonalInfoScreen() {
  const { updateProfile } = useAuth();
  const { fetchPeriods } = useCycles();
  const router = useRouter();

  const [dateOfBirth, setDateOfBirth] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleNext = async () => {
    if (!dateOfBirth) {
      Alert.alert("Error", "Please enter your date of birth");
      return;
    }

    setIsLoading(true);

    try {
      await updateProfile({
        date_of_birth: new Date(dateOfBirth),
      });
    } catch (err) {
      Alert.alert("Error", (err as Error).message);
      setIsLoading(false);
      return;
    }

    try {
      const periods = await fetchPeriods();
      console.log("[update dob > periods]", periods);
      setIsLoading(false);
      if (periods.length < 1) router.replace("/onboarding/period");
      else router.replace("/");
    } catch (err) {
      Alert.alert("Error", (err as Error).message);
      setIsLoading(false);
      return;
    }
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      className="flex-1"
      style={{ backgroundColor: COLORS.background }}
    >
      <View className="flex-1 justify-center px-6">
        <View className="mb-10">
          <SansText
            className="text-[2rem] mb-2"
            style={{ fontWeight: 700, color: COLORS.foreground }}
          >
            About You
          </SansText>
          <SansText style={{ color: COLORS.mutedForeground }}>
            We need your date of birth to provide accurate predictions
          </SansText>
        </View>

        <View className="mb-8">
          <Label>Date of Birth</Label>
          <TextField
            value={dateOfBirth}
            onChangeText={setDateOfBirth}
            placeholder="YYYY-MM-DD"
            keyboardType="numbers-and-punctuation"
          />
        </View>

        <Button
          title={isLoading ? "Loading..." : "Next"}
          onPress={handleNext}
          loading={isLoading}
          disabled={isLoading}
        />
      </View>
    </KeyboardAvoidingView>
  );
}
