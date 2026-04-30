# 📋 Passo-a-Passo: Aplicar Sistema de Verificação de Horários

Este guia descreve como aplicar o novo sistema de verificação de conflitos de horários no seu projeto.

## ✅ Pré-requisitos

- Projeto Supabase criado e configurado
- Acesso ao SQL Editor do Supabase
- Scripts SQL 01-06 já aplicados
- App rodando com sucesso

## 🚀 Passos de Implementação

### Passo 1: Fazer Backup (Recomendado)
```bash
# Se tiver dados importantes, fazer backup primeiro
# Via Supabase Dashboard → Settings → Backups
```

### Passo 2: Executar Script 07 (Tabelas e Funções)

1. Ir ao Supabase Dashboard
2. Clicar em "SQL Editor"
3. Clicar em "+ New Query"
4. Copiar todo o conteúdo de `07_class_schedules.sql`
5. Colar na janela de Query
6. Clicar "Run"
7. **Esperado**: Sem erros, verde ✅

**O que este script faz:**
- Cria tabela `student_class_schedules`
- Cria funções para verificação de conflitos
- Modifica função `register_announcement()` para incluir verificação
- Define políticas RLS
- Adiciona índices

### Passo 3: Executar Script 08 (Dados de Exemplo)

1. Criar nova Query (+)
2. Copiar todo o conteúdo de `08_seed_class_schedules.sql`
3. Colar e executar
4. **Esperado**: 9 linhas inseridas (confirmação de sucesso)

**O que este script faz:**
- Insere 9 aulas para o aluno "armindo"
- Segunda a sexta com horários variados
- Nomes realistas das disciplinas

### Passo 4: Verificar Dados

Executar esta Query para confirmar:

```sql
SELECT 
  p.full_name,
  p.username,
  cs.day_of_week,
  cs.start_time,
  cs.end_time,
  cs.class_name
FROM public.student_class_schedules cs
JOIN public.profiles p ON cs.student_id = p.id
WHERE p.username = 'armindo'
ORDER BY cs.day_of_week, cs.start_time;
```

**Esperado resultado:**
```
full_name | username | day_of_week | start_time | end_time  | class_name
----------|----------|-------------|------------|-----------|---------------------------
Armindo   | armindo  |           1 | 09:00:00   | 12:00:00  | LGSI_DAW (TP1) - D2.18
Armindo   | armindo  |           1 | 12:00:00   | 13:30:00  | LGSI_EID (TP1) - C1.07
Armindo   | armindo  |           2 | 09:00:00   | 12:00:00  | SIDG (TP1) - D2.18
... (mais 6 linhas)
```

### Passo 5: Testar Funções SQL

#### Teste A: Verificar Função `times_overlap`

```sql
-- Deve retornar TRUE (horários se sobrepõem)
SELECT public.times_overlap(
  '09:00'::time, 
  '12:00'::time,
  '10:00'::time, 
  '11:00'::time
);

-- Deve retornar FALSE (horários não se sobrepõem)
SELECT public.times_overlap(
  '09:00'::time, 
  '12:00'::time,
  '14:00'::time, 
  '15:00'::time
);
```

#### Teste B: Verificar Função `check_schedule_conflict`

```sql
-- Deve retornar o conflito detectado
SELECT * FROM public.check_schedule_conflict(
  (SELECT id FROM public.profiles WHERE username = 'armindo'),
  1,  -- Monday
  '09:30'::time,
  '11:00'::time
);

-- Esperado: has_conflict = true, conflicting_class = "LGSI_DAW (TP1) - D2.18"
```

### Passo 6: Verificar App Frontend

1. Ir ao app na browser
2. Fazer login como "armindo" (username: armindo, password: aluno123)
3. Ir para o Feed de eventos
4. Verificar se não há erros na console (F12)

### Passo 7: Testar Inscrição SEM Conflito

1. No Supabase SQL Editor, criar um evento de teste:

```sql
INSERT INTO public.announcements 
(title, description, school, category, expires_at, start_time, end_time, author_id)
VALUES (
  'Evento Teste - Sem Conflito',
  'Este evento tem horário que NÃO conflita com aulas de Armindo',
  'EST'::public.school_code,
  'Evento'::public.announcement_category,
  current_date + 30,
  '15:00'::time,
  '16:00'::time,
  (SELECT id FROM public.profiles WHERE username = 'professor' LIMIT 1)
);
```

2. Voltar ao app
3. Atualizar a página (F5) ou ir para outra categoria e voltar
4. Procurar o evento "Evento Teste - Sem Conflito"
5. Clicar "Inscrever agora"
6. **Esperado**: 
   - Nenhum modal de conflito
   - Mensagem verde "Inscrição realizada com sucesso"
   - Botão muda para "Cancelar inscrição"

### Passo 8: Testar Inscrição COM Conflito

1. Criar outro evento com conflito:

```sql
INSERT INTO public.announcements 
(title, description, school, category, expires_at, start_time, end_time, author_id)
VALUES (
  'Evento Teste - COM CONFLITO',
  'Este evento tem horário que CONFLITA com aulas de Armindo (segunda 09:00-12:00)',
  'EST'::public.school_code,
  'Evento'::public.announcement_category,
  current_date + 30,
  '10:00'::time,
  '11:00'::time,
  (SELECT id FROM public.profiles WHERE username = 'professor' LIMIT 1)
);
```

2. Voltar ao app e atualizar
3. Procurar "Evento Teste - COM CONFLITO"
4. Clicar "Inscrever agora"
5. **Esperado**:
   - Modal aparece com aviso ⚠️
   - Mostra "LGSI_DAW (TP1) - D2.18" como conflito
   - Mostra horário do evento: 10:00 - 11:00
   - Dois botões: "Cancelar" e "Inscrever Mesmo Assim"

### Passo 9: Confirmar Inscrição com Conflito

1. No modal, clicar "Inscrever Mesmo Assim"
2. **Esperado**:
   - Modal fecha
   - Mensagem verde aparece: "Inscrição realizada com sucesso (com aviso de conflito)"
   - Botão muda para "Cancelar inscrição"

### Passo 10: Cancelar Modal

1. Criar outro evento de teste (se necessário)
2. Clicar "Inscrever agora"
3. Quando modal aparecer, clicar "Cancelar"
4. **Esperado**:
   - Modal fecha
   - Nenhuma inscrição é feita
   - Botão permanece "Inscrever agora"

## 🎯 Checklist de Sucesso

- [ ] Scripts 07 e 08 executados sem erros
- [ ] Query de verificação mostra 9 aulas para "armindo"
- [ ] Funções SQL testadas e funcionando
- [ ] App frontend não tem erros na console
- [ ] Inscrição SEM conflito funciona normalmente
- [ ] Inscrição COM conflito mostra modal
- [ ] Modal mostra informações corretas
- [ ] Botão "Inscrever Mesmo Assim" funciona
- [ ] Botão "Cancelar" funciona

## 🔍 Troubleshooting

### Erro: "Function check_announcement_conflict not found"
**Solução**: 
1. Confirmar que script 07 foi executado completamente
2. Verificar se há erros na execução
3. Rodar Script 07 novamente

### Erro: "Error checking conflict"
**Solução**:
1. Abrir console do browser (F12)
2. Ver mensagem de erro específica
3. Verificar Supabase Logs (Dashboard → Logs)
4. Confirmar permissions (grants) no script 07

### Modal de conflito não aparece
**Solução**:
1. Confirmar que evento tem `start_time` e `end_time`
2. Ver console para erros da RPC
3. Verificar que aluno "armindo" tem horários inseridos

### Inscrição com conflito é bloqueada
**Solução**:
1. Isto é comportamento ESPERADO inicialmente
2. Necessário clicar "Inscrever Mesmo Assim" no modal
3. Se não houver modal, ver console para erros

## 📞 Próximos Passos

Após sucesso:
1. Adicionar horários de outros alunos (via SQL ou interface futura)
2. Testar com múltiplos alunos
3. Refinaar UX/UI conforme feedback
4. Melhorar para verificar apenas dia específico do evento
5. Considerar adicionar gerenciamento de aulas para alunos

## 📚 Referências

- `CLASS_SCHEDULE_SYSTEM.md` - Documentação técnica completa
- `07_class_schedules.sql` - Código SQL comentado
- `08_seed_class_schedules.sql` - Dados de exemplo
- `IMPLEMENTATION_SUMMARY.md` - Resumo da implementação

---

**Boa sorte com a implementação!** 🚀
