# Migração Supabase - UNIIP

Este diretório contém o setup base para migrar a app para Supabase com autenticação real, perfis por role (Professor/Aluno) e RLS por escola.

## Pré-requisitos
- Projeto criado no Supabase.
- Acesso ao SQL Editor do Supabase.
- Node.js instalado localmente.

## 1) Aplicar SQL pela ordem correta
No SQL Editor do Supabase, executar nesta ordem:

1. `01_schema.sql`
2. `02_rls.sql`
3. `03_seed_announcements.sql` (opcional, apenas dados de exemplo)
4. `04_username_login.sql` se a base já tinha o schema antigo e queres acrescentar login por username

Se aplicares fora de ordem, podes ter erros de tipos/tabelas/policies inexistentes.

## 2) Criar utilizadores iniciais (Professor/Aluno)
Como o frontend atual é estático, a criação de utilizadores é feita por script com Admin API.

Instalar dependência:

```bash
npm install @supabase/supabase-js
```

Executar seed de utilizadores:

```bash
SUPABASE_URL="https://YOUR_PROJECT_REF.supabase.co" \
SUPABASE_SERVICE_ROLE_KEY="YOUR_SERVICE_ROLE_KEY" \
node supabase/seed-users.mjs
```

O script cria/atualiza:
- `professor@uniip.pt` (Professor)
- `aluno@uniip.pt` (Aluno)
- usernames:
	- `professor`
	- `armindo`

Nota de segurança:
- A `SUPABASE_SERVICE_ROLE_KEY` dá privilégios totais.
- Usa apenas localmente/ambiente seguro.
- Nunca expor esta chave no browser.

## 3) Validar rapidamente RLS
Valida estes cenários após login com cada conta:

1. Aluno não consegue publicar aviso (`insert` bloqueado).
2. Professor consegue publicar aviso apenas na própria escola.
3. Utilizador autenticado só lê avisos da sua escola.

Sugestão prática:
- Abrir duas sessões (normal + incógnito), uma por role, e comparar comportamento.

## 4) Estrutura funcional incluída
- `01_schema.sql`: enums, tabelas, triggers e índices.
- `02_rls.sql`: políticas de acesso por role/escola/autor.
- `03_seed_announcements.sql`: avisos de exemplo.
- `seed-users.mjs`: seed idempotente de utilizadores no Auth.

## 5) Próximo passo no frontend
Integrar Supabase no `index.html` e substituir:

- login mock por Supabase Auth (email/password)
- sessão local custom por `onAuthStateChange`
- `mockAnnouncements` por `select/insert` em `public.announcements`
- login por email ou username usando a função `resolve_login_email`

## 6) Login por username
Se escreveres um username no formulário, a app faz:

1. `rpc('resolve_login_email', { login_identifier })`
2. Se encontrar email associado, faz `signInWithPassword` com esse email
3. Se não encontrar, mostra erro de credenciais inválidas

Isto permite usar:
- `professor` + password
- `armindo` + password
- ou os emails completos, se preferires

## Troubleshooting
- Erro de policy ao inserir como Professor:
	confirmar se o profile desse utilizador tem role `Professor` e escola correta.
- Login funciona, mas sem dados no feed:
	confirmar se existem anúncios para a escola do utilizador.
- Script seed falha por variáveis em falta:
	confirmar `SUPABASE_URL` e `SUPABASE_SERVICE_ROLE_KEY` no comando.
