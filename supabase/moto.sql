-- Tablas del módulo Moto. No habilita RLS ni modifica tablas existentes.

create table if not exists public.moto (
  id smallint primary key default 1 check (id = 1),
  nombre text not null,
  marca text not null,
  modelo text not null,
  anio smallint not null,
  kilometraje_actual integer not null default 0 check (kilometraje_actual >= 0),
  imagen_url text,
  ultimo_cambio_aceite integer check (ultimo_cambio_aceite is null or ultimo_cambio_aceite >= 0),
  fecha_ultimo_cambio_aceite date,
  notas text,
  created_at timestamptz not null default now()
);

create table if not exists public.mantenimientos_moto (
  id uuid primary key default gen_random_uuid(),
  tipo text not null,
  fecha date not null,
  kilometraje integer not null check (kilometraje >= 0),
  costo numeric(12, 2) not null default 0 check (costo >= 0),
  notas text,
  created_at timestamptz not null default now()
);

create table if not exists public.gastos_moto (
  id uuid primary key default gen_random_uuid(),
  categoria text not null,
  descripcion text not null,
  valor numeric(12, 2) not null check (valor >= 0),
  fecha date not null,
  created_at timestamptz not null default now()
);

create index if not exists mantenimientos_moto_fecha_idx
  on public.mantenimientos_moto (fecha desc);

create index if not exists gastos_moto_fecha_idx
  on public.gastos_moto (fecha desc);

insert into public.moto (id, nombre, marca, modelo, anio)
values (1, 'Pulsar NS160 FI', 'Bajaj', 'NS160 FI', 2023)
on conflict (id) do nothing;

-- La aplicación usa la clave anon y todavía no incorpora autenticación/RLS.
grant select, insert, update, delete on public.moto to anon;
grant select, insert, update, delete on public.mantenimientos_moto to anon;
grant select, insert, update, delete on public.gastos_moto to anon;
