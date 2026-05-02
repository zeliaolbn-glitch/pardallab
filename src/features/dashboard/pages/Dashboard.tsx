import { useAuth } from '@/features/auth/hooks/useAuth'
import { useIdeas } from '@/features/ideas/hooks/useIdeas'
import { useProjects } from '@/features/projects/hooks/useProjects'
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card'
import { Lightbulb, Briefcase, CheckCircle2, FileSpreadsheet } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { exportToCsv } from '@/lib/export'
import { toast } from 'sonner'

export default function Dashboard() {
  const { user } = useAuth()
  const { ideas } = useIdeas()
  const { projects } = useProjects()

  const handleExport = () => {
    try {
      if (ideas.length > 0) exportToCsv(ideas, 'ideiaflow_ideias')
      if (projects.length > 0) exportToCsv(projects, 'ideiaflow_projetos')
      toast.success('Dados exportados com sucesso!')
    } catch (err) {
      toast.error('Erro ao exportar dados.')
    }
  }

  const activeIdeas = ideas.filter(i => i.status === 'active').length
  const activeProjects = projects.filter(p => p.status !== 'completed').length
  const completedProjects = projects.filter(p => p.status === 'completed').length

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Olá, {user?.email?.split('@')[0]}</h1>
          <p className="text-gray-500">Aqui está um resumo do seu caos criativo organizado.</p>
        </div>
        <Button variant="outline" className="border-green-200 text-green-700 hover:bg-green-50" onClick={handleExport}>
          <FileSpreadsheet className="mr-2 h-4 w-4" /> Exportar para Sheets
        </Button>
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        <Card className="border-none shadow-md">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Ideias Ativas</CardTitle>
            <Lightbulb className="h-4 w-4 text-blue-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{activeIdeas}</div>
            <p className="text-xs text-gray-500 mt-1">Insights prontos para decolar</p>
          </CardContent>
        </Card>

        <Card className="border-none shadow-md">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Projetos em Execução</CardTitle>
            <Briefcase className="h-4 w-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{activeProjects}</div>
            <p className="text-xs text-gray-500 mt-1">Transformando sonhos em código</p>
          </CardContent>
        </Card>

        <Card className="border-none shadow-md">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Concluídos</CardTitle>
            <CheckCircle2 className="h-4 w-4 text-purple-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{completedProjects}</div>
            <p className="text-xs text-gray-500 mt-1">Missão cumprida</p>
          </CardContent>
        </Card>
      </div>

      <div className="rounded-xl border border-dashed border-gray-300 p-12 text-center bg-white">
        <h3 className="text-lg font-medium">Bem-vindo ao IdeaFlow!</h3>
        <p className="text-gray-500 mt-2">Comece capturando uma ideia rápida na aba lateral.</p>
      </div>
    </div>
  )
}
