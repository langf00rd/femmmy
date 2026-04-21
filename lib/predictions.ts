import {
  addDays,
  differenceInDays,
  parseISO,
  subDays,
} from 'date-fns';
import type { CycleEntry, PredictionData } from './types';

const DEFAULT_CYCLE_LENGTH = 28;
const OVULATION_OFFSET = 14;
const FERTILE_WINDOW_BEFORE = 5;
const FERTILE_WINDOW_AFTER = 1;
const MIN_CYCLES_FOR_PREDICTION = 3;
const MAX_CYCLES_FOR_PREDICTION = 6;

export function calculateAverageCycleLength(cycles: CycleEntry[]): number {
  if (cycles.length === 0) {
    return DEFAULT_CYCLE_LENGTH;
  }

  const sortedCycles = [...cycles].sort(
    (a, b) =>
      new Date(b.periodStartDate).getTime() - new Date(a.periodStartDate).getTime()
  );

  const recentCycles = sortedCycles.slice(0, MAX_CYCLES_FOR_PREDICTION);

  if (recentCycles.length < MIN_CYCLES_FOR_PREDICTION) {
    if (cycles.length < MIN_CYCLES_FOR_PREDICTION) {
      return DEFAULT_CYCLE_LENGTH;
    }
  }

  const total = recentCycles.reduce((sum, cycle) => sum + cycle.cycleLength, 0);
  return Math.round(total / recentCycles.length);
}

export function calculateAveragePeriodDuration(cycles: CycleEntry[]): number {
  if (cycles.length === 0) {
    return 5;
  }

  const durations = cycles.map((cycle) => {
    const start = parseISO(cycle.periodStartDate);
    const end = parseISO(cycle.periodEndDate);
    return differenceInDays(end, start) + 1;
  });

  const total = durations.reduce((sum, d) => sum + d, 0);
  return Math.round(total / durations.length);
}

export function predictNextPeriod(cycles: CycleEntry[]): Date {
  if (cycles.length === 0) {
    const today = new Date();
    return addDays(today, DEFAULT_CYCLE_LENGTH);
  }

  const sortedCycles = [...cycles].sort(
    (a, b) =>
      new Date(b.periodStartDate).getTime() - new Date(a.periodStartDate).getTime()
  );

  const lastPeriodStart = parseISO(sortedCycles[0].periodStartDate);
  const avgCycleLength = calculateAverageCycleLength(cycles);

  return addDays(lastPeriodStart, avgCycleLength);
}

export function predictOvulation(cycles: CycleEntry[]): Date {
  const nextPeriod = predictNextPeriod(cycles);
  return subDays(nextPeriod, OVULATION_OFFSET);
}

export function getFertileWindow(cycles: CycleEntry[]): {
  start: Date;
  end: Date;
} {
  const ovulation = predictOvulation(cycles);
  return {
    start: subDays(ovulation, FERTILE_WINDOW_BEFORE),
    end: addDays(ovulation, FERTILE_WINDOW_AFTER),
  };
}

export function getPredictionData(cycles: CycleEntry[]): PredictionData {
  const nextPeriodDate = predictNextPeriod(cycles);
  const ovulationDate = predictOvulation(cycles);
  const fertileWindow = getFertileWindow(cycles);

  return {
    nextPeriodDate,
    ovulationDate,
    fertileWindowStart: fertileWindow.start,
    fertileWindowEnd: fertileWindow.end,
    averageCycleLength: calculateAverageCycleLength(cycles),
    averagePeriodDuration: calculateAveragePeriodDuration(cycles),
  };
}

export function getCurrentCycleDay(cycles: CycleEntry[]): number {
  if (cycles.length === 0) {
    return 1;
  }

  const sortedCycles = [...cycles].sort(
    (a, b) =>
      new Date(a.periodStartDate).getTime() - new Date(b.periodStartDate).getTime()
  );

  const mostRecentStart = parseISO(sortedCycles[sortedCycles.length - 1].periodStartDate);
  const today = new Date();
  const day = differenceInDays(today, mostRecentStart) + 1;

  return day > 0 ? day : 1;
}

export function getDaysUntilNextPeriod(cycles: CycleEntry[]): number {
  if (cycles.length === 0) {
    return DEFAULT_CYCLE_LENGTH;
  }

  const nextPeriod = predictNextPeriod(cycles);
  const today = new Date();
  const days = differenceInDays(nextPeriod, today);

  return days > 0 ? days : 0;
}

export function isInFertileWindow(date: Date, cycles: CycleEntry[]): boolean {
  if (cycles.length === 0) {
    return false;
  }

  const fertile = getFertileWindow(cycles);
  const startOfDay = new Date(date);
  startOfDay.setHours(0, 0, 0, 0);

  const windowStart = new Date(fertile.start);
  windowStart.setHours(0, 0, 0, 0);

  const windowEnd = new Date(fertile.end);
  windowEnd.setHours(23, 59, 59, 999);

  return startOfDay >= windowStart && startOfDay <= windowEnd;
}

export function isInMenstruation(date: Date, cycles: CycleEntry[]): boolean {
  if (cycles.length === 0) {
    return false;
  }

  const sortedCycles = [...cycles].sort(
    (a, b) =>
      new Date(b.periodStartDate).getTime() - new Date(a.periodStartDate).getTime()
  );

  const mostRecent = sortedCycles[0];
  const start = parseISO(mostRecent.periodStartDate);
  const end = parseISO(mostRecent.periodEndDate);

  const checkDate = new Date(date);
  checkDate.setHours(0, 0, 0, 0);

  const periodStart = new Date(start);
  periodStart.setHours(0, 0, 0, 0);

  const periodEnd = new Date(end);
  periodEnd.setHours(23, 59, 59, 999);

  return checkDate >= periodStart && checkDate <= periodEnd;
}