import { AppBar } from "@/components/app-bar";
import { useRouter } from "expo-router";
import { CalendarIcon } from "lucide-react-native";
import { useMemo } from "react";
import { TouchableOpacity, View } from "react-native";

export default function HomeScreen() {
  const router = useRouter();
  const greeting = useMemo(() => {
    const hour = new Date().getHours();
    if (hour >= 5 && hour < 12) return "good morning.";
    if (hour >= 12 && hour < 18) return "good afternoon.";
    return "good evening.";
  }, []);

  return (
    <View>
      <AppBar
        title={greeting}
        action={
          <TouchableOpacity onPress={() => router.push("/timeline")}>
            <CalendarIcon />
          </TouchableOpacity>
        }
      />
    </View>
  );
}
