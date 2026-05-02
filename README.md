# IdeaFlow CRM 🚀

**Transforme o caos criativo em projetos de mercado com inteligência artificial.**

IdeaFlow é um CRM minimalista e poderoso projetado para capturar insights rápidos e gerenciá-los através de um fluxo de trabalho estruturado, desde a semente da ideia até a execução final, assistido pelo Google Gemini AI.

![IdeaFlow Preview](https://via.placeholder.com/1200x600/1e3a8a/ffffff?text=IdeaFlow+CRM+v1.0)

## ✨ Funcionalidades

- **Dashboard Inteligente**: Visão geral em tempo real do seu funil de ideias e projetos.
- **Captura de Ideias**: Interface rápida para não deixar nenhum insight escapar.
- **Assistente de IA (Gemini)**: Gere planos de ação, analise desafios e receba sugestões técnicas automaticamente.
- **Conversão Ideia ➔ Projeto**: Transforme conceitos em planos de execução com um único clique.
- **Canais Sociais**: Compartilhe o progresso instantaneamente via WhatsApp e Telegram.
- **Recursos de Apoio**: Catálogo curado de ferramentas e tutoriais em vídeo integrados.
- **Exportação para Google Sheets**: Seus dados sempre sob seu controle via exportação CSV otimizada.

## 🛠️ Stack Tecnológica

- **Frontend**: React + Vite + TypeScript
- **Estilização**: Tailwind CSS v4 + Shadcn/UI (Preset Nova)
- **Estado/Dados**: TanStack Query (React Query)
- **Backend**: Supabase (Auth, Database, RLS)
- **IA**: Google Gemini 1.5 Flash SDK
- **Notificações**: Sonner (Toasts)

## 🚀 Como Rodar Localmente

1. **Clone o repositório**:
   ```bash
   git clone <seu-repositorio>
   cd 001-CRM-IDEIAS
   ```

2. **Instale as dependências**:
   ```bash
   npm install
   ```

3. **Configure as variáveis de ambiente**:
   Crie um arquivo `.env.local` na raiz e preencha com suas credenciais:
   ```env
   VITE_SUPABASE_URL=https://seu-projeto.supabase.co
   VITE_SUPABASE_ANON_KEY=sua-chave-anonima-supabase
   VITE_GEMINI_API_KEY=sua-chave-api-google-gemini
   ```

4. **Inicie o servidor de desenvolvimento**:
   ```bash
   npm run dev
   ```

## 🌐 Deploy (Vercel / Netlify)

O IdeaFlow está pronto para deploy imediato. Recomendamos a **Vercel**:

1. Conecte seu repositório GitHub na Vercel.
2. Adicione as variáveis de ambiente listadas acima nas configurações do projeto.
3. Clique em **Deploy**.

## 📄 Licença

Este projeto é parte do ecossistema de produtividade IdeaFlow. Sinta-se à vontade para expandir e personalizar.

---
Desenvolvido com ❤️ para criadores e visionários.
