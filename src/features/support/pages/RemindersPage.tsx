import { useState } from 'react'
import { useReminders, type Reminder } from '../hooks/useReminders'
import { Card, CardContent, CardHeader } from '@/components/ui/card'
import { Checkbox } from '@/components/ui/checkbox'
import { ListTodo, Plus, Pencil, Trash2, Calendar, ArrowUpDown, Search, ArrowUp, ArrowDown } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { toast } from 'sonner'
import { cn } from '@/lib/utils'

export default function RemindersPage() {
  const { reminders, createReminder, toggleReminder, deleteReminder, updateReminder } = useReminders()
  const [newText, setNewText] = useState('')
  const [editingId, setEditingId] = useState<string | null>(null)
  const [editText, setEditText] = useState('')
  const [searchQuery, setSearchQuery] = useState('')
  const [sortConfig, setSortConfig] = useState<{
    key: 'completed' | 'content' | 'created_at' | null
    direction: 'asc' | 'desc'
  }>({ key: null, direction: 'asc' })

  const handleSort = (key: 'completed' | 'content' | 'created_at') => {
    setSortConfig(prev => {
      if (prev.key === key) {
        return { key, direction: prev.direction === 'asc' ? 'desc' : 'asc' }
      }
      return { key, direction: 'asc' }
    })
  }

  const getSortIcon = (key: 'completed' | 'content' | 'created_at') => {
    if (sortConfig.key !== key) {
      return <ArrowUpDown className="h-3 w-3 text-slate-400" />
    }
    return sortConfig.direction === 'asc' 
      ? <ArrowUp className="h-3 w-3 text-amber-600 font-bold" />
      : <ArrowDown className="h-3 w-3 text-amber-600 font-bold" />
  }

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

  const sortedReminders = [...filteredReminders].sort((a, b) => {
    if (!sortConfig.key) return 0
    let valA = (a[sortConfig.key] || '').toString().toLowerCase()
    let valB = (b[sortConfig.key] || '').toString().toLowerCase()

    if (sortConfig.key === 'completed') {
      valA = a.completed ? 'true' : 'false'
      valB = b.completed ? 'true' : 'false'
    }

    if (valA < valB) return sortConfig.direction === 'asc' ? -1 : 1
    if (valA > valB) return sortConfig.direction === 'asc' ? 1 : -1
    return 0
  })

  return (
    <div className="max-w-4xl mx-auto space-y-8">
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
            <div className="flex gap-2">
              <div className="relative flex-1 flex items-center">
                <Search className="absolute left-3 h-4 w-4 text-slate-400 pointer-events-none" />
                <Input
                  placeholder="Filtrar pendências por nome..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="bg-white border-slate-200 h-10 text-sm shadow-sm pl-9 pr-16 w-full"
                />
                {searchQuery && (
                  <button 
                    type="button" 
                    onClick={() => setSearchQuery('')}
                    className="absolute right-3 text-slate-400 hover:text-slate-600 text-xs font-medium"
                  >
                    Limpar
                  </button>
                )}
              </div>
            </div>
          )}
        </CardHeader>
        <CardContent className="p-0">
          <Table>
            <TableHeader className="bg-amber-50/50">
              <TableRow>
                <TableHead 
                  className="w-[100px] cursor-pointer select-none hover:bg-amber-100/50 transition-colors py-3"
                  onClick={() => handleSort('completed')}
                >
                  <div className="flex items-center gap-1.5 font-bold text-slate-700">
                    Status {getSortIcon('completed')}
                  </div>
                </TableHead>
                <TableHead 
                  className="cursor-pointer select-none hover:bg-amber-100/50 transition-colors py-3"
                  onClick={() => handleSort('content')}
                >
                  <div className="flex items-center gap-1.5 font-bold text-slate-700">
                    Descrição / Lembrete {getSortIcon('content')}
                  </div>
                </TableHead>
                <TableHead 
                  className="cursor-pointer select-none hover:bg-amber-100/50 transition-colors py-3"
                  onClick={() => handleSort('created_at')}
                >
                  <div className="flex items-center gap-1.5 font-bold text-slate-700">
                    Data de Inserção {getSortIcon('created_at')}
                  </div>
                </TableHead>
                <TableHead className="text-right font-bold text-slate-700">Ações</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {reminders.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={4} className="h-32 text-center text-slate-400">
                    <Calendar className="h-12 w-12 mx-auto opacity-20 mb-2" />
                    Nenhuma pendência. Aproveite o sossego! 🎉
                  </TableCell>
                </TableRow>
              ) : filteredReminders.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={4} className="h-32 text-center text-slate-400">
                    <Calendar className="h-12 w-12 mx-auto opacity-20 mb-2" />
                    Nenhuma pendência encontrada com o nome "{searchQuery}".
                  </TableCell>
                </TableRow>
              ) : (
                sortedReminders.map((reminder) => (
                  <TableRow 
                    key={reminder.id} 
                    className={cn(
                      "hover:bg-amber-50/10 transition-colors",
                      reminder.completed && "opacity-60 bg-slate-50/30"
                    )}
                  >
                    <TableCell className="py-3">
                      <Checkbox 
                        checked={reminder.completed}
                        onCheckedChange={(checked: boolean | 'indeterminate') => 
                          toggleReminder({ id: reminder.id, completed: checked === true })
                        }
                        className="h-6 w-6 border-slate-300 data-[state=checked]:bg-amber-500 data-[state=checked]:border-amber-500"
                      />
                    </TableCell>
                    <TableCell className="py-3">
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
                          "text-base font-medium text-slate-700 transition-all",
                          reminder.completed && "line-through text-slate-400"
                        )}>
                          {reminder.content}
                        </p>
                      )}
                    </TableCell>
                    <TableCell className="text-xs text-slate-500 font-medium py-3">
                      {reminder.created_at ? new Date(reminder.created_at).toLocaleDateString('pt-BR') : '-'}
                    </TableCell>
                    <TableCell className="text-right py-3">
                      <div className="flex justify-end gap-1">
                        {!reminder.completed && editingId !== reminder.id && (
                          <Button size="icon" variant="ghost" className="h-8 w-8 text-slate-400 hover:text-blue-500" onClick={() => handleStartEdit(reminder)}>
                            <Pencil className="h-4 w-4" />
                          </Button>
                        )}
                        <Button size="icon" variant="ghost" className="h-8 w-8 text-slate-400 hover:text-rose-500" onClick={() => deleteReminder(reminder.id)}>
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
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
