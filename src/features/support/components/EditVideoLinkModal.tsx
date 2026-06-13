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
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Pencil } from 'lucide-react'
import { useProjects } from '@/features/projects/hooks/useProjects'
import { toast } from 'sonner'
import type { Project } from '@/features/projects/types'

interface EditVideoLinkModalProps {
  project: Project
}

export function EditVideoLinkModal({ project }: EditVideoLinkModalProps) {
  const [open, setOpen] = useState(false)
  const { updateProject, isUpdating } = useProjects()

  const [formData, setFormData] = useState({
    video_link: project.video_link || '',
    video_function: project.video_function || '',
    video_tool: project.video_tool || '',
    video_summary: project.video_summary || ''
  })

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    try {
      await updateProject({
        id: project.id,
        ...formData
      })
      toast.success('Link atualizado com sucesso!')
      setOpen(false)
    } catch (err) {
      toast.error('Erro ao atualizar link.')
    }
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button 
          variant="ghost" 
          size="sm" 
          className="h-8 w-8 p-0 text-gray-400 hover:text-blue-600"
        >
          <Pencil className="h-4 w-4" />
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-blue-600">
            <Pencil className="h-5 w-5" />
            Editar Informações do Vídeo
          </DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4 py-4">
          <div className="space-y-2">
            <Label htmlFor="v_link">Link do Vídeo</Label>
            <Input
              id="v_link"
              value={formData.video_link}
              onChange={(e) => setFormData({ ...formData, video_link: e.target.value })}
            />
          </div>
          <div className="grid grid-cols-2 gap-2">
            <div className="space-y-2">
              <Label htmlFor="v_func">Função</Label>
              <Input
                id="v_func"
                value={formData.video_function}
                onChange={(e) => setFormData({ ...formData, video_function: e.target.value })}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="v_tool">Ferramenta</Label>
              <Input
                id="v_tool"
                value={formData.video_tool}
                onChange={(e) => setFormData({ ...formData, video_tool: e.target.value })}
              />
            </div>
          </div>
          <div className="space-y-2">
            <Label htmlFor="v_summary">Resumo do Vídeo</Label>
            <Textarea
              id="v_summary"
              value={formData.video_summary}
              onChange={(e) => setFormData({ ...formData, video_summary: e.target.value })}
              rows={3}
            />
          </div>
          <DialogFooter>
            <Button type="submit" disabled={isUpdating} className="w-full bg-blue-600">
              {isUpdating ? 'Salvando...' : 'Salvar Alterações'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
