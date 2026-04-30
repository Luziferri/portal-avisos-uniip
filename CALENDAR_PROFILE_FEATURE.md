# 📅 Nova Funcionalidade: Calendário e Anúncios no Perfil do Aluno

## Descrição

Foi adicionada uma nova seção visual no perfil do aluno (página `/conta`) que mostra:

1. **Calendário Semanal com Horários de Aulas**
   - Layout de 5 colunas (segunda a sexta)
   - Cada dia mostra todas as aulas agendadas
   - Horários de início e fim de cada aula
   - Visual claro com cores azuis

2. **Avisos e Atividades da Semana**
   - Lista dos 5 últimos avisos/eventos da semana
   - Nome da escola, categoria, horário (se houver)
   - Data de expiração
   - Link para mais informações

---

## O Que Foi Modificado

### Arquivo: `scripts/app.jsx`

#### 1. Novos Estados
```javascript
const [weeklySchedule, setWeeklySchedule] = useState([]);
const [weeklyAnnouncements, setWeeklyAnnouncements] = useState([]);
```

Armazenam os horários e anúncios da semana.

#### 2. Nova Função
```javascript
const loadWeeklyScheduleAndAnnouncements = async () { ... }
```

Carrega:
- Tabela `student_class_schedules` para o aluno autenticado
- Anúncios que expiram nesta semana

#### 3. Novo useEffect
```javascript
useEffect(() => {
  if (currentView === "account" && isAluno) {
    loadWeeklyScheduleAndAnnouncements();
  }
}, [currentView, isAluno]);
```

Carrega dados ao entrar na página de conta.

#### 4. Nova Seção HTML/React
Adicionada após a seção de foto de perfil e antes dos cartões de informação:
- Calendário visual com 5 colunas
- Lista de anúncios
- Mensagens "sem dados" quando apropriado

---

## Visual da Funcionalidade

### Calendário Semanal

```
┌─────────────────────────────────────────────────────────────────────┐
│ CALENDÁRIO                                                          │
│ Horários e Atividades da Semana                                   │
├─────────────────────────────────────────────────────────────────────┤
│                                                                     │
│ ┌──────────┐ ┌──────────┐ ┌──────────┐ ┌──────────┐ ┌──────────┐ │
│ │    1     │ │    2     │ │    3     │ │    4     │ │    5     │ │
│ │ Segunda  │ │  Terça   │ │  Quarta  │ │ Quinta   │ │  Sexta   │ │
│ ├──────────┤ ├──────────┤ ├──────────┤ ├──────────┤ ├──────────┤ │
│ │LGSI_DAW  │ │SIDG      │ │LGSI_IBD  │ │LGSI_SGBD │ │LGSI_ASI  │ │
│ │09:00-12: │ │09:00-12: │ │08:30-11: │ │08:30-11: │ │09:00-12: │ │
│ │          │ │          │ │          │ │          │ │          │ │
│ │LGSI_EID  │ │LGSI_EID  │ │          │ │EA        │ │          │ │
│ │12:00-13: │ │12:00-13: │ │          │ │14:00-15: │ │          │ │
│ │          │ │          │ │          │ │          │ │          │ │
│ │          │ │          │ │          │ │M         │ │          │ │
│ │          │ │          │ │          │ │15:30-18: │ │          │ │
│ └──────────┘ └──────────┘ └──────────┘ └──────────┘ └──────────┘ │
└─────────────────────────────────────────────────────────────────────┘
```

### Avisos da Semana

```
┌─────────────────────────────────────────────────────────────────┐
│ AVISOS                                                          │
│ Avisos da Semana                                                │
├─────────────────────────────────────────────────────────────────┤
│                                                                 │
│ [ESE] Sessão de Boas-Vindas para Novos Alunos                 │
│       Evento • 09:30 - 11:00                    05 mai 2026    │
│                                                                 │
│ [EST] Alteração de Sala na Unidade Curricular de Redes        │
│       Aviso Académico                           30 abr 2026    │
│                                                                 │
│ [ESCE] Feira de Projetos e Startups da ESCE                  │
│       Evento • 14:00 - 17:30                    14 mai 2026    │
│                                                                 │
└─────────────────────────────────────────────────────────────────┘
```

---

## Como Usar

### Para Alunos

1. **Ir ao Perfil**: Clicar no botão de perfil ou menu (canto superior direito)
2. **Ver Calendário**: Os horários de aulas aparecem automaticamente em layout de semana
3. **Ver Avisos**: Abaixo do calendário, lista com avisos da semana
4. **Clicar em Avisos**: Pode clicar para ver mais detalhes

### Para Administradores

Os dados são carregados automaticamente de:
- Tabela: `student_class_schedules` (horários)
- Tabela: `announcements` (avisos)

Não é necessário fazer nada - funciona automaticamente!

---

## Dados Mostrados

### Calendário (para aluno "armindo")

**Segunda-feira:**
- 09:00 - 12:00: LGSI_DAW (TP1) - D2.18
- 12:00 - 13:30: LGSI_EID (TP1) - C1.07

**Terça-feira:**
- 09:00 - 12:00: SIDG (TP1) - D2.18
- 12:00 - 13:30: LGSI_EID (TP1) - C1.15

**Quarta-feira:**
- 08:30 - 11:30: LGSI_IBD (TP1) - D2.10

**Quinta-feira:**
- 08:30 - 11:30: LGSI_SGBD (TP1) - D2.18
- 14:00 - 15:30: EA (TP3) - D2.10
- 15:30 - 18:30: M (TP2) - C1.08

**Sexta-feira:**
- 09:00 - 12:00: LGSI_ASI (TP1) - C1.12

### Avisos

Mostra até 5 avisos que expiram esta semana com:
- Escola (com cor-código)
- Título do aviso
- Categoria (Evento, Voluntariado, etc.)
- Horário (se disponível)
- Data de expiração

---

## Funcionalidades

✅ **Calendário Visual**
- Layout limpo com 5 colunas (seg-sex)
- Cards com informações de cada aula
- Sem aulas = "Sem aulas" mensagem

✅ **Avisos Semana**
- Mostra avisos relevantes
- Informações condensadas
- Fácil leitura

✅ **Responsivo**
- Desktop: 5 colunas lado a lado
- Tablet: Grid ajustado
- Mobile: Stack vertical (com `md:grid-cols-5`)

✅ **Performance**
- Carrega apenas quando vai para /conta
- Cache de dados
- Sem muitas queries

✅ **Segurança**
- Só alunos veem sua seção
- Usa RLS do banco
- Dados filtrados por escola

---

## Mensagens de Estado

### Sem Horários
```
🗓️ Nenhum horário de aula registado
```

### Sem Avisos
```
🔔 Nenhum aviso esta semana
```

---

## Integração com Sistema Existente

Esta funcionalidade integra-se com:

1. **Sistema de Verificação de Horários** (v7-8)
   - Usa tabela `student_class_schedules`
   - Mostra os mesmos dados de forma visual

2. **Sistema de Anúncios**
   - Filtra por semana atual
   - Mostra como preview

3. **Segurança**
   - RLS garante que aluno vê só seus dados
   - Validações no banco

---

## Dados de Exemplo

O sistema está pré-populado com:

**Aluno "armindo":**
- 9 aulas (segunda a sexta)
- Vários avisos de exemplo

Dados reais carregados ao acceder à página /conta.

---

## Próximas Melhorias

- [ ] Sincronização em tempo real
- [ ] Importar horários de arquivo
- [ ] Notificações de mudanças
- [ ] Exportar calendário (ICS)
- [ ] Integração com Google Calendar
- [ ] Modo escuro melhorado
- [ ] Filtros adicionais

---

## Testando

### Login Teste
```
Username: armindo
Senha: aluno123
```

### Passos
1. Fazer login
2. Ir ao perfil (ícone conta)
3. Ver calendário semanal
4. Ver avisos da semana
5. Confirmar que dados aparecem corretamente

---

## Estrutura do Código

```javascript
// Estados
const [weeklySchedule, setWeeklySchedule] = useState([]);
const [weeklyAnnouncements, setWeeklyAnnouncements] = useState([]);

// Função de carregamento
async loadWeeklyScheduleAndAnnouncements() {
  // Busca em student_class_schedules
  // Busca em announcements (filtrado por semana)
}

// Effect que trigga quando vai para conta
useEffect(() => {
  if (currentView === "account" && isAluno) {
    loadWeeklyScheduleAndAnnouncements();
  }
}, [currentView, isAluno]);

// Renderização
{isAluno && (
  <div>
    {/* Calendário 5 colunas */}
    {/* Avisos lista */}
  </div>
)}
```

---

## Troubleshooting

### Não aparecem horários
- [ ] Verificar se SQL 08 foi executado
- [ ] Confirmar que aluno tem dados em `student_class_schedules`
- [ ] Ver console (F12) para erros

### Não aparecem avisos
- [ ] Confirmar que existem avisos para a escola do aluno
- [ ] Verificar se avisos têm `expires_at` esta semana
- [ ] Confirmar filtro de escola

### Layout quebrado
- [ ] Atualizar página (F5)
- [ ] Limpar cache (Ctrl+Shift+Delete)
- [ ] Verificar Tailwind CSS em index.html

---

## Documentação Relacionada

- [RESUMO_VISUAL.md](./RESUMO_VISUAL.md) - Sistema de verificação de conflitos
- [CLASS_SCHEDULE_SYSTEM.md](./supabase/CLASS_SCHEDULE_SYSTEM.md) - Técnico
- [SETUP_GUIDE.md](./SETUP_GUIDE.md) - Setup

---

**Adição:** Calendário no Perfil  
**Data:** 2024  
**Status:** ✅ Implementado  
**Versão:** 1.0  
