import { supabase } from "@/lib/supabase";
import type { CycleEntry } from "@/lib/types";
import { differenceInDays, parseISO } from "date-fns";
import {
  createContext,
  useCallback,
  useContext,
  useState,
  type ReactNode,
} from "react";
import { useAuth } from "./auth";

export interface PeriodRecord {
  id: string;
  user_id: string;
  start_dt: string;
  end_dt: string;
  symptoms: string[];
  created_at: string;
  updated_at: string;
}

interface CycleContextValue {
  cycles: CycleEntry[];
  isLoading: boolean;
  addPeriod: (
    startDate: string,
    endDate: string,
    symptoms?: string[],
  ) => Promise<void>;
  deleteCycle: (id: string) => Promise<void>;
  clearAllData: () => Promise<void>;
  fetchPeriods: () => Promise<any[]>;
}

const CycleContext = createContext<CycleContextValue | undefined>(undefined);

interface CycleProviderProps {
  children: ReactNode;
}

export function CycleProvider({ children }: CycleProviderProps) {
  const { getProfile } = useAuth();
  const [cycles, setCycles] = useState<CycleEntry[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  async function fetchPeriods() {
    const profile = await getProfile();
    if (!profile) return [];

    const { data, error } = await supabase
      .from("periods")
      .select("*")
      .eq("user_id", profile.id)
      .order("start_dt", { ascending: false });
    if (error) throw new Error(error.message);
    return data;
  }

  // Legacy function kept for future use

  // useEffect(() => {
  //   fetchCycles();
  // }, [fetchCycles]);

  // Legacy function kept for future use
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const recalculateCycleLength = useCallback(
    (newCycles: CycleEntry[]): number => {
      if (newCycles.length < 2) {
        return 28;
      }

      const sorted = [...newCycles].sort(
        (a, b) =>
          new Date(a.periodStartDate).getTime() -
          new Date(b.periodStartDate).getTime(),
      );

      const lengths: number[] = [];
      for (let i = 1; i < sorted.length; i++) {
        const prevStart = parseISO(sorted[i - 1].periodStartDate);
        const currStart = parseISO(sorted[i].periodStartDate);
        lengths.push(differenceInDays(currStart, prevStart));
      }

      if (lengths.length === 0) {
        return 28;
      }

      const total = lengths.reduce((sum, l) => sum + l, 0);
      return Math.round(total / lengths.length);
    },
    [],
  );

  async function addPeriod(
    startDate: string,
    endDate: string,
    symptoms: string[] = [],
  ) {
    const profile = await getProfile();
    console.log("[addPeriod]", startDate, endDate, symptoms);
    const { error } = await supabase.from("periods").insert({
      user_id: profile?.id,
      start_dt: new Date(startDate),
      end_dt: new Date(endDate),
      symptoms,
    });
    if (error) throw error;
  }

  const deleteCycle = useCallback(async (id: string) => {
    const { error } = await supabase.from("periods").delete().eq("id", id);

    if (error) {
      console.error("Error deleting cycle:", error);
      throw error;
    }

    setCycles((prev) => prev.filter((c) => c.id !== id));
  }, []);

  const clearAllData = useCallback(async () => {
    const profile = await getProfile();
    if (!profile) return;

    const { error } = await supabase
      .from("periods")
      .delete()
      .eq("user_id", profile.id);

    if (error) {
      console.error("Error clearing cycles:", error);
      throw error;
    }

    setCycles([]);
  }, []);

  const value: CycleContextValue = {
    cycles,
    isLoading,
    addPeriod,
    deleteCycle,
    clearAllData,
    fetchPeriods,
  };

  return (
    <CycleContext.Provider value={value}>{children}</CycleContext.Provider>
  );
}

export function useCycles(): CycleContextValue {
  const context = useContext(CycleContext);
  if (!context) {
    throw new Error("useCycles must be used within a CycleProvider");
  }
  return context;
}
