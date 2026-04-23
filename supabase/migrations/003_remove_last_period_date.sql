-- Remove last_period_date from users table if it exists
alter table public.users drop column if exists last_period_date;