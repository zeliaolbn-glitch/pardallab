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
import { useStandaloneLinks, type StandaloneLink } from '../hooks/useStandaloneLinks'
import { toast } from 'sonner'

interface EditStandaloneLinkModalProps {
  link: StandaloneLink
}

export function EditStandaloneLinkModal({ link }: EditStandaloneLinkModalProps) {
  const [open, setOpen] = useState(false)
  const { updateLink } = useStandaloneLinks()

  const [formData, setFormData] = useState({
    title: link.title,
    url: link.url,
    main_function: link.main_function,
    tool: link.tool,
    summary: link.summary || ''
  })

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    try {
      await updateLink({
        id: link.id,
        ...formData
      })
      toast.success('Link atualizado!')
      setOpen(false)
    } catch (err) {
      toast.error('Erro ao atualizar.')
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
            Editar Link Manual
          </DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4 py-4">
          <div className="space-y-2">
            <Label>Título</Label>
            <Input
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              required
            />
          </div>
          <div className="space-y-2">
            <Label>URL</Label>
            <Input
              value={formData.url}
              onChange={(e) => setFormData({ ...formData, url: e.target.value })}
              required
            />
          </div>
          <div className="grid grid-cols-2 gap-2">
            <div className="space-y-2">
              <Label>Função</Label>
              <Input
                value={formData.main_function}
                onChange={(e) => setFormData({ ...formData, main_function: e.target.value })}
              />
            </div>
            <div className="space-y-2">
              <Label>Ferramenta</Label>
              <Input
                value={formData.tool}
                onChange={(e) => setFormData({ ...formData, tool: e.target.value })}
              />
            </div>
          </div>
          <div className="space-y-2">
            <Label>Resumo</Label>
            <Textarea
              value={formData.summary}
              onChange={(e) => setFormData({ ...formData, summary: e.target.value })}
              rows={3}
            />
          </div>
          <DialogFooter>
            <Button type="submit" className="w-full bg-blue-600">
              Salvar Alterações
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
