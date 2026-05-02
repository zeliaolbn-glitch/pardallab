# IdeaFlow

## O que é este projeto
IdeaFlow é um CRM de ideias e projetos inteligente, desenvolvido para ajudar criadores a organizar, desenvolver e lançar suas ideias de forma profissional. É uma aplicação web responsiva construída com React e Vite, utilizando Tailwind CSS e Shadcn/UI para a interface, e Supabase para o backend e autenticação.

## Valor Central
Transformar ideias abstratas em projetos concretos através de um fluxo de trabalho estruturado e assistido por IA.

## Requisitos

### Validados
(Nenhum ainda — lance para validar)

### Ativos
- [ ] **Landing Page**: Hero impactante, menu de navegação e CTA para início rápido.
- [ ] **Dashboard Principal**: Sidebar com navegação Lucide React e cards de resumo (Ideias, Projetos, Ferramentas).
- [ ] **Gestão de Ideias**: Criação de "Posts Pequenos" com título, descrição e upload de logo via Shadcn/UI Dialog.
- [ ] **Gestão de Projetos**: Listagem e criação de projetos com status específicos (IDEIA, INICIADA, FERRAMENTAS ESCOLHIDAS, etc.).
- [ ] **Catálogo de Ferramentas**: Repositório de ferramentas úteis com descrição e links externos.
- [ ] **Módulo de Tutoriais**: Galeria de vídeos e guias incorporados para aprendizado.
- [ ] **Integração com IA**: Interface para Lovable AI fornecer sugestões personalizadas de abordagem e ferramentas.
- [ ] **Conectividade Social**: Botões de ação rápida para contato via WhatsApp e Telegram com mensagens pré-formatadas.
- [ ] **Infraestrutura de Dados**: Integração com Supabase (Auth + DB) e sincronização opcional com Google Sheets.

### Fora de Escopo
- [ ] **Processamento de Pagamentos**: Não planejado para a fase inicial — foco em organização gratuita.
- [ ] **Colaboração em Tempo Real**: Multi-usuário avançado (edição simultânea) adiado para versões futuras.

## Contexto
O projeto visa resolver a desorganização comum em processos criativos, onde ideias se perdem por falta de um funil claro de desenvolvimento. O uso de Shadcn/UI garante uma interface premium e consistente desde o início.

## Restrições
- **Tech Stack**: React + Vite + Tailwind CSS + Shadcn/UI.
- **Backend**: Supabase (Auth e Banco de Dados Relacional).
- **Tipografia**: Fonte Inter (obrigatória para legibilidade).
- **Cores**: Azul escuro, branco, verde (sucesso) e amarelo (alerta).
- **Performance**: Foco em Core Web Vitals (LCP < 2.5s, INP < 200ms).

## Principais Decisões
| Decisão | Racional | Resultado |
|----------|-----------|---------|
| React + Vite | Performance de desenvolvimento e runtime moderna. | — Pendente |
| Supabase Auth | Facilidade de implementação de login seguro e Google OAuth. | — Pendente |
| Shadcn/UI | Componentes acessíveis, customizáveis e com estética premium. | — Pendente |
| Status de Projeto Granular | Permite rastrear o progresso desde a "Ideia" até o "APK". | — Pendente |

## Evolução
Este documento evolui em transições de fase e marcos do projeto.

**Após cada transição de fase**:
1. Requisitos invalidados? → Mover para Fora de Escopo com motivo.
2. Requisitos validados? → Mover para Validados com referência à fase.
3. Novos requisitos surgiram? → Adicionar aos Ativos.
4. Decisões a registrar? → Adicionar às Principais Decisões.
5. "O que é este projeto" ainda está correto? → Atualizar se houver desvio.

**Após cada marco (Milestone)**:
1. Revisão completa de todas as seções.
2. Verificação do Valor Central — ainda é a prioridade certa?
3. Auditoria de Fora de Escopo — os motivos ainda são válidos?
4. Atualizar Contexto com o estado atual.

---
*Última atualização: 02/05/2026 após inicialização*
