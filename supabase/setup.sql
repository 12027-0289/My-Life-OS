-- My Life OS: tabla y fotos para sincronizar entre dispositivos.
-- Pegalo en Supabase → SQL Editor → New query y tocá Run. Se puede correr más de una vez.

-- 1) Tus datos: una fila por persona con todo el estado de la app
create table if not exists public.mlos_state (
  user_id uuid primary key references auth.users (id) on delete cascade,
  data jsonb not null,
  updated_at timestamptz not null default now()
);
alter table public.mlos_state enable row level security;

drop policy if exists "mlos_state: leer lo mío" on public.mlos_state;
drop policy if exists "mlos_state: crear lo mío" on public.mlos_state;
drop policy if exists "mlos_state: cambiar lo mío" on public.mlos_state;
drop policy if exists "mlos_state: borrar lo mío" on public.mlos_state;
create policy "mlos_state: leer lo mío" on public.mlos_state for select to authenticated using ((select auth.uid()) = user_id);
create policy "mlos_state: crear lo mío" on public.mlos_state for insert to authenticated with check ((select auth.uid()) = user_id);
create policy "mlos_state: cambiar lo mío" on public.mlos_state for update to authenticated using ((select auth.uid()) = user_id) with check ((select auth.uid()) = user_id);
create policy "mlos_state: borrar lo mío" on public.mlos_state for delete to authenticated using ((select auth.uid()) = user_id);

-- 2) Fotos (closet, comidas, recetas, metas): bucket privado, una carpeta por persona
insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values ('mlos-photos', 'mlos-photos', false, 5242880, array['image/jpeg', 'image/png', 'image/webp'])
on conflict (id) do nothing;

drop policy if exists "mlos-photos: leer las mías" on storage.objects;
drop policy if exists "mlos-photos: subir las mías" on storage.objects;
drop policy if exists "mlos-photos: cambiar las mías" on storage.objects;
drop policy if exists "mlos-photos: borrar las mías" on storage.objects;
create policy "mlos-photos: leer las mías" on storage.objects for select to authenticated
  using (bucket_id = 'mlos-photos' and (storage.foldername(name))[1] = (select auth.uid())::text);
create policy "mlos-photos: subir las mías" on storage.objects for insert to authenticated
  with check (bucket_id = 'mlos-photos' and (storage.foldername(name))[1] = (select auth.uid())::text);
create policy "mlos-photos: cambiar las mías" on storage.objects for update to authenticated
  using (bucket_id = 'mlos-photos' and (storage.foldername(name))[1] = (select auth.uid())::text);
create policy "mlos-photos: borrar las mías" on storage.objects for delete to authenticated
  using (bucket_id = 'mlos-photos' and (storage.foldername(name))[1] = (select auth.uid())::text);
