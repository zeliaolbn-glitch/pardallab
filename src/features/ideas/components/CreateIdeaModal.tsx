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
import { Plus, Lightbulb } from 'lucide-react'
import { useIdeas } from '../hooks/useIdeas'
import { toast } from 'sonner'

export function CreateIdeaModal() {
  const [open, setOpen] = useState(false)
  const { createIdea, isCreating } = useIdeas()
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    category: 'Geral'
  })

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    try {
      await createIdea(formData)
      toast.success('Ideia capturada!')
      setOpen(false)
      setFormData({ title: '', description: '', category: 'Geral' })
    } catch (err) {
      toast.error('Erro ao salvar ideia.')
    }
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button className="bg-blue-600 hover:bg-blue-700 shadow-lg shadow-blue-200">
          <Plus className="mr-2 h-4 w-4" /> Nova Ideia
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Lightbulb className="h-5 w-5 text-blue-600" />
            Capturar Nova Ideia
          </DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4 py-4">
          <div className="space-y-2">
            <Label htmlFor="title">Título da Ideia</Label>
            <Input
              id="title"
              placeholder="Ex: App de Gestão de Dieta"
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              required
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="category">Categoria</Label>
            <Input
              id="category"
              placeholder="Ex: SaaS, Mobile, Web"
              value={formData.category}
              onChange={(e) => setFormData({ ...formData, category: e.target.value })}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="description">Descrição</Label>
            <Textarea
              id="description"
              placeholder="Descreva brevemente o que é essa ideia..."
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              rows={4}
            />
          </div>
          <DialogFooter>
            <Button type="submit" disabled={isCreating} className="w-full bg-blue-600">
              {isCreating ? 'Salvando...' : 'Salvar Ideia'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
