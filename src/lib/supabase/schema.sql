-- REMAX Gifts - orders + inventory (Supabase Postgres).
-- Run once in the Supabase SQL editor. Safe to re-run.
-- All access is via the service-role key from server actions; RLS is enabled
-- with NO policies so the anon/publishable key cannot read or write these tables.

-- Tables -------------------------------------------------------------------
create table if not exists public.inventory (
  sku          text primary key,
  product_sku  text not null,
  name         text,
  stock        integer not null default 0 check (stock >= 0),
  updated_at   timestamptz not null default now()
);
create index if not exists inventory_product_sku_idx on public.inventory (product_sku);

create table if not exists public.orders (
  id              uuid primary key default gen_random_uuid(),
  session_id      text,
  customer_email  text,
  status          text not null default 'pending'
                    check (status in ('pending', 'confirmed', 'rejected')),
  total_qty       integer not null default 0,
  estimated_total bigint not null default 0,
  note            text,
  created_at      timestamptz not null default now(),
  confirmed_at    timestamptz
);
create index if not exists orders_status_created_idx
  on public.orders (status, created_at desc);

create table if not exists public.order_items (
  id           uuid primary key default gen_random_uuid(),
  order_id     uuid not null references public.orders (id) on delete cascade,
  sku          text not null,
  product_sku  text,
  product_slug text,
  name         text,
  options      jsonb not null default '{}'::jsonb,
  qty          integer not null check (qty > 0),
  unit_price   bigint not null default 0
);
create index if not exists order_items_order_id_idx on public.order_items (order_id);

-- Row Level Security: service-role only ------------------------------------
-- Enable RLS with no policies -> anon/authenticated keys get zero rows; the
-- service-role key (used only by server actions) bypasses RLS entirely.
alter table public.inventory   enable row level security;
alter table public.orders      enable row level security;
alter table public.order_items enable row level security;

-- Atomic order confirmation -------------------------------------------------
-- Locks the order and the inventory rows it touches, blocks if any item is
-- short (returning the shortfalls), otherwise decrements all and confirms.
create or replace function public.confirm_order(p_order_id uuid)
returns jsonb
language plpgsql
as $$
declare
  v_status text;
  v_short  jsonb;
begin
  select status into v_status
    from public.orders
   where id = p_order_id
   for update;

  if v_status is null then
    return jsonb_build_object('ok', false, 'error', 'not_found');
  end if;
  if v_status <> 'pending' then
    return jsonb_build_object('ok', false, 'error', 'not_pending', 'status', v_status);
  end if;

  -- Lock the inventory rows this order touches (serializes concurrent confirms).
  perform 1
    from public.inventory i
    join public.order_items oi on oi.sku = i.sku
   where oi.order_id = p_order_id
   for update of i;

  -- Collect shortfalls (a missing SKU counts as 0 available).
  select jsonb_agg(jsonb_build_object(
           'sku', oi.sku,
           'name', oi.name,
           'requested', oi.qty,
           'available', coalesce(i.stock, 0)))
    into v_short
    from public.order_items oi
    left join public.inventory i on i.sku = oi.sku
   where oi.order_id = p_order_id
     and coalesce(i.stock, 0) < oi.qty;

  if v_short is not null then
    return jsonb_build_object('ok', false, 'error', 'insufficient', 'items', v_short);
  end if;

  update public.inventory i
     set stock = i.stock - oi.qty,
         updated_at = now()
    from public.order_items oi
   where oi.order_id = p_order_id
     and oi.sku = i.sku;

  update public.orders
     set status = 'confirmed',
         confirmed_at = now()
   where id = p_order_id;

  return jsonb_build_object('ok', true);
end;
$$;

