import { useState, useEffect } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { FileText, Save } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { toast } from 'sonner'

export function Notepad() {
  const [notes, setNotes] = useState('')
  const [isSaved, setIsSaved] = useState(true)

  useEffect(() => {
    const savedNotes = localStorage.getItem('pardallab_dashboard_notes')
    if (savedNotes) {
      setNotes(savedNotes)
    }
  }, [])

  const handleSave = () => {
    localStorage.setItem('pardallab_dashboard_notes', notes)
    setIsSaved(true)
    toast.success('Notas salvas localmente!')
  }

  const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setNotes(e.target.value)
    setIsSaved(false)
  }

  return (
    <Card className="border-none shadow-lg bg-white overflow-hidden">
      <CardHeader className="bg-slate-50 border-b py-3 px-4 flex flex-row items-center justify-between space-y-0">
        <CardTitle className="text-sm font-bold text-slate-700 flex items-center gap-2">
          <FileText className="h-4 w-4 text-blue-600" />
          Bloco de Notas Rápido
        </CardTitle>
        <Button 
          variant="ghost" 
          size="sm" 
          className={`h-8 px-2 gap-1.5 ${isSaved ? 'text-slate-400' : 'text-blue-600 animate-pulse'}`}
          onClick={handleSave}
        >
          <Save className="h-4 w-4" />
          {isSaved ? 'Salvo' : 'Salvar'}
        </Button>
      </CardHeader>
      <CardContent className="p-0">
        <textarea
          className="w-full h-48 p-4 text-sm text-slate-700 bg-white border-none focus:ring-0 resize-none placeholder:text-slate-300"
          placeholder="Escreva aqui seus rascunhos, lembretes rápidos ou ideias para processar depois..."
          value={notes}
          onChange={handleChange}
        />
      </CardContent>
    </Card>
  )
}
