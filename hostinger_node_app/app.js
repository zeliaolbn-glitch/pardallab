const express = require('express');
const path = require('path');
const { createClient } = require('@supabase/supabase-js');
const dotenv = require('dotenv');

dotenv.config();

const app = express();
app.use(express.json());

const TOKEN = process.env.TELEGRAM_BOT_TOKEN;
const SUPABASE_URL = process.env.SUPABASE_URL;
const SUPABASE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY;

const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);

// Função para enviar mensagem ao Telegram
async function send(chatId, text, replyMarkup) {
  const payload = { chat_id: chatId, text, parse_mode: 'Markdown' };
  if (replyMarkup) payload.reply_markup = replyMarkup;
  try {
    const res = await fetch(`https://api.telegram.org/bot${TOKEN}/sendMessage`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    });
    return await res.json();
  } catch (e) { console.error('Telegram error:', e); }
}

// Confirma clique no botão
async function answerCallback(callbackId) {
  try {
    await fetch(`https://api.telegram.org/bot${TOKEN}/answerCallbackQuery`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ callback_query_id: callbackId })
    });
  } catch (e) { console.error('Callback error:', e); }
}

const MENU_PRINCIPAL = {
  inline_keyboard: [
    [{ text: '💡 Nova Ideia', callback_data: 'menu_ideia' }, { text: '✅ Lembrete', callback_data: 'menu_lembrete' }],
    [{ text: '🛠️ Ferramenta', callback_data: 'menu_ferramenta' }, { text: '🛡️ Conta', callback_data: 'menu_conta' }],
    [{ text: '📝 Atualizar Projeto', callback_data: 'menu_update_list' }],
    [{ text: '🔗 Salvar Link', callback_data: 'menu_link' }]
  ]
};

// ─── WEBHOOK DO TELEGRAM ───────────────────────────────────────────────────
app.post('/webhook', async (req, res) => {
  const body = req.body;

  // 1. Cliques em Botões
  if (body.callback_query) {
    const cb = body.callback_query;
    const chatId = cb.message.chat.id;
    const data = cb.data;

    await answerCallback(cb.id);

    if (data === 'menu_ideia') {
      await send(chatId, '💡 *Nova Ideia*\n\nDigite:\n`/ideia Sua ideia aqui`');
    } else if (data === 'menu_lembrete') {
      await send(chatId, '✅ *Novo Lembrete*\n\nDigite:\n`/lembrete Sua tarefa aqui`');
    } else if (data === 'menu_ferramenta') {
      await send(chatId, '🛠️ *Nova Ferramenta*\n\nDigite:\n`/ferramenta Nome | Função`');
    } else if (data === 'menu_conta') {
      await send(chatId, '🛡️ *Novo Cadastro*\n\nDigite:\n`/conta Plataforma | Usuario | Notas`');
    } else if (data === 'menu_link') {
      await send(chatId, '🔗 *Salvar Link*\n\nDigite:\n`/link https://url.com Descrição`');
    } else if (data === 'menu_update_list') {
      const { data: projects } = await supabase.from('projects').select('id, title').order('created_at', { ascending: false }).limit(8);
      if (!projects || projects.length === 0) {
        await send(chatId, '🔍 Nenhum projeto encontrado.');
      } else {
        await send(chatId, '📂 *Selecione o projeto para atualizar:*', {
          inline_keyboard: projects.map(p => ([{
            text: p.title.substring(0, 40),
            callback_data: `upd:${p.id}`
          }]))
        });
      }
    } else if (data.startsWith('upd:')) {
      const projId = data.replace('upd:', '');
      const { data: proj } = await supabase.from('projects').select('id, title').eq('id', projId).single();
      const projTitle = proj?.title || 'Projeto';
      await send(chatId, `✍️ *Projeto:* ${projTitle}\n\nAgora envie:\n\`/update ${projTitle} | o que atualizar\``);
    }
    return res.send('OK');
  }

  // 2. Mensagens de Texto
  const message = body?.message;
  if (!message?.text) return res.send('OK');

  const chatId = message.chat.id;
  const text = message.text.trim();

  if (['oi', 'olá', 'ola', '/start', '/menu'].includes(text.toLowerCase())) {
    await send(chatId, '🐦 *Olá! Sou o assistente PardalLab.*\n\nO que deseja fazer?', MENU_PRINCIPAL);
    return res.send('OK');
  }

  if (text.toLowerCase().startsWith('/ideia')) {
    const t = text.replace(/^\/ideia\s*/i, '').trim();
    if (!t) await send(chatId, '⚠️ Use: `/ideia Sua ideia`');
    else {
      const { error } = await supabase.from('ideas').insert([{ title: t.substring(0, 120), description: t, category: 'Telegram', status: 'pending' }]);
      await send(chatId, error ? `❌ Erro: ${error.message}` : `💡 *Ideia registrada!*`);
    }
  } else if (text.toLowerCase().startsWith('/lembrete')) {
    const t = text.replace(/^\/lembrete\s*/i, '').trim();
    if (!t) await send(chatId, '⚠️ Use: `/lembrete Sua tarefa`');
    else {
      const { error } = await supabase.from('reminders').insert([{ content: t, completed: false }]);
      await send(chatId, error ? `❌ Erro: ${error.message}` : `✅ *Lembrete adicionado!*`);
    }
  } else if (text.toLowerCase().startsWith('/update')) {
    const t = text.replace(/^\/update\s*/i, '').trim();
    if (!t || !t.includes('|')) await send(chatId, '⚠️ Use: `/update Nome do Projeto | Atualização`');
    else {
      const [projectName, ...parts] = t.split('|');
      const content = parts.join('|').trim();
      const { data: projects } = await supabase.from('projects').select('id, title, updates_checklist').ilike('title', `%${projectName.trim()}%`).limit(1);
      if (!projects || projects.length === 0) await send(chatId, `🔍 Projeto "${projectName.trim()}" não encontrado.`);
      else {
        const project = projects[0];
        const newChecklist = [...(project.updates_checklist || []), { id: Date.now().toString(), text: content, completed: false }];
        await supabase.from('projects').update({ updates_checklist: newChecklist }).eq('id', project.id);
        await send(chatId, `✅ *Atualização adicionada ao projeto:* ${project.title}`);
      }
    }
  } else if (text.toLowerCase().startsWith('/link')) {
    const t = text.replace(/^\/link\s*/i, '').trim();
    const urlMatch = t.match(/(https?:\/\/[^\s]+)/);
    if (!urlMatch) await send(chatId, '⚠️ Use: `/link https://url.com Descrição`');
    else {
      const url = urlMatch[1];
      const desc = t.replace(url, '').trim() || 'Link via Telegram';
      await supabase.from('standalone_links').insert([{ url, title: desc.substring(0, 100), summary: desc, main_function: 'draft', tool: 'Telegram' }]);
      await send(chatId, `🔗 *Link salvo como rascunho!*`);
    }
  } else if (text.toLowerCase().startsWith('/ferramenta')) {
    const t = text.replace(/^\/ferramenta\s*/i, '').trim();
    const [name, ...fn] = t.split('|');
    if (!name) await send(chatId, '⚠️ Use: `/ferramenta Nome | Função`');
    else {
      await supabase.from('tools').insert([{ name: name.trim(), main_function: fn.join('|').trim() || 'Bot', category: 'Telegram' }]);
      await send(chatId, `🛠️ *Ferramenta registrada!*`);
    }
  } else if (text.toLowerCase().startsWith('/conta')) {
    const t = text.replace(/^\/conta\s*/i, '').trim();
    const [p, u, r] = t.split('|').map(s => s.trim());
    if (!p) await send(chatId, '⚠️ Use: `/conta Plataforma | Usuario | Notas`');
    else {
      await supabase.from('account_registrations').insert([{ platform: p, user_account: u || '', reminder: r || '', bot_alert: true }]);
      await send(chatId, `🛡️ *Conta registrada em Cadastros!*`);
    }
  } else {
    await send(chatId, '❓ Não entendi. Envie *Oi* para ver o menu.', MENU_PRINCIPAL);
  }

  res.send('OK');
});

// ─── SERVIR O SITE ─────────────────────────────────────────────────────────
app.use(express.static(path.join(__dirname, 'public')));
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => { console.log(`Server running on port ${PORT}`); });
