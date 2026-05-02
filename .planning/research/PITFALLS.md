# Pitfalls e Cuidados - IdeaFlow (2025/2026)

## Supabase & PostgreSQL
1.  **RLS Esquecido**: Ativar RLS mas esquecer as políticas (Policies). Resultado: O banco retorna `[]` e parece quebrado.
    - *Ação*: Criar políticas explícitas de `SELECT`, `INSERT`, `UPDATE` vinculadas ao `auth.uid()`.
2.  **Performance de RLS**: Políticas que não usam colunas indexadas causam lentidão extrema.
    - *Ação*: Garantir índices em `user_id` e colunas usadas em filtros de políticas.
3.  **Insert/Select Trap**: No Supabase, para um `INSERT` funcionar com retorno de dados, o usuário precisa de permissão de `INSERT` **E** `SELECT`.
    - *Ação*: Sempre adicionar política de visualização para o próprio usuário.

## Integrações
1.  **Rate Limit do Google Sheets**: Abusar de escritas na planilha pode bloquear o acesso.
    - *Ação*: Implementar debouncing ou enfileiramento via Edge Functions se o volume crescer.
2.  **Latência de IA**: O Lovable AI pode levar segundos para responder.
    - *Ação*: Uso obrigatório de `Skeleton` e estados de loading amigáveis para evitar que a UI pareça travada.

## Frontend
1.  **Zustand vs TanStack Query**: Misturar estado do servidor no Zustand.
    - *Ação*: Usar TanStack Query para TUDO que vem do banco. Usar Zustand apenas para estados efêmeros da UI (modal aberto, tema, etc.).
2.  **Vazamento de Memória em Subscrições**: Esquecer de limpar subscrições Realtime.
    - *Ação*: Sempre retornar a função de `unsubscribe()` no `useEffect`.

---
*Atualizado em: 02/05/2026*
