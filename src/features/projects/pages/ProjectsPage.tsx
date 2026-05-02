import { useProjects } from '../hooks/useProjects'
import { Card, CardHeader, CardTitle, CardDescription, CardFooter } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Trash2, FolderGit2, MessageSquare, Send } from 'lucide-react'
import { Skeleton } from '@/components/ui/skeleton'
import { AIAssistantModal } from '../components/AIAssistantModal'
import { getWhatsAppUrl, getTelegramUrl } from '@/lib/social-links'

export default function ProjectsPage() {
  const { projects, isLoading, deleteProject } = useProjects()

  if (isLoading) {
    return (
      <div className="space-y-6">
        <Skeleton className="h-10 w-[200px]" />
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
          {[1, 2, 3].map((i) => (
            <Skeleton key={i} className="h-[200px] w-full rounded-xl" />
          ))}
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold tracking-tight">Projetos</h1>
      </div>

      {projects.length === 0 ? (
        <div className="flex min-h-[400px] flex-col items-center justify-center rounded-lg border-2 border-dashed border-gray-300 bg-white p-12 text-center">
          <FolderGit2 className="h-12 w-12 text-gray-300" />
          <h3 className="mt-4 text-lg font-medium text-gray-900">Nenhum projeto ativo</h3>
          <p className="mt-2 text-gray-500">Transforme suas ideias em projetos reais para começar a gerenciá-los.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
          {projects.map((project) => (
            <Card key={project.id} className="flex flex-col border-none shadow-md">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <Badge className="bg-green-100 text-green-700 hover:bg-green-100">
                    {project.status === 'planning' ? 'Planejamento' : project.status}
                  </Badge>
                  <span className="text-xs text-gray-400">
                    {new Date(project.created_at).toLocaleDateString()}
                  </span>
                </div>
                <CardTitle className="mt-2">{project.title}</CardTitle>
                <CardDescription className="line-clamp-3">
                  {project.description || 'Sem descrição.'}
                </CardDescription>
              </CardHeader>
              <CardFooter className="mt-auto flex justify-between border-t bg-gray-50/50 p-4">
                <div className="flex gap-2">
                  <Button variant="ghost" size="sm" className="text-red-500 hover:text-red-600" onClick={() => deleteProject(project.id)}>
                    <Trash2 className="h-4 w-4" />
                  </Button>
                  <Button 
                    variant="ghost" 
                    size="sm" 
                    className="text-green-600"
                    onClick={() => window.open(getWhatsAppUrl(`Confira meu novo projeto no IdeaFlow: ${project.title}`), '_blank')}
                  >
                    <MessageSquare className="h-4 w-4" />
                  </Button>
                  <Button 
                    variant="ghost" 
                    size="sm" 
                    className="text-blue-500"
                    onClick={() => window.open(getTelegramUrl(`Confira meu novo projeto no IdeaFlow: ${project.title}`), '_blank')}
                  >
                    <Send className="h-4 w-4" />
                  </Button>
                </div>
                <AIAssistantModal 
                  projectId={project.id}
                  title={project.title} 
                  description={project.description || ''} 
                />
              </CardFooter>
            </Card>
          ))}
        </div>
      )}
    </div>
  )
}
