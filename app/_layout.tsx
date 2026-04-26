import { AuthProvider, useAuth } from "@/context/auth";
import { BiometricSettingsProvider } from "@/context/biometric";
import { CycleProvider } from "@/context/cycle";
import { AppLockOverlay } from "@/hooks/app-lock-overlay";
import { useNotificationReminder } from "@/hooks/use-notification-reminder";
import { COLORS } from "@/lib/theme";
import { DefaultTheme, ThemeProvider } from "@react-navigation/native";
import { Redirect, Stack, Tabs, useSegments } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { CalendarDays, Heart, User2 } from "lucide-react-native";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import "react-native-reanimated";
import "../global.css";

function RootNavigation() {
  const { isAuthenticated, isLoading } = useAuth();
  const segments = useSegments();
  const isAuthRoute = segments.includes("auth" as never);
  const isOnboardingRoute = segments.includes("onboarding" as never);
  const currentRoute = segments[0] as string;
  const isTimelineRoute = currentRoute === "timeline";
  useNotificationReminder();

  if (!isLoading && isAuthenticated && isAuthRoute) {
    return <Redirect href="/" />;
  }

  if (!isLoading && !isAuthenticated && !isAuthRoute) {
    return <Redirect href="/auth/login" />;
  }

  if (!isAuthenticated || isOnboardingRoute) {
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

  return (
    <>
      <Tabs
        screenOptions={{
          headerShown: false,
          tabBarActiveTintColor: COLORS.primary,
          tabBarInactiveTintColor: COLORS.mutedForeground,
          tabBarStyle: {
            height: 80,
            paddingTop: 8,
            paddingBottom: 20,
            backgroundColor: COLORS.background,
            borderTopWidth: 0,
            // borderTopColor: "#F1F1F1",
            elevation: 0,
          },
          tabBarLabelStyle: {
            fontSize: 11,
            fontWeight: "500",
          },
        }}
      >
        <Tabs.Screen
          name="index"
          options={{
            tabBarLabel: "Home",
            tabBarIcon: ({ color }) => <Heart size={22} color={color} />,
          }}
        />
        <Tabs.Screen
          name="timeline"
          options={{
            tabBarLabel: "Calendar",
            tabBarIcon: ({ color }) => <CalendarDays size={22} color={color} />,
          }}
        />
        <Tabs.Screen
          name="settings"
          options={{
            tabBarLabel: "Settings",
            tabBarIcon: ({ color }) => <User2 size={22} color={color} />,
          }}
        />

        <Tabs.Screen name="auth/login" options={{ href: null }} />
        <Tabs.Screen name="auth/signup" options={{ href: null }} />
        <Tabs.Screen name="onboarding/personal" options={{ href: null }} />
        <Tabs.Screen name="onboarding/period" options={{ href: null }} />
      </Tabs>
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
