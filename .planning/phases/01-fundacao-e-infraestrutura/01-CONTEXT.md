# Fase 1: Fundação e Infraestrutura - Contexto

**Coletado em:** 02/05/2026
**Status:** Pronto para Planejamento

<domain>
## Fronteira da Fase
Esta fase estabelece a infraestrutura base do IdeaFlow, incluindo o setup do ambiente React (Vite), configuração do Tailwind CSS v4 com Shadcn/UI, e a integração inicial com Supabase para Autenticação e Banco de Dados.

O objetivo é terminar esta fase com um usuário capaz de se autenticar e ver uma rota protegida (Dashboard vazio).
</domain>

<decisions>
## Decisões de Implementação

### Estrutura de Código
- **Padrão**: Feature-First. Componentes, hooks e serviços serão agrupados por funcionalidade (ex: `features/auth`, `features/ideas`).
- **Nomenclatura**: PascalCase para componentes, camelCase para hooks e serviços.

### Autenticação (Supabase Auth)
- **Provedores**: Email/Senha e Google OAuth.
- **Fluxo**: Redirecionamento automático para `/dashboard` após login bem-sucedido.
- **Perfil**: Dados básicos sincronizados automaticamente do provedor (Email/Avatar).

### Banco de Dados (PostgreSQL + RLS)
- **Tabelas Iniciais**: `profiles`, `ideas`, `projects`.
- **Privacidade**: RLS ativado em todas as tabelas. Política: `auth.uid() == user_id`.
- **Sincronização Sheets**: Implementada como uma ação manual (botão) no futuro, mas o schema já deve prever o campo de ID externo se necessário.

### UI/UX Base
- **Framework**: Tailwind CSS v4 + Shadcn/UI.
- **Interações**: Uso de Toasts para feedback de autenticação.
</decisions>

<canonical_refs>
## Referências Canônicas
- [.planning/PROJECT.md](file:///c:/Users/lenov/.gemini/001-CRM%20IDEIAS/.planning/PROJECT.md)
- [.planning/REQUIREMENTS.md](file:///c:/Users/lenov/.gemini/001-CRM%20IDEIAS/.planning/REQUIREMENTS.md)
- [.planning/research/STACK.md](file:///c:/Users/lenov/.gemini/001-CRM%20IDEIAS/.planning/research/STACK.md)
</canonical_refs>

<specifics>
## Ideias Específicas
- Utilizar `lucide-react` para todos os ícones.
- Configurar o Supabase Client em um serviço centralizado (`src/services/supabase.ts`).
</specifics>

---
*Fase: 01-fundacao-e-infraestrutura*
*Contexto gerado após discussão inicial*
