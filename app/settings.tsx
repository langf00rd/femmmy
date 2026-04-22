import { AppBar } from "@/components/app-bar";
import { Button } from "@/components/button";
import { SansText } from "@/components/text";
import { useCycles } from "@/context/cycle";
import { useRouter } from "expo-router";
import { ChevronLeft } from "lucide-react-native";
import React from "react";
import { Alert, StyleSheet, TouchableOpacity, View } from "react-native";

export default function SettingsScreen() {
  const router = useRouter();
  const { cycles, clearAllData } = useCycles();

  const handleClearData = () => {
    Alert.alert(
      "Clear All Data",
      "Are you sure you want to delete all your cycle data? This action cannot be undone.",
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Delete",
          style: "destructive",
          onPress: async () => {
            await clearAllData();
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
          <SansText style={styles.sectionTitle}>Data</SansText>
          <View style={styles.card}>
            <View style={styles.row}>
              <SansText style={styles.label}>Logged Cycles</SansText>
              <SansText style={styles.value}>{cycles.length}</SansText>
            </View>
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
  container: {
    flex: 1,
    padding: 20,
    paddingTop: 60,
  },
  title: {
    fontSize: 32,
    fontWeight: "700",
    color: "#1f2937",
    marginBottom: 28,
  },
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
    borderRadius: 16,
    padding: 20,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 3,
    elevation: 2,
  },
  row: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  label: {
    fontSize: 16,
    fontWeight: "500",
    color: "#374151",
  },
  value: {
    fontSize: 16,
    fontWeight: "600",
    color: "#dc2626",
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
