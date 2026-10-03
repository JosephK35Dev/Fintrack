-- Tablas para el módulo personal de Hábitos.
-- Script aditivo: crea únicamente estas dos tablas si aún no existen.

create table if not exists public.habitos (
  id uuid primary key default gen_random_uuid(),
  nombre text not null check (char_length(trim(nombre)) > 0),
  descripcion text,
  dias_semana smallint[] not null default ARRAY[1, 2, 3, 4, 5, 6, 7]::smallint[],
  activo boolean not null default true,
  created_at timestamptz not null default now()
);

-- Para instalaciones existentes, la columna nueva asigna todos los días
-- a los hábitos actuales y conserva sus registros sin modificarlos.
alter table public.habitos
  add column if not exists dias_semana smallint[] not null
  default ARRAY[1, 2, 3, 4, 5, 6, 7]::smallint[];

do $$
begin
  if not exists (
    select 1
    from pg_constraint
    where conname = 'habitos_dias_semana_validos'
      and conrelid = 'public.habitos'::regclass
  ) then
    alter table public.habitos
      add constraint habitos_dias_semana_validos
      check (
        cardinality(dias_semana) between 1 and 7
        and dias_semana <@ ARRAY[1, 2, 3, 4, 5, 6, 7]::smallint[]
      );
  end if;
end $$;

create table if not exists public.habito_registros (
  id uuid primary key default gen_random_uuid(),
  habito_id uuid not null references public.habitos(id) on delete cascade,
  fecha date not null,
  created_at timestamptz not null default now(),
  constraint habito_registros_habito_fecha_unique unique (habito_id, fecha)
);

create index if not exists habito_registros_fecha_idx
  on public.habito_registros (fecha desc);
