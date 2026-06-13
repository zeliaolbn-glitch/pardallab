import { useState } from 'react'
import { useTutorials, type Tutorial } from '../hooks/useTutorials'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { toast } from 'sonner'
import { Sparkles, Loader2 } from 'lucide-react'
import { useAI } from '@/hooks/useAI'

interface TutorialVideoModalProps {
  tutorial?: Tutorial | null
  onClose: () => void
  open: boolean
}

export function TutorialVideoModal({ tutorial, onClose, open }: TutorialVideoModalProps) {
  const { createTutorial, updateTutorial } = useTutorials()
  const { extractVideoInfo } = useAI()
  const [loading, setLoading] = useState(false)
  const [isExtracting, setIsExtracting] = useState(false)
  const [formData, setFormData] = useState({
    title: tutorial?.title || '',
    description: tutorial?.description || '',
    url: '', // Campo novo para o link
    videoId: tutorial?.content?.videoId || '',
    duration: tutorial?.content?.duration || ''
  })

  const getYoutubeID = (url: string) => {
    const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#&?]*).*/
    const match = url.match(regExp)
    return (match && match[2].length === 11) ? match[2] : null
  }

  const handleAutoFill = async () => {
    if (!formData.url) return
    setIsExtracting(true)
    try {
      const vidId = getYoutubeID(formData.url)
      if (vidId) {
        setFormData(prev => ({ ...prev, videoId: vidId }))
        
        // Busca título via oEmbed (NoEmbed)
        const res = await fetch(`https://noembed.com/embed?url=${formData.url}`)
        const data = await res.json()
        if (data.title) {
          setFormData(prev => ({ ...prev, title: data.title }))
        }

        // Busca informações via IA
        const info = await extractVideoInfo(formData.url, data.title || '')
        if (info) {
          setFormData(prev => ({
            ...prev,
            title: info.title || data.title || prev.title,
            description: info.summary || prev.description,
            duration: info.duration || prev.duration
          }))
          toast.success('Dados preenchidos pela IA!')
        }
      } else {
        toast.error('URL do YouTube inválida.')
      }
    } catch (err) {
      toast.error('Erro ao extrair dados do vídeo.')
    } finally {
      setIsExtracting(false)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    try {
      setLoading(true)
      const payload = {
        title: formData.title,
        description: formData.description,
        type: 'video' as const,
        status: 'completed' as const,
        content: { videoId: formData.videoId, duration: formData.duration }
      }

      if (tutorial) {
        await updateTutorial({ id: tutorial.id, ...payload })
        toast.success('Vídeo atualizado!')
      } else {
        await createTutorial(payload)
        toast.success('Vídeo adicionado!')
      }
      onClose()
    } catch (err) {
      toast.error('Erro ao salvar vídeo.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={(val) => !val && onClose()}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{tutorial ? 'Editar Vídeo' : 'Cadastrar Vídeo'}</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4 py-4">
          <div className="space-y-2">
            <Label>Link do Vídeo (YouTube)</Label>
            <div className="flex gap-2">
              <Input 
                placeholder="Cole o link aqui para auto-preencher..." 
                value={formData.url} 
                onChange={e => setFormData({...formData, url: e.target.value})} 
              />
              <Button 
                type="button" 
                variant="outline" 
                onClick={handleAutoFill}
                disabled={isExtracting || !formData.url}
                className="shrink-0 bg-indigo-50 text-indigo-600 border-indigo-200"
              >
                {isExtracting ? <Loader2 className="h-4 w-4 animate-spin" /> : <Sparkles className="h-4 w-4 mr-2" />}
                Extrair
              </Button>
            </div>
          </div>

          <div className="space-y-2">
            <Label>Título</Label>
            <Input required value={formData.title} onChange={e => setFormData({...formData, title: e.target.value})} />
          </div>
          
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>ID do Vídeo</Label>
              <Input required value={formData.videoId} onChange={e => setFormData({...formData, videoId: e.target.value})} placeholder="Ex: dQw4w9WgXcQ" />
            </div>
            <div className="space-y-2">
              <Label>Duração</Label>
              <Input value={formData.duration} onChange={e => setFormData({...formData, duration: e.target.value})} placeholder="Ex: 5 min" />
            </div>
          </div>
          <div className="space-y-2">
            <Label>Resumo / Descrição</Label>
            <Textarea value={formData.description} onChange={e => setFormData({...formData, description: e.target.value})} className="h-24" />
          </div>
          <DialogFooter>
            <Button type="submit" disabled={loading} className="w-full bg-rose-600 hover:bg-rose-700">
              {loading ? 'Salvando...' : 'Salvar Vídeo'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
