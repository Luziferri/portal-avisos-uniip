-- UNIIP - Seed student class schedules
-- Run after 07_class_schedules.sql
-- This adds the sample class schedule from the calendar image

insert into public.student_class_schedules (student_id, day_of_week, start_time, end_time, class_name)
select
  p.id,
  1, -- Monday
  time '09:00',
  time '12:00',
  'LGSI_DAW (TP1) - D2.18'
from public.profiles p
where lower(p.username) = 'armindo'
limit 1;

insert into public.student_class_schedules (student_id, day_of_week, start_time, end_time, class_name)
select
  p.id,
  1, -- Monday
  time '12:00',
  time '13:30',
  'LGSI_EID (TP1) - C1.07'
from public.profiles p
where lower(p.username) = 'armindo'
limit 1;

insert into public.student_class_schedules (student_id, day_of_week, start_time, end_time, class_name)
select
  p.id,
  2, -- Tuesday
  time '09:00',
  time '12:00',
  'SIDG (TP1) - D2.18'
from public.profiles p
where lower(p.username) = 'armindo'
limit 1;

insert into public.student_class_schedules (student_id, day_of_week, start_time, end_time, class_name)
select
  p.id,
  2, -- Tuesday
  time '12:00',
  time '13:30',
  'LGSI_EID (TP1) - C1.15'
from public.profiles p
where lower(p.username) = 'armindo'
limit 1;

insert into public.student_class_schedules (student_id, day_of_week, start_time, end_time, class_name)
select
  p.id,
  3, -- Wednesday
  time '08:30',
  time '11:30',
  'LGSI_IBD (TP1) - D2.10'
from public.profiles p
where lower(p.username) = 'armindo'
limit 1;

insert into public.student_class_schedules (student_id, day_of_week, start_time, end_time, class_name)
select
  p.id,
  4, -- Thursday
  time '08:30',
  time '11:30',
  'LGSI_SGBD (TP1) - D2.18'
from public.profiles p
where lower(p.username) = 'armindo'
limit 1;

insert into public.student_class_schedules (student_id, day_of_week, start_time, end_time, class_name)
select
  p.id,
  4, -- Thursday
  time '14:00',
  time '15:30',
  'EA (TP3) - D2.10'
from public.profiles p
where lower(p.username) = 'armindo'
limit 1;

insert into public.student_class_schedules (student_id, day_of_week, start_time, end_time, class_name)
select
  p.id,
  4, -- Thursday
  time '15:30',
  time '18:30',
  'M (TP2) - C1.08'
from public.profiles p
where lower(p.username) = 'armindo'
limit 1;

insert into public.student_class_schedules (student_id, day_of_week, start_time, end_time, class_name)
select
  p.id,
  5, -- Friday
  time '09:00',
  time '12:00',
  'LGSI_ASI (TP1) - C1.12'
from public.profiles p
where lower(p.username) = 'armindo'
limit 1;
