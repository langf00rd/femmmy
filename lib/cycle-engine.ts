import {
  addDays,
  differenceInDays,
  eachDayOfInterval,
  format,
  isAfter,
  isBefore,
  isSameDay,
  parseISO,
  subDays,
} from "date-fns";

// ─────────────────────────────────────────────
// Constants
// ─────────────────────────────────────────────

const DEFAULT_CYCLE_LENGTH = 28;
const DEFAULT_PERIOD_LENGTH = 5;
const OVULATION_DAYS_BEFORE_NEXT_PERIOD = 14;
const FERTILE_DAYS_BEFORE_OVULATION = 5;
const FERTILE_DAYS_AFTER_OVULATION = 1;
const DELAY_GRACE_DAYS = 7;
const MAX_CYCLES_FOR_AVERAGE = 6;
const CALENDAR_DAYS_PAST = 30;
const CALENDAR_DAYS_FUTURE = 59;

// ─────────────────────────────────────────────
// Types
// ─────────────────────────────────────────────

export type PeriodRecord = {
  id: string;
  start_dt: string; // ISO 8601 UTC
  end_dt: string | null; // ISO 8601 UTC, null if ongoing
};

export type CycleInput = {
  periods: PeriodRecord[]; // unsorted is fine — engine sorts internally
  today: string; // ISO 8601 UTC — always pass explicitly
};

export type Phase =
  | "period" // logged bleeding days
  | "predicted_period" // forecasted next period
  | "ovulation" // peak fertility day
  | "fertile" // fertile window around ovulation
  | "delay" // period is late
  | "luteal"; // everything else (post-ovulation, pre-period)

export type CalendarDay = {
  date: string; // YYYY-MM-DD
  phase: Phase;
};

export type CycleOutput = {
  anchor: string | null; // start_dt of most recent period
  avgCycleLength: number; // rolling avg of last 6 complete cycles
  avgPeriodLength: number; // rolling avg of last 6 period durations
  nextPeriod: string | null; // predicted next period start (YYYY-MM-DD)
  ovulation: string | null; // predicted ovulation day (YYYY-MM-DD)
  fertileWindowStart: string | null;
  fertileWindowEnd: string | null;
  isDelayed: boolean; // true if today > nextPeriod + grace days
  calendar: CalendarDay[]; // 90-day window
};

// ─────────────────────────────────────────────
// Internal helpers
// ─────────────────────────────────────────────

function parse(dateStr: string): Date {
  return parseISO(dateStr);
}

function fmt(date: Date): string {
  return format(date, "yyyy-MM-dd");
}

function inRange(date: Date, start: Date, end: Date): boolean {
  return (
    (isSameDay(date, start) || isAfter(date, start)) &&
    (isSameDay(date, end) || isBefore(date, end))
  );
}

// ─────────────────────────────────────────────
// Sort
// ─────────────────────────────────────────────

function sortAscending(periods: PeriodRecord[]): PeriodRecord[] {
  return [...periods].sort(
    (a, b) => parse(a.start_dt).getTime() - parse(b.start_dt).getTime(),
  );
}

// ─────────────────────────────────────────────
// Averages
// Cycle length = gap between consecutive period start dates.
// A cycle is only "complete" when the next period has been logged.
// Period length = end_dt - start_dt + 1. Skip ongoing (null end_dt).
// ─────────────────────────────────────────────

function computeAvgCycleLength(sorted: PeriodRecord[]): number {
  if (sorted.length < 2) return DEFAULT_CYCLE_LENGTH;

  // Take up to last MAX_CYCLES_FOR_AVERAGE + 1 records to compute MAX_CYCLES_FOR_AVERAGE gaps
  const slice = sorted.slice(-(MAX_CYCLES_FOR_AVERAGE + 1));
  const lengths: number[] = [];

  for (let i = 0; i < slice.length - 1; i++) {
    const len = differenceInDays(
      parse(slice[i + 1].start_dt),
      parse(slice[i].start_dt),
    );
    if (len > 0) lengths.push(len);
  }

  if (lengths.length === 0) return DEFAULT_CYCLE_LENGTH;
  return Math.round(lengths.reduce((s, l) => s + l, 0) / lengths.length);
}

function computeAvgPeriodLength(sorted: PeriodRecord[]): number {
  const slice = sorted.slice(-MAX_CYCLES_FOR_AVERAGE);
  const lengths: number[] = [];

  for (const p of slice) {
    if (!p.end_dt) continue; // skip ongoing
    const len = differenceInDays(parse(p.end_dt), parse(p.start_dt)) + 1;
    if (len > 0) lengths.push(len);
  }

  if (lengths.length === 0) return DEFAULT_PERIOD_LENGTH;
  return Math.round(lengths.reduce((s, l) => s + l, 0) / lengths.length);
}

// ─────────────────────────────────────────────
// Predictions
// All derived from the anchor (most recent period start).
// ─────────────────────────────────────────────

function computeAnchor(sorted: PeriodRecord[]): string | null {
  if (sorted.length === 0) return null;
  return sorted[sorted.length - 1].start_dt;
}

function computeNextPeriod(
  anchor: string | null,
  avgCycleLength: number,
): string | null {
  if (!anchor) return null;
  return fmt(addDays(parse(anchor), avgCycleLength));
}

function computeOvulation(nextPeriod: string | null): string | null {
  if (!nextPeriod) return null;
  return fmt(subDays(parse(nextPeriod), OVULATION_DAYS_BEFORE_NEXT_PERIOD));
}

function computeFertileWindow(
  ovulation: string | null,
): { start: string; end: string } | null {
  if (!ovulation) return null;
  const ov = parse(ovulation);
  return {
    start: fmt(subDays(ov, FERTILE_DAYS_BEFORE_OVULATION)),
    end: fmt(addDays(ov, FERTILE_DAYS_AFTER_OVULATION)),
  };
}

function computeIsDelayed(today: string, nextPeriod: string | null): boolean {
  if (!nextPeriod) return false;
  return isAfter(parse(today), addDays(parse(nextPeriod), DELAY_GRACE_DAYS));
}

// ─────────────────────────────────────────────
// Phase resolution
// Priority (highest → lowest):
//   period > predicted_period > delay > ovulation > fertile > luteal
//
// Delay zone = between nextPeriod and today (when isDelayed).
// Ovulation and fertile are nulled out when delayed.
// ─────────────────────────────────────────────

function resolvePhase(
  date: Date,
  sorted: PeriodRecord[],
  avgPeriodLength: number,
  nextPeriod: string | null,
  ovulation: string | null,
  fertileWindow: { start: string; end: string } | null,
  isDelayed: boolean,
  today: Date,
): Phase {
  // 1. Logged period days
  for (const p of sorted) {
    const pStart = parse(p.start_dt);
    // If end_dt is null (ongoing), use avgPeriodLength as estimate
    const pEnd = p.end_dt
      ? parse(p.end_dt)
      : addDays(pStart, avgPeriodLength - 1);
    if (inRange(date, pStart, pEnd)) return "period";
  }

  // 2. Predicted next period range
  if (nextPeriod) {
    const nxt = parse(nextPeriod);
    const nxtEnd = addDays(nxt, avgPeriodLength - 1);
    if (inRange(date, nxt, nxtEnd)) return "predicted_period";
  }

  // 3. Delay zone (nextPeriod → today, when late)
  if (isDelayed && nextPeriod) {
    const nxt = parse(nextPeriod);
    if (inRange(date, nxt, today)) return "delay";
  }

  // 4. Ovulation day (check before fertile to win priority)
  if (ovulation && isSameDay(date, parse(ovulation))) return "ovulation";

  // 5. Fertile window
  if (fertileWindow) {
    if (inRange(date, parse(fertileWindow.start), parse(fertileWindow.end))) {
      return "fertile";
    }
  }

  // 6. Default
  return "luteal";
}

// ─────────────────────────────────────────────
// Calendar builder
// ─────────────────────────────────────────────

function buildCalendar(
  sorted: PeriodRecord[],
  today: string,
  avgPeriodLength: number,
  nextPeriod: string | null,
  ovulation: string | null,
  fertileWindow: { start: string; end: string } | null,
  isDelayed: boolean,
): CalendarDay[] {
  const todayDate = parse(today);
  const start = subDays(todayDate, CALENDAR_DAYS_PAST);
  const end = addDays(todayDate, CALENDAR_DAYS_FUTURE);

  // When delayed, hide ovulation and fertile window — Flo behaviour
  const resolvedOvulation = isDelayed ? null : ovulation;
  const resolvedFertile = isDelayed ? null : fertileWindow;

  return eachDayOfInterval({ start, end }).map((date) => ({
    date: fmt(date),
    phase: resolvePhase(
      date,
      sorted,
      avgPeriodLength,
      nextPeriod,
      resolvedOvulation,
      resolvedFertile,
      isDelayed,
      todayDate,
    ),
  }));
}

// ─────────────────────────────────────────────
// Public API — single export
// ─────────────────────────────────────────────

export function computeCycle(input: CycleInput): CycleOutput {
  const { periods, today } = input;

  const empty: CycleOutput = {
    anchor: null,
    avgCycleLength: DEFAULT_CYCLE_LENGTH,
    avgPeriodLength: DEFAULT_PERIOD_LENGTH,
    nextPeriod: null,
    ovulation: null,
    fertileWindowStart: null,
    fertileWindowEnd: null,
    isDelayed: false,
    calendar: [],
  };

  if (periods.length === 0) return empty;

  const sorted = sortAscending(periods);

  const anchor = computeAnchor(sorted);
  const avgCycleLength = computeAvgCycleLength(sorted);
  const avgPeriodLength = computeAvgPeriodLength(sorted);
  const nextPeriod = computeNextPeriod(anchor, avgCycleLength);
  const ovulation = computeOvulation(nextPeriod);
  const fertileWindow = computeFertileWindow(ovulation);
  const isDelayed = computeIsDelayed(today, nextPeriod);

  const calendar = buildCalendar(
    sorted,
    today,
    avgPeriodLength,
    nextPeriod,
    ovulation,
    fertileWindow,
    isDelayed,
  );

  return {
    anchor,
    avgCycleLength,
    avgPeriodLength,
    nextPeriod,
    ovulation,
    fertileWindowStart: fertileWindow?.start ?? null,
    fertileWindowEnd: fertileWindow?.end ?? null,
    isDelayed,
    calendar,
  };
}
