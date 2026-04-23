import { supabase } from "@/lib/supabase";
import AsyncStorage from "@react-native-async-storage/async-storage";
import type { User } from "@supabase/supabase-js";
import {
  createContext,
  useCallback,
  useContext,
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
}

const STORAGE_KEYS = {
  PROFILE: "femmmy_profile",
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
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

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

    if (error) {
      console.error("Error fetching profile:", error);
      return null;
    }

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

    if (error) throw new Error(error.message);
    if (!data?.user) throw new Error("No user found");

    const userProfile = await fetchProfile(data.user.id);
    await setStoredProfile(userProfile);
  }

  async function signUp(email: string, password: string) {
    const { error } = await supabase.auth.signUp({
      email,
      password,
    });
    if (error) throw new Error(error.message);
  }

  const signOut = useCallback(async () => {
    await supabase.auth.signOut();
    await setStoredProfile(null);
  }, []);

  async function updateProfile(data: Partial<UserProfile>) {
    const user = await getProfile();

    const { error } = await supabase
      .from("users")
      .update(data)
      .eq("id", user!.id);

    if (error) throw new Error(error.message);

    const updatedProfile = await fetchProfile(user!.id);
    await setStoredProfile(updatedProfile);
  }

  const refreshProfile = useCallback(async () => {
    if (user) {
      const updatedProfile = await fetchProfile(user.id);
      await setStoredProfile(updatedProfile);
    }
  }, [user, fetchProfile]);

  const isOnboardingComplete = useCallback(async () => {
    const profile = await getStoredProfile();
    return !!profile?.date_of_birth;
  }, []);

  return (
    <AuthContext.Provider
      value={{
        user,
        getProfile,
        isLoading,
        isAuthenticated: !!user,
        isOnboardingComplete,
        signIn,
        signUp,
        signOut,
        updateProfile,
        refreshProfile,
        fetchUserSession,
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
