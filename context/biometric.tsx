import AsyncStorage from "@react-native-async-storage/async-storage";
import * as LocalAuthentication from "expo-local-authentication";
import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
  type ReactNode,
} from "react";

interface BiometricSettingsValue {
  isBiometricEnabled: boolean;
  isBiometricAvailable: boolean;
  setBiometricEnabled: (enabled: boolean) => Promise<void>;
}

const STORAGE_KEY = "femmmy_biometric_enabled";

const BiometricSettingsContext = createContext<
  BiometricSettingsValue | undefined
>(undefined);

export function BiometricSettingsProvider({
  children,
}: {
  children: ReactNode;
}) {
  const [isBiometricEnabled, setIsBiometricEnabled] = useState(false);
  const [isBiometricAvailable, setIsBiometricAvailable] = useState(false);

  useEffect(() => {
    async function checkBiometric() {
      const compatible = await LocalAuthentication.hasHardwareAsync();
      const enrolled = await LocalAuthentication.isEnrolledAsync();
      setIsBiometricAvailable(compatible && enrolled);

      const stored = await AsyncStorage.getItem(STORAGE_KEY);
      setIsBiometricEnabled(stored === "true");
    }
    checkBiometric();
  }, []);

  const authenticate = useCallback(async (): Promise<boolean> => {
    if (!isBiometricAvailable) return false;

    const result = await LocalAuthentication.authenticateAsync({
      promptMessage: "Authenticate to access Femmmy",
      fallbackLabel: "Use Passcode",
      cancelLabel: "Cancel",
    });

    return result.success;
  }, [isBiometricAvailable]);

  const setBiometricEnabledHandler = useCallback(async (enabled: boolean) => {
    if (enabled) {
      const result = await LocalAuthentication.authenticateAsync({
        promptMessage: "Authenticate to enable biometrics",
        fallbackLabel: "Use Passcode",
      });
      if (!result.success) return;
    }
    setIsBiometricEnabled(enabled);
    await AsyncStorage.setItem(STORAGE_KEY, enabled.toString());
  }, []);

  return (
    <BiometricSettingsContext.Provider
      value={{
        isBiometricEnabled,
        isBiometricAvailable,
        setBiometricEnabled: setBiometricEnabledHandler,
      }}
    >
      {children}
    </BiometricSettingsContext.Provider>
  );
}

export function useBiometricSettings(): BiometricSettingsValue {
  const context = useContext(BiometricSettingsContext);
  if (!context) {
    throw new Error(
      "useBiometricSettings must be used within BiometricSettingsProvider",
    );
  }
  return context;
}