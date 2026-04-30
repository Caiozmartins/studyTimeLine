# Plano Acelerado — Apple Developer Academy UCB

> **Prazo:** 20 semanas (maio → setembro 2026)
> **Meta:** 2–4 projetos publicados, 1 projeto forte com diferencial, base sólida para prova e entrevista.
> **Eixo principal:** Curso iOS Developer (Tiago Aguiar) — não seguir tutoriais avulsos.
> **Princípio:** Construir > Estudar. Cada semana produz algo funcional.

---

## Visão Geral das Fases

| Fase | Semanas | Foco | Entregáveis |
|------|---------|------|-------------|
| **0 — Ignição** | 1–2 | Curso Tiago (Mód 1-4) + Lógica em Swift + Git | 2 mini-apps pessoais no GitHub |
| **1 — Primeiro App** | 3–6 | Curso Tiago (Mód 5-7) + Projeto 1 real | Projeto 1 publicado no GitHub |
| **2 — Evolução** | 7–11 | Curso Tiago (Mód 8-10) + C/Lógica + Projeto 2 + Ideação CBL | Projeto 2 publicado + problema CBL definido |
| **3 — Projeto Principal** | 12–16 | CBL + UX + App diferencial | Projeto principal completo |
| **4 — Polimento** | 17–20 | Portfolio + Simulados + Entrevista | Tudo pronto para o processo |

---

## Recursos e Como Usar

### Curso iOS Developer (Tiago Aguiar) — EIXO PRINCIPAL
Seguir os módulos na ordem. É o que guia seu aprendizado de SwiftUI.
Não precisa de outro curso de SwiftUI em paralelo.

### Curso de Swift (Tiago Aguiar) — SUPORTE SOB DEMANDA
**NÃO seguir linearmente.** Consultar quando o curso iOS pedir um conceito que você não entende.

| Estudar AGORA (Fase 0-1) | Sob demanda (quando precisar) | IGNORAR por agora |
|--------------------------|-------------------------------|-------------------|
| Variáveis, tipos, optionals | Protocols e extensions | Generics avançados |
| Collections (Array, Dict) | Error handling (try/catch) | Operator overloading |
| Control flow (if, for, while) | Enums com associated values | Memory management (ARC) |
| Functions e parâmetros | Property observers (didSet) | Subscripts |
| Closures (básico) | Async/await | Protocol-oriented avançado |
| Structs vs Classes (básico) | | |

### SwiftUI com Firebase — BÔNUS (Fase 3, se o projeto principal precisar de backend)

---

## Mapa de Progressão

```
Semana:  1  2  3  4  5  6  7  8  9 10 11 12 13 14 15 16 17 18 19 20
Curso:   ████████████████████████████████████████████░░░░░░░░░░░░░░░░░░░
Swift:   ████████████████████████████████████████████████████████████████
Projeto: ░░░░████████████████████████████████████████████████████████████
C:       ░░░░░░░░░░░░░░░░░░░░████████████░░░░░░░░░░░░░░░░░░████░░░░░░░
Lógica:  ████████████░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░
R.Lóg:   ░░░░░░░░░░░░░░░░░░░░░░░░████████████░░░░░░░░░░░░░░░░░░░░░░░░░
Git:     ████████████████████████████████████████████████████████████████
CBL:     ░░░░░░░░░░░░░░░░░░░░░░░░░░░░████████████████████░░░░░░░░░░░░░
Design:  ░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░████████████████████████████░░
```

---

## FASE 0 — Ignição (Semanas 1–2)

> **Objetivo:** Configurar ambiente, entender fundação iOS, construir 2 mini-apps pessoais.

### Semana 1: Ambiente + Fundação iOS

**Curso Tiago Aguiar:**
- Módulo 1 — Preparação e metodologia
- Módulo 2 — Fundação do Ambiente (Xcode, Simuladores)
- Módulo 3 — Fundamentos Swift no contexto iOS

**Lógica em Swift:**
- Continuar de onde parou (condicionais → loops → funções)
- Resolver 5 problemas em Swift (não Portugol, não C)

**Curso Swift (sob demanda):** Variáveis, Tipos, Optionals, Collections

**Construir:**
- Git: criar conta GitHub + repositório "academy-prep"
- Mini-app 1: **MoodTracker** — registrar humor do dia com emoji + nota curta (1 tela, @State)
- Commit diário obrigatório

**Entregável:** Repo GitHub com MoodTracker + 7 commits

---

### Semana 2: Primeiro App Real + Fundação iOS Moderno

**Curso Tiago Aguiar:**
- Módulo 4 — Fundação do iOS Moderno & Apple SDK (primeiro app, arquitetura SwiftUI)

**Lógica em Swift:**
- Funções com retorno, arrays, dicionários
- Resolver 5 problemas em Swift

**Construir:**
- Mini-app 2: **Decisor** — input opções → resultado aleatório ponderado (2 telas, NavigationView)
- Documentar ambos os mini-apps com README

**Entregável:** 2 mini-apps no GitHub com README + 14 commits totais

---

## FASE 1 — Primeiro App Real (Semanas 3–6)

> **Objetivo:** Aprender SwiftUI com o curso e publicar um projeto pessoal real.
> **Zero C nesta fase.** Imersão total em Swift/SwiftUI.

### Semana 3–4: SwiftUI com o Curso

**Curso Tiago Aguiar:**
- Módulos 5–6 — SwiftUI intermediário (componentes, navegação, state management)

**Curso Swift (sob demanda):** Closures, Structs vs Classes — consultar quando o curso pedir

**Construir:**
- Definir escopo do Projeto 1: wireframe em papel
- Começar implementação: navegação + telas básicas

**Entregável:** Wireframe + estrutura do Projeto 1 no GitHub

---

### Semana 5–6: Projeto 1 Completo

**Curso Tiago Aguiar:**
- Módulo 7 — Apps Online (URLSession, JSON, Codable, Combine introdução)

**Construir:**
> **Projeto 1: "AcademyPrep"** — App de rotina de estudo para candidatos da Apple Developer Academy
> - Temas de estudo por dia (Swift, C, Lógica, etc.)
> - Streak de dias estudados
> - Progresso por área com visual claro
> - Por que este app: público real (outros candidatos), contexto Apple, demonstra autoconhecimento
>
> Requisitos:
> - 3+ telas com NavigationView
> - @State, @Binding, @AppStorage (persistência)
> - Visual seguindo HIG (SF Symbols, cores semânticas)
> - README com screenshots e descrição do problema

**Entregável:** Projeto 1 publicado no GitHub com README profissional

**Alternativas de Projeto 1:**
| App | Descrição | Por que é real |
|-----|-----------|---------------|
| AcademyPrep | Rotina de estudo para candidatos | Público real, contexto Apple |
| FocusBlock | Pomodoro com bloqueio de distrações | Problema que TODO estudante tem |
| QuickNote | Notas rápidas por categoria com busca | Útil no dia-a-dia, mostra CRUD |

---

## FASE 2 — Evolução (Semanas 7–11)

> **Objetivo:** SwiftUI avançado com o curso, C e raciocínio lógico em paralelo, Projeto 2, e começar ideação CBL.

### Semana 7–8: Curso Avançado + Início C

**Curso Tiago Aguiar:**
- Módulo 8 — Serviços Reativos com Combine & LocalStorage (login, tokens, offline)
- Módulo 9 — Listas e Coleções de Views (NavigationLink, Lists, Forms, Tabs)

**Curso Swift (sob demanda):** Protocols, Error Handling, Async/await

**C essencial (30 min/dia):**
- Sintaxe básica, printf/scanf, variáveis e tipos
- Arrays e strings
- Funções com parâmetros e retorno

**Construir:**
- Definir escopo Projeto 2: wireframe + estrutura MVVM
- Começar implementação

**Entregável:** Projeto 2 em andamento + 6 exercícios de C resolvidos

---

### Semana 9–10: Projeto 2 Completo + Raciocínio Lógico

**Curso Tiago Aguiar:**
- Módulo 10 — UI Cupertino e Edição de Dados (guidelines Apple, Forms nativos)

**C essencial (30 min/dia):**
- Ponteiros (conceito básico)
- Structs
- Resolver 10 exercícios

**Raciocínio lógico (30 min/dia):**
- Sequências numéricas e lógicas
- Proposições e conectivos lógicos
- Diagramas e tabelas-verdade

**Construir:**
> **Projeto 2: "UniGuide Brasília"** — Guia de locais e serviços perto da UCB
> - Restaurantes, transporte, bibliotecas, coworkings
> - Dados via API ou JSON local estruturado
> - Favoritos + busca + filtros por categoria
> - Por que este app: contexto local (UCB/Brasília), útil para calouros, demonstra empatia
>
> Requisitos:
> - 4+ telas com TabView
> - MVVM pattern
> - API externa ou dados JSON complexos
> - Persistência robusta (Core Data ou SwiftData)
> - Acessibilidade básica (VoiceOver labels, Dynamic Type)
> - README com screenshots

**Entregável:** Projeto 2 publicado no GitHub

**Alternativas de Projeto 2:**
| App | Descrição | Por que é real |
|-----|-----------|---------------|
| UniGuide Brasília | Guia de locais perto da UCB | Contexto local, útil, mostra APIs |
| CandidatoConnect | Candidatos da Academy se conectam p/ estudar | Meta (sobre a jornada), colaboração |
| GastosUni | Controle financeiro para universitários | Problema real, gráficos, cálculos |

---

### Semana 11: Ideação CBL + Simulado

**NÃO é buffer.** Esta semana produz algo concreto.

**CBL — Começar a pensar no Projeto Principal:**
- Estudar CBL: Big Idea → Essential Question → Challenge
- Listar 3 problemas reais da sua vida/comunidade
- Entrevistar 2–3 pessoas sobre um dos problemas
- Documentar: qual problema? quem sofre? como resolve hoje?

**Raciocínio lógico:**
- Simulado completo (meta: 70%+)
- Identificar pontos fracos

**Polir:**
- Revisar Projetos 1 e 2 (bugs, README, screenshots)

**Entregável:** Documento CBL com problema + 2 entrevistas + simulado 70%+

---

## FASE 3 — Projeto Principal (Semanas 12–16)

> **Objetivo:** Construir O projeto que te diferencia. CBL aplicado, impacto real, design intencional.
> **Nota:** A ideação já começou na sem 11. Aqui é execução.

### Semana 12: Definir e Projetar

**CBL + Design Thinking:**
- Finalizar: Big Idea, Essential Question, Challenge
- Entrevistar mais 2–3 pessoas (total: 5+)
- Wireframe completo (Figma ou papel)
- Definir arquitetura (models, views, viewmodels)

**Opcional:** Se o projeto precisar de backend → usar curso SwiftUI com Firebase (Tiago Aguiar)

**Entregável:** Documento CBL completo + wireframe + projeto Xcode criado

---

### Semana 13–14: Core Features

**Construir:**
- Implementar 2–3 funcionalidades principais
- Integrar APIs Apple relevantes (MapKit, CoreLocation, UserNotifications, etc.)
- Persistência de dados
- SwiftUI avançado conforme necessidade

**Entregável:** MVP funcional com core features rodando

---

### Semana 15: Polish + Acessibilidade

**Construir:**
- Polish visual seguindo HIG (SF Symbols, cores semânticas, espaçamento)
- Acessibilidade: VoiceOver labels, Dynamic Type, color contrast
- Estados vazios, loading, erro
- Testar em diferentes tamanhos de tela

**Entregável:** App visualmente polido e acessível

---

### Semana 16: Finalizar + Demo

**Construir:**
- **PROJETO PRINCIPAL COMPLETO**
  - 5+ telas, navegação completa, persistência robusta
  - Acessibilidade implementada
  - Design seguindo HIG
  - README formato CBL: problema → pesquisa → solução → impacto
  - Screenshots/GIFs no README
  - Vídeo demo de 1 minuto
- Praticar pitch de 3 minutos

**Entregável:** Projeto principal publicado no GitHub com README CBL + vídeo demo

**Ideias de projeto principal:**
| App | Problema | Diferencial Academy |
|-----|----------|-------------------|
| **AccessiGuide** | Falta de info sobre acessibilidade urbana | MapKit, impacto social, valor Apple |
| **StudyBuddy** | Candidatos estudam sozinhos | Meta (sobre a jornada), colaboração |
| **CommunityReport** | Problemas urbanos sem canal fácil | Câmera, localização, impacto cívico |
| **ElderCare** | Idosos esquecem medicamentos | Notifications, acessibilidade, empatia |

---

## FASE 4 — Polimento Final (Semanas 17–20)

### Semana 17: Portfolio GitHub

**Construir:**
- GitHub profile README profissional
- Revisar e polir TODOS os projetos (links, screenshots, descrições)
- Opcional: projeto bônus simples com skill diferente (CoreML, HealthKit, widgets)

**Entregável:** GitHub portfolio completo com 3–4 projetos documentados

---

### Semana 18: Simulado de Prova

**Estudar:**
- Revisão intensiva de C: variáveis, tipos, arrays, ponteiros, funções, structs
- Revisão de raciocínio lógico: sequências, proposições, diagramas
- Revisão de lógica de programação: algoritmos, pseudocódigo

**Fazer:**
- Simulado completo cronometrado (2h)
- Identificar pontos fracos → estudar focado

**Entregável:** Score 80%+ no simulado

---

### Semana 19: Preparação de Entrevista

**Praticar:**
- Escrever respostas para 10 perguntas comuns ("Por que a Academy?", "Conte sobre um projeto seu")
- Gravar pitch do projeto principal (3 min) e reassistir
- Simular entrevista com amigo/familiar
- Simular dinâmica de grupo: problema → solução em 15 min

**Entregável:** Pitch gravado + respostas escritas + 1 simulação completa

---

### Semana 20: Revisão Final

**Fazer:**
- Simulado final de prova (2h cronometradas)
- Entrevista simulada final
- Verificar: GitHub público? Links funcionam? READMEs ok?
- Escrever reflexão: "O que aprendi nessa jornada"

**Entregável:** Tudo pronto. Portfolio público, pitch afiado, confiança.

---

## Rotina Diária (2–3h)

| Bloco | Tempo | Atividade |
|-------|-------|-----------|
| Curso | 45–60 min | Aula do Tiago Aguiar (iOS Developer) + praticar junto |
| Build | 45–60 min | Construir/avançar projeto da fase atual |
| Paralelo | 30 min | C ou Raciocínio Lógico (a partir da Fase 2) |
| Commit | 10 min | Git add, commit, push |

**Fins de semana:** sessão mais longa (3–4h) focada em projeto.

---

## Regras de Ouro

1. **Curso do Tiago = eixo.** Não pule módulos, não busque tutoriais avulsos.
2. **Curso de Swift = dicionário.** Consulta quando precisar, não segue linearmente.
3. **Commit diário.** Mesmo que pequeno.
4. **Projeto > Tutorial.** Assistir aula sem construir = tempo perdido.
5. **C é meio, não fim.** 30 min/dia a partir da Fase 2, suficiente para a prova.
6. **Todo projeto resolve um problema.** Se não tem usuário real, é exercício.
7. **CBL não é buzzword.** Entreviste pessoas de verdade.
8. **Acessibilidade é valor Apple.** Implementar = diferencial real.
