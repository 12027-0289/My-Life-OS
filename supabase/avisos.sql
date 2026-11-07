-- My Life OS: avisos con la app cerrada (gratis, con Web Push).
-- Pegalo en Supabase → SQL Editor → New query y tocá Run. Se puede correr más de una vez.
-- Antes publicá la función "avisos" (ver README).

-- 1) Dispositivos que reciben avisos. Solo la función entra a estas tablas (sin políticas = nadie más).
create table if not exists public.mlos_push_subs (
  endpoint text primary key,
  user_id uuid not null references auth.users (id) on delete cascade,
  p256dh text not null,
  auth text not null,
  tz text not null default 'America/Costa_Rica',
  created_at timestamptz not null default now()
);
alter table public.mlos_push_subs enable row level security;

-- 2) Avisos ya enviados (para no mandar el mismo dos veces)
create table if not exists public.mlos_push_log (
  user_id uuid not null,
  key text not null,
  created_at timestamptz not null default now(),
  primary key (user_id, key)
);
alter table public.mlos_push_log enable row level security;

-- 3) Claves con las que se firman los avisos (la función las crea sola la primera vez)
create table if not exists public.mlos_push_keys (
  id int primary key default 1,
  public_key text not null,
  private_jwk jsonb not null
);
alter table public.mlos_push_keys enable row level security;

-- 4) El reloj: cada minuto le pide a la función que mande lo que toque
create extension if not exists pg_cron with schema pg_catalog;
create extension if not exists pg_net with schema extensions;

select cron.unschedule(jobid) from cron.job where jobname = 'mlos-avisos';
select cron.schedule(
  'mlos-avisos',
  '* * * * *',
  $$ select net.http_post(
       url := 'https://pmedkcicgwfjrhfzwxgp.supabase.co/functions/v1/avisos',
       body := '{"action":"tick"}'::jsonb,
       headers := '{"Content-Type":"application/json"}'::jsonb
     ) $$
);
