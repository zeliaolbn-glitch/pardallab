# Plano: Fase 3 - Fluxo de Gestão

**Fase:** 03
**Slug:** fluxo-de-gestao
**Objetivo:** Implementar o CRUD de Ideias e Projetos com persistência no Supabase e Dashboard dinâmico.

## Requisitos Abrangidos
- IDEA-01 a IDEA-05
- PROJ-01 a PROJ-05
- DASH-03 (Widgets reais)

## Ondas de Execução

### Onda 1: TanStack Query e Módulo de Ideias
- [ ] **Tarefa 1.1**: Instalar e configurar `@tanstack/react-query`.
- [ ] **Tarefa 1.2**: Implementar hooks de query/mutation para a tabela `ideas`.
- [ ] **Tarefa 1.3**: Criar página de listagem de Ideias com Modal de criação (Shadcn Dialog/Form).

### Onda 2: Módulo de Projetos e Conversão
- [ ] **Tarefa 2.1**: Implementar hooks de query/mutation para a tabela `projects`.
- [ ] **Tarefa 2.2**: Criar página de listagem de Projetos.
- [ ] **Tarefa 2.3**: Implementar o botão "Transformar em Projeto" dentro do card de ideia.

### Onda 3: Dashboard Widgets e Refinamentos
- [ ] **Tarefa 3.1**: Criar widgets de contadores reais no Dashboard principal.
- [ ] **Tarefa 3.2**: Adicionar estados de Empty (Vazio) e Erro nas listagens.

## Critérios de Verificação
- [ ] Ideias são salvas e persistidas no Supabase (verificar via dashboard Supabase).
- [ ] É possível criar um projeto a partir de uma ideia existente.
- [ ] Contadores no Dashboard refletem o número real de itens no banco.
- [ ] Toasts de sucesso aparecem após cada criação.

---

## Detalhes das Tarefas

### Tarefa 1.3: Modal de Criação de Ideia
```xml
<task>
  <read_first>
    <file>src/features/ideas/components/CreateIdeaModal.tsx</file>
  </read_first>
  <action>
    Criar formulário usando react-hook-form e zod, integrado com Shadcn Dialog.
  </action>
  <acceptance_criteria>
    - Campos título e descrição validados.
    - Modal fecha após sucesso.
  </acceptance_criteria>
</task>
```

### Tarefa 2.3: Fluxo de Conversão
```xml
<task>
  <read_first>
    <file>src/features/projects/hooks/useCreateProject.ts</file>
  </read_first>
  <action>
    Implementar lógica que cria um projeto e opcionalmente marca a ideia original como "Arquivada/Convertida".
  </action>
  <acceptance_criteria>
    - Projeto criado com sucesso.
    - Usuário redirecionado para a lista de projetos.
  </acceptance_criteria>
</task>
```
