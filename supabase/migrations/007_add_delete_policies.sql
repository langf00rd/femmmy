-- Migration: Add delete RLS policies for users to delete their own accounts

-- Add delete policy for periods table (already exists but ensuring it's there)
drop policy if exists "Users can delete own periods" on public.periods;
create policy "Users can delete own periods"
  on public.periods for delete
  using (auth.uid() = user_id);

-- Add delete policy for users table so users can delete their own account
drop policy if exists "Users can delete own account" on public.users;
create policy "Users can delete own account"
  on public.users for delete
  using (auth.uid() = id);