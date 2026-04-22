export interface CycleEntry {
  id: string;
  periodStartDate: string;
  periodEndDate: string;
  cycleLength: number;
  symptoms: string[];
}

export interface PredictionData {
  nextPeriodDate: Date;
  ovulationDate: Date;
  fertileWindowStart: Date;
  fertileWindowEnd: Date;
  averageCycleLength: number;
  averagePeriodDuration: number;
}

export type AppFonts =
  | "DMSans_100Thin"
  | "DMSans_200ExtraLight"
  | "DMSans_300Light"
  | "DMSans_400Regular"
  | "DMSans_500Medium"
  | "DMSans_600SemiBold"
  | "DMSans_700Bold"
  | "DMSans_800ExtraBold"
  | "DMSans_900Black"
  | "DMSans_100Thin_Italic"
  | "DMSans_200ExtraLight_Italic"
  | "DMSans_300Light_Italic"
  | "DMSans_400Regular_Italic"
  | "DMSans_500Medium_Italic"
  | "DMSans_600SemiBold_Italic"
  | "DMSans_700Bold_Italic"
  | "DMSans_800ExtraBold_Italic"
  | "DMSans_900Black_Italic";
