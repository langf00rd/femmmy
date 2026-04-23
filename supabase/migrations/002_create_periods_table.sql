-- Create periods table to store period logs
create table public.periods (
  id uuid not null default gen_random_uuid() primary key,
  user_id uuid not null references auth.users(id) on delete cascade,
  period_start_date date not null,
  period_end_date date not null,
  cycle_length integer default 28,
  symptoms text[],
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null,
  unique(user_id, period_start_date)
);

-- Enable RLS
alter table public.periods enable row level security;

-- Create indexes
create index periods_user_id_idx on public.periods(user_id);
create index periods_start_date_idx on public.periods(period_start_date);

-- RLS Policies
-- Users can only see their own periods
create policy "Users can view own periods"
  on public.periods for select
  using (auth.uid() = user_id);

-- Users can only insert their own periods
create policy "Users can insert own periods"
  on public.periods for insert
  with check (auth.uid() = user_id);

-- Users can only update their own periods
create policy "Users can update own periods"
  on public.periods for update
  using (auth.uid() = user_id);

-- Users can only delete their own periods
create policy "Users can delete own periods"
  on public.periods for delete
  using (auth.uid() = user_id);

-- Function to update updated_at timestamp
create or replace function public.update_periods_updated_at()
returns trigger as $$
begin
  new.updated_at = timezone('utc'::text, now());
  return new;
end;
$$ language plpgsql security definer;

-- Trigger to auto-update updated_at
create trigger update_periods_updated_at
  before update on public.periods
  for each row execute procedure public.update_periods_updated_at();