-- UNIIP - Secretaria user management RPCs
-- Run after 01_schema.sql and 02_rls.sql

create or replace function public.secretaria_list_users()
returns table (
  id uuid,
  full_name text,
  username text,
  email text,
  role public.user_role,
  school public.school_code,
  created_at timestamptz
)
language plpgsql
security definer
set search_path = public, auth
as $$
declare
  requester_role public.user_role;
begin
  select p.role
  into requester_role
  from public.profiles p
  where p.id = auth.uid();

  if requester_role is distinct from 'Secretaria'::public.user_role then
    raise exception 'Acesso negado.' using errcode = '42501';
  end if;

  return query
  select p.id, p.full_name, p.username, u.email, p.role, p.school, p.created_at
  from public.profiles p
  join auth.users u on u.id = p.id
  order by p.created_at desc;
end;
$$;

create or replace function public.secretaria_create_user(
  p_full_name text,
  p_email text,
  p_username text,
  p_password text,
  p_role public.user_role,
  p_school public.school_code
)
returns uuid
language plpgsql
security definer
set search_path = public, auth
as $$
declare
  requester_role public.user_role;
  new_user_id uuid;
  normalized_email text;
  normalized_username text;
begin
  select p.role
  into requester_role
  from public.profiles p
  where p.id = auth.uid();

  if requester_role is distinct from 'Secretaria'::public.user_role then
    raise exception 'Acesso negado.' using errcode = '42501';
  end if;

  normalized_email := lower(trim(p_email));
  normalized_username := lower(trim(p_username));

  if normalized_email = '' or normalized_username = '' or trim(p_full_name) = '' then
    raise exception 'Dados inválidos para criar utilizador.';
  end if;

  if char_length(coalesce(p_password, '')) < 6 then
    raise exception 'A password deve ter pelo menos 6 caracteres.';
  end if;

  if exists (
    select 1
    from auth.users u
    where lower(u.email) = normalized_email
  ) then
    raise exception 'Já existe um utilizador com esse email.';
  end if;

  if exists (
    select 1
    from public.profiles p
    where lower(p.username) = normalized_username
  ) then
    raise exception 'Já existe um utilizador com esse username.';
  end if;

  new_user_id := gen_random_uuid();

  insert into auth.users (
    id,
    aud,
    role,
    email,
    encrypted_password,
    email_confirmed_at,
    raw_app_meta_data,
    raw_user_meta_data,
    created_at,
    updated_at,
    is_sso_user,
    is_anonymous
  )
  values (
    new_user_id,
    'authenticated',
    'authenticated',
    normalized_email,
    crypt(p_password, gen_salt('bf')),
    timezone('utc', now()),
    jsonb_build_object('provider', 'email', 'providers', array['email']),
    jsonb_build_object(
      'full_name', trim(p_full_name),
      'username', normalized_username,
      'role', p_role::text,
      'school', p_school::text
    ),
    timezone('utc', now()),
    timezone('utc', now()),
    false,
    false
  );

  insert into auth.identities (
    id,
    user_id,
    identity_data,
    provider,
    provider_id,
    last_sign_in_at,
    created_at,
    updated_at
  )
  values (
    gen_random_uuid(),
    new_user_id,
    jsonb_build_object('sub', new_user_id::text, 'email', normalized_email),
    'email',
    new_user_id::text,
    timezone('utc', now()),
    timezone('utc', now()),
    timezone('utc', now())
  );

  insert into public.profiles (id, full_name, username, role, school)
  values (
    new_user_id,
    trim(p_full_name),
    normalized_username,
    p_role,
    p_school
  )
  on conflict (id) do update
  set
    full_name = excluded.full_name,
    username = excluded.username,
    role = excluded.role,
    school = excluded.school,
    updated_at = timezone('utc', now());

  return new_user_id;
end;
$$;

create or replace function public.secretaria_delete_user(target_user_id uuid)
returns void
language plpgsql
security definer
set search_path = public, auth
as $$
declare
  requester_role public.user_role;
begin
  select p.role
  into requester_role
  from public.profiles p
  where p.id = auth.uid();

  if requester_role is distinct from 'Secretaria'::public.user_role then
    raise exception 'Acesso negado.' using errcode = '42501';
  end if;

  if target_user_id = auth.uid() then
    raise exception 'Não podes remover a tua própria conta.';
  end if;

  delete from auth.users u
  where u.id = target_user_id;

  if not found then
    raise exception 'Utilizador não encontrado.';
  end if;
end;
$$;

revoke all on function public.secretaria_list_users() from public;
revoke all on function public.secretaria_create_user(text, text, text, text, public.user_role, public.school_code) from public;
revoke all on function public.secretaria_delete_user(uuid) from public;

grant execute on function public.secretaria_list_users() to authenticated;
grant execute on function public.secretaria_create_user(text, text, text, text, public.user_role, public.school_code) to authenticated;
grant execute on function public.secretaria_delete_user(uuid) to authenticated;
