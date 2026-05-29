-- Run this in the Supabase SQL editor (Dashboard → SQL → New query).
-- Stores persistent app configuration such as the package catalog.

create table if not exists public.app_settings (
  key text primary key,
  data jsonb not null default '{}'::jsonb,
  updated_at timestamptz not null default now()
);

alter table public.app_settings enable row level security;

create policy "app_settings_select"
  on public.app_settings for select
  using (true);

create policy "app_settings_insert"
  on public.app_settings for insert
  with check (true);

create policy "app_settings_update"
  on public.app_settings for update
  using (true);
