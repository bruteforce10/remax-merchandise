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

-- Popular search keywords, most-searched first.
create or replace function public.popular_keywords(p_limit int default 10)
returns table (keyword text, count bigint)
language sql
as $$
  select lower(trim(keyword)) as keyword, count(*)::bigint as count
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

-- Device split (distinct engaged sessions per device) for the last p_days.
create or replace function public.event_devices(p_days int default 30)
returns table (device text, sessions bigint)
language sql
stable
as $$
  select device, count(distinct session_id) as sessions
  from public.events
  where created_at >= now() - make_interval(days => p_days)
    and device is not null
    and session_id is not null
  group by device
  order by sessions desc;
$$;

-- Country split for the last p_days ('XX' = unknown / geo header absent).
create or replace function public.event_countries(p_days int default 30)
returns table (country text, count bigint)
language sql
stable
as $$
  select coalesce(nullif(country, ''), 'XX') as country, count(*) as count
  from public.events
  where created_at >= now() - make_interval(days => p_days)
  group by coalesce(nullif(country, ''), 'XX')
  order by count desc;
$$;

-- View + WA-click totals for the current window and the one before it (deltas).
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

