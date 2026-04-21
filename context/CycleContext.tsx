import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
  type ReactNode,
} from 'react';
import { differenceInDays, parseISO, format } from 'date-fns';
import type { CycleEntry } from '@/lib/types';
import { loadCycles, saveCycles, clearCycles } from '@/lib/storage';

interface CycleContextValue {
  cycles: CycleEntry[];
  isLoading: boolean;
  addCycle: (startDate: string, endDate: string, symptoms?: string[]) => Promise<void>;
  clearAllData: () => Promise<void>;
}

const CycleContext = createContext<CycleContextValue | undefined>(undefined);

interface CycleProviderProps {
  children: ReactNode;
}

export function CycleProvider({ children }: CycleProviderProps) {
  const [cycles, setCycles] = useState<CycleEntry[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function init() {
      const stored = await loadCycles();
      setCycles(stored);
      setIsLoading(false);
    }
    init();
  }, []);

  const recalculateCycleLength = useCallback(
    (newCycles: CycleEntry[]): number => {
      if (newCycles.length < 2) {
        return 28;
      }

      const sorted = [...newCycles].sort(
        (a, b) =>
          new Date(a.periodStartDate).getTime() -
          new Date(b.periodStartDate).getTime()
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
    []
  );

  const addCycle = useCallback(
    async (startDate: string, endDate: string, symptoms: string[] = []) => {
      const newCycle: CycleEntry = {
        id: `cycle_${Date.now()}`,
        periodStartDate: startDate,
        periodEndDate: endDate,
        cycleLength: 28,
        symptoms,
      };

      const updatedCycles = [...cycles, newCycle];
      const avgLength = recalculateCycleLength(updatedCycles);

      newCycle.cycleLength = avgLength;

      const finalCycles = [...cycles.filter((c) => c.periodStartDate !== startDate), newCycle];

      setCycles(finalCycles);
      await saveCycles(finalCycles);
    },
    [cycles, recalculateCycleLength]
  );

  const clearAllData = useCallback(async () => {
    setCycles([]);
    await clearCycles();
  }, []);

  const value: CycleContextValue = {
    cycles,
    isLoading,
    addCycle,
    clearAllData,
  };

  return (
    <CycleContext.Provider value={value}>{children}</CycleContext.Provider>
  );
}

export function useCycles(): CycleContextValue {
  const context = useContext(CycleContext);
  if (!context) {
    throw new Error('useCycles must be used within a CycleProvider');
  }
  return context;
}