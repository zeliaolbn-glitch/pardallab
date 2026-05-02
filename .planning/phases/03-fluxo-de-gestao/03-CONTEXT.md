# Fase 3: Fluxo de Gestão - Contexto

**Coletado em:** 02/05/2026
**Status:** Pronto para Planejamento

<domain>
## Fronteira da Fase
Esta fase foca na funcionalidade central (core business) do IdeaFlow: o ciclo de vida de uma ideia até se tornar um projeto. 

O objetivo é permitir que o usuário crie, visualize e gerencie suas ideias e projetos com persistência total no Supabase. A fase termina com o fluxo de "conversão" de uma ideia em um projeto totalmente funcional.
</domain>

<decisions>
## Decisões de Implementação

### Módulo de Ideias
- **Schema**: Tabela `ideas` com campos: `id`, `user_id`, `title`, `description`, `status` (draft, active, archived), `created_at`.
- **UI**: Grid de Cards com busca e filtragem simples por status.
- **Criação**: Modal deslizante (Sheet) ou Modal central com formulário Shadcn.

### Módulo de Projetos
- **Schema**: Tabela `projects` com campos: `id`, `user_id`, `idea_id` (FK opcional), `title`, `description`, `category`, `status` (planning, in_progress, completed), `created_at`.
- **Fluxo de Conversão**: Ao converter uma ideia, os dados básicos (título/descrição) são pré-preenchidos no formulário de novo projeto.

### Gestão de Dados (TanStack Query)
- **Caching**: Utilizar TanStack Query para gerenciar o estado do servidor e garantir que a UI esteja sempre sincronizada com o Supabase.
- **Mutations**: Feedback imediato com Toasts após criação ou edição.

### Dashboard Real
- **Widgets**: Cards no topo do Dashboard mostrando contadores reais de:
    - Ideias Ativas
    - Projetos em Andamento
    - Total de Projetos Concluídos
</decisions>

<canonical_refs>
## Referências Canônicas
- [.planning/PROJECT.md](file:///c:/Users/lenov/.gemini/001-CRM%20IDEIAS/.planning/PROJECT.md)
- [.planning/REQUIREMENTS.md](file:///c:/Users/lenov/.gemini/001-CRM%20IDEIAS/.planning/REQUIREMENTS.md)
- [src/lib/supabase.ts](file:///c:/Users/lenov/.gemini/001-CRM%20IDEIAS/src/lib/supabase.ts)
</canonical_refs>

---
*Fase: 03-fluxo-de-gestao*
*Contexto gerado para implementação dos módulos de negócio*
