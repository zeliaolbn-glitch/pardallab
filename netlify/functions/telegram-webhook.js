// Netlify Function: telegram-webhook.js
const { createClient } = require('@supabase/supabase-js')

const TOKEN = process.env.TELEGRAM_BOT_TOKEN
const SUPABASE_URL = process.env.SUPABASE_URL
const SUPABASE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY

// Envia mensagem ao Telegram
async function send(chatId, text, replyMarkup) {
  const payload = { chat_id: chatId, text, parse_mode: 'Markdown' }
  if (replyMarkup) payload.reply_markup = replyMarkup

  const res = await fetch(`https://api.telegram.org/bot${TOKEN}/sendMessage`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload)
  })
  const json = await res.json()
  if (!json.ok) console.error('Telegram sendMessage error:', JSON.stringify(json))
  return json
}

// Confirma clique no botão (obrigatório para o Telegram parar de esperar)
async function answerCallback(callbackId) {
  await fetch(`https://api.telegram.org/bot${TOKEN}/answerCallbackQuery`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ callback_query_id: callbackId })
  })
}

exports.handler = async (event) => {
  if (event.httpMethod !== 'POST') {
    return { statusCode: 405, body: 'Method Not Allowed' }
  }

  if (!TOKEN || !SUPABASE_URL || !SUPABASE_KEY) {
    console.error('Missing env vars')
    return { statusCode: 500, body: 'Server misconfigured' }
  }

  let body
  try {
    body = JSON.parse(event.body)
    console.log('PAYLOAD:', JSON.stringify(body))
  } catch (e) {
    return { statusCode: 200, body: 'OK' }
  }

  const supabase = createClient(SUPABASE_URL, SUPABASE_KEY)

  // ─── BOTÕES (callback_query) ───────────────────────────────────────────────
  if (body.callback_query) {
    const cb = body.callback_query
    const chatId = cb.message.chat.id
    const data = cb.data

    await answerCallback(cb.id)

    const MENU = {
      inline_keyboard: [
        [{ text: '💡 Nova Ideia', callback_data: 'menu_ideia' }, { text: '✅ Lembrete', callback_data: 'menu_lembrete' }],
        [{ text: '🛠️ Ferramenta', callback_data: 'menu_ferramenta' }, { text: '🛡️ Conta', callback_data: 'menu_conta' }],
        [{ text: '📝 Atualizar Projeto', callback_data: 'menu_update_list' }],
        [{ text: '🔗 Salvar Link', callback_data: 'menu_link' }]
      ]
    }

    if (data === 'menu_ideia') {
      await send(chatId, '💡 *Nova Ideia*\n\nDigite:\n`/ideia Sua ideia aqui`')

    } else if (data === 'menu_lembrete') {
      await send(chatId, '✅ *Novo Lembrete*\n\nDigite:\n`/lembrete Sua tarefa aqui`')

    } else if (data === 'menu_ferramenta') {
      await send(chatId, '🛠️ *Nova Ferramenta*\n\nDigite:\n`/ferramenta Nome | Função`')

    } else if (data === 'menu_conta') {
      await send(chatId, '🛡️ *Novo Cadastro*\n\nDigite:\n`/conta Plataforma | Usuario | Notas`')

    } else if (data === 'menu_link') {
      await send(chatId, '🔗 *Salvar Link*\n\nDigite:\n`/link https://url.com Descrição`')

    } else if (data === 'menu_update_list') {
      const { data: projects, error: projError } = await supabase
        .from('projects')
        .select('id, title')
        .order('created_at', { ascending: false })
        .limit(8)

      console.log('PROJECTS QUERY:', JSON.stringify({ projects, error: projError }))

      if (projError) {
        await send(chatId, `❌ Erro ao buscar projetos: ${projError.message}`)
      } else if (!projects || projects.length === 0) {
        await send(chatId, '🔍 Nenhum projeto encontrado no banco.')
      } else {
        // callback_data tem limite de 64 bytes: 'upd:'(4) + UUID(36) = 40 bytes - OK
        const sendResult = await send(chatId, '📂 *Selecione o projeto para atualizar:*', {
          inline_keyboard: projects.map(p => ([{
            text: p.title.substring(0, 40),
            callback_data: `upd:${p.id}`
          }]))
        })
        console.log('SEND BUTTONS RESULT:', JSON.stringify(sendResult))
      }

    } else if (data.startsWith('upd:')) {
      const projId = data.replace('upd:', '')
      const { data: proj } = await supabase
        .from('projects').select('id, title').eq('id', projId).single()
      const projTitle = proj?.title || 'Projeto'
      await send(chatId, `✍️ *Projeto:* ${projTitle}\n\nAgora envie:\n\`/update ${projTitle} | o que atualizar\``)

    } else {
      await send(chatId, '❓ Opção não reconhecida.', MENU)
    }

    return { statusCode: 200, body: 'OK' }
  }

  // ─── MENSAGENS DE TEXTO ────────────────────────────────────────────────────
  const message = body?.message
  if (!message?.text) return { statusCode: 200, body: 'OK' }

  const chatId = message.chat.id
  const text = message.text.trim()

  const MENU = {
    inline_keyboard: [
      [{ text: '💡 Nova Ideia', callback_data: 'menu_ideia' }, { text: '✅ Lembrete', callback_data: 'menu_lembrete' }],
      [{ text: '🛠️ Ferramenta', callback_data: 'menu_ferramenta' }, { text: '🛡️ Conta', callback_data: 'menu_conta' }],
      [{ text: '📝 Atualizar Projeto', callback_data: 'menu_update_list' }],
      [{ text: '🔗 Salvar Link', callback_data: 'menu_link' }]
    ]
  }

  // Saudações → abre menu
  if (['oi', 'olá', 'ola', 'hi', 'hello', '/start', '/help', '/menu'].includes(text.toLowerCase())) {
    await send(chatId, '🐦 *Olá! Sou o assistente PardalLab.*\n\nO que deseja fazer?', MENU)
    return { statusCode: 200, body: 'OK' }
  }

  // /ideia
  if (text.toLowerCase().startsWith('/ideia')) {
    const t = text.replace(/^\/ideia\s*/i, '').trim()
    if (!t) return await send(chatId, '⚠️ Use: `/ideia Sua ideia aqui`') && { statusCode: 200, body: 'OK' }
    const { error } = await supabase.from('ideas').insert([{ title: t.substring(0, 120), description: t, category: 'Telegram', status: 'pending' }])
    await send(chatId, error ? `❌ Erro: ${error.message}` : `💡 *Ideia registrada!*\n\n_"${t.substring(0, 100)}"_`)
    return { statusCode: 200, body: 'OK' }
  }

  // /lembrete
  if (text.toLowerCase().startsWith('/lembrete')) {
    const t = text.replace(/^\/lembrete\s*/i, '').trim()
    if (!t) return await send(chatId, '⚠️ Use: `/lembrete Sua tarefa`') && { statusCode: 200, body: 'OK' }
    const { error } = await supabase.from('reminders').insert([{ content: t, completed: false }])
    await send(chatId, error ? `❌ Erro: ${error.message}` : `✅ *Lembrete adicionado!*\n\n_"${t.substring(0, 100)}"_`)
    return { statusCode: 200, body: 'OK' }
  }

  // /link
  if (text.toLowerCase().startsWith('/link')) {
    const t = text.replace(/^\/link\s*/i, '').trim()
    const urlMatch = t.match(/(https?:\/\/[^\s]+)/)
    if (!urlMatch) {
      await send(chatId, '⚠️ Use: `/link https://youtube.com/... Descrição`')
      return { statusCode: 200, body: 'OK' }
    }
    const url = urlMatch[1]
    const description = t.replace(url, '').trim() || 'Link via Telegram'
    const { error } = await supabase.from('standalone_links').insert([{ url, title: description.substring(0, 100), summary: description, main_function: 'draft', tool: 'Telegram' }])
    await send(chatId, error ? `❌ Erro: ${error.message}` : `🔗 *Link salvo!*\n\n${url}`)
    return { statusCode: 200, body: 'OK' }
  }

  // /ferramenta
  if (text.toLowerCase().startsWith('/ferramenta')) {
    const t = text.replace(/^\/ferramenta\s*/i, '').trim()
    if (!t) {
      await send(chatId, '⚠️ Use: `/ferramenta Nome | Função`')
      return { statusCode: 200, body: 'OK' }
    }
    const [name, ...fnParts] = t.split('|')
    const fn = fnParts.join('|').trim() || 'Via Telegram'
    const { error } = await supabase.from('tools').insert([{ name: name.trim(), main_function: fn, category: 'Telegram', description: 'Inserido via bot' }])
    await send(chatId, error ? `❌ Erro: ${error.message}` : `🛠️ *Ferramenta registrada!*\n\nNome: ${name.trim()}\nFunção: ${fn}`)
    return { statusCode: 200, body: 'OK' }
  }

  // /conta
  if (text.toLowerCase().startsWith('/conta')) {
    const t = text.replace(/^\/conta\s*/i, '').trim()
    if (!t) {
      await send(chatId, '⚠️ Use: `/conta Plataforma | Usuario | Notas`')
      return { statusCode: 200, body: 'OK' }
    }
    const [platform, user_account, reminder] = t.split('|').map(s => s.trim())
    const { error } = await supabase.from('account_registrations').insert([{ platform: platform || 'Telegram', user_account: user_account || 'N/A', reminder: reminder || '', bot_alert: true }])
    await send(chatId, error ? `❌ Erro: ${error.message}` : `🛡️ *Conta registrada!*\n\nPlataforma: ${platform}\nUsuário: ${user_account}`)
    return { statusCode: 200, body: 'OK' }
  }

  // /update
  if (text.toLowerCase().startsWith('/update')) {
    const t = text.replace(/^\/update\s*/i, '').trim()
    if (!t || !t.includes('|')) {
      await send(chatId, '⚠️ Use: `/update Nome do Projeto | O que atualizar`')
      return { statusCode: 200, body: 'OK' }
    }
    const [projectName, ...parts] = t.split('|')
    const content = parts.join('|').trim()
    const { data: projects, error: searchError } = await supabase.from('projects').select('id, title, updates_checklist').ilike('title', `%${projectName.trim()}%`).limit(1)
    if (searchError) {
      await send(chatId, `❌ Erro ao buscar: ${searchError.message}`)
    } else if (!projects || projects.length === 0) {
      await send(chatId, `🔍 Projeto "${projectName.trim()}" não encontrado.`)
    } else {
      const project = projects[0]
      const newChecklist = [...(project.updates_checklist || []), { id: Date.now().toString(), text: content, completed: false }]
      const { error: updateError } = await supabase.from('projects').update({ updates_checklist: newChecklist }).eq('id', project.id)
      await send(chatId, updateError ? `❌ Erro: ${updateError.message}` : `✅ *Atualização adicionada!*\n\nProjeto: ${project.title}\nItem: ${content}`)
    }
    return { statusCode: 200, body: 'OK' }
  }

  // Qualquer outra coisa
  await send(chatId, '❓ Não entendi.\n\nEnvie *Oi* para ver o menu de opções.', MENU)
  return { statusCode: 200, body: 'OK' }
}
