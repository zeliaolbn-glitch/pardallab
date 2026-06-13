import { useAuth } from '@/features/auth/hooks/useAuth'
import { useIdeas } from '@/features/ideas/hooks/useIdeas'
import { useProjects } from '@/features/projects/hooks/useProjects'
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card'
import { Lightbulb, Briefcase, CheckCircle2, FileSpreadsheet, Moon, Sun, Pencil, Check } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Notepad } from '@/components/dashboard/Notepad';
import { QuickReminders } from '@/components/dashboard/QuickReminders'
import { exportToCsv } from '@/lib/export'
import { toast } from 'sonner'
import { useTheme } from '@/contexts/ThemeContext'
import { useStandaloneLinks } from '@/features/support/hooks/useStandaloneLinks'
import { useState, useEffect } from 'react'
import { Loader2, Link2 } from 'lucide-react'

export default function Dashboard() {
  const { user } = useAuth()
  const { ideas } = useIdeas()
  const { projects } = useProjects()
  const { toggleTheme, isDark } = useTheme()
  const { createLink } = useStandaloneLinks()

  const [displayName, setDisplayName] = useState(() => localStorage.getItem('pardallab_username') || '')
  const [editingName, setEditingName] = useState(false)
  const [tempName, setTempName] = useState('')
  const [quickLink, setQuickLink] = useState('')
  const [isSavingLink, setIsSavingLink] = useState(false)

  const handleQuickLink = async (url: string) => {
    if (!url || !url.includes('http')) return
    setIsSavingLink(true)
    try {
      // Salva como rascunho (main_function: 'draft')
      await createLink({
        url,
        title: 'Link Detectado',
        main_function: 'draft',
        tool: 'Dashboard Quick Add',
        summary: 'Detectado automaticamente pelo Dashboard.'
      })
      toast.success('Link de vídeo detectado e salvo em Rascunhos!')
      setQuickLink('')
    } catch (e) {
      toast.error('Erro ao salvar link automático.')
    } finally {
      setIsSavingLink(false)
    }
  }

  // Detecta se o que foi colado é um link de vídeo
  useEffect(() => {
    const isVideo = quickLink.includes('youtube.com') || quickLink.includes('youtu.be') || quickLink.includes('vimeo.com')
    if (isVideo && quickLink.length > 10) {
      handleQuickLink(quickLink)
    }
  }, [quickLink])

  // Se não tem nome salvo, entra no modo de edição automaticamente
  useEffect(() => {
    if (!displayName) setEditingName(true)
  }, [displayName])

  const saveName = () => {
    if (!tempName.trim()) return
    localStorage.setItem('pardallab_username', tempName.trim())
    setDisplayName(tempName.trim())
    setEditingName(false)
    toast.success(`Ótimo! Vou te chamar de ${tempName.trim()} 🐦`)
  }

  const handleExport = () => {
    try {
      if (ideas.length > 0) exportToCsv(ideas, 'ideiaflow_ideias')
      if (projects.length > 0) exportToCsv(projects, 'ideiaflow_projetos')
      toast.success('Dados exportados!')
    } catch {
      toast.error('Erro ao exportar.')
    }
  }

  const activeIdeas = ideas.filter(i => i.status === 'pending').length
  const activeProjects = projects.filter(p => p.status !== 'APP WINDOWS/APK' && p.status !== 'IMPLEMENTAÇÃO WEB').length
  const completedProjects = projects.filter(p => p.status === 'APP WINDOWS/APK' || p.status === 'IMPLEMENTAÇÃO WEB').length

  const greeting = displayName ? `Olá, ${displayName}! 👋` : `Olá, ${user?.email?.split('@')[0]}! 👋`

  return (
    <div className="space-y-8">
      {/* Header com nome e dark mode */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          {editingName ? (
            <div className="flex items-center gap-2 animate-in slide-in-from-left duration-300">
              <div className="space-y-1">
                <p className="text-sm font-medium text-slate-500">Como gostaria de ser chamado?</p>
                <div className="flex gap-2">
                  <Input
                    autoFocus
                    placeholder="Seu nome ou apelido..."
                    value={tempName}
                    onChange={e => setTempName(e.target.value)}
                    onKeyDown={e => e.key === 'Enter' && saveName()}
                    className="h-10 w-64 text-lg font-bold border-2 border-blue-200 focus:border-blue-500"
                  />
                  <Button size="icon" className="h-10 w-10 bg-blue-600" onClick={saveName} disabled={!tempName.trim()}>
                    <Check className="h-5 w-5" />
                  </Button>
                </div>
              </div>
            </div>
          ) : (
            <div className="group flex items-center gap-2">
              <div>
                <h1 className="text-3xl font-bold tracking-tight dark:text-white">{greeting}</h1>
                <p className="text-gray-500 dark:text-gray-400">Seu caos criativo organizado.</p>
              </div>
              <Button
                size="icon"
                variant="ghost"
                className="h-7 w-7 opacity-0 group-hover:opacity-100 transition-opacity text-slate-400 hover:text-blue-500"
                onClick={() => { setTempName(displayName); setEditingName(true) }}
              >
                <Pencil className="h-4 w-4" />
              </Button>
            </div>
          )}
        </div>

        <div className="flex items-center gap-2">
          {/* Toggle Dark Mode */}
          <Button
            variant="outline"
            size="icon"
            onClick={toggleTheme}
            className="h-10 w-10 border-slate-200 dark:border-slate-700 dark:bg-slate-800 dark:text-yellow-400"
            title={isDark ? 'Modo Claro' : 'Modo Escuro'}
          >
            {isDark ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
          </Button>

          <Button variant="outline" className="border-green-200 text-green-700 hover:bg-green-50" onClick={handleExport}>
            <FileSpreadsheet className="mr-2 h-4 w-4" /> Exportar CSV
          </Button>
        </div>
      </div>

      {/* Cards de estatísticas */}
      <div className="grid gap-4 md:grid-cols-3">
        <Card className="border-none shadow-md dark:bg-slate-800 dark:border-slate-700">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium dark:text-slate-300">Ideias Ativas</CardTitle>
            <Lightbulb className="h-4 w-4 text-blue-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold dark:text-white">{activeIdeas}</div>
            <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">Prontas para decolar</p>
          </CardContent>
        </Card>

        <Card className="border-none shadow-md dark:bg-slate-800 dark:border-slate-700">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium dark:text-slate-300">Em Execução</CardTitle>
            <Briefcase className="h-4 w-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold dark:text-white">{activeProjects}</div>
            <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">Transformando em realidade</p>
          </CardContent>
        </Card>

        <Card className="border-none shadow-md dark:bg-slate-800 dark:border-slate-700">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium dark:text-slate-300">Concluídos</CardTitle>
            <CheckCircle2 className="h-4 w-4 text-purple-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold dark:text-white">{completedProjects}</div>
            <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">Missão cumprida</p>
          </CardContent>
        </Card>
      </div>

      {/* Welcome card com logo e Bloco de Notas */}
      <div className="grid gap-6 md:grid-cols-2">
        <div className="rounded-xl border border-dashed border-slate-200 dark:border-slate-700 p-8 text-center bg-white dark:bg-slate-800/50 shadow-sm flex flex-col items-center justify-center">
          <img
            src="/logo.png"
            alt="PardalLab"
            className="h-28 w-28 object-contain mb-4 drop-shadow-md"
            onError={(e) => (e.currentTarget.style.display = 'none')}
          />
          <h3 className="text-2xl font-bold text-slate-800 dark:text-white">
            Bem-vindo ao PardalLab{displayName ? `, ${displayName}` : ''}!
          </h3>
          <p className="text-slate-500 dark:text-slate-400 mt-2 max-w-md mx-auto">
            Capture ideias, gerencie projetos e evolua com inteligência.
          </p>

          <div className="mt-6 w-full max-w-sm">
            <div className="relative group">
              <div className="absolute inset-y-0 left-3 flex items-center pointer-events-none">
                {isSavingLink ? <Loader2 className="h-4 w-4 animate-spin text-blue-500" /> : <Link2 className="h-4 w-4 text-slate-400 group-focus-within:text-blue-500 transition-colors" />}
              </div>
              <Input 
                placeholder="Cole um link de vídeo aqui..." 
                className="pl-10 bg-slate-50 border-slate-200 focus:bg-white transition-all shadow-inner"
                value={quickLink}
                onChange={(e) => setQuickLink(e.target.value)}
                disabled={isSavingLink}
              />
              <div className="absolute right-2 top-1.2 flex items-center h-full">
                <span className="text-[10px] font-bold text-slate-300 bg-white px-1.5 py-0.5 rounded border border-slate-100">AUTO-DRAFT</span>
              </div>
            </div>
          </div>
        </div>

        <QuickReminders />
      </div>
    </div>
  )
}
