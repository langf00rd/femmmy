import { supabase } from "@/lib/supabase";
import AsyncStorage from "@react-native-async-storage/async-storage";
import type { User } from "@supabase/supabase-js";
import * as SecureStore from "expo-secure-store";
import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
  type ReactNode,
} from "react";

export interface UserProfile {
  id: string;
  email: string;
  date_of_birth: Date;
  created_at: string;
  updated_at: string;
}

interface AuthContextValue {
  user: User | null;
  getProfile: () => Promise<UserProfile | null>;
  isLoading: boolean;
  isAuthenticated: boolean;
  isOnboardingComplete: () => Promise<boolean>;
  signIn: (email: string, password: string) => Promise<{ error: Error | null }>;
  signUp: (email: string, password: string) => Promise<{ error: Error | null }>;
  signOut: () => Promise<void>;
  updateProfile: (
    data: Partial<UserProfile>,
  ) => Promise<{ error: Error | null }>;
  refreshProfile: () => Promise<void>;
  fetchUserSession: () => Promise<{ session: unknown }>;
  deleteAccount: () => Promise<{ error: Error | null }>;
}

const STORAGE_KEYS = {
  PROFILE: "femmmy_profile",
  SESSION_ACCESS_TOKEN: "femmmy_session_access",
  SESSION_REFRESH_TOKEN: "femmmy_session_refresh",
} as const;

async function getStoredProfile(): Promise<UserProfile | null> {
  try {
    const stored = await AsyncStorage.getItem(STORAGE_KEYS.PROFILE);
    if (!stored) return null;
    return JSON.parse(stored) as UserProfile;
  } catch {
    return null;
  }
}

async function getStoredSession(): Promise<{
  access_token: string;
  refresh_token: string;
} | null> {
  try {
    const accessToken = await SecureStore.getItemAsync(
      STORAGE_KEYS.SESSION_ACCESS_TOKEN,
    );
    const refreshToken = await SecureStore.getItemAsync(
      STORAGE_KEYS.SESSION_REFRESH_TOKEN,
    );
    if (!accessToken || !refreshToken) return null;
    return { access_token: accessToken, refresh_token: refreshToken };
  } catch {
    return null;
  }
}

async function setStoredSession(
  session: { access_token: string; refresh_token: string } | null,
): Promise<void> {
  if (session) {
    await SecureStore.setItemAsync(
      STORAGE_KEYS.SESSION_ACCESS_TOKEN,
      session.access_token,
    );
    await SecureStore.setItemAsync(
      STORAGE_KEYS.SESSION_REFRESH_TOKEN,
      session.refresh_token,
    );
  } else {
    await SecureStore.deleteItemAsync(STORAGE_KEYS.SESSION_ACCESS_TOKEN);
    await SecureStore.deleteItemAsync(STORAGE_KEYS.SESSION_REFRESH_TOKEN);
  }
}

async function setStoredProfile(profile: UserProfile | null): Promise<void> {
  if (profile) {
    await AsyncStorage.setItem(STORAGE_KEYS.PROFILE, JSON.stringify(profile));
  } else {
    await AsyncStorage.removeItem(STORAGE_KEYS.PROFILE);
  }
}

interface AuthProviderProps {
  children: ReactNode;
}

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

export function AuthProvider({ children }: AuthProviderProps) {
  const [storedProfile, setStoredProfileState] = useState<UserProfile | null>(
    null,
  );
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    getStoredProfile().then(async (profile) => {
      setStoredProfileState(profile);

      const session = await getStoredSession();
      if (session) {
        supabase.auth.setSession(session);
      }

      setIsLoading(false);
    });
  }, []);

  // const storedProfile = useCallback(async () => {
  //   return await getStoredProfile();
  // }, []);

  const isAuthenticated = storedProfile !== null;

  console.log("[storedProfile]", storedProfile);
  console.log("[isAuthenticated]", isAuthenticated);
  console.log("[isLoading]", isLoading);

  async function fetchUserSession() {
    const { data } = await supabase.auth.getSession();
    return data;
  }

  const fetchProfile = useCallback(async (userId: string) => {
    const { data, error } = await supabase
      .from("users")
      .select("*")
      .eq("id", userId)
      .single();
    console.log("[fetchProfile]", data, error);
    if (!data) {
      throw new Error("Your account must've been deleted. Contact support");
    }
    if (error) throw new Error(error.message);
    return data as UserProfile;
  }, []);

  const getProfile = useCallback(async () => {
    return getStoredProfile();
  }, []);

  async function signIn(email: string, password: string) {
    const { error, data } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    console.log("[signIn]", data.user?.id, error);

    if (error) return { error: new Error(error.message) };
    if (!data?.user) return { error: new Error("No user found") };

    if (data.session) {
      const sessionData = {
        access_token: data.session.access_token,
        refresh_token: data.session.refresh_token,
      };
      await setStoredSession(sessionData);
      supabase.auth.setSession(sessionData);
    }

    const userProfile = await fetchProfile(data.user.id);
    await setStoredProfile(userProfile);
    return { error: null };
  }

  async function signUp(email: string, password: string) {
    const { error } = await supabase.auth.signUp({
      email,
      password,
    });
    if (error) return { error: new Error(error.message) };
    return { error: null };
  }

  const signOut = useCallback(async () => {
    const { error } = await supabase.auth.signOut();
    await setStoredProfile(null);
    await setStoredSession(null);
    if (error) console.error("[signOut]", error);
  }, []);

  async function updateProfile(data: Partial<UserProfile>) {
    const profile = await getProfile();
    if (!profile) return { error: new Error("No profile found") };

    const { error } = await supabase
      .from("users")
      .update(data)
      .eq("id", profile.id);

    if (error) return { error: new Error(error.message) };

    const updatedProfile = await fetchProfile(profile.id);
    await setStoredProfile(updatedProfile);
    return { error: null };
  }

  const refreshProfile = useCallback(async () => {
    if (storedProfile) {
      const updatedProfile = await fetchProfile(storedProfile.id);
      await setStoredProfile(updatedProfile);
    }
  }, [storedProfile, fetchProfile]);

  const deleteAccount = useCallback(async () => {
    const profile = await getProfile();
    if (!profile) return { error: null };

    const { error: periodError } = await supabase
      .from("periods")
      .delete()
      .eq("user_id", profile.id);

    if (periodError) {
      return { error: periodError };
    }

    const { error: profileError } = await supabase
      .from("users")
      .delete()
      .eq("id", profile.id);

    if (profileError) {
      return { error: profileError };
    }

    const { error: authError } = await supabase.auth.signOut();

    if (authError) {
      return { error: authError };
    }

    await setStoredProfile(null);

    return { error: null };
  }, [getProfile]);

  const isOnboardingComplete = useCallback(async () => {
    const profile = await getStoredProfile();
    return !!profile?.date_of_birth;
  }, []);

  return (
    <AuthContext.Provider
      value={{
        user: null,
        getProfile,
        isLoading,
        isAuthenticated,
        isOnboardingComplete,
        signIn,
        signUp,
        signOut,
        updateProfile,
        refreshProfile,
        fetchUserSession,
        deleteAccount,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth(): AuthContextValue {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
