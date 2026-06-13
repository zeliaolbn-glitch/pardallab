import { useProjects } from '../hooks/useProjects'
import { PROJECT_STATUS_FLOW, type ProjectStatus, type Project } from '../types'
import { Card, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Trash2, MessageSquare, Calendar, Video, Smartphone, ListChecks } from 'lucide-react'
import { Skeleton } from '@/components/ui/skeleton'
import { AIAssistantModal } from '../components/AIAssistantModal'
import { EditProjectModal } from '../components/EditProjectModal'
import { getWhatsAppUrl } from '@/lib/social-links'
import { DragDropContext, Droppable, Draggable, type DropResult } from '@hello-pangea/dnd'
import { toast } from 'sonner'

export default function ProjectsPage() {
  const { projects, isLoading, updateProjectStatus, deleteProject } = useProjects()

  const handleDelete = async (id: string, title: string) => {
    if (window.confirm(`Tem certeza que deseja deletar o projeto "${title}"?`)) {
      try {
        await deleteProject(id)
        toast.success('Projeto removido com sucesso!')
      } catch (err) {
        toast.error('Erro ao remover projeto.')
      }
    }
  }

  const onDragEnd = async (result: DropResult) => {
    const { destination, source, draggableId } = result

    if (!destination) return
    if (destination.droppableId === source.droppableId && destination.index === source.index) return

    try {
      await updateProjectStatus({ 
        id: draggableId, 
        status: destination.droppableId as ProjectStatus 
      })
      toast.success('Status atualizado!')
    } catch (err) {
      toast.error('Erro ao atualizar status.')
    }
  }

  if (isLoading) {
    return (
      <div className="flex gap-4 overflow-x-auto pb-4">
        {[1, 2, 3].map((i) => (
          <div key={i} className="min-w-[300px] space-y-4">
            <Skeleton className="h-10 w-full" />
            <Skeleton className="h-[200px] w-full rounded-xl" />
          </div>
        ))}
      </div>
    )
  }

  return (
    <div className="h-[calc(100vh-120px)] flex flex-col space-y-6">
      <div className="flex items-center justify-between px-2">
        <h1 className="text-3xl font-bold tracking-tight text-slate-900">Evolução de Projetos</h1>
      </div>

      <DragDropContext onDragEnd={onDragEnd}>
        <div className="flex-1 flex gap-4 overflow-x-auto pb-6 scrollbar-hide">
          {PROJECT_STATUS_FLOW.map((status: ProjectStatus) => (
            <div key={status} className="min-w-[320px] max-w-[320px] flex flex-col bg-slate-100/50 rounded-xl p-3 border border-slate-100">
              <div className="flex items-center justify-between mb-4 px-1">
                <h3 className="font-bold text-xs text-slate-500 uppercase tracking-widest">
                  {status}
                </h3>
                <span className="bg-white px-2 py-0.5 rounded-full text-[10px] font-bold text-blue-600 shadow-sm border border-blue-50">
                  {projects.filter((p: Project) => p.status === status).length}
                </span>
              </div>

              <Droppable droppableId={status}>
                {(provided, snapshot) => (
                  <div
                    {...provided.droppableProps}
                    ref={provided.innerRef}
                    className={`flex-1 space-y-3 transition-colors rounded-md ${
                      snapshot.isDraggingOver ? 'bg-blue-50/50' : ''
                    }`}
                  >
                    {projects
                      .filter((p: Project) => p.status === status)
                      .map((project: Project, index: number) => (
                        <Draggable key={project.id} draggableId={project.id} index={index}>
                          {(provided, snapshot) => (
                            <div
                              ref={provided.innerRef}
                              {...provided.draggableProps}
                              {...provided.dragHandleProps}
                              className={`transition-transform ${snapshot.isDragging ? 'rotate-2' : ''}`}
                            >
                              <Card className="border-none shadow-sm hover:shadow-md transition-all group bg-white ring-1 ring-slate-200/50">
                                <CardHeader className="p-4 space-y-3">
                                  <div className="flex justify-between items-start gap-2">
                                    <CardTitle className="text-sm font-bold leading-tight group-hover:text-blue-600 transition-colors">
                                      {project.title}
                                    </CardTitle>
                                    <EditProjectModal project={project} />
                                  </div>
                                  
                                  <div className="space-y-1.5">
                                    {project.project_date && (
                                      <div className="flex items-center text-[10px] text-slate-400 gap-1.5">
                                        <Calendar className="h-3 w-3 text-blue-400" />
                                        {new Date(project.project_date).toLocaleDateString()}
                                      </div>
                                    )}
                                    {project.tools_used && (
                                      <div className="flex items-center text-[10px] text-slate-400 gap-1.5">
                                        <Smartphone className="h-3 w-3 text-emerald-400" />
                                        <span className="truncate">{project.tools_used}</span>
                                      </div>
                                    )}
                                    {project.video_link && (
                                      <div className="flex items-center text-[10px] text-blue-500 gap-1.5 cursor-pointer hover:underline" onClick={() => window.open(project.video_link, '_blank')}>
                                        <Video className="h-3 w-3" />
                                        Ver Origem
                                      </div>
                                    )}
                                    {(project.updates_checklist?.length || 0) > 0 && (
                                      <div className="flex items-center text-[10px] text-violet-500 font-bold gap-1.5">
                                        <ListChecks className="h-3 w-3" />
                                        {project.updates_checklist?.filter(i => i.completed).length}/{project.updates_checklist?.length} Atualizações
                                      </div>
                                    )}
                                  </div>

                                  <CardDescription className="text-[11px] line-clamp-2 pt-1 border-t border-slate-50">
                                    {project.description || 'Sem descrição.'}
                                  </CardDescription>
                                  
                                  <div className="flex items-center justify-between pt-2">
                                    <div className="flex gap-1">
                                      <Button 
                                        variant="ghost" 
                                        size="icon" 
                                        className="h-7 w-7 text-emerald-600 hover:bg-emerald-50"
                                        onClick={() => window.open(getWhatsAppUrl(`Evolução: ${project.title} - Status: ${project.status}`), '_blank')}
                                      >
                                        <MessageSquare className="h-3.5 w-3.5" />
                                      </Button>
                                      <Button 
                                        variant="ghost" 
                                        size="icon" 
                                        className="h-7 w-7 text-rose-400 hover:bg-rose-50"
                                        onClick={() => handleDelete(project.id, project.title)}
                                      >
                                        <Trash2 className="h-3.5 w-3.5" />
                                      </Button>
                                    </div>
                                    <AIAssistantModal 
                                      projectId={project.id}
                                      title={project.title} 
                                      description={project.description || ''} 
                                    />
                                  </div>
                                </CardHeader>
                              </Card>
                            </div>
                          )}
                        </Draggable>
                      ))}
                    {provided.placeholder}
                  </div>
                )}
              </Droppable>
            </div>
          ))}
        </div>
      </DragDropContext>
    </div>
  )
}
