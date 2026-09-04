-- Схема Supabase для Форума-Фестиваля «Преображение».
-- Выполните этот файл в SQL Editor вашего проекта Supabase
-- (https://supabase.com/dashboard/project/_/sql) перед тем как
-- задать NEXT_PUBLIC_SUPABASE_URL и SUPABASE_SERVICE_ROLE_KEY в .env.local.
--
-- После этого lib/storage.ts автоматически начнёт использовать эти таблицы
-- вместо локальных JSON-файлов — код компонентов и форм менять не нужно.

create extension if not exists "pgcrypto";

create table if not exists public.registrations (
  id uuid primary key default gen_random_uuid(),
  status text not null default 'новая',
  created_at timestamptz not null default now(),
  "firstName" text not null,
  "lastName" text not null,
  phone text not null,
  email text not null,
  telegram text,
  city text not null,
  dates text not null,
  format text not null,
  participants integer not null,
  accommodation text not null,
  meals text not null,
  "transferNeeded" boolean not null default false,
  comment text
);

create table if not exists public.speaker_applications (
  id uuid primary key default gen_random_uuid(),
  status text not null default 'новая',
  created_at timestamptz not null default now(),
  name text not null,
  role text not null,
  org text,
  topic text not null,
  description text not null,
  bio text not null,
  links text,
  format text not null,
  "preferredDate" text,
  "techRequirements" text,
  email text not null,
  phone text not null
);

create table if not exists public.partner_applications (
  id uuid primary key default gen_random_uuid(),
  status text not null default 'новая',
  created_at timestamptz not null default now(),
  org text not null,
  representative text not null,
  email text not null,
  phone text not null,
  "siteUrl" text,
  activity text not null,
  "cooperationFormat" text not null,
  contribution text,
  "expectedResult" text,
  "presentationUrl" text,
  comment text
);

create table if not exists public.orders (
  id uuid primary key default gen_random_uuid(),
  status text not null default 'новая',
  created_at timestamptz not null default now(),
  registration_id text,
  package_id text,
  amount numeric not null,
  description text,
  payment_status text not null default 'создан'
);

-- Row Level Security: доступ только через сервисный ключ (используется исключительно
-- на сервере, никогда в клиентском коде), поэтому политики для анонимного
-- доступа сознательно не создаются.
alter table public.registrations enable row level security;
alter table public.speaker_applications enable row level security;
alter table public.partner_applications enable row level security;
alter table public.orders enable row level security;
