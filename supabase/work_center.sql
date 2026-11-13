-- Centro de trabajo: tablas nuevas y aisladas, con filas separadas por usuario.
create table if not exists public.work_monitors (
  id uuid primary key default gen_random_uuid(),
  user_id uuid,
  name text not null check (char_length(trim(name)) > 0),
  description text,
  interval_minutes integer not null check (interval_minutes between 1 and 10080),
  last_review_at timestamptz,
  next_due_at timestamptz,
  review_started_at timestamptz,
  review_count integer not null default 0,
  paused boolean not null default false,
  paused_at timestamptz,
  created_at timestamptz not null default now()
);
alter table public.work_monitors add column if not exists review_count integer not null default 0;
alter table public.work_monitors add column if not exists paused_at timestamptz;
create index if not exists work_monitors_user_idx on public.work_monitors(user_id, created_at desc);

create table if not exists public.work_monitor_reviews (
  id uuid primary key default gen_random_uuid(),
  user_id uuid,
  monitor_id uuid,
  monitor_name text not null,
  interval_minutes integer not null,
  started_at timestamptz,
  completed_at timestamptz not null default now()
);
create index if not exists work_monitor_reviews_user_date_idx on public.work_monitor_reviews(user_id, completed_at desc);

create table if not exists public.work_tasks (
  id uuid primary key default gen_random_uuid(),
  user_id uuid,
  title text not null check (char_length(trim(title)) > 0),
  description text,
  priority text not null default 'media' check (priority in ('alta','media','baja')),
  due_at date,
  created_at timestamptz not null default now(),
  completed_at timestamptz,
  deleted_at timestamptz
);
create index if not exists work_tasks_user_created_idx on public.work_tasks(user_id, created_at desc);

-- The app is currently single-user and has no sign-in flow. Keep old rows
-- intact, but allow the anonymous Supabase role to use this private app's data.
alter table public.work_monitors alter column user_id drop not null;
alter table public.work_monitor_reviews alter column user_id drop not null;
alter table public.work_tasks alter column user_id drop not null;
alter table public.work_monitors drop constraint if exists work_monitors_user_id_fkey;
alter table public.work_monitor_reviews drop constraint if exists work_monitor_reviews_user_id_fkey;
alter table public.work_tasks drop constraint if exists work_tasks_user_id_fkey;

alter table public.work_monitors enable row level security;
alter table public.work_monitor_reviews enable row level security;
alter table public.work_tasks enable row level security;

drop policy if exists work_monitors_owner_all on public.work_monitors;
drop policy if exists work_monitors_private_app on public.work_monitors;
create policy work_monitors_private_app on public.work_monitors for all to anon, authenticated using (true) with check (true);
drop policy if exists work_monitor_reviews_owner_all on public.work_monitor_reviews;
drop policy if exists work_monitor_reviews_private_app on public.work_monitor_reviews;
create policy work_monitor_reviews_private_app on public.work_monitor_reviews for all to anon, authenticated using (true) with check (true);
drop policy if exists work_tasks_owner_all on public.work_tasks;
drop policy if exists work_tasks_private_app on public.work_tasks;
create policy work_tasks_private_app on public.work_tasks for all to anon, authenticated using (true) with check (true);

grant select, insert, update, delete on public.work_monitors, public.work_monitor_reviews, public.work_tasks to authenticated;
grant select, insert, update, delete on public.work_monitors, public.work_monitor_reviews, public.work_tasks to anon;

create or replace function public.complete_work_monitor(p_id uuid)
returns void language plpgsql security invoker set search_path = public as $$
declare m public.work_monitors%rowtype;
declare finished_at timestamptz := now();
begin
  select * into m from public.work_monitors where id = p_id for update;
  if not found then raise exception 'Monitor not found'; end if;
  insert into public.work_monitor_reviews(user_id, monitor_id, monitor_name, interval_minutes, started_at, completed_at)
  values (m.user_id, m.id, m.name, m.interval_minutes, m.review_started_at, finished_at);
  update public.work_monitors set last_review_at = finished_at,
    next_due_at = finished_at + make_interval(mins => interval_minutes),
    review_started_at = null, paused = false, review_count = review_count + 1 where id = m.id;
end;
$$;
grant execute on function public.complete_work_monitor(uuid) to authenticated;

create or replace function public.set_work_monitor_paused(p_id uuid, p_paused boolean)
returns public.work_monitors language plpgsql security invoker set search_path = public as $$
declare m public.work_monitors%rowtype;
begin
  select * into m from public.work_monitors where id = p_id for update;
  if not found then raise exception 'Monitor not found'; end if;
  if p_paused and not m.paused then
    update public.work_monitors set paused = true, paused_at = now() where id = p_id returning * into m;
  elsif not p_paused and m.paused then
    update public.work_monitors set paused = false,
      next_due_at = case when next_due_at is null or paused_at is null then next_due_at else next_due_at + (now() - paused_at) end,
      paused_at = null where id = p_id returning * into m;
  end if;
  return m;
end;
$$;
grant execute on function public.set_work_monitor_paused(uuid, boolean) to authenticated;
