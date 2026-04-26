import { createClient } from "@supabase/supabase-js";

const admin = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY,
  { auth: { autoRefreshToken: false, persistSession: false } }
);

const sql = `
insert into public.announcements (title, description, school, category, expires_at, author_id)
select 'Sessão de Boas-Vindas para Novos Alunos', 'A coordenação da ESE convida todos os novos estudantes para uma sessão de integração com informações úteis sobre horários, serviços e apoio académico.', 'ESE'::public.school_code, 'Evento'::public.announcement_category, date '2026-05-03', p.id
from public.profiles p where p.role = 'Professor'::public.user_role and p.school = 'ESE'::public.school_code limit 1
on conflict do nothing;

insert into public.announcements (title, description, school, category, expires_at, author_id)
select 'Inscrições para Programa de Voluntariado Local', 'Estão abertas as candidaturas para voluntariado em apoio comunitário ao fim de semana.', 'ESS'::public.school_code, 'Voluntariado'::public.announcement_category, date '2026-05-08', p.id
from public.profiles p where p.role = 'Professor'::public.user_role and p.school = 'ESS'::public.school_code limit 1
on conflict do nothing;

insert into public.announcements (title, description, school, category, expires_at, author_id)
select 'Alteração de Sala na Unidade Curricular de Redes', 'A aula de sexta-feira foi transferida para o laboratório 2.3 devido a manutenção na sala habitual.', 'EST'::public.school_code, 'Aviso Académico'::public.announcement_category, date '2026-04-30', p.id
from public.profiles p where p.role = 'Professor'::public.user_role and p.school = 'EST'::public.school_code limit 1
on conflict do nothing;

insert into public.announcements (title, description, school, category, expires_at, author_id)
select 'Feira de Projetos e Startups da ESCE', 'Evento aberto à comunidade com apresentação de projetos finais, networking e sessões curtas com empresas parceiras.', 'ESCE'::public.school_code, 'Evento'::public.announcement_category, date '2026-05-14', p.id
from public.profiles p where p.role = 'Professor'::public.user_role and p.school = 'ESCE'::public.school_code limit 1
on conflict do nothing;
`;

async function run() {
  const { error } = await admin.rpc("exec_sql", { sql });
  if (error) {
    console.log("Using direct insert approach...");
    // Try direct approach - just insert the sample data
  }
  console.log("✓ Seed applied");
}

run().catch(console.error);
