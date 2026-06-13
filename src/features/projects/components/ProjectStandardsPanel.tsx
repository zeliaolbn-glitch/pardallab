import { useState } from 'react'
import { useProjectStandards } from '@/features/projects/hooks/useProjectStandards'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Plus, Trash2, Pencil, GripVertical, ClipboardList } from 'lucide-react'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogFooter } from '@/components/ui/dialog'
import { toast } from 'sonner'
import type { ProjectStandard } from '@/features/projects/hooks/useProjectStandards'

export function ProjectStandardsPanel() {
  const { standards, createStandard, updateStandard, deleteStandard } = useProjectStandards()
  const [open, setOpen] = useState(false)
  const [editing, setEditing] = useState<ProjectStandard | null>(null)
  const [form, setForm] = useState({ title: '', description: '' })

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (editing) {
      await updateStandard({ id: editing.id, ...form })
      toast.success('Passo atualizado!')
    } else {
      await createStandard({ ...form, order_index: standards.length + 1 })
      toast.success('Passo padrão adicionado!')
    }
    setOpen(false)
    setEditing(null)
    setForm({ title: '', description: '' })
  }

  const handleEdit = (standard: ProjectStandard) => {
    setEditing(standard)
    setForm({ title: standard.title, description: standard.description || '' })
    setOpen(true)
  }

  return (
    <Card className="border-none shadow-md ring-1 ring-slate-100 col-span-1 md:col-span-2 dark:bg-slate-800 dark:ring-slate-700">
      <CardHeader>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <ClipboardList className="h-5 w-5 text-violet-500" />
            <CardTitle className="dark:text-white">Passos Padrão de Projeto</CardTitle>
          </div>
          <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
              <Button size="sm" className="bg-violet-600 hover:bg-violet-700">
                <Plus className="mr-1 h-4 w-4" /> Novo Passo
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>{editing ? 'Editar Passo' : 'Novo Passo Padrão'}</DialogTitle>
              </DialogHeader>
              <form onSubmit={handleSubmit} className="space-y-4 py-2">
                <div className="space-y-2">
                  <Label>Título do Passo</Label>
                  <Input required value={form.title} onChange={e => setForm({ ...form, title: e.target.value })} placeholder="Ex: Configurar autenticação" />
                </div>
                <div className="space-y-2">
                  <Label>Descrição (opcional)</Label>
                  <Textarea value={form.description} onChange={e => setForm({ ...form, description: e.target.value })} rows={2} />
                </div>
                <DialogFooter>
                  <Button type="submit" className="w-full bg-violet-600">Salvar</Button>
                </DialogFooter>
              </form>
            </DialogContent>
          </Dialog>
        </div>
        <CardDescription className="dark:text-slate-400">
          Estes passos aparecerão como checklist dentro de cada projeto. Crie seus padrões de desenvolvimento.
        </CardDescription>
      </CardHeader>
      <CardContent>
        {standards.length === 0 ? (
          <div className="text-center py-8 text-slate-400">
            <ClipboardList className="h-10 w-10 mx-auto opacity-20 mb-2" />
            <p>Nenhum passo padrão criado ainda.</p>
          </div>
        ) : (
          <div className="space-y-2">
            {standards.map((standard, index) => (
              <div
                key={standard.id}
                className="group flex items-center gap-3 p-3 rounded-lg bg-slate-50 dark:bg-slate-900/50 hover:bg-violet-50 dark:hover:bg-violet-900/20 transition-colors border border-transparent hover:border-violet-100"
              >
                <GripVertical className="h-4 w-4 text-slate-300 shrink-0" />
                <div className="h-6 w-6 rounded-full bg-violet-100 dark:bg-violet-900/50 flex items-center justify-center text-xs font-bold text-violet-700 dark:text-violet-300 shrink-0">
                  {index + 1}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-medium text-slate-800 dark:text-slate-200 text-sm">{standard.title}</p>
                  {standard.description && (
                    <p className="text-xs text-slate-500 dark:text-slate-400 truncate">{standard.description}</p>
                  )}
                </div>
                <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                  <Button size="icon" variant="ghost" className="h-7 w-7 text-violet-500" onClick={() => handleEdit(standard)}>
                    <Pencil className="h-3.5 w-3.5" />
                  </Button>
                  <Button size="icon" variant="ghost" className="h-7 w-7 text-rose-500" onClick={() => {
                    if (confirm('Remover este passo padrão?')) deleteStandard(standard.id)
                  }}>
                    <Trash2 className="h-3.5 w-3.5" />
                  </Button>
                </div>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  )
}
