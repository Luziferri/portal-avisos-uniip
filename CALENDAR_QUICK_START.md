# 📅 Calendário Semanal no Perfil - Guia Rápido

## ✨ O Que É Novo

No perfil do aluno (`/conta`), agora aparece uma seção visual mostrando:

```
┌─────────────────────────────────────────────┐
│ 📅 CALENDÁRIO                               │
│ Horários e Atividades da Semana             │
├─────────────────────────────────────────────┤
│                                             │
│ [Seg] [Ter] [Qua] [Qui] [Sex]              │
│                                             │
│ - Todas as aulas do aluno                   │
│ - Horários de cada aula                     │
│ - Visual organizado por dia                 │
│                                             │
├─────────────────────────────────────────────┤
│ 🔔 AVISOS                                   │
│ Avisos da Semana                            │
├─────────────────────────────────────────────┤
│                                             │
│ - Até 5 avisos esta semana                  │
│ - Escola, Categoria, Horário                │
│ - Data de expiração                         │
│                                             │
└─────────────────────────────────────────────┘
```

---

## 🎯 Como Funciona

### Para o Aluno
1. **Login** como aluno (ex: armindo)
2. **Clique no ícone de Conta** (canto superior direito)
3. **Veja o calendário** com seus horários
4. **Veja os avisos** da semana

### Automático
- Os dados carregam sozinhos
- Busca na base de dados
- Filtra por aluno + semana

---

## 📊 O Que é Mostrado

### Calendário (5 Dias)

```
┌──────────┬──────────┬──────────┬──────────┬──────────┐
│  Segunda │  Terça   │  Quarta  │  Quinta  │  Sexta   │
├──────────┼──────────┼──────────┼──────────┼──────────┤
│ LGSI_DAW │ SIDG     │LGSI_IBD  │LGSI_SGBD │LGSI_ASI  │
│ 09:00-12 │ 09:00-12 │ 08:30-11 │ 08:30-11 │ 09:00-12 │
│          │          │          │          │          │
│LGSI_EID  │LGSI_EID  │          │ EA       │          │
│ 12:00-13 │ 12:00-13 │          │ 14:00-15 │          │
│          │          │          │          │          │
│          │          │          │ M        │          │
│          │          │          │ 15:30-18 │          │
└──────────┴──────────┴──────────┴──────────┴──────────┘
```

### Avisos (Lista Simples)

```
[ESE] Sessão Boas-Vindas
      Evento • 09:30-11:00          05 mai 2026

[EST] Alteração Sala Redes
      Aviso Académico               30 abr 2026

[ESCE] Feira Projetos
      Evento • 14:00-17:30          14 mai 2026
```

---

## 🔧 Tecnicamente

### Novo no Código

**Estados:**
```javascript
const [weeklySchedule, setWeeklySchedule] = useState([]);
const [weeklyAnnouncements, setWeeklyAnnouncements] = useState([]);
```

**Função:**
```javascript
loadWeeklyScheduleAndAnnouncements() {
  // Busca em student_class_schedules
  // Busca em announcements
}
```

**Effect:**
```javascript
useEffect(() => {
  if (currentView === "account" && isAluno) {
    loadWeeklyScheduleAndAnnouncements();
  }
}, [currentView, isAluno]);
```

**UI:**
- Calendário: Grid 5 colunas
- Avisos: Lista com cards
- Mensagens quando vazio

### Dados Usados
- Tabela: `student_class_schedules`
- Tabela: `announcements`
- Filtro: Aluno atual + semana

---

## ✅ Benefícios

| Feature | Benefício |
|---------|-----------|
| Calendário | Visualiza aulas rápido |
| Avisos | Sabe o que vem na semana |
| Organizado | Informação em um lugar |
| Responsive | Funciona em móvel |
| Seguro | Só vê seus dados |
| Rápido | Carrega só na página |

---

## 🚀 Usar Agora

### 1. Certifique-se que tem os dados
```sql
-- Verificar SQL 08 foi executado
SELECT COUNT(*) FROM student_class_schedules 
WHERE student_id = (
  SELECT id FROM profiles WHERE username = 'armindo'
);
-- Esperado: 9 aulas
```

### 2. Teste no App
```
1. Login: armindo / aluno123
2. Clique em Conta
3. Veja o calendário
4. Veja os avisos
```

### 3. Pronto! 🎉

---

## 💡 Dicas

- **Calendário vazio?** → Verificar SQL 08
- **Avisos vazios?** → Criar eventos com datas desta semana
- **Lento?** → Pode estar carregando, espere um momento
- **Não é aluno?** → Seção não aparece para prof/secretaria

---

## 📋 Checklist

- [x] Calendário adicionado ao perfil
- [x] Avisos da semana mostrados
- [x] Dados carregam automaticamente
- [x] Visual atraente
- [x] Responsivo
- [x] Documentação completa

---

## 🎨 Design

- **Cores**: Azul para aulas, cores por escola para avisos
- **Layout**: 5 colunas (semana)
- **Cards**: Limpos e informativos
- **Mensagens**: Claras quando sem dados
- **Padding**: Confortável
- **Sombras**: Suaves e profissionais

---

## 🔗 Integração

Usa:
- ✅ Tabela: `student_class_schedules` (v7-8)
- ✅ Sistema de Anúncios (existente)
- ✅ RLS Segurança (existente)
- ✅ Profile User (existente)

---

## 📱 Responsividade

| Device | Layout |
|--------|--------|
| Mobile | 1 coluna |
| Tablet | 2-3 colunas |
| Desktop | 5 colunas |

---

## 🐛 Se Algo Errar

**Erro: Sem horários**
- Confirmar: `SELECT * FROM student_class_schedules` tem dados
- Confirmar: Aluno certo

**Erro: Sem avisos**
- Confirmar: `SELECT * FROM announcements` tem dados
- Confirmar: Data está dentro desta semana

**Layout quebrado**
- F5 para refresh
- Verificar console (F12)

---

## 📞 Suporte

- Ver: [CALENDAR_PROFILE_FEATURE.md](./CALENDAR_PROFILE_FEATURE.md)
- Ver: [CLASS_SCHEDULE_SYSTEM.md](./supabase/CLASS_SCHEDULE_SYSTEM.md)
- Ver: Console (F12)

---

## ✨ O que Vem Depois

- [ ] Sincronização em tempo real
- [ ] Exportar calendário
- [ ] Modo escuro
- [ ] Notificações
- [ ] Mobile app

---

**Implementado:** Calendário Semanal  
**Status:** ✅ Pronto  
**Versão:** 1.0  
**Data:** 2024  
