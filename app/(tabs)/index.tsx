import { AppBar } from "@/components/app-bar";
import { DayPicker } from "@/components/day-picker";
import { useCycles } from "@/context/cycle";
import { useRouter } from "expo-router";
import { CalendarDays } from "lucide-react-native";
import { useMemo } from "react";
import { TouchableOpacity, View } from "react-native";

export default function HomeScreen() {
  const router = useRouter();
  const { cycles } = useCycles();
  const greeting = useMemo(() => {
    const hour = new Date().getHours();
    if (hour >= 5 && hour < 12) return "good morning.";
    if (hour >= 12 && hour < 18) return "good afternoon.";
    return "good evening.";
  }, []);

  return (
    <View>
      <AppBar
        className="pl-4"
        title={greeting}
        action={
          <TouchableOpacity onPress={() => router.push("/timeline")}>
            <CalendarDays size={20} />
          </TouchableOpacity>
        }
      />
      <DayPicker cycles={cycles} />
    </View>
  );
}
