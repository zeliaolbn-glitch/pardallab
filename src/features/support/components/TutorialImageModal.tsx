import { useState, useRef } from 'react'
import { useTutorials, type Tutorial } from '../hooks/useTutorials'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { ImagePlus, X, CheckCircle } from 'lucide-react'
import { toast } from 'sonner'
import { cn } from '@/lib/utils'

interface TutorialImageModalProps {
  tutorial?: Tutorial | null
  onClose: () => void
  open: boolean
}

export function TutorialImageModal({ tutorial, onClose, open }: TutorialImageModalProps) {
  const { createTutorial, updateTutorial, uploadTutorialImage } = useTutorials()
  const [loading, setLoading] = useState(false)
  const [formData, setFormData] = useState({
    title: tutorial?.title || '',
    description: tutorial?.description || '',
    imageUrl: tutorial?.content?.imageUrl || '',
    status: tutorial?.status || 'draft'
  })
  const fileInputRef = useRef<HTMLInputElement>(null)

  const handlePaste = async (e: React.ClipboardEvent) => {
    const items = e.clipboardData.items
    for (let i = 0; i < items.length; i++) {
      if (items[i].type.indexOf('image') !== -1) {
        const file = items[i].getAsFile()
        if (file) await handleFileUpload(file)
      }
    }
  }

  const handleFileUpload = async (file: File) => {
    setLoading(true)
    try {
      toast.info('Fazendo upload da imagem...')
      const url = await uploadTutorialImage(file)
      setFormData(prev => ({ ...prev, imageUrl: url }))
      toast.success('Imagem carregada!')
    } catch (err) {
      toast.error('Erro ao carregar imagem. Verifique se o bucket existe no Supabase.')
    } finally {
      setLoading(false)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    try {
      setLoading(true)
      const payload = {
        title: formData.title,
        description: formData.description,
        type: 'image' as const,
        status: formData.status as 'draft' | 'completed',
        content: { imageUrl: formData.imageUrl }
      }

      if (tutorial) {
        await updateTutorial({ id: tutorial.id, ...payload })
        toast.success('Tutorial atualizado!')
      } else {
        await createTutorial(payload)
        toast.success('Rascunho criado!')
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
      <DialogContent className="sm:max-w-[700px]">
        <DialogHeader>
          <DialogTitle>{tutorial ? 'Editar Guia/Rascunho' : 'Novo Guia com Imagem'}</DialogTitle>
        </DialogHeader>
        
        <form onSubmit={handleSubmit} className="space-y-4 py-2" onPaste={handlePaste}>
          <div className="space-y-2">
            <Label>Título do Processo</Label>
            <Input required value={formData.title} onChange={e => setFormData({...formData, title: e.target.value})} placeholder="Ex: Como emitir nota fiscal" />
          </div>

          <div className="space-y-2">
            <Label>Área da Imagem (Cole com Ctrl+V ou clique para enviar)</Label>
            <div 
              className={cn(
                "border-2 border-dashed rounded-xl h-64 flex flex-col items-center justify-center relative overflow-hidden transition-colors cursor-pointer",
                formData.imageUrl ? "border-slate-200" : "border-slate-300 hover:bg-slate-50 dark:hover:bg-slate-900"
              )}
              onClick={() => !formData.imageUrl && fileInputRef.current?.click()}
            >
              <input 
                type="file" 
                ref={fileInputRef} 
                className="hidden" 
                accept="image/*" 
                onChange={(e) => e.target.files?.[0] && handleFileUpload(e.target.files[0])}
              />
              
              {loading ? (
                <div className="text-slate-500 animate-pulse">Carregando imagem...</div>
              ) : formData.imageUrl ? (
                <>
                  <img src={formData.imageUrl} alt="Tutorial" className="absolute inset-0 w-full h-full object-contain bg-slate-50 dark:bg-slate-950" />
                  <Button 
                    variant="destructive" 
                    size="icon" 
                    className="absolute top-2 right-2 rounded-full h-8 w-8 opacity-0 hover:opacity-100 transition-opacity"
                    onClick={(e) => { e.stopPropagation(); setFormData({...formData, imageUrl: ''}) }}
                    type="button"
                  >
                    <X className="h-4 w-4" />
                  </Button>
                </>
              ) : (
                <div className="text-center space-y-2 text-slate-500">
                  <ImagePlus className="h-10 w-10 mx-auto opacity-50" />
                  <p className="text-sm font-medium">Clique para escolher arquivo</p>
                  <p className="text-xs">ou simplesmente cole aqui (Ctrl+V)</p>
                </div>
              )}
            </div>
          </div>

          <div className="space-y-2">
            <Label>Instruções / Texto Auxiliar</Label>
            <Textarea 
              value={formData.description} 
              onChange={e => setFormData({...formData, description: e.target.value})} 
              rows={3}
              placeholder="Descreva os passos representados na imagem..."
            />
          </div>

          <DialogFooter className="flex justify-between items-center sm:justify-between pt-4">
            <div className="flex items-center gap-2">
              <Button
                type="button"
                variant={formData.status === 'completed' ? 'default' : 'outline'}
                className={cn(formData.status === 'completed' && "bg-emerald-600 hover:bg-emerald-700")}
                onClick={() => setFormData({...formData, status: formData.status === 'completed' ? 'draft' : 'completed'})}
              >
                <CheckCircle className="mr-2 h-4 w-4" />
                {formData.status === 'completed' ? 'Concluído' : 'Marcar como Concluído'}
              </Button>
            </div>
            <Button type="submit" disabled={loading} className="bg-blue-600 hover:bg-blue-700">
              {loading ? 'Salvando...' : 'Salvar'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
