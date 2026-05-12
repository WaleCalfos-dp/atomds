-- Brand Portal — Supabase schema
--
-- One row per authenticated user. RLS pins every row to its owner so the
-- public anon key can safely run all CRUD from the browser.
--
-- Apply with: paste into the Supabase SQL editor and run.

create table if not exists public.brands (
  user_id        uuid primary key references auth.users(id) on delete cascade,
  name           text not null default 'My brand',
  logo_url       text,
  font           text not null default '''Inter'', sans-serif',
  seed_primary   text not null,
  seed_secondary text not null,
  seed_neutral   text not null,
  seed_success   text not null,
  seed_warning   text not null,
  seed_error     text not null,
  updated_at     timestamptz not null default now()
);

alter table public.brands enable row level security;

drop policy if exists "owner_select" on public.brands;
drop policy if exists "owner_insert" on public.brands;
drop policy if exists "owner_update" on public.brands;
drop policy if exists "owner_delete" on public.brands;

create policy "owner_select" on public.brands for select
  using (auth.uid() = user_id);

create policy "owner_insert" on public.brands for insert
  with check (auth.uid() = user_id);

create policy "owner_update" on public.brands for update
  using (auth.uid() = user_id)
  with check (auth.uid() = user_id);

create policy "owner_delete" on public.brands for delete
  using (auth.uid() = user_id);

-- Bump updated_at on every change.
create or replace function public.set_updated_at()
returns trigger language plpgsql as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

drop trigger if exists brands_set_updated_at on public.brands;
create trigger brands_set_updated_at
  before update on public.brands
  for each row execute function public.set_updated_at();
