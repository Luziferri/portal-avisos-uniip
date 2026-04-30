# 🎨 Visualização - Calendário no Perfil

## 📄 Estrutura da Página de Conta

```
┌─────────────────────────────────────────────────────────────────────┐
│                        PÁGINA DE CONTA                              │
├─────────────────────────────────────────────────────────────────────┤
│                                                                     │
│  Cabeçalho                                                          │
│  ├─ Título: "Perfil do utilizador"                                 │
│  └─ Botão: "Voltar ao feed"                                        │
│                                                                     │
│  ─────────────────────────────────────────────────────────────────  │
│                                                                     │
│  Seção 1: Mudar Foto de Perfil                                    │
│  ├─ Avatar pequeno                                                 │
│  ├─ Status: "Foto atualizada" ou "Sem foto definida"             │
│  └─ Botões: "Alterar foto" e "Remover foto"                      │
│                                                                     │
│  ─────────────────────────────────────────────────────────────────  │
│                                                                     │
│  📍 NOVA SEÇÃO: Calendário da Semana                               │
│  ├─ Título: "Horários e Atividades da Semana"                    │
│  │                                                                 │
│  │  ┌────────┐ ┌────────┐ ┌────────┐ ┌────────┐ ┌────────┐      │
│  │  │ Seg    │ │ Ter    │ │ Qua    │ │ Qui    │ │ Sex    │      │
│  │  │   1    │ │   2    │ │   3    │ │   4    │ │   5    │      │
│  │  ├────────┤ ├────────┤ ├────────┤ ├────────┤ ├────────┤      │
│  │  │LGSI_DAW│ │SIDG    │ │LGSI_IBD│ │LGSI_SGB│ │LGSI_ASI│      │
│  │  │09:00-12│ │09:00-12│ │08:30-11│ │08:30-11│ │09:00-12│      │
│  │  │        │ │        │ │        │ │        │ │        │      │
│  │  │LGSI_EI │ │LGSI_EI │ │        │ │EA      │ │        │      │
│  │  │12:00-13│ │12:00-13│ │        │ │14:00-15│ │        │      │
│  │  │        │ │        │ │        │ │        │ │        │      │
│  │  │        │ │        │ │        │ │M       │ │        │      │
│  │  │        │ │        │ │        │ │15:30-18│ │        │      │
│  │  └────────┘ └────────┘ └────────┘ └────────┘ └────────┘      │
│  │                                                                 │
│  └─────────────────────────────────────────────────────────────────│
│                                                                     │
│  📍 NOVA SEÇÃO: Avisos da Semana                                   │
│  ├─ Título: "Avisos da Semana"                                   │
│  │                                                                 │
│  │  ┌─────────────────────────────────────────────────────────┐  │
│  │  │[ESE] Sessão de Boas-Vindas para Novos Alunos          │  │
│  │  │      Evento • 09:30 - 11:00                  05 mai    │  │
│  │  └─────────────────────────────────────────────────────────┘  │
│  │                                                                 │
│  │  ┌─────────────────────────────────────────────────────────┐  │
│  │  │[EST] Alteração de Sala na Unidade Curricular de Redes │  │
│  │  │      Aviso Académico                       30 abr     │  │
│  │  └─────────────────────────────────────────────────────────┘  │
│  │                                                                 │
│  │  ┌─────────────────────────────────────────────────────────┐  │
│  │  │[ESCE] Feira de Projetos e Startups da ESCE           │  │
│  │  │       Evento • 14:00 - 17:30                14 mai    │  │
│  │  └─────────────────────────────────────────────────────────┘  │
│  │                                                                 │
│  └─────────────────────────────────────────────────────────────────│
│                                                                     │
│  ─────────────────────────────────────────────────────────────────  │
│                                                                     │
│  Seção 3: Informações do Utilizador (EXISTENTE)                   │
│  ├─ Grid de Cartões                                               │
│  ├─ Nome                                                           │
│  ├─ Perfil (Aluno/Professor/Secretaria)                           │
│  ├─ Escola                                                         │
│  ├─ Email                                                          │
│  ├─ Username                                                       │
│  └─ Total de Avisos                                               │
│                                                                     │
└─────────────────────────────────────────────────────────────────────┘
```

---

## 🎨 Detalhe: Cartão de Aula

### Single Day Card

```
┌──────────────────────────────┐
│ [1]  Segunda                 │
├──────────────────────────────┤
│ ┌────────────────────────────┤
│ │ LGSI_DAW (TP1) - D2.18     │
│ │ 09:00 - 12:00              │
│ └────────────────────────────┤
│                              │
│ ┌────────────────────────────┤
│ │ LGSI_EID (TP1) - C1.07     │
│ │ 12:00 - 13:30              │
│ └────────────────────────────┤
└──────────────────────────────┘
```

**Cores:**
- Background: `from-slate-50 to-white` (gradiente suave)
- Border: `border-slate-200`
- Aula: `bg-blue-50`, `border-blue-100`, `text-blue-900`

**Typography:**
- Dia: Número azul em círculo + texto bold
- Aula: Nome em semibold, horário em tamanho menor

---

## 🎨 Detalhe: Aviso Card

```
┌──────────────────────────────────────────────────────────────┐
│ [EST] Alteração de Sala na Unidade Curricular de Redes      │
│       Aviso Académico • 30 abr 2026                        │
└──────────────────────────────────────────────────────────────┘
```

**Componentes:**
- Badge escola: `bg-slate-700 text-white` (colorido por escola)
- Título: Bold, texto escuro
- Categoria: Texto menor, cinzento
- Data: Alinhada à direita

**Hover Effect:**
- Border muda para `border-slate-300`
- Shadow aumenta ligeiramente

---

## 📱 Responsividade

### Desktop (5 colunas)
```
┌────┬────┬────┬────┬────┐
│ S  │ T  │ Q  │ Q  │ F  │
├────┼────┼────┼────┼────┤
│...  │... │... │... │... │
└────┴────┴────┴────┴────┘
```

### Tablet (Grid 2-3)
```
┌────────┬────────┐
│   S    │   T    │
├────────┼────────┤
│   Q    │   Q    │
├────────┴────────┤
│        F        │
└─────────────────┘
```

### Mobile (1 coluna)
```
┌──────────┐
│ Segunda  │
├──────────┤
│ Terça    │
├──────────┤
│ Quarta   │
├──────────┤
│ Quinta   │
├──────────┤
│ Sexta    │
└──────────┘
```

---

## 🎨 Paleta de Cores

| Elemento | Cor | RGB |
|----------|-----|-----|
| Background Dia | Blue-50 | #eff6ff |
| Border Dia | Blue-100 | #dbeafe |
| Texto Aula | Blue-900 | #111e3b |
| Background Aviso | White | #ffffff |
| Badge | Varia (école) | ... |
| Hover | Slate-300 | #cbd5e1 |

---

## ✨ Transições & Efeitos

### Card Hover
```css
transition: all 0.3s ease
hover:border-slate-300
hover:shadow-md
```

### Ícones
```
Sem aulas: 🗓️ CalendarDays icon
Sem avisos: 🔔 BellRing icon
```

---

## 🔤 Typography

| Elemento | Font | Tamanho | Peso |
|----------|------|---------|------|
| Heading | Sistema | lg | semibold |
| Label | Sistema | xs | bold uppercase |
| Aula Nome | Sistema | xs | semibold |
| Aula Hora | Sistema | xs | normal |
| Aviso Título | Sistema | sm | semibold |
| Aviso Info | Sistema | xs | normal |

---

## 🎯 Layout Grid

### Calendário
```css
grid-cols-1        /* Mobile */
md:grid-cols-2     /* Tablet */
lg:grid-cols-3     /* Large Tablet */
xl:grid-cols-5     /* Desktop */
gap-3
```

### Avisos
```css
space-y-3          /* Stack vertical */
```

---

## 🖼️ Exemplo Completo - Calendário Semana

```
SEGUNDA    TERÇA      QUARTA     QUINTA     SEXTA
┌────────┐┌────────┐┌────────┐┌────────┐┌────────┐
│LGSI_DAW││SIDG     ││LGSI_IBD││LGSI_SGB││LGSI_ASI│
│09:00-12││09:00-12││08:30-11││08:30-11││09:00-12│
│        ││        ││        ││        ││        │
│LGSI_EID││LGSI_EID││        ││EA       ││        │
│12:00-13││12:00-13││        ││14:00-15││        │
│        ││        ││        ││        ││        │
│        ││        ││        ││M        ││        │
│        ││        ││        ││15:30-18││        │
└────────┘└────────┘└────────┘└────────┘└────────┘
```

---

## 🖼️ Exemplo Completo - Avisos

```
EST - Alteração de Sala
    Aviso Académico                    30 abr 2026

ESE - Sessão de Boas-Vindas
    Evento • 09:30-11:00               05 mai 2026

ESCE - Feira de Projetos
    Evento • 14:00-17:30               14 mai 2026

EST - Inscrições Voluntariado
    Voluntariado                        08 mai 2026

ESS - Palestra de Saúde Mental
    Evento • 16:00-17:00               07 mai 2026
```

---

## 💡 Notas de Design

1. **Espaçamento**: Amplo, respira
2. **Cores**: Azul para aulas (calma), colorido para escolas
3. **Typography**: Hierarquia clara
4. **Ícones**: SVG inline, consistentes
5. **Feedback**: Hover effects suaves
6. **Acessibilidade**: Contraste ok, text readable

---

## 🎭 Estados

### Estado: Com Dados
```
✅ Mostra calendário + avisos
✅ Cards preenchidos
✅ Info completa
```

### Estado: Sem Dados (Calendário)
```
🗓️ Nenhum horário de aula registado
```

### Estado: Sem Dados (Avisos)
```
🔔 Nenhum aviso esta semana
```

### Estado: Carregando
```
(Implícito - dados carregam quando entra na página)
```

---

**Visualização:** Calendário Semanal  
**Versão:** 1.0  
**Status:** ✅ Pronto  
