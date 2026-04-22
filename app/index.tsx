import { AppBar } from "@/components/app-bar";
import { DayPicker } from "@/components/day-picker";
import { LogBottomSheet } from "@/components/log-bottom-sheet";
import { StatsOverview } from "@/components/stats-overview";
import { useCycles } from "@/context/cycle";
import BottomSheet from "@gorhom/bottom-sheet";
import { useRouter } from "expo-router";
import { CalendarDays, Plus, Settings2 } from "lucide-react-native";
import { useMemo, useRef, useState } from "react";
import { StyleSheet, TouchableOpacity, View } from "react-native";

export default function HomeScreen() {
  const router = useRouter();
  const { cycles } = useCycles();
  const bottomSheetRef = useRef<BottomSheet>(null);
  const [sheetOpen, setSheetOpen] = useState(false);

  const greeting = useMemo(() => {
    const hour = new Date().getHours();
    if (hour >= 5 && hour < 12) return "good morning.";
    if (hour >= 12 && hour < 18) return "good afternoon.";
    return "good evening.";
  }, []);

  const handleOpenBottomSheet = () => {
    setSheetOpen(true);
    bottomSheetRef.current?.expand();
  };

  const handleCloseBottomSheet = () => {
    setSheetOpen(false);
  };

  return (
    <View style={styles.container}>
      <AppBar
        className="pl-4"
        title={greeting}
        action={
          <View className="flex-row gap-10">
            <TouchableOpacity onPress={() => router.push("/timeline")}>
              <CalendarDays size={20} />
            </TouchableOpacity>
            <TouchableOpacity onPress={() => router.push("/settings")}>
              <Settings2 size={20} />
            </TouchableOpacity>
          </View>
        }
      />
      <DayPicker cycles={cycles} />
      <StatsOverview />
      <TouchableOpacity style={styles.fab} onPress={handleOpenBottomSheet}>
        <Plus size={24} color="white" />
      </TouchableOpacity>
      <LogBottomSheet ref={bottomSheetRef} onClose={handleCloseBottomSheet} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  fab: {
    position: "absolute",
    right: 20,
    bottom: 20,
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: "#e11d48",
    justifyContent: "center",
    alignItems: "center",
    elevation: 4,
    // shadowColor: "#000",
    // shadowOffset: { width: 0, height: 2 },
    // shadowOpacity: 0.25,
    // shadowRadius: 4,
  },
});
