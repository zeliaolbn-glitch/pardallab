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
import { useIdeas } from '../hooks/useIdeas'
import { Plus } from 'lucide-react'
import { toast } from 'sonner'

export function CreateIdeaModal() {
  const [open, setOpen] = useState(false)
  const { createIdea, isCreating } = useIdeas()
  const [title, setTitle] = useState('')
  const [description, setDescription] = useState('')

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    try {
      await createIdea({ title, description, status: 'active' })
      toast.success('Ideia capturada com sucesso!')
      setTitle('')
      setDescription('')
      setOpen(false)
    } catch (err) {
      toast.error('Erro ao salvar ideia. Tente novamente.')
      console.error('Failed to create idea:', err)
    }
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button className="bg-blue-600 hover:bg-blue-700">
          <Plus className="mr-2 h-4 w-4" /> Nova Ideia
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Capturar Nova Ideia</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4 py-4">
          <div className="space-y-2">
            <Label htmlFor="title">Título</Label>
            <Input
              id="title"
              placeholder="Ex: App de receitas inteligentes"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              required
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="description">Descrição</Label>
            <Textarea
              id="description"
              placeholder="Descreva brevemente sua ideia..."
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows={4}
            />
          </div>
          <DialogFooter>
            <Button type="submit" disabled={isCreating} className="bg-blue-600 hover:bg-blue-700">
              {isCreating ? 'Salvando...' : 'Salvar Ideia'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
