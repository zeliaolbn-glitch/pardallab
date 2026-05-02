# Plano: Fase 2 - Interface Core

**Fase:** 02
**Slug:** interface-core
**Objetivo:** Implementar a Landing Page, o Layout Base do Dashboard e a navegação responsiva.

## Requisitos Abrangidos
- DASH-01, DASH-02
- UI-01 a UI-05

## Ondas de Execução

### Onda 1: Landing Page
- [ ] **Tarefa 1.1**: Criar componente `LandingPage` com seção Hero e "Como Funciona".
- [ ] **Tarefa 1.2**: Integrar CTA da Landing Page com a rota `/auth`.
- [ ] **Tarefa 1.3**: Estilizar com Tailwind v4 seguindo a paleta azul/branco.

### Onda 2: Layout Estrutural (Dashboard)
- [ ] **Tarefa 2.1**: Criar componente `DashboardLayout` com Sidebar e Header.
- [ ] **Tarefa 2.2**: Implementar Sidebar responsiva (Sheet no mobile via Shadcn).
- [ ] **Tarefa 2.3**: Adicionar navegação entre as rotas (Dashboard, Ideias, Projetos).

### Onda 3: Polish e Skeletons
- [ ] **Tarefa 3.1**: Adicionar componentes `Skeleton` nas telas do dashboard.
- [ ] **Tarefa 3.2**: Refinar tipografia e espaçamentos (Padding/Margin) para look premium.

## Critérios de Verificação
- [ ] Landing Page acessível publicamente.
- [ ] Sidebar funciona corretamente em mobile e desktop.
- [ ] Usuário consegue navegar entre abas do Dashboard sem erros.
- [ ] Feedback visual de "carregando" visível ao alternar rotas.

---

## Detalhes das Tarefas

### Tarefa 1.1: Landing Page Hero
```xml
<task>
  <read_first>
    <file>src/features/landing/pages/LandingPage.tsx</file>
  </read_first>
  <action>
    Criar a página inicial com um Hero de alto impacto usando tipografia Inter e cores azuis.
  </action>
  <acceptance_criteria>
    - Título principal presente.
    - Botão "Começar Agora" redireciona para /auth.
  </acceptance_criteria>
</task>
```

### Tarefa 2.1: Sidebar Responsiva
```xml
<task>
  <read_first>
    <file>src/components/layout/DashboardLayout.tsx</file>
  </read_first>
  <action>
    Implementar layout com Sidebar fixa à esquerda (hidden no mobile) e Header superior.
  </action>
  <acceptance_criteria>
    - Sidebar contém links funcionais.
    - Header mostra nome do usuário (se logado).
  </acceptance_criteria>
</task>
```
