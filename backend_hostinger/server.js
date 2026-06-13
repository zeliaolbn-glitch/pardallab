const express = require('express');
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
  } catch (e) {
    console.error('Error sending message:', e);
  }
}

async function answerCallback(callbackId) {
  try {
    await fetch(`https://api.telegram.org/bot${TOKEN}/answerCallbackQuery`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ callback_query_id: callbackId })
    });
  } catch (e) {
    console.error('Error answering callback:', e);
  }
}

// Rota para o Webhook do Telegram
app.post('/webhook', async (req, res) => {
  const body = req.body;
  
  if (body.callback_query) {
    const cb = body.callback_query;
    const chatId = cb.message.chat.id;
    const data = cb.data;

    await answerCallback(cb.id);

    const MENU = {
      inline_keyboard: [
        [{ text: '💡 Nova Ideia', callback_data: 'menu_ideia' }, { text: '✅ Lembrete', callback_data: 'menu_lembrete' }],
        [{ text: '🛠️ Ferramenta', callback_data: 'menu_ferramenta' }, { text: '🛡️ Conta', callback_data: 'menu_conta' }],
        [{ text: '📝 Atualizar Projeto', callback_data: 'menu_update_list' }],
        [{ text: '🔗 Salvar Link', callback_data: 'menu_link' }]
      ]
    };

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
          inline_keyboard: projects.map(p => ([{ text: p.title, callback_data: `upd:${p.id}` }]))
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

  const message = body?.message;
  if (!message?.text) return res.send('OK');

  const chatId = message.chat.id;
  const text = message.text.trim();

  const MENU = {
    inline_keyboard: [
      [{ text: '💡 Nova Ideia', callback_data: 'menu_ideia' }, { text: '✅ Lembrete', callback_data: 'menu_lembrete' }],
      [{ text: '🛠️ Ferramenta', callback_data: 'menu_ferramenta' }, { text: '🛡️ Conta', callback_data: 'menu_conta' }],
      [{ text: '📝 Atualizar Projeto', callback_data: 'menu_update_list' }],
      [{ text: '🔗 Salvar Link', callback_data: 'menu_link' }]
    ]
  };

  if (['oi', 'olá', 'ola', '/start', '/help'].includes(text.toLowerCase())) {
    await send(chatId, '🐦 *Olá! Sou o assistente PardalLab.*\n\nO que deseja fazer?', MENU);
  } else if (text.toLowerCase().startsWith('/ideia')) {
    const t = text.replace(/^\/ideia\s*/i, '').trim();
    if (!t) await send(chatId, '⚠️ Use: `/ideia Sua ideia aqui`');
    else {
      const { error } = await supabase.from('ideas').insert([{ title: t.substring(0, 120), description: t, category: 'Telegram', status: 'pending' }]);
      await send(chatId, error ? `❌ Erro: ${error.message}` : `💡 *Ideia registrada!*`);
    }
  } else if (text.toLowerCase().startsWith('/update')) {
    const t = text.replace(/^\/update\s*/i, '').trim();
    if (!t || !t.includes('|')) await send(chatId, '⚠️ Use: `/update Nome do Projeto | O que atualizar`');
    else {
      const [projectName, ...parts] = t.split('|');
      const content = parts.join('|').trim();
      const { data: projects } = await supabase.from('projects').select('id, title, updates_checklist').ilike('title', `%${projectName.trim()}%`).limit(1);
      if (!projects || projects.length === 0) await send(chatId, `🔍 Projeto "${projectName.trim()}" não encontrado.`);
      else {
        const project = projects[0];
        const newChecklist = [...(project.updates_checklist || []), { id: Date.now().toString(), text: content, completed: false }];
        await supabase.from('projects').update({ updates_checklist: newChecklist }).eq('id', project.id);
        await send(chatId, `✅ *Atualização adicionada!*`);
      }
    }
  } else {
    await send(chatId, '❓ Não entendi. Envie *Oi* para o menu.', MENU);
  }

  res.send('OK');
});

const path = require('path');
app.use(express.static(path.join(__dirname, 'public')));
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});


// Porta padrão para o Node.js na Hostinger costuma ser dinâmica ou 3000
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

