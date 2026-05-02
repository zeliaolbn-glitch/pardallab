import { useIdeas } from '../hooks/useIdeas'
import { useProjects } from '@/features/projects/hooks/useProjects'
import { useNavigate } from 'react-router-dom'
import { CreateIdeaModal } from '../components/CreateIdeaModal'
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Trash2, FolderGit2 } from 'lucide-react'
import { Skeleton } from '@/components/ui/skeleton'
import { toast } from 'sonner'

export default function IdeasPage() {
  const { ideas, isLoading, deleteIdea } = useIdeas()
  const { createProject } = useProjects()
  const navigate = useNavigate()

  const handleConvertToProject = async (idea: any) => {
    try {
      await createProject({
        title: idea.title,
        description: idea.description,
        idea_id: idea.id,
        status: 'planning'
      })
      toast.success('Ideia transformada em projeto!')
      navigate('/projects')
    } catch (err) {
      toast.error('Erro ao converter ideia.')
      console.error('Failed to convert idea:', err)
    }
  }

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <Skeleton className="h-10 w-[150px]" />
          <Skeleton className="h-10 w-[120px]" />
        </div>
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
        <h1 className="text-3xl font-bold tracking-tight">Suas Ideias</h1>
        <CreateIdeaModal />
      </div>

      {ideas.length === 0 ? (
        <div className="flex min-h-[400px] flex-col items-center justify-center rounded-lg border-2 border-dashed border-gray-300 bg-white p-12 text-center">
          <h3 className="text-lg font-medium text-gray-900">Nenhuma ideia capturada</h3>
          <p className="mt-2 text-gray-500">Comece registrando seus primeiros insights e transforme-os em realidade.</p>
          <div className="mt-6">
            <CreateIdeaModal />
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
          {ideas.map((idea) => (
            <Card key={idea.id} className="flex flex-col border-none shadow-md hover:shadow-lg transition-shadow">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <Badge variant={idea.status === 'active' ? 'default' : 'secondary'} className="bg-blue-100 text-blue-700 hover:bg-blue-100">
                    {idea.status === 'active' ? 'Ativa' : idea.status}
                  </Badge>
                  <span className="text-xs text-gray-400">
                    {new Date(idea.created_at).toLocaleDateString()}
                  </span>
                </div>
                <CardTitle className="mt-2 leading-tight">{idea.title}</CardTitle>
                <CardDescription className="line-clamp-3">
                  {idea.description || 'Sem descrição.'}
                </CardDescription>
              </CardHeader>
              <CardContent className="flex-grow"></CardContent>
              <CardFooter className="flex justify-between border-t bg-gray-50/50 p-4">
                <Button variant="ghost" size="sm" className="text-red-500 hover:text-red-600 hover:bg-red-50" onClick={() => deleteIdea(idea.id)}>
                  <Trash2 className="mr-2 h-4 w-4" /> Excluir
                </Button>
                {idea.status !== 'archived' && (
                  <Button 
                    variant="outline" 
                    size="sm" 
                    className="text-blue-600 border-blue-200 hover:bg-blue-50"
                    onClick={() => handleConvertToProject(idea)}
                  >
                    <FolderGit2 className="mr-2 h-4 w-4" /> Transformar em Projeto
                  </Button>
                )}
              </CardFooter>
            </Card>
          ))}
        </div>
      )}
    </div>
  )
}
