# Fase 5: Recursos de Apoio - Contexto

**Coletado em:** 02/05/2026
**Status:** Pronto para Planejamento

<domain>
## Fronteira da Fase
Esta fase completa o MVP do IdeaFlow, adicionando recursos que ajudam o usuário no dia a dia (ferramentas e aprendizado) e permitindo a exportação de dados para o Google Sheets. 

A fase termina com todas as abas da Sidebar funcionais e o CRM pronto para uso total.
</domain>

<decisions>
## Decisões de Implementação

### Catálogo de Ferramentas
- **Dados**: Lista estática de ferramentas curadas (ex: Canva, Notion, Replicate, etc).
- **UI**: Grid de cards simples com imagem/ícone, título, descrição curta e link externo.

### Módulo de Tutoriais
- **Conteúdo**: Galeria de vídeos incorporados (YouTube/Vimeo) ensinando a usar o fluxo Ideia -> Projeto.
- **UI**: Grid de vídeos com títulos e badges de dificuldade/tema.

### Integração Google Sheets (Exportação)
- **Modo**: Manual (solicitado pelo usuário).
- **Mecânica**: Botão "Exportar para Google Sheets" no Dashboard.
- **Implementação**: Para o MVP, usaremos uma solução de "Download CSV" que é facilmente importável no Sheets, ou uma chamada para uma Edge Function caso o usuário queira integração direta via API. 
- **Decisão**: Implementaremos o "Download CSV" formatado especificamente para o Sheets como a forma mais rápida e confiável de exportação manual.

### Finalização do Dashboard
- **Welcome Card**: Refinamento da mensagem de boas-vindas.
- **Footer**: Link para suporte ou documentação final.
</decisions>

<canonical_refs>
## Referências Canônicas
- [.planning/PROJECT.md](file:///c:/Users/lenov/.gemini/001-CRM%20IDEIAS/.planning/PROJECT.md)
- [.planning/ROADMAP.md](file:///c:/Users/lenov/.gemini/001-CRM%20IDEIAS/.planning/ROADMAP.md)
- [src/components/layout/AppSidebar.tsx](file:///c:/Users/lenov/.gemini/001-CRM%20IDEIAS/src/components/layout/AppSidebar.tsx)
</canonical_refs>

---
*Fase: 05-recursos-de-apoio*
*Contexto gerado para conclusão do ecossistema do MVP*
