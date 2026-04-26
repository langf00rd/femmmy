import { AuthProvider, useAuth } from "@/context/auth";
import { BiometricSettingsProvider } from "@/context/biometric";
import { CycleProvider } from "@/context/cycle";
import { DefaultTheme, ThemeProvider } from "@react-navigation/native";
import { Redirect, Stack, useSegments } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import "react-native-reanimated";
import { AppLockOverlay } from "@/hooks/app-lock-overlay";
import { useNotificationReminder } from "@/hooks/use-notification-reminder";
import "../global.css";

function RootNavigation() {
  const { isAuthenticated, isLoading } = useAuth();
  const segments = useSegments();
  const isAuthRoute = segments.includes("auth" as never);
  useNotificationReminder();

  if (!isLoading && isAuthenticated && isAuthRoute) {
    return <Redirect href="/" />;
  }

  if (!isLoading && !isAuthenticated && !isAuthRoute) {
    return <Redirect href="/auth/login" />;
  }

  return (
    <>
      <Stack screenOptions={{ headerShown: false }}>
        <Stack.Screen name="index" />
        <Stack.Screen name="auth/login" />
        <Stack.Screen name="auth/signup" />
        <Stack.Screen name="onboarding/personal" />
        <Stack.Screen name="onboarding/period" />
        <Stack.Screen name="settings" />
        <Stack.Screen name="timeline" />
      </Stack>
      <StatusBar style="dark" />
    </>
  );
}

export default function RootLayout() {
  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <ThemeProvider value={DefaultTheme}>
        <AuthProvider>
          <CycleProvider>
            <BiometricSettingsProvider>
              <RootNavigation />
              <AppLockOverlay />
            </BiometricSettingsProvider>
          </CycleProvider>
        </AuthProvider>
      </ThemeProvider>
    </GestureHandlerRootView>
  );
}