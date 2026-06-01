-- ============================================
-- OTAKU SHOP — Schéma Supabase
-- Coller dans : Supabase > SQL Editor > Run
-- ============================================

-- USERS
create table if not exists public.users (
  id                    uuid primary key default gen_random_uuid(),
  email                 text unique not null,
  pseudo                text unique not null,
  password_hash         text not null,
  avatar_url            text,
  wallet_address        text unique,
  subscription_tier     text not null default 'free' check (subscription_tier in ('free', 'subscriber')),
  subscription_expires_at timestamptz,
  created_at            timestamptz not null default now()
);

-- REMIXES
create table if not exists public.remixes (
  id          uuid primary key default gen_random_uuid(),
  user_id     uuid not null references public.users(id) on delete cascade,
  photo_id    text not null,
  image_url   text not null,
  votes_count integer not null default 0,
  created_at  timestamptz not null default now(),
  unique (user_id, photo_id)
);

-- VOTES
create table if not exists public.votes (
  id             uuid primary key default gen_random_uuid(),
  voter_user_id  uuid not null references public.users(id) on delete cascade,
  remix_id       uuid not null references public.remixes(id) on delete cascade,
  photo_id       text not null,
  created_at     timestamptz not null default now(),
  unique (voter_user_id, photo_id)
);

-- INDEX pour perf
create index if not exists remixes_photo_id_idx on public.remixes(photo_id);
create index if not exists votes_voter_photo_idx on public.votes(voter_user_id, photo_id);

-- RLS : désactiver l'accès direct depuis le client (l'API Render utilise la service key)
alter table public.users    enable row level security;
alter table public.remixes  enable row level security;
alter table public.votes    enable row level security;
