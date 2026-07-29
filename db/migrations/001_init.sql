create extension if not exists pgcrypto;

create table if not exists users (
  id uuid primary key default gen_random_uuid(),
  email text not null unique,
  name text,
  password_hash text not null,
  created_at timestamptz not null default now()
);

create table if not exists auth_rate_limits (
  key text primary key,
  count integer not null default 0,
  window_started_at timestamptz not null default now()
);

create table if not exists invites (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references users (id) on delete cascade,
  slug text not null unique,
  template_id text not null default 'default',
  partner_one text not null,
  partner_two text not null,
  event_at timestamptz not null,
  venue_name text not null,
  venue_address text,
  message text,
  accent_color text not null default '#7a2e3a',
  published boolean not null default false,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists invites_user_id_idx on invites (user_id);

create table if not exists guests (
  id uuid primary key default gen_random_uuid(),
  invite_id uuid not null references invites (id) on delete cascade,
  display_name text not null,
  token text not null unique,
  is_curated boolean not null default false,
  rsvp_status text not null default 'pending'
    check (rsvp_status in ('pending', 'yes', 'no', 'maybe')),
  party_size integer not null default 1 check (party_size >= 1 and party_size <= 20),
  rsvp_note text,
  rsvp_at timestamptz,
  created_at timestamptz not null default now()
);

create index if not exists guests_invite_id_idx on guests (invite_id);
