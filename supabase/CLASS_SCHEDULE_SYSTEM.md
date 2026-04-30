# Sistema de Verificação de Conflitos de Horário

Este documento descreve o novo sistema que verifica automaticamente conflitos entre horários de aula e inscrições em eventos/atividades.

## Visão Geral

Quando um aluno tenta se inscrever em um evento ou atividade que possui um horário específico (com `start_time` e `end_time`), o sistema verifica automaticamente se ele tem aulas marcadas naquele horário. Se houver conflito, um modal de aviso é exibido antes da inscrição ser confirmada.

## Como Funciona

### 1. Arquitetura do Banco de Dados

#### Nova Tabela: `student_class_schedules`
```sql
- id: UUID (chave primária)
- student_id: UUID (referência para profiles)
- day_of_week: Integer (0-6, onde 0 = domingo, 1 = segunda, etc.)
- start_time: Time (hora de início da aula)
- end_time: Time (hora de término da aula)
- class_name: Text (nome da aula, ex: "LGSI_DAW (TP1) - D2.18")
- created_at: Timestamp
- updated_at: Timestamp
```

### 2. Funções SQL (Procedures)

#### `times_overlap(time1_start, time1_end, time2_start, time2_end)`
Função utilitária que verifica se dois intervalos de tempo se sobrepõem.

#### `check_schedule_conflict(p_student_id, p_day_of_week, p_start_time, p_end_time)`
Verifica se um aluno tem aulas em um dia específico durante um intervalo de tempo.

#### `check_announcement_conflict(p_announcement_id)`
RPC que verifica conflitos de um anúncio/evento com o horário do aluno autenticado. Retorna:
- `has_conflict: boolean` - Se existe conflito
- `conflicting_classes: text` - Nomes das aulas em conflito

#### `register_announcement(p_announcement_id)` [Modificada]
Agora inclui verificação de conflito antes de realizar a inscrição. Se houver conflito, lança uma exceção.

### 3. Interface do Usuário

#### Fluxo de Inscrição com Verificação

1. **Aluno clica em "Inscrever agora"**
2. Sistema chama `check_announcement_conflict()`
3. **Se NÃO houver conflito**: Inscrição é realizada normalmente
4. **Se houver conflito**: 
   - Modal de aviso é exibido
   - Mostra as aulas em conflito
   - Oferece dois botões:
     - "Cancelar" - Descarta a inscrição
     - "Inscrever Mesmo Assim" - Confirma a inscrição mesmo com conflito

## Instalação e Configuração

### Passo 1: Executar os Scripts SQL no Supabase

Execute os scripts SQL na seguinte ordem:

1. `01_schema.sql` - Schema base (já existe)
2. `02_rls.sql` - Políticas de segurança (já existe)
3. ... (outros scripts)
4. `07_class_schedules.sql` - **NOVO** - Tabelas e funções de verificação de horário
5. `08_seed_class_schedules.sql` - **NOVO** - Carrega horários de exemplo

```bash
# No Supabase SQL Editor:
-- 1. Execute 07_class_schedules.sql
-- 2. Execute 08_seed_class_schedules.sql
```

### Passo 2: Verificar os Dados

Após executar os scripts, verifique se os dados foram carregados:

```sql
-- Verificar horários do aluno "armindo"
SELECT * FROM public.student_class_schedules 
WHERE student_id = (SELECT id FROM public.profiles WHERE username = 'armindo')
ORDER BY day_of_week, start_time;
```

## Dados de Exemplo

O arquivo `08_seed_class_schedules.sql` carrega os horários do aluno "armindo" conforme a imagem do calendário:

### Segunda-feira (day_of_week = 1)
- 09:00 - 12:00: LGSI_DAW (TP1) - D2.18
- 12:00 - 13:30: LGSI_EID (TP1) - C1.07

### Terça-feira (day_of_week = 2)
- 09:00 - 12:00: SIDG (TP1) - D2.18
- 12:00 - 13:30: LGSI_EID (TP1) - C1.15

### Quarta-feira (day_of_week = 3)
- 08:30 - 11:30: LGSI_IBD (TP1) - D2.10

### Quinta-feira (day_of_week = 4)
- 08:30 - 11:30: LGSI_SGBD (TP1) - D2.18
- 14:00 - 15:30: EA (TP3) - D2.10
- 15:30 - 18:30: M (TP2) - C1.08

### Sexta-feira (day_of_week = 5)
- 09:00 - 12:00: LGSI_ASI (TP1) - C1.12

## Como Adicionar Horários para Outros Alunos

### Opção 1: Via SQL (Recomendado para Administradores)

```sql
INSERT INTO public.student_class_schedules 
(student_id, day_of_week, start_time, end_time, class_name)
VALUES (
  (SELECT id FROM public.profiles WHERE username = 'username_aluno'),
  1,  -- Monday
  '09:00'::time,
  '11:30'::time,
  'Disciplina ABC (TP1) - Sala 1.5'
);
```

### Opção 2: Criar Interface no App (Trabalho Futuro)

Adicionar um formulário no perfil do aluno onde possa:
- Adicionar suas aulas
- Editar horários existentes
- Remover aulas

## Testando o Sistema

### Teste 1: Inscrição SEM Conflito

1. Acesse o app como "armindo"
2. Procure um evento com horário (ex: 15:00 - 16:00)
3. Clique em "Inscrever agora"
4. A inscrição deve ser realizada sem aviso

### Teste 2: Inscrição COM Conflito

1. Acesse o app como "armindo"
2. Procure/crie um evento com horário 09:30 - 11:00 (segunda-feira)
   - Isso conflita com "LGSI_DAW" (09:00 - 12:00)
3. Clique em "Inscrever agora"
4. Um modal deve aparecer mostrando o conflito
5. Clique "Inscrever Mesmo Assim" para confirmar

## Segurança (RLS Policies)

As políticas de segurança garantem que:

- **Alunos** podem visualizar apenas seus próprios horários
- **Secretaria** pode visualizar e gerenciar horários de todos os alunos
- **Professores** não têm acesso aos horários

## Queries Úteis

### Verificar conflitos para um aluno em um dia específico

```sql
SELECT c.*
FROM public.student_class_schedules c
WHERE c.student_id = 'uuid-do-aluno'
  AND c.day_of_week = 1  -- Segunda
  AND public.times_overlap(c.start_time, c.end_time, '09:30'::time, '11:00'::time);
```

### Listar todos os alunos com aulas na segunda às 09:00

```sql
SELECT DISTINCT p.full_name, p.username, c.*
FROM public.student_class_schedules c
JOIN public.profiles p ON c.student_id = p.id
WHERE c.day_of_week = 1
  AND c.start_time = '09:00'::time
ORDER BY p.full_name;
```

## Performance

As queries de verificação de conflito são otimizadas com índices:
- `idx_student_schedules_student_id` - Para buscar aulas por aluno
- `idx_student_schedules_day_times` - Para verificação rápida de conflitos

## Limitações Atuais

1. **Verificação genérica de dias**: O sistema verifica conflitos para TODOS os dias da semana. Idealmente, deveria verificar apenas o dia específico do evento.
2. **Sem interface para gerenciamento**: Os horários são adicionados apenas via SQL.
3. **Sem exportação de calendário**: Não há integração com calendários externos.

## Trabalho Futuro

- [ ] Adicionar interface Web para alunos gerenciarem seus horários
- [ ] Integrar com calendário do aluno (Google Calendar, Outlook, etc.)
- [ ] Permitir que professores atualizem horários automaticamente
- [ ] Suporte para horários variáveis (classes que podem ter múltiplas opções)
- [ ] Notificações quando há conflito iminente
- [ ] Histórico de conflitos

## Suporte

Para problemas ou dúvidas:
1. Verifique os logs da RPC no Supabase
2. Consulte o README.md principal do projeto
3. Verifique se os scripts foram executados na ordem correta
