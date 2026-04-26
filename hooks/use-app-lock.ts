import { useEffect, useRef, useCallback } from "react";
import { AppState, AppStateStatus } from "react-native";
import * as LocalAuthentication from "expo-local-authentication";
import { useAuth } from "../context/auth";
import { useBiometricSettings } from "../context/biometric";

export function useAppLock() {
  const { isAuthenticated } = useAuth();
  const { isBiometricEnabled, isBiometricAvailable } = useBiometricSettings();
  const appState = useRef<AppStateStatus>(AppState.currentState);
  const hasOpenedApp = useRef(false);

  const authenticate = useCallback(async (): Promise<boolean> => {
    if (!isBiometricAvailable) return false;

    const result = await LocalAuthentication.authenticateAsync({
      promptMessage: "Authenticate to access Femmmy",
      fallbackLabel: "Use Passcode",
      cancelLabel: "Cancel",
    });

    return result.success;
  }, [isBiometricAvailable]);

  useEffect(() => {
    if (!hasOpenedApp.current) {
      hasOpenedApp.current = true;
      return;
    }
  }, []);

  useEffect(() => {
    const subscription = AppState.addEventListener("change", (nextAppState) => {
      const wasInBackground = appState.current.match(/inactive|background/);
      const isNowActive = nextAppState === "active";

      if (
        wasInBackground &&
        isNowActive &&
        isAuthenticated &&
        isBiometricEnabled &&
        isBiometricAvailable
      ) {
        authenticate().then(() => {});
      }

      appState.current = nextAppState;
    });

    return () => {
      subscription.remove();
    };
  }, [isAuthenticated, isBiometricEnabled, isBiometricAvailable, authenticate]);

  return { authenticate };
}