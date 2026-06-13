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
import { FolderGit2 } from 'lucide-react'
import { useProjects } from '@/features/projects/hooks/useProjects'
import { useNavigate } from 'react-router-dom'
import { toast } from 'sonner'
import type { Idea } from '../types'

interface ConvertIdeaModalProps {
  idea: Idea
}

export function ConvertIdeaModal({ idea }: ConvertIdeaModalProps) {
  const [open, setOpen] = useState(false)
  const { createProject, isCreating } = useProjects()
  const navigate = useNavigate()

  const [formData, setFormData] = useState({
    title: idea.title,
    description: idea.description || '',
    project_date: new Date().toISOString().split('T')[0],
    video_link: '',
    video_function: '',
    video_tool: '',
    video_summary: '',
    tools_used: '',
    notes: ''
  })

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    try {
      await createProject({
        ...formData,
        idea_id: idea.id,
        status: 'IDEIA'
      })
      toast.success('Projeto criado com sucesso!')
      setOpen(false)
      navigate('/projects')
    } catch (err) {
      toast.error('Erro ao converter ideia.')
    }
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button 
          variant="outline" 
          size="sm" 
          className="text-blue-600 border-blue-200 hover:bg-blue-50"
        >
          <FolderGit2 className="mr-2 h-4 w-4" /> Transformar em Projeto
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[550px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <FolderGit2 className="h-5 w-5 text-blue-600" />
            Configurar Novo Projeto
          </DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4 py-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="col-span-2 space-y-2">
              <Label htmlFor="title">Nome do Projeto</Label>
              <Input
                id="title"
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                required
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="date">Data de Início</Label>
              <Input
                id="date"
                type="date"
                value={formData.project_date}
                onChange={(e) => setFormData({ ...formData, project_date: e.target.value })}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="tools">Apps Usados no Projeto</Label>
              <Input
                id="tools"
                value={formData.tools_used}
                onChange={(e) => setFormData({ ...formData, tools_used: e.target.value })}
              />
            </div>

            <div className="col-span-2 p-3 bg-blue-50 rounded-lg space-y-3">
              <Label className="text-blue-700 font-bold">Informações do Vídeo</Label>
              <div className="space-y-2">
                <Label htmlFor="video">Link do Vídeo</Label>
                <Input
                  id="video"
                  value={formData.video_link}
                  onChange={(e) => setFormData({ ...formData, video_link: e.target.value })}
                />
              </div>
              <div className="grid grid-cols-2 gap-2">
                <div className="space-y-2">
                  <Label htmlFor="v_func">Principal Função</Label>
                  <Input
                    id="v_func"
                    value={formData.video_function}
                    onChange={(e) => setFormData({ ...formData, video_function: e.target.value })}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="v_tool">Ferramenta Usada</Label>
                  <Input
                    id="v_tool"
                    value={formData.video_tool}
                    onChange={(e) => setFormData({ ...formData, video_tool: e.target.value })}
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="v_summary">Resumo do Conteúdo</Label>
                <Textarea
                  id="v_summary"
                  value={formData.video_summary}
                  onChange={(e) => setFormData({ ...formData, video_summary: e.target.value })}
                  rows={2}
                />
              </div>
            </div>

            <div className="col-span-2 space-y-2">
              <Label htmlFor="description">Descrição do Projeto</Label>
              <Textarea
                id="description"
                rows={2}
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              />
            </div>
          </div>

          <DialogFooter className="pt-4">
            <Button type="submit" disabled={isCreating} className="w-full bg-blue-600 hover:bg-blue-700">
              {isCreating ? 'Iniciando Projeto...' : 'Confirmar e Iniciar Evolução'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
