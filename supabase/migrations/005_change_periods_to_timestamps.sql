-- Convert start_dt and end_dt from date to timestamp with time zone

-- Add new columns as timestamps
alter table public.periods add column if not exists start_ts timestamp with time zone;
alter table public.periods add column if not exists end_ts timestamp with time zone;

-- Copy data from date columns to timestamp columns (adding time component)
update public.periods
set start_ts = start_dt::date::timestamp with time zone,
    end_ts = end_dt::date::timestamp with time zone;

-- Drop old date columns
alter table public.periods drop column if exists start_dt;
alter table public.periods drop column if exists end_dt;

-- Rename new columns
alter table public.periods rename column start_ts to start_dt;
alter table public.periods rename column end_ts to end_dt;

-- Rename indexes
alter index if exists periods_start_dt_idx rename to periods_start_dt_idx;