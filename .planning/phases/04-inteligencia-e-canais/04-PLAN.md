# Plano: Fase 4 - Inteligência e Canais

**Fase:** 04
**Slug:** inteligencia-e-canais
**Objetivo:** Integrar assistência de IA para projetos e adicionar atalhos de comunicação social.

## Requisitos Abrangidos
- IA-01 a IA-03
- SOCIAL-01, SOCIAL-02

## Ondas de Execução

### Onda 1: Assistente de IA (Frontend-First)
- [ ] **Tarefa 1.1**: Instalar `react-markdown` e `@google/generative-ai`.
- [ ] **Tarefa 1.2**: Criar hook `useAI` para interagir com o modelo Gemini.
- [ ] **Tarefa 1.3**: Implementar modal de "Assistente de Ideia" que gera planos de ação.

### Onda 2: Canais Sociais e Atalhos
- [ ] **Tarefa 2.1**: Implementar utilitários para links de compartilhamento (WhatsApp/Telegram).
- [ ] **Tarefa 2.2**: Adicionar barra de ações rápidas nos cards de projeto.

### Onda 3: Refinamentos e Persistência
- [ ] **Tarefa 3.1**: Permitir salvar a sugestão da IA como descrição do projeto.
- [ ] **Tarefa 3.2**: Refinar a UI do chat/assistente com animações de digitação.

## Critérios de Verificação
- [ ] Resposta da IA é exibida formatada em Markdown.
- [ ] Links de WhatsApp abrem com o título do projeto preenchido.
- [ ] Usuário pode escolher entre usar a sugestão da IA ou manter sua descrição original.

---

## Detalhes das Tarefas

### Tarefa 1.2: Hook de IA
```xml
<task>
  <action>
    Implementar integração direta com a API do Gemini (usando chave de ambiente) para gerar respostas baseadas no contexto da ideia.
  </action>
  <acceptance_criteria>
    - Chave VITE_GEMINI_API_KEY utilizada.
    - Resposta gerada com sucesso para um prompt de exemplo.
  </acceptance_criteria>
</task>
```

### Tarefa 2.1: Links Sociais
```xml
<task>
  <action>
    Criar função helper que gera URLs do tipo `https://wa.me/?text=...`.
  </action>
  <acceptance_criteria>
    - URL codificada corretamente (URI component).
  </acceptance_criteria>
</task>
```
