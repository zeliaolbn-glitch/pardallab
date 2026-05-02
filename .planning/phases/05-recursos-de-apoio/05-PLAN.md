# Plano: Fase 5 - Recursos de Apoio

**Fase:** 05
**Slug:** recursos-de-apoio
**Objetivo:** Finalizar o catálogo de ferramentas, tutoriais e a exportação para Google Sheets.

## Requisitos Abrangidos
- TOOLS-01, TOOLS-02
- TUTOR-01, TUTOR-02
- EXPORT-01 (Manual)

## Ondas de Execução

### Onda 1: Catálogo de Ferramentas e Tutoriais
- [ ] **Tarefa 1.1**: Criar página `ToolsPage` com grid de ferramentas curadas.
- [ ] **Tarefa 1.2**: Criar página `TutorialsPage` com galeria de vídeos (Embeds).
- [ ] **Tarefa 1.3**: Integrar rotas finais no `App.tsx`.

### Onda 2: Exportação para Google Sheets (Manual)
- [ ] **Tarefa 2.1**: Implementar utilitário `exportToCsv` para Ideias e Projetos.
- [ ] **Tarefa 2.2**: Adicionar botão de exportação no Dashboard e listagens.

### Onda 3: Polish Final e Entrega
- [ ] **Tarefa 3.1**: Revisão geral de UI (Margens, cores, estados vazios).
- [ ] **Tarefa 3.2**: Gerar documentação final de uso (`PROJECT_GUIDE.md`).

## Critérios de Verificação
- [ ] Todas as abas da Sidebar levam a páginas funcionais.
- [ ] Download do CSV contém os dados reais do usuário logado.
- [ ] Vídeos de tutoriais carregam corretamente.

---

## Detalhes das Tarefas

### Tarefa 1.1: ToolsPage
```xml
<task>
  <action>
    Implementar uma página com grid de cards Shadcn contendo ferramentas úteis para criadores.
  </action>
  <acceptance_criteria>
    - Pelo menos 6 ferramentas listadas.
    - Links externos funcionais.
  </acceptance_criteria>
</task>
```

### Tarefa 2.1: Utilitário de Exportação
```xml
<task>
  <action>
    Criar função que transforma o array de ideias/projetos em uma string CSV e dispara o download.
  </action>
  <acceptance_criteria>
    - Formato compatível com importação direta no Google Sheets.
  </acceptance_criteria>
</task>
```
