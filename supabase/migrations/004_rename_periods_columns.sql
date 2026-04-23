-- Rename columns and remove cycle_length from periods table

-- Rename period_start_date to start_dt
alter table public.periods rename column period_start_date to start_dt;

-- Rename period_end_date to end_dt
alter table public.periods rename column period_end_date to end_dt;

-- Remove cycle_length column
alter table public.periods drop column if exists cycle_length;

-- Rename indexes
alter index if exists periods_start_date_idx rename to periods_start_dt_idx;