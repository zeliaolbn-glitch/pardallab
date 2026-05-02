# Fase 4: Inteligência e Canais - Contexto

**Coletado em:** 02/05/2026
**Status:** Pronto para Planejamento

<domain>
## Fronteira da Fase
Esta fase foca em adicionar inteligência e agilidade ao workflow do usuário. O objetivo é permitir que o usuário use IA para detalhar ideias e tenha atalhos rápidos para compartilhar o progresso em canais sociais (WhatsApp/Telegram).

A fase termina com um assistente de IA funcional que recebe contexto de uma ideia/projeto e sugere próximos passos.
</domain>

<decisions>
## Decisões de Implementação

### Integração IA (Google Gemini API)
- **Modelo**: Utilizar `gemini-1.5-flash` via Supabase Edge Functions ou diretamente no frontend (se seguro/autorizado pelo usuário com chave própria). 
- **Decisão**: Para o MVP e simplicidade, usaremos uma Edge Function no Supabase para mascarar a chave da API do Google.
- **Funcionalidade**: Botão "Ajuda da IA" dentro do detalhe do projeto que gera:
    - Lista de tarefas sugeridas.
    - Possíveis desafios.
    - Sugestão de tech stack.

### Canais Sociais
- **Atalhos**: Adicionar botões no detalhe do projeto para:
    - "Compartilhar no WhatsApp" (Link direto com mensagem pré-formatada).
    - "Enviar para Telegram".
- **Estética**: Ícones oficiais das redes com cores vibrantes seguindo o padrão Shadcn.

### UI de IA
- **Formatador**: Usar `react-markdown` para renderizar as respostas da IA de forma legível (listas, negrito, etc).
- **Feedback**: Loading states específicos com animações sutis durante a geração de texto.

### Mudança de Schema (Opcional)
- Adicionar campo `ai_suggestions` (JSONB) na tabela `projects` para persistir o histórico de ajuda da IA.
</decisions>

<canonical_refs>
## Referências Canônicas
- [.planning/PROJECT.md](file:///c:/Users/lenov/.gemini/001-CRM%20IDEIAS/.planning/PROJECT.md)
- [.planning/ROADMAP.md](file:///c:/Users/lenov/.gemini/001-CRM%20IDEIAS/.planning/ROADMAP.md)
- [src/features/projects/pages/ProjectsPage.tsx](file:///c:/Users/lenov/.gemini/001-CRM%20IDEIAS/src/features/projects/pages/ProjectsPage.tsx)
</canonical_refs>

---
*Fase: 04-inteligencia-e-canais*
*Contexto gerado para expansão de recursos inteligentes*
