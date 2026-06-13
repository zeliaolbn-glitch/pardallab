import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Database, Download, Upload, ShieldCheck, Lock, UserCog, Bot, Copy, CheckCircle2, ExternalLink } from 'lucide-react'
import { useState } from 'react'
import { toast } from 'sonner'
import { supabase } from '@/lib/supabase'
import { useAuth } from '@/features/auth/hooks/useAuth'
import { ProjectStandardsPanel } from '@/features/projects/components/ProjectStandardsPanel'

export default function SettingsPage() {
  const { updatePassword } = useAuth()
  const [loading, setLoading] = useState(false)
  const [newPassword, setNewPassword] = useState('')
  const [webhookActivating, setWebhookActivating] = useState(false)
  const [settings, setSettings] = useState(() => {
    const saved = localStorage.getItem('ideaflow_settings')
    return saved ? JSON.parse(saved) : {
      telegramToken: '',
      telegramChatId: '',
      geminiApiKey: '',
      autoFillVideoAI: false,
      netlifyUrl: ''
    }
  })

  const saveSettings = () => {
    localStorage.setItem('ideaflow_settings', JSON.stringify(settings))
    toast.success('Configurações salvas!')
    window.location.reload()
  }

  // Ativa o Webhook do Telegram automaticamente
  const activateTelegramWebhook = async () => {
    if (!settings.telegramToken || !settings.netlifyUrl) {
      toast.error('Preencha o Token do Bot e a URL do Netlify antes de ativar.')
      return
    }
    setWebhookActivating(true)
    try {
      const webhookUrl = `${settings.netlifyUrl.replace(/\/$/, '')}/.netlify/functions/telegram-webhook`
      const response = await fetch(
        `https://api.telegram.org/bot${settings.telegramToken}/setWebhook?url=${encodeURIComponent(webhookUrl)}`
      )
      const result = await response.json()
      if (result.ok) {
        toast.success('🤖 Bot do Telegram ativado com sucesso!')
      } else {
        toast.error('Erro: ' + result.description)
      }
    } catch (err) {
      toast.error('Falha ao ativar webhook.')
    } finally {
      setWebhookActivating(false)
    }
  }

  const copyWebhookUrl = () => {
    if (!settings.netlifyUrl) return toast.error('Informe a URL do Netlify primeiro.')
    const url = `${settings.netlifyUrl.replace(/\/$/, '')}/.netlify/functions/telegram-webhook`
    navigator.clipboard.writeText(url)
    toast.success('URL copiada!')
  }

  const handleExportBackup = async () => {
    setLoading(true)
    try {
      const [
        { data: ideas },
        { data: projects },
        { data: tools },
        { data: links },
        { data: glossary },
        { data: reminders },
        { data: tutorials }
      ] = await Promise.all([
        supabase.from('ideas').select('*'),
        supabase.from('projects').select('*'),
        supabase.from('tools').select('*'),
        supabase.from('standalone_links').select('*'),
        supabase.from('glossary').select('*'),
        supabase.from('reminders').select('*'),
        supabase.from('tutorials').select('*')
      ])

      const backupData = {
        version: '3.1-telegram',
        timestamp: new Date().toISOString(),
        settings,
        database: {
          ideas: ideas || [],
          projects: projects || [],
          tools: tools || [],
          standalone_links: links || [],
          glossary: glossary || [],
          reminders: reminders || [],
          tutorials: tutorials || []
        }
      }

      const blob = new Blob([JSON.stringify(backupData, null, 2)], { type: 'application/json' })
      const url = URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.href = url
      a.download = `pardallab_backup_${new Date().toISOString().split('T')[0]}.json`
      a.click()
      toast.success('Backup total gerado!')
    } catch (error) {
      console.error(error)
      toast.error('Falha ao gerar backup.')
    } finally {
      setLoading(false)
    }
  }

  const handleImportBackup = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (!file) return
    const reader = new FileReader()
    reader.onload = async (e) => {
      try {
        const backup = JSON.parse(e.target?.result as string)
        if (!confirm('Restaurar backup? Os dados atuais serão substituídos.')) return
        setLoading(true)
        if (backup.settings) {
          localStorage.setItem('ideaflow_settings', JSON.stringify(backup.settings))
        }
        if (backup.database) {
          const { ideas, projects, tools, standalone_links, glossary, reminders, tutorials } = backup.database
          const DUMMY_UUID = '00000000-0000-0000-0000-000000000000'
          await Promise.all([
            supabase.from('ideas').delete().neq('id', DUMMY_UUID),
            supabase.from('projects').delete().neq('id', DUMMY_UUID),
            supabase.from('tools').delete().neq('id', DUMMY_UUID),
            supabase.from('standalone_links').delete().neq('id', DUMMY_UUID),
            supabase.from('glossary').delete().neq('id', DUMMY_UUID),
            supabase.from('reminders').delete().neq('id', DUMMY_UUID),
            supabase.from('tutorials').delete().neq('id', DUMMY_UUID)
          ])
          if (ideas?.length) await supabase.from('ideas').insert(ideas)
          if (projects?.length) await supabase.from('projects').insert(projects)
          if (tools?.length) await supabase.from('tools').insert(tools)
          if (standalone_links?.length) await supabase.from('standalone_links').insert(standalone_links)
          if (glossary?.length) await supabase.from('glossary').insert(glossary)
          if (reminders?.length) await supabase.from('reminders').insert(reminders)
          if (tutorials?.length) await supabase.from('tutorials').insert(tutorials)
        }
        toast.success('Restauração concluída!')
        setTimeout(() => window.location.reload(), 1000)
      } catch (err) {
        console.error(err)
        toast.error('Erro ao restaurar backup.')
      } finally {
        setLoading(false)
      }
    }
    reader.readAsText(file)
  }

  return (
    <div className="max-w-4xl mx-auto space-y-8 pb-12">
      <div className="flex items-center gap-3 border-b pb-6">
        <Database className="h-10 w-10 text-blue-600" />
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-slate-800">Configurações</h1>
          <p className="text-slate-500">Gerencie APIs, Integrações e Backup do PardalLab.</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

        {/* Passos Padrão de Projeto */}
        <ProjectStandardsPanel />

        {/* Telegram Bot */}
        <Card className="col-span-1 md:col-span-2 border-none shadow-lg ring-2 ring-sky-100 bg-sky-50/20">
          <CardHeader>
            <div className="flex items-center gap-2">
              <Bot className="h-6 w-6 text-sky-500" />
              <CardTitle>Integração com Telegram Bot</CardTitle>
            </div>
            <CardDescription>
              Envie <strong>/ideia</strong> ou <strong>/lembrete</strong> no Telegram para salvar direto no PardalLab.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-5">
            {/* Instruções */}
            <div className="bg-white rounded-xl p-4 border border-sky-100 space-y-2 text-sm">
              <p className="font-bold text-slate-700">📋 Passo a Passo:</p>
              <ol className="list-decimal ml-4 space-y-1 text-slate-600">
                <li>Abra o Telegram e procure por <strong>@BotFather</strong></li>
                <li>Envie <code className="bg-sky-50 px-1 rounded">/newbot</code>, escolha nome e username</li>
                <li>Copie o <strong>Token</strong> fornecido e cole abaixo</li>
                <li>Faça o deploy no Netlify e cole a URL abaixo</li>
                <li>Clique em <strong>"Ativar Webhook"</strong> e pronto! 🎉</li>
              </ol>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Token do Bot Telegram</Label>
                <Input
                  type="password"
                  value={settings.telegramToken}
                  onChange={e => setSettings({...settings, telegramToken: e.target.value})}
                  placeholder="7123456789:AAHxxxxx..."
                  className="bg-white"
                />
              </div>
              <div className="space-y-2">
                <Label>URL do Site (Netlify)</Label>
                <Input
                  value={settings.netlifyUrl}
                  onChange={e => setSettings({...settings, netlifyUrl: e.target.value})}
                  placeholder="https://seu-app.netlify.app"
                  className="bg-white"
                />
              </div>
            </div>

            {/* URL do Webhook */}
            {settings.netlifyUrl && (
              <div className="bg-slate-900 rounded-lg p-3 flex items-center justify-between gap-2">
                <code className="text-xs text-emerald-400 truncate">
                  {settings.netlifyUrl.replace(/\/$/, '')}/.netlify/functions/telegram-webhook
                </code>
                <Button size="icon" variant="ghost" className="h-7 w-7 text-slate-400 hover:text-white shrink-0" onClick={copyWebhookUrl}>
                  <Copy className="h-4 w-4" />
                </Button>
              </div>
            )}

            {/* Comandos do Bot */}
            <div className="bg-slate-800 text-slate-200 rounded-xl p-4 font-mono text-sm space-y-1">
              <p className="text-slate-400 text-xs mb-2">COMANDOS DISPONÍVEIS:</p>
              <p><span className="text-sky-400">/ideia</span> Criar app de agendamento</p>
              <p><span className="text-amber-400">/lembrete</span> Renovar domínio do site</p>
              <p><span className="text-slate-400">/help</span> Ver todos os comandos</p>
            </div>

            <div className="flex gap-3">
              <Button onClick={saveSettings} variant="outline" className="flex-1">
                Salvar Configurações
              </Button>
              <Button
                onClick={activateTelegramWebhook}
                disabled={webhookActivating}
                className="flex-1 bg-sky-500 hover:bg-sky-600 gap-2"
              >
                {webhookActivating ? 'Ativando...' : (
                  <><CheckCircle2 className="h-4 w-4" /> Ativar Webhook</>
                )}
              </Button>
              <Button variant="ghost" size="icon" onClick={() => window.open('https://t.me/BotFather', '_blank')} title="Abrir BotFather">
                <ExternalLink className="h-4 w-4" />
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* APIs */}
        <Card className="border-none shadow-md ring-1 ring-slate-100">
          <CardHeader>
            <div className="flex items-center gap-2">
              <ShieldCheck className="h-5 w-5 text-emerald-500" />
              <CardTitle>APIs</CardTitle>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label>Gemini AI Key</Label>
              <Input
                type="password"
                value={settings.geminiApiKey}
                onChange={e => setSettings({...settings, geminiApiKey: e.target.value})}
                placeholder="AIza..."
              />
            </div>
            <div className="flex items-center gap-2">
              <input 
                type="checkbox" 
                id="autoFillVideoAI"
                checked={settings.autoFillVideoAI || false}
                onChange={e => setSettings({...settings, autoFillVideoAI: e.target.checked})}
                className="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
              />
              <Label htmlFor="autoFillVideoAI" className="cursor-pointer">
                Preencher automaticamente dados de links de vídeo usando IA
              </Label>
            </div>
            <Button onClick={saveSettings} className="w-full bg-blue-600">Salvar</Button>
          </CardContent>
        </Card>

        {/* Minha Conta */}
        <Card className="border-none shadow-md ring-1 ring-slate-100">
          <CardHeader>
            <div className="flex items-center gap-2 text-indigo-500">
              <UserCog className="h-5 w-5" />
              <CardTitle>Minha Conta</CardTitle>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label>Mudar Senha</Label>
              <div className="flex gap-2">
                <Input
                  type="password"
                  value={newPassword}
                  onChange={e => setNewPassword(e.target.value)}
                  placeholder="Nova senha..."
                />
                <Button
                  onClick={() => {
                    if (newPassword.length < 6) return toast.error('Mínimo 6 caracteres')
                    updatePassword(newPassword)
                    setNewPassword('')
                  }}
                  className="bg-indigo-600 shrink-0"
                >
                  <Lock className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Backup */}
        <Card className="col-span-1 md:col-span-2 border-none shadow-lg bg-blue-50/20">
          <CardHeader>
            <CardTitle>Central de Backup Total</CardTitle>
            <CardDescription>Inclui Ideias, Projetos, Glossário, Lembretes e Configurações.</CardDescription>
          </CardHeader>
          <CardContent className="flex flex-col md:flex-row gap-4">
            <Button onClick={handleExportBackup} disabled={loading} className="flex-1 h-16 gap-3 bg-blue-600 shadow-md">
              <Download className="h-5 w-5" /> Exportar Backup Total
            </Button>
            <div className="flex-1 relative">
              <Input type="file" accept=".json" onChange={handleImportBackup} disabled={loading} className="absolute inset-0 opacity-0 z-10 cursor-pointer h-16" />
              <Button variant="outline" disabled={loading} className="w-full h-16 gap-3 border-dashed border-2 border-blue-200">
                <Upload className="h-5 w-5 text-blue-400" /> Restaurar Backup
              </Button>
            </div>
          </CardContent>
        </Card>

      </div>
    </div>
  )
}
