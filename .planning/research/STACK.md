# Stack Tecnológica - IdeaFlow (2025/2026)

## Visão Geral
A stack foi escolhida para maximizar a produtividade, garantir segurança por padrão e permitir escalabilidade com baixo overhead operacional.

## Frontend
- **Framework**: [React 19+](https://react.dev/) com [Vite](https://vitejs.dev/) (TypeScript).
- **Estilização**: [Tailwind CSS v4](https://tailwindcss.com/) (Workflow CSS-first).
- **Componentes UI**: [shadcn/ui](https://ui.shadcn.com/) (Baseado em Radix UI e Lucide React).
- **Gerenciamento de Estado**:
    - **Server State**: [TanStack Query v5](https://tanstack.com/query) (Essencial para caching e sincronização com Supabase).
    - **Client State**: [Zustand](https://github.com/pmndrs/zustand) (Para estados globais leves como filtros e preferências de UI).
- **Ícones**: [Lucide React](https://lucide.dev/).
- **Formulários**: [React Hook Form](https://react-hook-form.com/) + [Zod](https://zod.dev/) para validação.

## Backend & Infraestrutura
- **BaaS**: [Supabase](https://supabase.com/).
    - **Auth**: Supabase Auth (Email/Senha + Google OAuth).
    - **Database**: PostgreSQL com RLS (Row Level Security) ativado.
    - **Storage**: Supabase Storage para logos e assets.
    - **Edge Functions**: Para integrações de IA (Lovable AI/OpenAI).
- **Integração Externa**: Google Sheets API (via Edge Functions para sincronização).

## Ferramentas de Desenvolvimento
- **Type Safety**: Geração automática de tipos TypeScript a partir do schema do Supabase.
- **Linting/Formatting**: ESLint + Prettier.

## O que NÃO usar e por que
- **Redux**: Sobrecarga desnecessária de boilerplate; TanStack Query + Zustand resolvem 100% dos casos.
- **CSS Puro/SASS**: Tailwind oferece maior velocidade e consistência no ecossistema shadcn.
- **Firebase**: Supabase oferece maior flexibilidade com SQL e relacionamentos complexos necessários para um CRM.

## Níveis de Confiança
- **Core Stack (React/Supabase/Tailwind)**: 100% (Padrão de mercado atual).
- **Google Sheets Sync**: 85% (Requer cuidado com limites de taxa da API).
- **Lovable AI Edge Functions**: 90% (Dependente da latência da API de IA).

---
*Atualizado em: 02/05/2026*
