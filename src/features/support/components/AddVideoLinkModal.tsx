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
import { Plus } from 'lucide-react'
import { useStandaloneLinks } from '../hooks/useStandaloneLinks'
import { toast } from 'sonner'

export function AddVideoLinkModal() {
  const [open, setOpen] = useState(false)
  const { createLink } = useStandaloneLinks()

  const [formData, setFormData] = useState({
    title: '',
    url: '',
    main_function: '',
    tool: '',
    summary: ''
  })

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!formData.url) return toast.error('O link é obrigatório')
    
    try {
      await createLink(formData)
      toast.success('Link cadastrado com sucesso!')
      setOpen(false)
      setFormData({ title: '', url: '', main_function: '', tool: '', summary: '' })
    } catch (err) {
      toast.error('Erro ao cadastrar link.')
    }
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button className="bg-blue-600 hover:bg-blue-700">
          <Plus className="mr-2 h-4 w-4" /> Cadastrar Novo Link
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-blue-600">
            <Plus className="h-5 w-5" />
            Inserir Link Manualmente
          </DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4 py-4">
          <div className="space-y-2">
            <Label htmlFor="add-v-title">Título/Referência</Label>
            <Input
              id="add-v-title"
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              placeholder="Ex: Tutorial de Deploy"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="add-v-link">Link do Vídeo</Label>
            <Input
              id="add-v-link"
              value={formData.url}
              onChange={(e) => setFormData({ ...formData, url: e.target.value })}
              placeholder="https://..."
              required
            />
          </div>
          <div className="grid grid-cols-2 gap-2">
            <div className="space-y-2">
              <Label htmlFor="add-v-func">Função</Label>
              <Input
                id="add-v-func"
                value={formData.main_function}
                onChange={(e) => setFormData({ ...formData, main_function: e.target.value })}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="add-v-tool">Ferramenta</Label>
              <Input
                id="add-v-tool"
                value={formData.tool}
                onChange={(e) => setFormData({ ...formData, tool: e.target.value })}
              />
            </div>
          </div>
          <div className="space-y-2">
            <Label htmlFor="add-v-summary">Resumo do Vídeo</Label>
            <Textarea
              id="add-v-summary"
              value={formData.summary}
              onChange={(e) => setFormData({ ...formData, summary: e.target.value })}
              placeholder="Descreva brevemente o conteúdo..."
              rows={3}
            />
          </div>
          <DialogFooter>
            <Button type="submit" className="w-full bg-blue-600">
              Salvar Link na Base
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
