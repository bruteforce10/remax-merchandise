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
  weight_grams integer not null default 0 check (weight_grams >= 0),
  updated_at   timestamptz not null default now()
);
create index if not exists inventory_product_sku_idx on public.inventory (product_sku);
-- Migrate existing installs: per-unit shipping weight (grams), mirrored from the
-- product's Hygraph `weight` on save and read at checkout to calculate ongkir.
alter table public.inventory add column if not exists weight_grams integer not null default 0;

create table if not exists public.orders (
  id              uuid primary key default gen_random_uuid(),
  session_id      text,
  customer_email  text,
  status          text not null default 'pending'
                    check (status in ('pending', 'confirmed', 'processing',
                                      'shipped', 'completed', 'rejected')),
  total_qty       integer not null default 0,
  estimated_total bigint not null default 0,
  shipping_cost   bigint not null default 0,
  total_weight_grams integer not null default 0,
  courier_code    text,
  courier_service text,
  recipient_name  text,
  recipient_phone text,
  address_detail  text,
  province_code   text,
  province_name   text,
  regency_code    text,
  regency_name    text,
  district_code   text,
  district_name   text,
  village_code    text,
  village_name    text,
  postal_code     text,
  note            text,
  resi            text,
  courier         text,
  created_at      timestamptz not null default now(),
  confirmed_at    timestamptz,
  shipped_at      timestamptz,
  completed_at    timestamptz
);
create index if not exists orders_status_created_idx
  on public.orders (status, created_at desc);

-- Migrate existing installs: add the new columns + widen the status check to the
-- 6-stage flow (pending -> confirmed -> processing -> shipped -> completed, plus
-- rejected). Safe to re-run.
alter table public.orders add column if not exists resi         text;
alter table public.orders add column if not exists courier      text;
alter table public.orders add column if not exists shipped_at   timestamptz;
alter table public.orders add column if not exists completed_at timestamptz;
-- Shipping (ongkir) + delivery destination captured at checkout.
alter table public.orders add column if not exists shipping_cost      bigint  not null default 0;
alter table public.orders add column if not exists total_weight_grams integer not null default 0;
alter table public.orders add column if not exists courier_code       text;
alter table public.orders add column if not exists courier_service    text;
alter table public.orders add column if not exists recipient_name     text;
alter table public.orders add column if not exists recipient_phone    text;
alter table public.orders add column if not exists address_detail     text;
alter table public.orders add column if not exists province_code      text;
alter table public.orders add column if not exists province_name      text;
alter table public.orders add column if not exists regency_code       text;
alter table public.orders add column if not exists regency_name       text;
alter table public.orders add column if not exists district_code      text;
alter table public.orders add column if not exists district_name      text;
alter table public.orders add column if not exists village_code       text;
alter table public.orders add column if not exists village_name       text;
alter table public.orders add column if not exists postal_code        text;
do $$
begin
  alter table public.orders drop constraint if exists orders_status_check;
  alter table public.orders add constraint orders_status_check
    check (status in ('pending', 'confirmed', 'processing',
                      'shipped', 'completed', 'rejected'));
end $$;

-- Per-order stage timeline (one row per status change), with an optional note the
-- customer sees on the tracking page. Service-role only (RLS on, no policies).
create table if not exists public.order_status_history (
  id         uuid primary key default gen_random_uuid(),
  order_id   uuid not null references public.orders (id) on delete cascade,
  status     text not null,
  note       text,
  created_at timestamptz not null default now()
);
create index if not exists order_status_history_order_idx
  on public.order_status_history (order_id, created_at);
alter table public.order_status_history enable row level security;

create table if not exists public.order_items (
  id           uuid primary key default gen_random_uuid(),
  order_id     uuid not null references public.orders (id) on delete cascade,
  sku          text not null,
  product_sku  text,
  product_slug text,
  name         text,
  options      jsonb not null default '{}'::jsonb,
  qty          integer not null check (qty > 0),
  unit_price   bigint not null default 0,
  weight_grams integer not null default 0
);
create index if not exists order_items_order_id_idx on public.order_items (order_id);
alter table public.order_items add column if not exists weight_grams integer not null default 0;

-- Row Level Security: service-role only ------------------------------------
-- Enable RLS with no policies -> anon/authenticated keys get zero rows; the
-- service-role key (used only by server actions) bypasses RLS entirely.
alter table public.inventory   enable row level security;
alter table public.orders      enable row level security;
alter table public.order_items enable row level security;

-- Saved customer delivery addresses (Shopee-like address book). Access stays via
-- server actions/service-role only; RLS is enabled with no public policies.
create table if not exists public.customer_addresses (
  id              uuid primary key default gen_random_uuid(),
  user_id         uuid not null references auth.users (id) on delete cascade,
  customer_email  text not null,
  label           text not null default 'Alamat',
  recipient_name  text not null,
  recipient_phone text not null,
  address_detail  text not null,
  province_code   text not null,
  province_name   text not null,
  regency_code    text not null,
  regency_name    text not null,
  district_code   text not null,
  district_name   text not null,
  village_code    text not null,
  village_name    text not null,
  postal_code     text not null default '',
  is_default      boolean not null default false,
  created_at      timestamptz not null default now(),
  updated_at      timestamptz not null default now()
);
create index if not exists customer_addresses_user_idx
  on public.customer_addresses (user_id, created_at desc);
create unique index if not exists customer_addresses_one_default_idx
  on public.customer_addresses (user_id) where is_default;
alter table public.customer_addresses enable row level security;

-- Atomic order confirmation -------------------------------------------------
-- Locks the order and the inventory rows it touches, blocks if any item is
-- short (returning the shortfalls), otherwise decrements all and confirms.
drop function if exists public.confirm_order(uuid);
create or replace function public.confirm_order(p_order_id uuid, p_note text default '')
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

  insert into public.order_status_history (order_id, status, note)
  values (p_order_id, 'confirmed', nullif(trim(p_note), ''));

  return jsonb_build_object('ok', true);
end;
$$;

-- Advance an order along the post-confirmation stages, logging each change to
-- order_status_history with an optional customer-facing note. Allowed moves:
--   pending -> rejected, confirmed -> processing, processing -> shipped,
--   shipped -> completed. Shipping requires a courier + tracking number (resi).
create or replace function public.advance_order(
  p_order_id uuid,
  p_status   text,
  p_note     text default '',
  p_resi     text default null,
  p_courier  text default null
)
returns jsonb
language plpgsql
as $$
declare
  v_status  text;
  v_allowed boolean;
begin
  select status into v_status
    from public.orders
   where id = p_order_id
   for update;

  if v_status is null then
    return jsonb_build_object('ok', false, 'error', 'not_found');
  end if;

  v_allowed := (v_status = 'pending'    and p_status = 'rejected')
            or (v_status = 'confirmed'  and p_status = 'processing')
            or (v_status = 'processing' and p_status = 'shipped')
            or (v_status = 'shipped'    and p_status = 'completed');
  if not v_allowed then
    return jsonb_build_object('ok', false, 'error', 'invalid_transition',
                              'from', v_status, 'to', p_status);
  end if;

  if p_status = 'shipped' then
    if p_resi is null or length(trim(p_resi)) = 0
       or p_courier is null or length(trim(p_courier)) = 0 then
      return jsonb_build_object('ok', false, 'error', 'resi_required');
    end if;
    update public.orders
       set status = 'shipped', resi = trim(p_resi),
           courier = trim(p_courier), shipped_at = now()
     where id = p_order_id;
  elsif p_status = 'completed' then
    update public.orders
       set status = 'completed', completed_at = now()
     where id = p_order_id;
  else
    update public.orders set status = p_status where id = p_order_id;
  end if;

  insert into public.order_status_history (order_id, status, note)
  values (p_order_id, p_status, nullif(trim(p_note), ''));

  return jsonb_build_object('ok', true);
end;
$$;

-- Admin override of an order's shipping cost / chosen courier (recalculated from
-- the ongkir API or entered manually). Allowed any time before the order is
-- completed or rejected. An optional note is appended to the stage timeline.
create or replace function public.update_order_shipping(
  p_order_id        uuid,
  p_shipping_cost   bigint,
  p_courier_code    text default null,
  p_courier_service text default null,
  p_note            text default ''
)
returns jsonb
language plpgsql
as $$
declare
  v_status text;
begin
  select status into v_status
    from public.orders
   where id = p_order_id
   for update;

  if v_status is null then
    return jsonb_build_object('ok', false, 'error', 'not_found');
  end if;
  if v_status in ('completed', 'rejected') then
    return jsonb_build_object('ok', false, 'error', 'locked', 'status', v_status);
  end if;

  update public.orders
     set shipping_cost   = greatest(coalesce(p_shipping_cost, 0), 0),
         courier_code    = coalesce(nullif(trim(p_courier_code), ''), courier_code),
         courier_service = coalesce(nullif(trim(p_courier_service), ''), courier_service)
   where id = p_order_id;

  if nullif(trim(p_note), '') is not null then
    insert into public.order_status_history (order_id, status, note)
    values (p_order_id, v_status, trim(p_note));
  end if;

  return jsonb_build_object('ok', true);
end;
$$;

-- Resolve the short human ref (first 8 hex of the id, e.g. "A1B2C3D4") back to
-- the full order id, for the public /lacak/<ref> tracking page.
create or replace function public.order_id_by_ref(p_ref text)
returns uuid
language sql
stable
as $$
  select id
    from public.orders
   where left(replace(id::text, '-', ''), 8) = lower(trim(p_ref))
   limit 1;
$$;

-- Engagement funnel + search log -------------------------------------------
-- product_stats: per-product counters (maps to the ProductStats model).
-- search_logs:   one row per committed search (maps to the SearchLog model).
create table if not exists public.product_stats (
  product_slug   text primary key,
  views          integer not null default 0,
  cart_count     integer not null default 0,
  checkout_count integer not null default 0,
  updated_at     timestamptz not null default now()
);

create table if not exists public.search_logs (
  id         uuid primary key default gen_random_uuid(),
  keyword    text not null,
  session_id text,
  created_at timestamptz not null default now()
);
create index if not exists search_logs_keyword_idx on public.search_logs (lower(trim(keyword)));
create index if not exists search_logs_created_idx on public.search_logs (created_at desc);

alter table public.product_stats enable row level security;
alter table public.search_logs   enable row level security;

-- Atomic per-product counter bump (upsert). p_kind in ('view','cart','checkout').
create or replace function public.bump_product_stat(p_slug text, p_kind text)
returns void
language plpgsql
as $$
begin
  insert into public.product_stats (product_slug, views, cart_count, checkout_count)
  values (
    p_slug,
    case when p_kind = 'view'     then 1 else 0 end,
    case when p_kind = 'cart'     then 1 else 0 end,
    case when p_kind = 'checkout' then 1 else 0 end
  )
  on conflict (product_slug) do update
    set views          = public.product_stats.views          + (case when p_kind = 'view'     then 1 else 0 end),
        cart_count     = public.product_stats.cart_count     + (case when p_kind = 'cart'     then 1 else 0 end),
        checkout_count = public.product_stats.checkout_count + (case when p_kind = 'checkout' then 1 else 0 end),
        updated_at     = now();
end;
$$;

-- Popular search keywords, most-searched first. Also returns the last time each
-- keyword was searched and its count within the current (Asia/Jakarta) week, for
-- the admin keyword detail table.
drop function if exists public.popular_keywords(int);
create or replace function public.popular_keywords(p_limit int default 10)
returns table (keyword text, count bigint, last_searched timestamptz, week_count bigint)
language sql
as $$
  select lower(trim(keyword)) as keyword,
         count(*)::bigint as count,
         max(created_at) as last_searched,
         count(*) filter (
           where (created_at at time zone 'Asia/Jakarta')
                 >= date_trunc('week', now() at time zone 'Asia/Jakarta')
         )::bigint as week_count
  from public.search_logs
  group by lower(trim(keyword))
  order by count desc
  limit p_limit;
$$;

-- Engagement events (time-series) ------------------------------------------
-- One row per tracked engagement, powering the admin Analytics charts:
-- daily views/WA-clicks, device + country breakdown, and windowed totals.
-- Maps to the Event model (id, type, productId->product_slug, sessionId, ...).
-- device is derived from the User-Agent, country from the Vercel geo header.
create table if not exists public.events (
  id           uuid primary key default gen_random_uuid(),
  type         text not null check (type in ('view', 'cart', 'wa')),
  product_slug text,
  session_id   text,
  device       text check (device in ('mobile', 'desktop', 'tablet')),
  country      text,
  created_at   timestamptz not null default now()
);
create index if not exists events_created_idx on public.events (created_at desc);
create index if not exists events_type_created_idx on public.events (type, created_at desc);
create index if not exists events_product_idx on public.events (product_slug);

alter table public.events enable row level security;

-- Daily views + WA clicks for the last p_days, gap-filled (one row per day,
-- bucketed in Asia/Jakarta so "today" matches the audience's local day).
drop function if exists public.event_daily(int);
create or replace function public.event_daily(p_days int default 14)
returns table (day date, views bigint, wa_clicks bigint)
language sql
stable
as $$
  with bounds as (
    select (now() at time zone 'Asia/Jakarta')::date as today
  ),
  days as (
    select generate_series(b.today - (p_days - 1), b.today, interval '1 day')::date as day
    from bounds b
  )
  select d.day,
         count(e.id) filter (where e.type = 'view') as views,
         count(e.id) filter (where e.type = 'wa')   as wa_clicks
  from days d
  left join public.events e
    on (e.created_at at time zone 'Asia/Jakarta')::date = d.day
  group by d.day
  order by d.day;
$$;

-- Weekly views + WA clicks for the last p_weeks, gap-filled (one row per ISO
-- week, bucketed in Asia/Jakarta). Powers the admin weekly-report trend chart.
drop function if exists public.event_weekly(int);
create or replace function public.event_weekly(p_weeks int default 12)
returns table (week_start date, views bigint, wa_clicks bigint)
language sql
stable
as $$
  with bounds as (
    select date_trunc('week', (now() at time zone 'Asia/Jakarta'))::date as this_week
  ),
  weeks as (
    select generate_series(b.this_week - ((p_weeks - 1) * 7),
                           b.this_week, interval '1 week')::date as week_start
    from bounds b
  )
  select w.week_start,
         count(e.id) filter (where e.type = 'view') as views,
         count(e.id) filter (where e.type = 'wa')   as wa_clicks
  from weeks w
  left join public.events e
    on date_trunc('week', (e.created_at at time zone 'Asia/Jakarta'))::date = w.week_start
  group by w.week_start
  order by w.week_start;
$$;

-- Device + country breakdowns were removed from the admin Analytics page. Drop
-- the RPCs if an earlier deploy created them. The events.device / events.country
-- columns are intentionally left in place (unused, nullable) to avoid a
-- destructive migration; drop them later in a separate, explicit change if wanted.
drop function if exists public.event_devices(int);
drop function if exists public.event_countries(int);

-- View + WA-click totals for the current window and the one before it (deltas).
drop function if exists public.event_totals(int);
create or replace function public.event_totals(p_days int default 30)
returns table (views_cur bigint, views_prev bigint, wa_cur bigint, wa_prev bigint)
language sql
stable
as $$
  select
    count(*) filter (
      where type = 'view' and created_at >= now() - make_interval(days => p_days)),
    count(*) filter (
      where type = 'view'
        and created_at >= now() - make_interval(days => p_days * 2)
        and created_at <  now() - make_interval(days => p_days)),
    count(*) filter (
      where type = 'wa' and created_at >= now() - make_interval(days => p_days)),
    count(*) filter (
      where type = 'wa'
        and created_at >= now() - make_interval(days => p_days * 2)
        and created_at <  now() - make_interval(days => p_days))
  from public.events;
$$;

-- Search totals for the current window and the one before it (delta).
drop function if exists public.search_totals(int);
create or replace function public.search_totals(p_days int default 30)
returns table (cur bigint, prev bigint)
language sql
stable
as $$
  select
    count(*) filter (where created_at >= now() - make_interval(days => p_days)),
    count(*) filter (
      where created_at >= now() - make_interval(days => p_days * 2)
        and created_at <  now() - make_interval(days => p_days))
  from public.search_logs;
$$;

-- Per-product views + WA clicks over the last p_days (most-viewed first). Feeds
-- the top-products list plus the popular-product and popular-category metrics.
drop function if exists public.event_product_stats(int);
create or replace function public.event_product_stats(p_days int default 30)
returns table (product_slug text, views bigint, wa_clicks bigint)
language sql
stable
as $$
  select product_slug,
         count(*) filter (where type = 'view') as views,
         count(*) filter (where type = 'wa')   as wa_clicks
  from public.events
  where product_slug is not null
    and created_at >= now() - make_interval(days => p_days)
  group by product_slug
  order by views desc, wa_clicks desc;
$$;

