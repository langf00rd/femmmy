import { Button } from "@/components/button";
import { useAuth } from "@/context/auth";
import { useBiometricSettings } from "@/context/biometric";
import * as LocalAuthentication from "expo-local-authentication";
import { useEffect, useRef, useState } from "react";
import { AppState, AppStateStatus, Modal, View } from "react-native";

export function AppLockOverlay() {
  const { isAuthenticated } = useAuth();
  const { isBiometricEnabled, isBiometricAvailable } = useBiometricSettings();
  const [showLock, setShowLock] = useState(false);
  const appState = useRef<AppStateStatus>(AppState.currentState);
  const hasOpenedApp = useRef(false);

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
        setShowLock(true);
      }

      appState.current = nextAppState;
    });

    return () => {
      subscription.remove();
    };
  }, [isAuthenticated, isBiometricEnabled, isBiometricAvailable]);

  useEffect(() => {
    if (
      showLock &&
      isAuthenticated &&
      isBiometricEnabled &&
      isBiometricAvailable
    ) {
      authenticate();
    }
  }, [showLock, isAuthenticated, isBiometricEnabled, isBiometricAvailable]);

  async function authenticate() {
    if (!isBiometricAvailable) {
      setShowLock(false);
      return;
    }

    const result = await LocalAuthentication.authenticateAsync({
      promptMessage: "Authenticate to access Femmmy",
      fallbackLabel: "Use Passcode",
      cancelLabel: "Cancel",
    });

    if (result.success) {
      setShowLock(false);
    }
  }

  return (
    <Modal visible={showLock} animationType="fade" transparent>
      <View
        style={{
          flex: 1,
          backgroundColor: "#fff",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <View style={{ alignItems: "center" }}>
          <Button
            onPress={authenticate}
            title="Unlock app"
            className="mt-2"
            style={{
              width: 150,
            }}
          ></Button>
        </View>
      </View>
    </Modal>
  );
}
