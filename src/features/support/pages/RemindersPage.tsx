import { useState } from 'react'
import { useReminders, type Reminder } from '../hooks/useReminders'
import { Card, CardContent, CardHeader } from '@/components/ui/card'
import { Checkbox } from '@/components/ui/checkbox'
import { ListTodo, Plus, Pencil, Trash2, Calendar } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { toast } from 'sonner'
import { cn } from '@/lib/utils'

export default function RemindersPage() {
  const { reminders, createReminder, toggleReminder, deleteReminder, updateReminder } = useReminders()
  const [newText, setNewText] = useState('')
  const [editingId, setEditingId] = useState<string | null>(null)
  const [editText, setEditText] = useState('')
  const [searchQuery, setSearchQuery] = useState('')

  const handleAdd = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!newText.trim()) return
    await createReminder(newText)
    setNewText('')
    toast.success('Pendência adicionada!')
  }

  const handleStartEdit = (reminder: Reminder) => {
    setEditingId(reminder.id)
    setEditText(reminder.content)
  }

  const handleSaveEdit = async (id: string) => {
    if (!editText.trim()) return
    await updateReminder({ id, content: editText })
    setEditingId(null)
    toast.success('Lembrete atualizado!')
  }

  const pendingCount = reminders.filter(r => !r.completed).length
  const completedCount = reminders.filter(r => r.completed).length

  const filteredReminders = reminders.filter(r =>
    r.content.toLowerCase().includes(searchQuery.toLowerCase())
  )

  return (
    <div className="max-w-3xl mx-auto space-y-8">
      <div className="flex items-center gap-3">
        <div className="bg-amber-100 p-3 rounded-2xl">
          <ListTodo className="h-8 w-8 text-amber-600" />
        </div>
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-slate-800">Bloco de Pendências</h1>
          <p className="text-slate-500">
            {pendingCount} pendente{pendingCount !== 1 ? 's' : ''} · {completedCount} concluída{completedCount !== 1 ? 's' : ''}
          </p>
        </div>
      </div>

      <Card className="border-none shadow-lg bg-white overflow-hidden">
        <CardHeader className="bg-slate-50/50 border-b py-4 space-y-3">
          <form onSubmit={handleAdd} className="flex gap-2">
            <Input 
              placeholder="O que precisa ser feito?" 
              value={newText}
              onChange={(e) => setNewText(e.target.value)}
              className="bg-white border-slate-200 h-12 text-base shadow-sm"
            />
            <Button type="submit" className="h-12 px-6 bg-amber-500 hover:bg-amber-600 shadow-md">
              <Plus className="h-5 w-5" />
            </Button>
          </form>
          {reminders.length > 0 && (
            <div className="relative">
              <Input
                placeholder="🔍 Filtrar pendências por nome..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="bg-white border-slate-200 h-10 text-sm shadow-sm pl-8"
              />
              {searchQuery && (
                <button 
                  type="button" 
                  onClick={() => setSearchQuery('')}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 text-xs font-medium"
                >
                  Limpar
                </button>
              )}
            </div>
          )}
        </CardHeader>
        <CardContent className="p-0">
          <div className="divide-y divide-slate-100">
            {reminders.length === 0 ? (
              <div className="p-12 text-center text-slate-400 space-y-2">
                <Calendar className="h-12 w-12 mx-auto opacity-20" />
                <p>Nenhuma pendência. Aproveite o sossego! 🎉</p>
              </div>
            ) : filteredReminders.length === 0 ? (
              <div className="p-12 text-center text-slate-400 space-y-2">
                <Calendar className="h-12 w-12 mx-auto opacity-20" />
                <p>Nenhuma pendência encontrada com o nome "{searchQuery}".</p>
              </div>
            ) : (
              filteredReminders.map((reminder) => (

                <div 
                  key={reminder.id} 
                  className={cn(
                    "group flex items-center gap-4 p-4 transition-all hover:bg-slate-50/50",
                    reminder.completed && "opacity-60 bg-slate-50/30"
                  )}
                >
                  <Checkbox 
                    checked={reminder.completed}
                    onCheckedChange={(checked: boolean | 'indeterminate') => 
                      toggleReminder({ id: reminder.id, completed: checked === true })
                    }
                    className="h-6 w-6 border-slate-300 data-[state=checked]:bg-amber-500 data-[state=checked]:border-amber-500"
                  />
                  
                  <div className="flex-1 min-w-0">
                    {editingId === reminder.id ? (
                      <div className="flex gap-2">
                        <Input 
                          autoFocus
                          value={editText}
                          onChange={(e) => setEditText(e.target.value)}
                          onKeyDown={(e) => e.key === 'Enter' && handleSaveEdit(reminder.id)}
                          className="h-9"
                        />
                        <Button size="sm" onClick={() => handleSaveEdit(reminder.id)}>Salvar</Button>
                        <Button size="sm" variant="ghost" onClick={() => setEditingId(null)}>✕</Button>
                      </div>
                    ) : (
                      <p className={cn(
                        "text-base font-medium text-slate-700 truncate transition-all",
                        reminder.completed && "line-through text-slate-400"
                      )}>
                        {reminder.content}
                      </p>
                    )}
                  </div>

                  <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                    {!reminder.completed && editingId !== reminder.id && (
                      <Button size="icon" variant="ghost" className="h-8 w-8 text-slate-400 hover:text-blue-500" onClick={() => handleStartEdit(reminder)}>
                        <Pencil className="h-4 w-4" />
                      </Button>
                    )}
                    <Button size="icon" variant="ghost" className="h-8 w-8 text-slate-400 hover:text-rose-500" onClick={() => deleteReminder(reminder.id)}>
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              ))
            )}
          </div>
        </CardContent>
      </Card>

      {completedCount > 0 && (
        <div className="text-center">
          <Button 
            variant="ghost" 
            className="text-xs text-slate-400 hover:text-rose-500"
            onClick={() => {
              if(confirm('Limpar todas as tarefas concluídas?')) {
                reminders.filter(r => r.completed).forEach(r => deleteReminder(r.id))
              }
            }}
          >
            Limpar {completedCount} tarefa{completedCount !== 1 ? 's' : ''} concluída{completedCount !== 1 ? 's' : ''}
          </Button>
        </div>
      )}
    </div>
  )
}
