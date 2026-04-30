-- UNIIP - Class schedules for conflict detection
-- Run after 01_schema.sql

-- Table to store student class schedules
create table if not exists public.student_class_schedules (
  id uuid primary key default gen_random_uuid(),
  student_id uuid not null references public.profiles (id) on delete cascade,
  day_of_week integer not null check (day_of_week >= 0 and day_of_week <= 6),
  start_time time not null,
  end_time time not null,
  class_name text not null,
  created_at timestamptz not null default timezone('utc', now()),
  updated_at timestamptz not null default timezone('utc', now()),
  constraint valid_time_range check (start_time < end_time)
);

-- Index for efficient queries
create index if not exists idx_student_schedules_student_id
  on public.student_class_schedules (student_id);

create index if not exists idx_student_schedules_day_times
  on public.student_class_schedules (student_id, day_of_week, start_time, end_time);

-- Function to check if times overlap
create or replace function public.times_overlap(
  time1_start time,
  time1_end time,
  time2_start time,
  time2_end time
)
returns boolean
language sql
immutable
as $$
  select time1_start < time2_end and time2_start < time1_end;
$$;

-- Function to check for schedule conflicts
create or replace function public.check_schedule_conflict(
  p_student_id uuid,
  p_day_of_week integer,
  p_start_time time,
  p_end_time time
)
returns table (
  has_conflict boolean,
  conflicting_class text
)
language sql
stable
security definer
set search_path = public
as $$
  select
    case when count(*) > 0 then true else false end as has_conflict,
    case when count(*) > 0 then string_agg(class_name, ', ') else null end as conflicting_class
  from public.student_class_schedules
  where student_id = p_student_id
    and day_of_week = p_day_of_week
    and public.times_overlap(start_time, end_time, p_start_time, p_end_time);
$$;

-- Function to check announcement conflicts for a specific student
-- Uses the announcement expiration date as the event day.
create or replace function public.check_announcement_conflict(p_announcement_id uuid)
returns table (
  has_conflict boolean,
  conflicting_classes text
)
language plpgsql
stable
security definer
set search_path = public
as $$
declare
  v_start_time time;
  v_end_time time;
  v_event_date date;
  v_conflicts text;
begin
  -- Get announcement times
  select start_time, end_time, expires_at into v_start_time, v_end_time, v_event_date
  from public.announcements
  where id = p_announcement_id;

  if v_start_time is null or v_end_time is null then
    return query select false, null;
    return;
  end if;

  -- Check for conflicts only on the event day
  select string_agg(distinct class_name, ', ')
  into v_conflicts
  from public.student_class_schedules
  where student_id = auth.uid()
    and day_of_week = extract(dow from v_event_date)::integer
    and public.times_overlap(start_time, end_time, v_start_time, v_end_time);

  if v_conflicts is not null then
    return query select true, v_conflicts;
  else
    return query select false, null;
  end if;
end;
$$;

-- Modify register_announcement to check for schedule conflicts
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
  conflict_result record;
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

  -- Check for schedule conflicts if event has time information
  if announcement_row.start_time is not null and announcement_row.end_time is not null then
    select * into conflict_result
    from public.check_announcement_conflict(p_announcement_id);

    if conflict_result.has_conflict then
      raise exception 'Conflito de horário detectado com aula(s): %', conflict_result.conflicting_classes;
    end if;
  end if;

  insert into public.announcement_registrations (announcement_id, student_id)
  values (p_announcement_id, auth.uid());
end;
$$;

-- Update RLS policy to include schedules table
alter table public.student_class_schedules enable row level security;

-- RLS Policies for student schedules
do $$
begin
  if not exists (
    select 1
    from pg_policies
    where schemaname = 'public'
      and tablename = 'student_class_schedules'
      and policyname = 'Students can view own schedules'
  ) then
    create policy "Students can view own schedules"
      on public.student_class_schedules
      for select
      using (student_id = auth.uid() or exists (
        select 1 from public.profiles
        where id = auth.uid() and role = 'Secretaria'::public.user_role
      ));
  end if;

  if not exists (
    select 1
    from pg_policies
    where schemaname = 'public'
      and tablename = 'student_class_schedules'
      and policyname = 'Secretaria can manage all schedules'
  ) then
    create policy "Secretaria can manage all schedules"
      on public.student_class_schedules
      for all
      using (exists (
        select 1 from public.profiles
        where id = auth.uid() and role = 'Secretaria'::public.user_role
      ));
  end if;
end
$$;

-- Add to realtime publication
do $$
begin
  if not exists (
    select 1
    from pg_publication_tables
    where pubname = 'supabase_realtime'
      and schemaname = 'public'
      and tablename = 'student_class_schedules'
  ) then
    alter publication supabase_realtime add table public.student_class_schedules;
  end if;
end
$$;

-- Grant permissions for new functions
revoke all on function public.check_announcement_conflict(uuid) from public;
grant execute on function public.check_announcement_conflict(uuid) to authenticated;

revoke all on function public.register_announcement(uuid) from public;
grant execute on function public.register_announcement(uuid) to authenticated;

revoke all on function public.unregister_announcement(uuid) from public;
grant execute on function public.unregister_announcement(uuid) to authenticated;
