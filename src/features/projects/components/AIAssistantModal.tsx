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
import { ScrollArea } from '@/components/ui/scroll-area'
import { Sparkles, Copy, Check } from 'lucide-react'
import { useAI } from '@/hooks/useAI'
import { useProjects } from '@/features/projects/hooks/useProjects'
import ReactMarkdown from 'react-markdown'
import { toast } from 'sonner'

interface AIAssistantModalProps {
  projectId: string
  title: string
  description: string
}

export function AIAssistantModal({ projectId, title, description }: AIAssistantModalProps) {
  const [open, setOpen] = useState(false)
  const { generateActionPlan, loading } = useAI()
  const { updateProject, isUpdating } = useProjects()
  const [suggestion, setSuggestion] = useState<string | null>(null)
  const [copied, setCopied] = useState(false)

  const handleApplySuggestion = async () => {
    if (!suggestion) return
    try {
      await updateProject({ id: projectId, description: suggestion })
      toast.success('Descrição do projeto atualizada!')
      setOpen(false)
    } catch (err) {
      toast.error('Erro ao atualizar projeto.')
    }
  }

  const handleGenerate = async () => {
    try {
      const result = await generateActionPlan(title, description)
      setSuggestion(result)
    } catch (err) {
      toast.error('Erro ao conectar com o Gemini.')
    }
  }

  const handleCopy = () => {
    if (suggestion) {
      navigator.clipboard.writeText(suggestion)
      setCopied(true)
      toast.success('Copiado para a área de transferência!')
      setTimeout(() => setCopied(false), 2000)
    }
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" size="icon" className="h-7 w-7 text-blue-600 border-blue-200 bg-blue-50/50 hover:bg-blue-50">
          <Sparkles className="h-3.5 w-3.5" />
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[600px] h-[80vh] flex flex-col">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Sparkles className="h-5 w-5 text-blue-600" />
            Assistente de Projeto
          </DialogTitle>
        </DialogHeader>

        <div className="flex-1 overflow-hidden py-4">
          {!suggestion ? (
            <div className="flex h-full flex-col items-center justify-center space-y-4 text-center">
              <div className="rounded-full bg-blue-100 p-4">
                <Sparkles className="h-8 w-8 text-blue-600" />
              </div>
              <div>
                <h3 className="text-lg font-medium">Pronto para detalhar seu projeto?</h3>
                <p className="text-sm text-gray-500 max-w-[300px] mx-auto">
                  Vou analisar seu título e descrição para criar um plano de ação completo.
                </p>
              </div>
              <Button onClick={handleGenerate} disabled={loading} className="bg-blue-600">
                {loading ? 'Analisando...' : 'Gerar Plano de Ação'}
              </Button>
            </div>
          ) : (
            <ScrollArea className="h-full pr-4">
              <div className="prose prose-sm prose-blue max-w-none prose-headings:font-bold prose-headings:text-blue-900 prose-p:text-gray-700">
                <ReactMarkdown>{suggestion}</ReactMarkdown>
              </div>
            </ScrollArea>
          )}
        </div>

        {suggestion && (
          <DialogFooter className="flex-row justify-between items-center sm:justify-between border-t pt-4 gap-2">
            <div className="flex gap-2">
              <Button variant="ghost" size="sm" onClick={() => setSuggestion(null)}>
                Limpar
              </Button>
              <Button onClick={handleCopy} size="sm" variant="outline" className="gap-2">
                {copied ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
                {copied ? 'Copiado' : 'Copiar'}
              </Button>
            </div>
            <Button onClick={handleApplySuggestion} disabled={isUpdating} size="sm" className="bg-blue-600">
              {isUpdating ? 'Salvando...' : 'Aplicar ao Projeto'}
            </Button>
          </DialogFooter>
        )}
      </DialogContent>
    </Dialog>
  )
}
