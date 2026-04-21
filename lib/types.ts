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