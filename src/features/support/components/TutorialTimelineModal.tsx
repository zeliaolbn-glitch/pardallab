import { useState } from 'react'
import { useTutorials, type Tutorial } from '../hooks/useTutorials'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Plus, Trash2, GitCommit } from 'lucide-react'
import { toast } from 'sonner'

interface TutorialTimelineModalProps {
  tutorial?: Tutorial | null
  onClose: () => void
  open: boolean
}

interface TimelineStep {
  id: string
  title: string
  text: string
}

export function TutorialTimelineModal({ tutorial, onClose, open }: TutorialTimelineModalProps) {
  const { createTutorial, updateTutorial } = useTutorials()
  const [loading, setLoading] = useState(false)
  const [formData, setFormData] = useState({
    title: tutorial?.title || '',
    description: tutorial?.description || '',
    steps: (tutorial?.content?.steps || [{ id: crypto.randomUUID(), title: '', text: '' }]) as TimelineStep[]
  })
  const [bulkText, setBulkText] = useState('')

  const handleBulkInsert = () => {
    if (!bulkText.trim()) return
    const lines = bulkText.split('\n').filter(line => line.trim() !== '')
    const newSteps = lines.map(line => ({
      id: crypto.randomUUID(),
      title: line.trim(),
      text: ''
    }))
    
    setFormData(prev => {
      // Se tiver só 1 passo vazio, substitui por inteiro
      if (prev.steps.length === 1 && !prev.steps[0].title && !prev.steps[0].text) {
        return { ...prev, steps: newSteps }
      }
      return { ...prev, steps: [...prev.steps, ...newSteps] }
    })
    setBulkText('')
    toast.success(`${newSteps.length} passos adicionados!`)
  }

  const handleAddStep = () => {
    setFormData(prev => ({
      ...prev,
      steps: [...prev.steps, { id: crypto.randomUUID(), title: '', text: '' }]
    }))
  }

  const handleRemoveStep = (id: string) => {
    setFormData(prev => ({
      ...prev,
      steps: prev.steps.filter(s => s.id !== id)
    }))
  }

  const updateStep = (id: string, field: 'title' | 'text', value: string) => {
    setFormData(prev => ({
      ...prev,
      steps: prev.steps.map(s => s.id === id ? { ...s, [field]: value } : s)
    }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    // Filter out empty steps
    const validSteps = formData.steps.filter(s => s.title.trim() !== '')
    if (validSteps.length === 0) {
      toast.error('Adicione pelo menos um passo com título.')
      return
    }

    try {
      setLoading(true)
      const payload = {
        title: formData.title,
        description: formData.description,
        type: 'timeline' as const,
        status: 'completed' as const,
        content: { steps: validSteps }
      }

      if (tutorial) {
        await updateTutorial({ id: tutorial.id, ...payload })
        toast.success('Organograma atualizado!')
      } else {
        await createTutorial(payload)
        toast.success('Organograma criado!')
      }
      onClose()
    } catch (err) {
      toast.error('Erro ao salvar tutorial.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={(val) => !val && onClose()}>
      <DialogContent className="sm:max-w-[700px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{tutorial ? 'Editar Organograma' : 'Novo Organograma Passo a Passo'}</DialogTitle>
        </DialogHeader>
        
        <form onSubmit={handleSubmit} className="space-y-6 py-2">
          <div className="space-y-4 bg-slate-50 dark:bg-slate-900/50 p-4 rounded-lg">
            <div className="space-y-2">
              <Label>Nome do Processo</Label>
              <Input required value={formData.title} onChange={e => setFormData({...formData, title: e.target.value})} placeholder="Ex: Fluxo de Atendimento ao Cliente" />
            </div>
            <div className="space-y-2">
              <Label>Descrição Curta</Label>
              <Input value={formData.description} onChange={e => setFormData({...formData, description: e.target.value})} />
            </div>
          </div>

          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <Label className="text-base flex items-center gap-2">
                <GitCommit className="h-5 w-5 text-indigo-500" />
                Passos Sequenciais
              </Label>
            </div>

            {/* Inserção em Massa */}
            <div className="bg-indigo-50 dark:bg-indigo-950/30 p-3 rounded-lg border border-indigo-100 dark:border-indigo-900 space-y-2">
              <Label className="text-xs text-indigo-600 dark:text-indigo-400">Criação Rápida: Cole uma lista de itens (um por linha)</Label>
              <div className="flex gap-2">
                <Textarea 
                  placeholder="Passo 1&#10;Passo 2&#10;Passo 3..." 
                  value={bulkText}
                  onChange={e => setBulkText(e.target.value)}
                  className="min-h-[60px] text-sm"
                />
                <Button type="button" onClick={handleBulkInsert} className="bg-indigo-600 hover:bg-indigo-700 h-auto">
                  Gerar
                </Button>
              </div>
            </div>
            
            <div className="space-y-2 mt-4">
              {formData.steps.map((step, index) => (
                <div key={step.id} className="relative flex gap-4">
                  {/* Timeline Line */}
                  <div className="flex flex-col items-center">
                    <div className="h-8 w-8 rounded-full bg-indigo-100 dark:bg-indigo-900/50 text-indigo-600 dark:text-indigo-400 font-bold flex items-center justify-center shrink-0 border-2 border-white dark:border-slate-950 z-10">
                      {index + 1}
                    </div>
                    {index < formData.steps.length - 1 && (
                      <div className="w-0.5 h-full bg-indigo-100 dark:bg-indigo-900/50 absolute top-8 bottom-[-16px] left-[15px]" />
                    )}
                  </div>
                  
                  {/* Step Content */}
                  <div className="flex-1 space-y-2 bg-white dark:bg-slate-950 border dark:border-slate-800 p-3 rounded-lg shadow-sm">
                    <div className="flex gap-2">
                      <Input 
                        placeholder="Título do passo..." 
                        value={step.title} 
                        onChange={e => updateStep(step.id, 'title', e.target.value)}
                        className="font-semibold"
                        required
                      />
                      <Button type="button" variant="ghost" size="icon" className="text-rose-400 hover:text-rose-500 hover:bg-rose-50 shrink-0" onClick={() => handleRemoveStep(step.id)}>
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                    <Textarea 
                      placeholder="Descrição ou detalhes do passo..." 
                      value={step.text} 
                      onChange={e => updateStep(step.id, 'text', e.target.value)}
                      rows={2}
                      className="text-sm"
                    />
                  </div>
                </div>
              ))}
            </div>

            <Button type="button" variant="outline" className="w-full mt-4 border-dashed" onClick={handleAddStep}>
              <Plus className="mr-2 h-4 w-4" /> Adicionar Próximo Passo
            </Button>
          </div>

          <DialogFooter>
            <Button type="submit" disabled={loading} className="bg-indigo-600 hover:bg-indigo-700 w-full">
              {loading ? 'Salvando...' : 'Salvar Organograma'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
