-- Convert date_of_birth from date to timestamp with time zone

-- Add new column as timestamp
alter table public.users add column if not exists dob_ts timestamp with time zone;

-- Copy data from date_of_birth to new timestamp column
update public.users
set dob_ts = date_of_birth::date::timestamp with time zone
where date_of_birth is not null;

-- Drop old date column
alter table public.users drop column if exists date_of_birth;

-- Rename new column
alter table public.users rename column dob_ts to date_of_birth;