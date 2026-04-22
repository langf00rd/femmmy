import { DefaultTheme, ThemeProvider } from "@react-navigation/native";
import { Stack } from "expo-router";
import { StatusBar } from "expo-status-bar";
import "react-native-reanimated";
import "../global.css";

import { CycleProvider } from "@/context/cycle";
import { GestureHandlerRootView } from "react-native-gesture-handler";

export const unstable_settings = {
  anchor: "(tabs)",
};

export default function RootLayout() {
  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <ThemeProvider value={DefaultTheme}>
        <CycleProvider>
          <Stack screenOptions={{ headerShown: false }}>
            <Stack.Screen name="index" />
            <Stack.Screen name="(tabs)" />
            <Stack.Screen name="timeline" />
          </Stack>
          <StatusBar style="dark" />
        </CycleProvider>
      </ThemeProvider>
    </GestureHandlerRootView>
  );
}
