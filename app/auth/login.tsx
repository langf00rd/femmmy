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

export default function LoginScreen() {
  const { signIn, getProfile } = useAuth();
  const { fetchPeriods } = useCycles();
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleLogin = async () => {
    if (!email || !password) {
      Alert.alert("Error", "Please fill in all fields");
      return;
    }

    setIsLoading(true);

    try {
      await signIn(email, password);
      const profile = await getProfile();
      const periods = await fetchPeriods();

      console.log("[periods]", periods);
      console.log("[profile]", profile);

      if (!profile?.date_of_birth) router.replace("/onboarding/personal");
      else if (periods.length < 1) router.replace("/onboarding/period");
      else router.replace("/");
    } catch (err) {
      Alert.alert("Error", (err as Error).message);
    } finally {
      setIsLoading(false);
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
            Welcome back
          </SansText>
          <SansText style={{ color: COLORS.mutedForeground }}>
            Sign in to continue tracking your cycle
          </SansText>
        </View>

        <View className="mb-6">
          <Label>Email</Label>
          <TextField
            value={email}
            onChangeText={setEmail}
            placeholder="you@example.com"
            keyboardType="email-address"
            autoCapitalize="none"
            autoCorrect={false}
          />
        </View>

        <View className="mb-8">
          <Label>Password</Label>
          <TextField
            value={password}
            onChangeText={setPassword}
            placeholder="Enter your password"
            secureTextEntry
          />
        </View>

        <Button
          title={isLoading ? "Signing in..." : "Sign In"}
          onPress={handleLogin}
          loading={isLoading}
          disabled={isLoading}
        />

        <View className="mt-6 flex-row justify-center">
          <SansText style={{ color: COLORS.mutedForeground }}>
            Don&apos;t have an account?{" "}
          </SansText>
          <SansText
            className="font-semibold"
            style={{ color: COLORS.primary }}
            onPress={() => router.push("/auth/signup")}
          >
            Sign Up
          </SansText>
        </View>
      </View>
    </KeyboardAvoidingView>
  );
}
