import { AppBar } from "@/components/app-bar";
import { Button } from "@/components/button";
import Section from "@/components/section";
import Switch from "@/components/switch";
import { SansText } from "@/components/text";
import { useAuth } from "@/context/auth";
import { useBiometricSettings } from "@/context/biometric";
import { useCycles } from "@/context/cycle";
import { COLORS } from "@/lib/theme";
import { useRouter } from "expo-router";
import { Fingerprint } from "lucide-react-native";
import React from "react";
import { Alert, ScrollView, StyleSheet, View } from "react-native";

export default function SettingsScreen() {
  const router = useRouter();
  const { signOut, deleteAccount } = useAuth();
  const { clearAllData } = useCycles();
  const { isBiometricAvailable, isBiometricEnabled, setBiometricEnabled } =
    useBiometricSettings();

  const handleLogout = async () => {
    Alert.alert("Log Out", "Are you sure you want to log out?", [
      { text: "Cancel", style: "cancel" },
      {
        text: "Log Out",
        style: "destructive",
        onPress: async () => {
          await signOut();
          router.replace("/auth/login");
        },
      },
    ]);
  };

  const handleClearData = () => {
    Alert.alert(
      "Clear All Data",
      "Are you sure you want to delete all your cycle data? This will also log you out.",
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Delete",
          style: "destructive",
          onPress: async () => {
            await clearAllData();
            await signOut();
            router.replace("/auth/login");
          },
        },
      ],
    );
  };

  const handleDeleteAccount = () => {
    Alert.alert(
      "Delete Account",
      "Are you sure you want to delete your account and all data? This action cannot be undone.",
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Delete Account",
          style: "destructive",
          onPress: async () => {
            const result = await deleteAccount();
            if (result.error) {
              Alert.alert("Error", result.error.message);
            } else {
              router.replace("/auth/login");
            }
          },
        },
      ],
    );
  };

  return (
    <View style={{ backgroundColor: COLORS.background, flex: 1 }}>
      <AppBar title="Settings" />

      <ScrollView className="p-4 gap-4">
        <Section>
          <SansText style={styles.sectionTitle}>Account</SansText>
          <View>
            <Button
              title="Log Out"
              onPress={handleLogout}
              variant="secondary"
            />
          </View>
        </Section>

        <Section>
          <SansText style={styles.sectionTitle}>Security</SansText>
          <View>
            <View style={styles.switchRow}>
              <View style={styles.switchLabel}>
                <Fingerprint size={20} color="#6b7280" />
                <SansText style={styles.switchText}>
                  Biometric App Lock
                </SansText>
              </View>
              <Switch
                value={isBiometricEnabled}
                onValueChange={setBiometricEnabled}
                disabled={!isBiometricAvailable}
              />
            </View>
            {!isBiometricAvailable && (
              <SansText style={styles.biometricHint}>
                Biometrics not available on this device
              </SansText>
            )}
          </View>
        </Section>

        <Section>
          <SansText style={styles.sectionTitle}>Clear all cycle data</SansText>
          <View>
            <Button
              title="Clear All Data"
              onPress={handleClearData}
              variant="danger"
            />
            <SansText
              style={{ color: COLORS.mutedForeground }}
              className="mt-4"
            >
              This will permanently delete all your cycle history and
              predictions.
            </SansText>
          </View>
        </Section>

        <Section>
          <SansText style={styles.sectionTitle}>Delete your account</SansText>
          <View>
            <Button
              title="Delete Account"
              onPress={handleDeleteAccount}
              variant="danger"
            />
            <SansText
              style={{ color: COLORS.mutedForeground }}
              className="mt-4"
            >
              This will permanently delete your account and all associated data.
            </SansText>
          </View>
        </Section>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  section: {
    marginBottom: 28,
    backgroundColor: "#F1F1F1aa",
    padding: 10,
    borderRadius: 6,
  },
  sectionTitle: {
    fontSize: 13,
    fontWeight: "600",
    color: "#6b7280",
    textTransform: "uppercase",
    letterSpacing: 0.5,
    marginBottom: 10,
    marginLeft: 4,
  },
  card: {
    // backgroundColor: "#fff",
    // borderRadius: 6,
    // padding: 20,
    // elevation: 1,
  },
  switchRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  switchLabel: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
  },
  switchText: {
    fontSize: 15,
    color: "#374151",
  },
  biometricHint: {
    fontSize: 12,
    color: "#9ca3af",
    marginTop: 8,
    textAlign: "center",
  },
  warningText: {
    fontSize: 13,
    color: "#6b7280",
    textAlign: "center",
    marginTop: 16,
    lineHeight: 18,
  },
  footer: {
    marginTop: "auto",
    paddingTop: 32,
    alignItems: "center",
  },
  footerText: {
    fontSize: 14,
    fontWeight: "600",
    color: "#9ca3af",
  },
  footerSubtext: {
    fontSize: 12,
    color: "#d1d5db",
    marginTop: 4,
  },
});
