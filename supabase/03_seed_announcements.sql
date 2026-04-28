-- UNIIP - Sample announcements seed
-- Run after 01_schema.sql and 02_rls.sql.
-- This script assumes at least one Professor exists per school in public.profiles.

insert into public.announcements (title, description, school, category, expires_at, start_time, end_time, author_id)
select
  'Sessão de Boas-Vindas para Novos Alunos',
  'A coordenação da ESE convida todos os novos estudantes para uma sessão de integração com informações úteis sobre horários, serviços e apoio académico.',
  'ESE'::public.school_code,
  'Evento'::public.announcement_category,
  date '2026-05-03',
  time '09:30',
  time '11:00',
  p.id
from public.profiles p
where p.role = 'Professor'::public.user_role and p.school = 'ESE'::public.school_code
limit 1;

insert into public.announcements (title, description, school, category, expires_at, author_id)
select
  'Inscrições para Programa de Voluntariado Local',
  'Estão abertas as candidaturas para voluntariado em apoio comunitário ao fim de semana. Uma oportunidade para acumular experiência e impacto social.',
  'ESS'::public.school_code,
  'Voluntariado'::public.announcement_category,
  date '2026-05-08',
  p.id
from public.profiles p
where p.role = 'Professor'::public.user_role and p.school = 'ESS'::public.school_code
limit 1;

insert into public.announcements (title, description, school, category, expires_at, author_id)
select
  'Alteração de Sala na Unidade Curricular de Redes',
  'A aula de sexta-feira foi transferida para o laboratório 2.3 devido a manutenção na sala habitual. Confirme o horário atualizado no portal académico.',
  'EST'::public.school_code,
  'Aviso Académico'::public.announcement_category,
  date '2026-04-30',
  p.id
from public.profiles p
where p.role = 'Professor'::public.user_role and p.school = 'EST'::public.school_code
limit 1;

insert into public.announcements (title, description, school, category, expires_at, start_time, end_time, author_id)
select
  'Feira de Projetos e Startups da ESCE',
  'Evento aberto à comunidade com apresentação de projetos finais, networking e sessões curtas com empresas parceiras.',
  'ESCE'::public.school_code,
  'Evento'::public.announcement_category,
  date '2026-05-14',
  time '14:00',
  time '17:30',
  p.id
from public.profiles p
where p.role = 'Professor'::public.user_role and p.school = 'ESCE'::public.school_code
limit 1;
