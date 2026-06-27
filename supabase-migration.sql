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

-- Loyalty customers (one profile per phone/email)
create table if not exists public.loyalty_customers (
  id               uuid primary key default gen_random_uuid(),
  name             text not null,
  phone            text,
  email            text,
  points_balance   integer not null default 0 check (points_balance >= 0),
  lifetime_points  integer not null default 0 check (lifetime_points >= 0),
  created_at       timestamptz not null default now(),
  updated_at       timestamptz not null default now()
);

create unique index if not exists loyalty_customers_phone_unique
  on public.loyalty_customers (phone)
  where phone is not null and phone <> '';

create unique index if not exists loyalty_customers_email_unique
  on public.loyalty_customers (email)
  where email is not null and email <> '';

create index if not exists loyalty_customers_created_idx
  on public.loyalty_customers (created_at desc);

-- Points ledger for auditability
create table if not exists public.loyalty_transactions (
  id               uuid primary key default gen_random_uuid(),
  customer_id      uuid not null references public.loyalty_customers(id) on delete cascade,
  kind             text not null check (kind in ('earn', 'redeem', 'adjust')),
  points           integer not null,
  note             text,
  order_ref        text,
  created_at       timestamptz not null default now()
);

create index if not exists loyalty_transactions_customer_idx
  on public.loyalty_transactions (customer_id, created_at desc);

alter table public.loyalty_customers enable row level security;
alter table public.loyalty_transactions enable row level security;
