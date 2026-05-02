# Requirements: IdeaFlow

**Definição:** 02/05/2026
**Valor Central:** Transformar ideias abstratas em projetos concretos através de um fluxo de trabalho estruturado e assistido por IA.

## Requisitos v1 (MVP)

Requisitos para o lançamento inicial. Cada um mapeia para as fases do roadmap.

### Autenticação (AUTH)
- [ ] **AUTH-01**: Usuário pode se cadastrar com email e senha.
- [ ] **AUTH-02**: Usuário pode fazer login com Google OAuth via Supabase.
- [ ] **AUTH-03**: A sessão do usuário persiste após o refresh do navegador.
- [ ] **AUTH-04**: O acesso aos dados é protegido por Row Level Security (RLS).

### Dashboard e Navegação (DASH)
- [ ] **DASH-01**: Landing page com Hero, CTA e menu de navegação responsivo.
- [ ] **DASH-02**: Sidebar fixa (desktop) e hambúrguer (mobile) com ícones Lucide React.
- [ ] **DASH-03**: Dashboard com cards de resumo (contagem de ideias, projetos e ferramentas sugeridas).
- [ ] **DASH-04**: Estados de carregamento visual com Skeleton components.

### Gestão de Ideias (IDEA)
- [ ] **IDEA-01**: Usuário pode criar "Posts Pequenos" via Dialog modal.
- [ ] **IDEA-02**: Upload de "Pequena Logo" para cada ideia.
- [ ] **IDEA-03**: Lista de ideias com busca e resumo visual.
- [ ] **IDEA-04**: Toast de sucesso/erro ao salvar nova ideia.

### Gestão de Projetos (PROJ)
- [ ] **PROJ-01**: Criação de projetos a partir de ideias ou do zero.
- [ ] **PROJ-02**: Atualização de status seguindo o funil (IDEIA -> APK).
- [ ] **PROJ-03**: Associação de links (vídeos, ferramentas) a projetos específicos.
- [ ] **PROJ-04**: Empty states motivadores para listas vazias.

### Catálogo de Ferramentas (TOOL)
- [ ] **TOOL-01**: Exibição de cards de ferramentas com nome, descrição, ícone e link oficial.
- [ ] **TOOL-02**: Filtros básicos por categoria de ferramenta.

### Tutoriais (TUTR)
- [ ] **TUTR-01**: Galeria de cards com miniaturas e títulos de tutoriais.
- [ ] **TUTR-02**: Visualização de vídeos via iframe ou link direto.

### IA Assistente (AIAS)
- [ ] **AIAS-01**: Interface de chat/modal para interagir com Lovable AI.
- [ ] **AIAS-02**: Envio de contexto do projeto atual para a IA receber sugestões personalizadas.

### Conectividade Social (CONN)
- [ ] **CONN-01**: Botão de contato rápido via WhatsApp com mensagem pré-formatada.
- [ ] **CONN-02**: Botão de contato rápido via Telegram com mensagem pré-formatada.

### Sincronização e Backend (SYNC)
- [ ] **SYNC-01**: Persistência de todos os dados no Supabase.
- [ ] **SYNC-02**: Integração básica com Google Sheets para visualização externa dos dados.

## Requisitos v2 (Futuro)
- **COLL-01**: Compartilhamento de ideias com outros usuários para feedback.
- **NOTF-01**: Sistema de notificações push para mudanças de status.
- **PLAN-01**: Plano de assinatura/monetização para recursos premium.

## Fora de Escopo
| Recurso | Razão |
|---------|--------|
| Editor de Vídeo Interno | Alta complexidade, usar links externos (YouTube/Vimeo) é suficiente. |
| Chat em Tempo Real | Foco inicial é gestão, não comunicação instantânea multi-usuário. |
| App Mobile Nativo | Foco em Web Responsiva (PWA) para agilidade no v1. |

## Rastreabilidade (Traceability)

| Requisito | Fase | Status |
|-------------|-------|--------|
| AUTH-01 a 04 | Fase 1 | Pendente |
| SYNC-01 | Fase 1 | Pendente |
| DASH-01 a 02 | Fase 2 | Pendente |
| DASH-03 a 04 | Fase 3 | Pendente |
| IDEA-01 a 04 | Fase 3 | Pendente |
| PROJ-01 a 04 | Fase 3 | Pendente |
| AIAS-01 a 02 | Fase 4 | Pendente |
| CONN-01 a 02 | Fase 4 | Pendente |
| TOOL-01 a 02 | Fase 5 | Pendente |
| TUTR-01 a 02 | Fase 5 | Pendente |
| SYNC-02 | Fase 5 | Pendente |

**Cobertura:**
- v1 requirements: 26 total
- Mapeado para fases: 26
- Não mapeado: 0 ✓

---
*Requirements definidos: 02/05/2026*
*Última atualização: 02/05/2026 após definição inicial*
