-- UNIIP - RLS policies
-- Run after 01_schema.sql

alter table public.profiles enable row level security;
alter table public.announcements enable row level security;
alter table public.announcement_registrations enable row level security;

drop policy if exists "profiles_select_own" on public.profiles;
drop policy if exists "profiles_update_own" on public.profiles;
drop policy if exists "announcements_select_same_school" on public.announcements;
drop policy if exists "announcements_insert_professor_same_school" on public.announcements;
drop policy if exists "announcements_update_author_professor" on public.announcements;
drop policy if exists "announcements_delete_author_professor" on public.announcements;
drop policy if exists "announcement_registrations_select_same_school" on public.announcement_registrations;
drop policy if exists "announcement_registrations_insert_student_own" on public.announcement_registrations;
drop policy if exists "announcement_registrations_delete_student_own" on public.announcement_registrations;

-- Profiles: users can read/update only their own profile.
create policy "profiles_select_own"
  on public.profiles
  for select
  to authenticated
  using (id = auth.uid());

create policy "profiles_update_own"
  on public.profiles
  for update
  to authenticated
  using (id = auth.uid())
  with check (id = auth.uid());

-- Announcements: visibility is scoped by user school.
create policy "announcements_select_same_school"
  on public.announcements
  for select
  to authenticated
  using (
    exists (
      select 1
      from public.profiles p
      where p.id = auth.uid()
        and p.school = announcements.school
    )
  );

-- Only professors can publish and only for their own school.
create policy "announcements_insert_professor_same_school"
  on public.announcements
  for insert
  to authenticated
  with check (
    author_id = auth.uid()
    and exists (
      select 1
      from public.profiles p
      where p.id = auth.uid()
        and p.role = 'Professor'::public.user_role
        and p.school = announcements.school
    )
  );

-- Only the professor author can update/delete own announcements.
create policy "announcements_update_author_professor"
  on public.announcements
  for update
  to authenticated
  using (
    author_id = auth.uid()
    and exists (
      select 1
      from public.profiles p
      where p.id = auth.uid()
        and p.role = 'Professor'::public.user_role
    )
  )
  with check (
    author_id = auth.uid()
    and exists (
      select 1
      from public.profiles p
      where p.id = auth.uid()
        and p.role = 'Professor'::public.user_role
        and p.school = announcements.school
    )
  );

create policy "announcements_delete_author_professor"
  on public.announcements
  for delete
  to authenticated
  using (
    author_id = auth.uid()
    and exists (
      select 1
      from public.profiles p
      where p.id = auth.uid()
        and p.role = 'Professor'::public.user_role
    )
  );

create policy "announcement_registrations_select_same_school"
  on public.announcement_registrations
  for select
  to authenticated
  using (
    exists (
      select 1
      from public.announcements a
      join public.profiles p on p.id = auth.uid()
      where a.id = announcement_registrations.announcement_id
        and p.school = a.school
    )
  );

create policy "announcement_registrations_insert_student_own"
  on public.announcement_registrations
  for insert
  to authenticated
  with check (
    student_id = auth.uid()
    and exists (
      select 1
      from public.profiles p
      join public.announcements a on a.id = announcement_registrations.announcement_id
      where p.id = auth.uid()
        and p.role = 'Aluno'::public.user_role
        and p.school = a.school
    )
  );

create policy "announcement_registrations_delete_student_own"
  on public.announcement_registrations
  for delete
  to authenticated
  using (
    student_id = auth.uid()
    and exists (
      select 1
      from public.profiles p
      where p.id = auth.uid()
        and p.role = 'Aluno'::public.user_role
    )
  );
