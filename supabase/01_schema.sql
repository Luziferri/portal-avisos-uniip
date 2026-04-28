-- UNIIP - Supabase schema (Sprint 1)
-- Run this first in the Supabase SQL Editor.

create extension if not exists pgcrypto;

-- Domain enums
do $$
begin
  create type public.user_role as enum ('Professor', 'Aluno', 'Secretaria');
exception
  when duplicate_object then null;
end
$$;

do $$
begin
  alter type public.user_role add value if not exists 'Secretaria';
exception
  when duplicate_object then null;
end
$$;

do $$
begin
  create type public.school_code as enum ('ESE', 'EST', 'ESS', 'ESCE');
exception
  when duplicate_object then null;
end
$$;

do $$
begin
  create type public.announcement_category as enum ('Evento', 'Voluntariado', 'Aviso Académico');
exception
  when duplicate_object then null;
end
$$;

-- User profile (1:1 with auth.users)
create table if not exists public.profiles (
  id uuid primary key references auth.users (id) on delete cascade,
  full_name text not null,
  username text not null,
  role public.user_role not null,
  school public.school_code not null,
  avatar_url text,
  created_at timestamptz not null default timezone('utc', now()),
  updated_at timestamptz not null default timezone('utc', now())
);

alter table public.profiles
  add column if not exists username text;

alter table public.profiles
  add column if not exists avatar_url text;

update public.profiles p
set username = lower(split_part(u.email, '@', 1))
from auth.users u
where p.id = u.id
  and (p.username is null or btrim(p.username) = '');

alter table public.profiles
  alter column username set not null;

create unique index if not exists profiles_username_unique_idx
  on public.profiles (lower(username));

-- Announcements
create table if not exists public.announcements (
  id uuid primary key default gen_random_uuid(),
  title text not null check (char_length(trim(title)) > 0),
  description text not null check (char_length(trim(description)) > 0),
  school public.school_code not null,
  category public.announcement_category not null,
  expires_at date not null,
  start_time time,
  end_time time,
  max_registrations integer check (max_registrations is null or max_registrations > 0),
  created_at timestamptz not null default timezone('utc', now()),
  author_id uuid not null references public.profiles (id) on delete restrict
);

alter table public.announcements
  add column if not exists start_time time;

alter table public.announcements
  add column if not exists end_time time;

alter table public.announcements
  add column if not exists max_registrations integer;

do $$
begin
  if not exists (
    select 1
    from pg_constraint
    where conname = 'announcements_max_registrations_check'
      and conrelid = 'public.announcements'::regclass
  ) then
    alter table public.announcements
      add constraint announcements_max_registrations_check
      check (max_registrations is null or max_registrations > 0);
  end if;
end
$$;

create table if not exists public.announcement_registrations (
  id uuid primary key default gen_random_uuid(),
  announcement_id uuid not null references public.announcements (id) on delete cascade,
  student_id uuid not null references public.profiles (id) on delete cascade,
  created_at timestamptz not null default timezone('utc', now()),
  unique (announcement_id, student_id)
);

-- Keep profile timestamps updated
create or replace function public.set_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = timezone('utc', now());
  return new;
end;
$$;

do $$
begin
  if not exists (
    select 1
    from pg_trigger
    where tgname = 'trg_profiles_set_updated_at'
  ) then
    create trigger trg_profiles_set_updated_at
    before update on public.profiles
    for each row
    execute function public.set_updated_at();
  end if;
end
$$;

-- Auto-create profile shell at signup; role/school completed later by onboarding or seed script.
create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  insert into public.profiles (id, full_name, username, role, school)
  values (
    new.id,
    coalesce(new.raw_user_meta_data ->> 'full_name', split_part(new.email, '@', 1)),
    lower(coalesce(new.raw_user_meta_data ->> 'username', split_part(new.email, '@', 1))),
    coalesce((new.raw_user_meta_data ->> 'role')::public.user_role, 'Aluno'::public.user_role),
    coalesce((new.raw_user_meta_data ->> 'school')::public.school_code, 'ESE'::public.school_code)
  )
  on conflict (id) do nothing;

  return new;
exception
  when others then
    -- Avoid blocking signup in case metadata is missing/invalid.
    return new;
end;
$$;

create or replace function public.resolve_login_email(login_identifier text)
returns text
language sql
security definer
set search_path = public
stable
as $$
  select u.email
  from public.profiles p
  join auth.users u on u.id = p.id
  where lower(p.username) = lower(login_identifier)
  limit 1;
$$;

revoke all on function public.resolve_login_email(text) from public;
grant execute on function public.resolve_login_email(text) to anon, authenticated;

create or replace function public.register_announcement(p_announcement_id uuid)
returns void
language plpgsql
security definer
set search_path = public
as $$
declare
  current_profile public.profiles%rowtype;
  announcement_row public.announcements%rowtype;
  registrations_count integer;
  already_registered boolean;
begin
  if auth.uid() is null then
    raise exception 'Utilizador não autenticado.';
  end if;

  select *
  into current_profile
  from public.profiles
  where id = auth.uid();

  if not found then
    raise exception 'Perfil do utilizador não encontrado.';
  end if;

  if current_profile.role <> 'Aluno'::public.user_role then
    raise exception 'Apenas alunos podem inscrever-se.';
  end if;

  select *
  into announcement_row
  from public.announcements
  where id = p_announcement_id
  for update;

  if not found then
    raise exception 'Aviso não encontrado.';
  end if;

  if announcement_row.school <> current_profile.school then
    raise exception 'Só pode inscrever-se em avisos da sua escola.';
  end if;

  if announcement_row.expires_at < current_date then
    raise exception 'Este aviso já expirou.';
  end if;

  select exists (
    select 1
    from public.announcement_registrations
    where announcement_id = p_announcement_id
      and student_id = auth.uid()
  )
  into already_registered;

  if already_registered then
    return;
  end if;

  if announcement_row.max_registrations is not null then
    select count(*)
    into registrations_count
    from public.announcement_registrations
    where announcement_id = p_announcement_id;

    if registrations_count >= announcement_row.max_registrations then
      raise exception 'Limite máximo de inscrições atingido.';
    end if;
  end if;

  insert into public.announcement_registrations (announcement_id, student_id)
  values (p_announcement_id, auth.uid());
end;
$$;

create or replace function public.unregister_announcement(p_announcement_id uuid)
returns void
language plpgsql
security definer
set search_path = public
as $$
begin
  if auth.uid() is null then
    raise exception 'Utilizador não autenticado.';
  end if;

  delete from public.announcement_registrations
  where announcement_id = p_announcement_id
    and student_id = auth.uid();
end;
$$;

revoke all on function public.register_announcement(uuid) from public;
grant execute on function public.register_announcement(uuid) to authenticated;

revoke all on function public.unregister_announcement(uuid) from public;
grant execute on function public.unregister_announcement(uuid) to authenticated;

do $$
begin
  if not exists (
    select 1
    from pg_trigger
    where tgname = 'on_auth_user_created'
  ) then
    create trigger on_auth_user_created
    after insert on auth.users
    for each row
    execute function public.handle_new_user();
  end if;
end
$$;

-- Query performance for feed and filters
create index if not exists idx_announcements_school_created_at
  on public.announcements (school, created_at desc);

create index if not exists idx_announcements_category_created_at
  on public.announcements (category, created_at desc);

create index if not exists idx_announcements_expires_at
  on public.announcements (expires_at);

create index if not exists idx_announcements_author_id
  on public.announcements (author_id);

create index if not exists idx_announcement_registrations_announcement_id
  on public.announcement_registrations (announcement_id);

create index if not exists idx_announcement_registrations_student_id
  on public.announcement_registrations (student_id);

-- Needed to stream changes in Supabase Realtime.
do $$
begin
  if not exists (
    select 1
    from pg_publication_tables
    where pubname = 'supabase_realtime'
      and schemaname = 'public'
      and tablename = 'announcements'
  ) then
    alter publication supabase_realtime add table public.announcements;
  end if;

  if not exists (
    select 1
    from pg_publication_tables
    where pubname = 'supabase_realtime'
      and schemaname = 'public'
      and tablename = 'announcement_registrations'
  ) then
    alter publication supabase_realtime add table public.announcement_registrations;
  end if;
end
$$;
