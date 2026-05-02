# Plano: Fase 1 - Fundação e Infraestrutura

**Fase:** 01
**Slug:** fundacao-e-infraestrutura
**Objetivo:** Estabelecer a base técnica com React, Tailwind, Shadcn e Supabase Auth.

## Requisitos Abrangidos
- AUTH-01 a AUTH-04
- SYNC-01 (Setup Inicial)

## Ondas de Execução

### Onda 1: Setup do Ambiente Frontend
- [ ] **Tarefa 1.1**: Inicializar projeto Vite com React e TypeScript.
- [ ] **Tarefa 1.2**: Configurar Tailwind CSS v4.
- [ ] **Tarefa 1.3**: Inicializar Shadcn/UI e componentes base (Button, Input, Toast).

### Onda 2: Integração Supabase
- [ ] **Tarefa 2.1**: Instalar `@supabase/supabase-js`.
- [ ] **Tarefa 2.2**: Criar serviço centralizado do Supabase Client (`src/services/supabase.ts`).
- [ ] **Tarefa 2.3**: Configurar variáveis de ambiente (`.env.local`).

### Onda 3: Fluxo de Autenticação e Rotas
- [ ] **Tarefa 3.1**: Criar hook customizado `useAuth` para gerenciar estado da sessão.
- [ ] **Tarefa 3.2**: Implementar páginas de Login e Cadastro (com Google OAuth).
- [ ] **Tarefa 3.3**: Configurar `react-router-dom` com rotas protegidas.

## Critérios de Verificação
- [ ] Projeto inicia sem erros (`npm run dev`).
- [ ] Usuário consegue se cadastrar/logar.
- [ ] Sessão persiste após refresh.
- [ ] Rota `/dashboard` é inacessível sem login.

---

## Detalhes das Tarefas

### Tarefa 1.1: Inicializar Projeto
```xml
<task>
  <read_first>
    <file>package.json</file>
  </read_first>
  <action>
    Executar 'npm create vite@latest . -- --template react-ts' e instalar dependências básicas.
  </action>
  <acceptance_criteria>
    - package.json existe com vite e react.
    - 'npm run dev' inicia o servidor local.
  </acceptance_criteria>
</task>
```

### Tarefa 2.2: Supabase Client
```xml
<task>
  <read_first>
    <file>src/services/supabase.ts</file>
  </read_first>
  <action>
    Criar o arquivo src/services/supabase.ts exportando o cliente inicializado com as env vars VITE_SUPABASE_URL e VITE_SUPABASE_ANON_KEY.
  </action>
  <acceptance_criteria>
    - Arquivo exporta 'supabase'.
    - Tipos do Supabase estão configurados (se disponíveis).
  </acceptance_criteria>
</task>
```

### Tarefa 3.2: Login Page
```xml
<task>
  <read_first>
    <file>src/features/auth/LoginPage.tsx</file>
  </read_first>
  <action>
    Criar página de login usando componentes Shadcn, integrando com supabase.auth.signInWithPassword e signInWithOAuth (Google).
  </action>
  <acceptance_criteria>
    - Botão de login com Google presente.
    - Formulário de email/senha funcional.
  </acceptance_criteria>
</task>
```
