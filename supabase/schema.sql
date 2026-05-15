-- Fotbolls-VM 2026 — Supabase schema
-- Run this in the Supabase SQL editor (or via `supabase db push`) once per project.

create extension if not exists "pgcrypto";

-- ENUMS ---------------------------------------------------------------------
do $$ begin
  create type stage as enum (
    'group',
    'round_of_32',
    'round_of_16',
    'quarter_final',
    'semi_final',
    'third_place',
    'final'
  );
exception when duplicate_object then null; end $$;

do $$ begin
  create type match_status as enum ('scheduled', 'live', 'finished', 'cancelled');
exception when duplicate_object then null; end $$;

-- TABLES --------------------------------------------------------------------
create table if not exists profiles (
  id          uuid primary key references auth.users(id) on delete cascade,
  name        text not null check (length(name) between 1 and 40),
  is_admin    boolean not null default false,
  created_at  timestamptz not null default now()
);

create table if not exists matches (
  id          uuid primary key default gen_random_uuid(),
  external_id text unique,
  home_team   text not null,
  away_team   text not null,
  kickoff     timestamptz not null,
  stage       stage not null default 'group',
  group_name  text,
  venue       text,
  home_score  int,
  away_score  int,
  status      match_status not null default 'scheduled',
  updated_at  timestamptz not null default now()
);
create index if not exists matches_kickoff_idx on matches (kickoff);

create table if not exists bets (
  id          uuid primary key default gen_random_uuid(),
  user_id     uuid not null references auth.users(id) on delete cascade,
  match_id    uuid not null references matches(id) on delete cascade,
  home_bet    int not null check (home_bet between 0 and 20),
  away_bet    int not null check (away_bet between 0 and 20),
  updated_at  timestamptz not null default now(),
  unique (user_id, match_id)
);
create index if not exists bets_user_idx on bets (user_id);
create index if not exists bets_match_idx on bets (match_id);

-- Helper: is the cutoff (2h before kickoff) still in the future?
create or replace function bet_is_open(p_match_id uuid)
returns boolean
language sql
stable
as $$
  select kickoff - interval '2 hours' > now()
  from matches where id = p_match_id;
$$;

-- Helper: is the current user an admin?
create or replace function is_admin()
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select coalesce((select is_admin from profiles where id = auth.uid()), false);
$$;

-- updated_at trigger
create or replace function set_updated_at()
returns trigger language plpgsql as $$
begin new.updated_at = now(); return new; end $$;

drop trigger if exists trg_bets_updated on bets;
create trigger trg_bets_updated
  before update on bets
  for each row execute function set_updated_at();

drop trigger if exists trg_matches_updated on matches;
create trigger trg_matches_updated
  before update on matches
  for each row execute function set_updated_at();

-- ROW LEVEL SECURITY --------------------------------------------------------
alter table profiles enable row level security;
alter table matches  enable row level security;
alter table bets     enable row level security;

-- Profiles: everyone signed in can read (needed for leaderboard names),
-- a user can insert/update only their own row.
drop policy if exists profiles_select on profiles;
create policy profiles_select on profiles
  for select using (auth.role() = 'authenticated');

drop policy if exists profiles_insert on profiles;
create policy profiles_insert on profiles
  for insert with check (auth.uid() = id);

drop policy if exists profiles_update on profiles;
create policy profiles_update on profiles
  for update using (auth.uid() = id) with check (auth.uid() = id);

-- Matches: everyone signed in can read; only admin can write.
drop policy if exists matches_select on matches;
create policy matches_select on matches
  for select using (auth.role() = 'authenticated');

drop policy if exists matches_modify on matches;
create policy matches_modify on matches
  for all using (is_admin()) with check (is_admin());

-- Bets:
--   * each user reads their own bets freely.
--   * everyone signed in can read other users' bets ONLY for matches whose
--     cutoff has passed (so the leaderboard can show everyone, but no one
--     can peek at bets while the window is still open).
--   * users insert/update/delete their own bet ONLY while the 2-hour window is open.
drop policy if exists bets_select_own on bets;
create policy bets_select_own on bets
  for select using (user_id = auth.uid());

drop policy if exists bets_select_locked on bets;
create policy bets_select_locked on bets
  for select using (
    auth.role() = 'authenticated'
    and not bet_is_open(match_id)
  );

drop policy if exists bets_insert_own on bets;
create policy bets_insert_own on bets
  for insert with check (
    user_id = auth.uid() and bet_is_open(match_id)
  );

drop policy if exists bets_update_own on bets;
create policy bets_update_own on bets
  for update using (
    user_id = auth.uid() and bet_is_open(match_id)
  ) with check (
    user_id = auth.uid() and bet_is_open(match_id)
  );

drop policy if exists bets_delete_own on bets;
create policy bets_delete_own on bets
  for delete using (
    user_id = auth.uid() and bet_is_open(match_id)
  );

-- AUTO-CREATE PROFILE ON SIGNUP --------------------------------------------
-- The "name" comes from the user's auth metadata (set during sign-up).
create or replace function handle_new_user()
returns trigger language plpgsql security definer set search_path = public as $$
begin
  insert into profiles (id, name)
  values (new.id, coalesce(new.raw_user_meta_data->>'name', 'Anonym'))
  on conflict (id) do nothing;
  return new;
end $$;

drop trigger if exists trg_on_auth_user_created on auth.users;
create trigger trg_on_auth_user_created
  after insert on auth.users
  for each row execute function handle_new_user();
