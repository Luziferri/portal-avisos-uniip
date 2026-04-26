-- UNIIP - Backward-compatible username migration
-- Run this if the database already exists with the old schema.

alter table public.profiles
  add column if not exists username text;

update public.profiles p
set username = lower(split_part(u.email, '@', 1))
from auth.users u
where p.id = u.id
  and (p.username is null or btrim(p.username) = '');

alter table public.profiles
  alter column username set not null;

create unique index if not exists profiles_username_unique_idx
  on public.profiles (lower(username));

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