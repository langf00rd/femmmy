import { Button } from "@/components/button";
import Label from "@/components/label";
import { SansText } from "@/components/text";
import TextField from "@/components/text-field";
import { useAuth } from "@/context/auth";
import { COLORS } from "@/lib/theme";
import { useRouter } from "expo-router";
import { useState } from "react";
import { Alert, KeyboardAvoidingView, Platform, View } from "react-native";

export default function SignupScreen() {
  const { signUp } = useAuth();
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleSignup = async () => {
    if (!email || !password || !confirmPassword) {
      Alert.alert("Error", "Please fill in all fields");
      return;
    }

    if (password !== confirmPassword) {
      Alert.alert("Error", "Passwords do not match");
      return;
    }

    if (password.length < 6) {
      Alert.alert("Error", "Password must be at least 6 characters");
      return;
    }

    try {
      await signUp(email, password);
      Alert.alert("Success", "Account created! You can now sign in.", [
        {
          text: "OK",
          onPress: () => router.replace("/auth/login"),
        },
      ]);
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
            Create Account
          </SansText>
          <SansText style={{ color: COLORS.mutedForeground }}>
            Start tracking your cycle today
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

        <View className="mb-6">
          <Label>Password</Label>
          <TextField
            value={password}
            onChangeText={setPassword}
            placeholder="At least 6 characters"
            secureTextEntry
          />
        </View>

        <View className="mb-8">
          <Label>Confirm Password</Label>
          <TextField
            value={confirmPassword}
            onChangeText={setConfirmPassword}
            placeholder="Re-enter your password"
            secureTextEntry
          />
        </View>

        <Button
          title={isLoading ? "Creating account..." : "Sign Up"}
          onPress={handleSignup}
          loading={isLoading}
          disabled={isLoading}
        />

        <View className="mt-6 flex-row justify-center">
          <SansText style={{ color: COLORS.mutedForeground }}>
            Already have an account?{" "}
          </SansText>
          <SansText
            className="font-semibold"
            style={{ color: COLORS.primary }}
            onPress={() => router.push("/auth/login")}
          >
            Sign In
          </SansText>
        </View>
      </View>
    </KeyboardAvoidingView>
  );
}
