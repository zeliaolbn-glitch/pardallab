# Padrões de Arquitetura - IdeaFlow (2025/2026)

## Organização de Código (Feature-First)
Para garantir escalabilidade, o código será organizado por domínios de negócio, não por tipos técnicos.

```
src/
├── components/
│   ├── ui/          # Componentes shadcn (propriedade do projeto)
│   └── shared/      # Layouts, Header, Footer
├── features/
│   ├── auth/        # Login, Profile, RLS Context
│   ├── dashboard/   # Resumos e Widgets
│   ├── ideas/       # Feed de ideias, modal de criação
│   ├── projects/    # Listagem, funil de status
│   └── ai-assist/   # Interface Lovable AI
├── services/        # supabaseClient, googleSheetsService
├── hooks/           # custom hooks globais (ex: useAuth)
├── store/           # Zustand store (client-state)
└── types/           # Interfaces TS (DB e Domain)
```

## Estratégia de Dados
1.  **Camada de Serviço Centralizada**: Interações com o Supabase devem estar em arquivos dedicados em `src/services/`, nunca espalhadas diretamente nos componentes.
2.  **Sincronização com Google Sheets**:
    - Fluxo: App -> Supabase -> Edge Function -> Google Sheets.
    - O Supabase atua como o banco de "quente" (performance), o Google Sheets como backup/planilha de gestão amigável.
3.  **Real-time**: Usar Supabase Realtime para atualizar o contador de ideias/projetos no dashboard sem refresh.

## Segurança e Performance
- **RLS (Row Level Security)**: Ativado por padrão em todas as tabelas. Usuários só veem/editam suas próprias ideias e projetos.
- **TanStack Query**: Usado para gerenciar o estado do servidor, garantindo que os dados estejam sempre atualizados com o mínimo de chamadas de rede.

---
*Atualizado em: 02/05/2026*
