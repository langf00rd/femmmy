import { AppBar } from "@/components/app-bar";
import { Button } from "@/components/button";
import { SansText } from "@/components/text";
import { useAuth } from "@/context/auth";
import { useCycles } from "@/context/cycle";
import { useRouter } from "expo-router";
import { ChevronLeft } from "lucide-react-native";
import React from "react";
import { Alert, StyleSheet, TouchableOpacity, View } from "react-native";

export default function SettingsScreen() {
  const router = useRouter();
  const { signOut, deleteAccount } = useAuth();
  const { clearAllData } = useCycles();

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
    <View>
      <AppBar
        className="border-b border-b-neutral-200/20"
        action={<View />}
        leading={
          <View className="flex-row items-center gap-5">
            <TouchableOpacity className="p-2" onPress={() => router.back()}>
              <ChevronLeft size={24} color="#374151" />
            </TouchableOpacity>
            <SansText className="text-xl">Settings</SansText>
          </View>
        }
      />

      <View className="p-4">
        <View style={styles.section}>
          <SansText style={styles.sectionTitle}>Account</SansText>
          <View style={styles.card}>
            <Button
              title="Log Out"
              onPress={handleLogout}
              variant="secondary"
            />
          </View>
        </View>

        <View style={styles.section}>
          <SansText style={styles.sectionTitle}>Danger Zone</SansText>
          <View style={styles.card}>
            <Button
              title="Clear All Data"
              onPress={handleClearData}
              variant="danger"
            />
            <SansText style={styles.warningText}>
              This will permanently delete all your cycle history and
              predictions.
            </SansText>
          </View>

          <View style={[styles.card, { marginTop: 12 }]}>
            <Button
              title="Delete Account"
              onPress={handleDeleteAccount}
              variant="danger"
            />
            <SansText style={styles.warningText}>
              This will permanently delete your account and all associated data.
            </SansText>
          </View>
        </View>

        <View style={styles.footer}>
          <SansText style={styles.footerText}>Femmmy v1.0.0</SansText>
          <SansText style={styles.footerSubtext}>
            Your data stays on your device
          </SansText>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  section: {
    marginBottom: 28,
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
    backgroundColor: "#fff",
    borderRadius: 6,
    padding: 20,
    elevation: 1,
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
