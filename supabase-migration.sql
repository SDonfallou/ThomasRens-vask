-- Run this in Supabase SQL Editor to set up the bookings table

create table public.bookings (
  id              uuid primary key default gen_random_uuid(),
  order_ref       text unique not null,
  name            text not null,
  phone           text not null,
  email           text not null,
  address         text not null,
  service         text not null,
  preferred_date  text,
  description     text,
  status          text not null default 'received'
                  check (status in ('received','processing','ready','collected')),
  created_at      timestamptz not null default now()
);

-- Index for fast lookups by phone
create index bookings_phone_idx on public.bookings (phone);

-- Row Level Security: public can't read; only service role (API) can write
alter table public.bookings enable row level security;

-- Do not create an overly permissive RLS policy for bookings.
-- The service role key used by server-side routes already bypasses RLS.
-- If you need client-side access later, replace this with a narrow policy.
-- Example: use auth.uid() checks for owner-specific access instead of `true`.
--
-- If this table already has an existing policy, drop it with:
-- drop policy if exists "service role full access" on public.bookings;
