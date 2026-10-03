-- Bucket público para lectura, con escritura limitada a una sola imagen.
-- No modifica las tablas de Moto ni habilita cargas arbitrarias.

insert into storage.buckets (
  id,
  name,
  public,
  file_size_limit,
  allowed_mime_types
)
values (
  'moto',
  'moto',
  true,
  10485760,
  array['image/jpeg', 'image/png', 'image/webp']::text[]
)
on conflict (id) do update
set public = excluded.public,
    file_size_limit = excluded.file_size_limit,
    allowed_mime_types = excluded.allowed_mime_types;

-- La clave pública de la app solo puede acceder/escribir al objeto fijo
-- "principal". SELECT y UPDATE son necesarios para reemplazarlo con upsert.
drop policy if exists moto_single_image_insert on storage.objects;
create policy moto_single_image_insert
on storage.objects
for insert
to anon
with check (bucket_id = 'moto' and name = 'principal');

drop policy if exists moto_single_image_select on storage.objects;
create policy moto_single_image_select
on storage.objects
for select
to anon
using (bucket_id = 'moto' and name = 'principal');

drop policy if exists moto_single_image_update on storage.objects;
create policy moto_single_image_update
on storage.objects
for update
to anon
using (bucket_id = 'moto' and name = 'principal')
with check (bucket_id = 'moto' and name = 'principal');
