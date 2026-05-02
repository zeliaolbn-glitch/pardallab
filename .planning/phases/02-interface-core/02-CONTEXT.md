# Fase 2: Interface Core - Contexto

**Coletado em:** 02/05/2026
**Status:** Pronto para Planejamento

<domain>
## Fronteira da Fase
Esta fase foca na experiência do usuário e na navegação estrutural. O objetivo é entregar uma Landing Page que converta e um Dashboard que organize, mesmo que os dados ainda sejam estáticos ou mockados em alguns pontos.

A fase termina com o usuário navegando fluidamente entre a página pública e a área logada (Dashboard).
</domain>

<decisions>
## Decisões de Implementação

### Estética e Marca
- **Cores**: Azul Profundo (#1e3a8a) para elementos principais, Branco (#ffffff) para fundos, e Cinza Suave (#f3f4f6) para seções de contraste.
- **Tipografia**: Inter (via Tailwind/Shadcn).
- **Estilo**: Clean, profissional, com bordas levemente arredondadas e sombras suaves (design premium).

### Landing Page
- **Seção Hero**: Título "Transforme suas ideias em projetos incríveis" em negrito extra, com um subtítulo explicativo e botão de CTA "Começar Agora".
- **Seção Como Funciona**: Grid de 3 colunas explicando o fluxo (Ideia -> Organização -> Execução).

### Layout do Dashboard
- **Sidebar**: Fixa à esquerda no desktop (pode ser colapsável), transformando-se em menu "sheet" (hambúrguer) no mobile.
- **Header**: Fixo no topo com logo, busca (estética) e perfil do usuário.
- **Navegação**: Links para Dashboard, Ideias, Projetos, Ferramentas e Tutoriais.

### Feedback Visual
- **Skeletons**: Implementação de `Skeleton` do Shadcn para estados de carregamento nas rotas principais.
- **Transições**: Transições suaves de opacidade entre rotas.
</decisions>

<canonical_refs>
## Referências Canônicas
- [.planning/PROJECT.md](file:///c:/Users/lenov/.gemini/001-CRM%20IDEIAS/.planning/PROJECT.md)
- [.planning/REQUIREMENTS.md](file:///c:/Users/lenov/.gemini/001-CRM%20IDEIAS/.planning/REQUIREMENTS.md)
- [src/App.tsx](file:///c:/Users/lenov/.gemini/001-CRM%20IDEIAS/src/App.tsx)
</canonical_refs>

---
*Fase: 02-interface-core*
*Contexto gerado automaticamente com base na visão do projeto*
