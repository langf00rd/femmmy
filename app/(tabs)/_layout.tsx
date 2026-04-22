import { Tabs } from "expo-router";
import { ChartLine, Heart, PlusCircle, Settings } from "lucide-react-native";

export default function TabLayout() {
  return (
    <Tabs
      screenOptions={{
        // tabBarActiveTintColor: Colors.light.tint,
        // tabBarInactiveTintColor: Colors.light.tabIconDefault,
        // tabBarShowLabel: false,
        headerShown: false,
        tabBarStyle: {
          backgroundColor: "white",
          // borderTopWidth: 1,
          // borderTopColor: "#cccccc66",
          // backgroundColor: Colors[colorScheme ?? "light"].background,
          elevation: 0,
          // margin: 10,
          height: 80,
          paddingTop: 10,
          // borderWidth: 1,
          // borderWidth: 0,
          // borderTopColor: Colors[colorScheme ?? "light"].icon,
        },
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: "Home",
          tabBarIcon: ({ color, size }) => <Heart size={size} color={color} />,
        }}
      />
      <Tabs.Screen
        name="log"
        options={{
          title: "Log",
          tabBarIcon: ({ color, size }) => (
            <PlusCircle size={size} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="insights"
        options={{
          title: "Insights",
          tabBarIcon: ({ color, size }) => (
            <ChartLine size={size} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="settings"
        options={{
          title: "Settings",
          tabBarIcon: ({ color, size }) => (
            <Settings size={size} color={color} />
          ),
        }}
      />
    </Tabs>
  );
}
