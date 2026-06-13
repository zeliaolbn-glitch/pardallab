import { useState } from 'react'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
} from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Label } from '@/components/ui/label'
import { Pencil, Terminal, Globe, Link2, FileText } from 'lucide-react'
import { useProjects } from '../hooks/useProjects'
import { toast } from 'sonner'
import type { Project } from '../types'
import { ProjectChecklistPanel } from './ProjectChecklistPanel'
import { ProjectUpdatesChecklist } from './ProjectUpdatesChecklist'

interface EditProjectModalProps {
  project: Project
}

export function EditProjectModal({ project }: EditProjectModalProps) {
  const [open, setOpen] = useState(false)
  const { updateProject, isUpdating } = useProjects()

  const [formData, setFormData] = useState({
    title: project.title,
    description: project.description || '',
    project_date: project.project_date || new Date().toISOString().split('T')[0],
    prompt_used: project.prompt_used || '',
    result_link: project.result_link || '',
    video_link: project.video_link || '',
    video_function: project.video_function || '',
    video_tool: project.video_tool || '',
    video_summary: project.video_summary || '',
    tools_used: project.tools_used || '',
    notes: project.notes || ''
  })

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    try {
      await updateProject({ id: project.id, ...formData })
      toast.success('Projeto atualizado!')
      setOpen(false)
    } catch (err: any) {
      console.error('ERRO SUPABASE UPDATE:', err)
      toast.error(`Erro ao atualizar: ${err.message || 'Desconhecido'}`)
    }
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="ghost" size="icon" className="h-7 w-7 text-gray-400 hover:text-blue-600">
          <Pencil className="h-3.5 w-3.5" />
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[650px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Editar Detalhes do Projeto</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4 py-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="col-span-2 space-y-2">
              <Label>Nome do Projeto</Label>
              <Input value={formData.title} onChange={e => setFormData({...formData, title: e.target.value})} required />
            </div>

            {/* Link do Projeto Criado (Deploy) */}
            <div className="p-3 bg-emerald-50 rounded-lg space-y-3 col-span-2 border border-emerald-100">
              <Label className="flex items-center gap-2 text-emerald-700 font-bold"><Globe className="h-4 w-4" /> Link do Projeto Criado (Deploy)</Label>
              <Input 
                placeholder="https://seu-projeto.vercel.app" 
                className="bg-white"
                value={formData.result_link}
                onChange={e => setFormData({...formData, result_link: e.target.value})}
              />
            </div>

            {/* Prompt */}
            <div className="p-3 bg-purple-50 rounded-lg space-y-3 col-span-2 border border-purple-100">
              <Label className="flex items-center gap-2 text-purple-700 font-bold"><Terminal className="h-4 w-4" /> Inteligência e Prompt</Label>
              <Textarea 
                placeholder="Cole aqui o prompt final usado..." 
                className="bg-white font-mono text-xs" 
                rows={3}
                value={formData.prompt_used}
                onChange={e => setFormData({...formData, prompt_used: e.target.value})}
              />
            </div>

            {/* Link da Origem (Vídeo) */}
            <div className="p-3 bg-blue-50 rounded-lg space-y-3 col-span-2 border border-blue-100">
              <Label className="flex items-center gap-2 text-blue-700 font-bold"><Link2 className="h-4 w-4" /> Link da Origem (Vídeo Youtube)</Label>
              <Input 
                placeholder="https://youtube.com/..." 
                className="bg-white"
                value={formData.video_link}
                onChange={e => setFormData({...formData, video_link: e.target.value})}
              />
            </div>

            <div className="space-y-2">
              <Label>Data</Label>
              <Input type="date" value={formData.project_date} onChange={e => setFormData({...formData, project_date: e.target.value})} />
            </div>
            <div className="space-y-2">
              <Label>Apps Usados</Label>
              <Input value={formData.tools_used} onChange={e => setFormData({...formData, tools_used: e.target.value})} />
            </div>

            <div className="col-span-2 space-y-2">
              <Label className="flex items-center gap-2"><FileText className="h-4 w-4 text-gray-500" /> Observações Extras</Label>
              <Textarea 
                placeholder="Notas adicionais sobre o progresso..." 
                rows={3}
                value={formData.notes}
                onChange={e => setFormData({...formData, notes: e.target.value})}
              />
            </div>
            
            {/* Checklist de Passos Padrão */}
            <div className="col-span-2 border-t pt-4 mt-2">
              <ProjectChecklistPanel projectId={project.id} />
            </div>

            {/* Checklist de Atualizações Específicas */}
            <div className="col-span-2 border-t pt-4 mt-2">
              <ProjectUpdatesChecklist project={project} />
            </div>
          </div>
          <DialogFooter>
            <Button type="submit" disabled={isUpdating} className="w-full bg-blue-600">Salvar Alterações</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
