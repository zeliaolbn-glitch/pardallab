import { useState } from 'react'
import { Checkbox } from '@/components/ui/checkbox'
import { Plus, Trash2, ListChecks } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { cn } from '@/lib/utils'
import { useProjects } from '../hooks/useProjects'
import type { Project } from '../types'

interface ProjectUpdatesChecklistProps {
  project: Project
}

export function ProjectUpdatesChecklist({ project }: ProjectUpdatesChecklistProps) {
  const { updateProject } = useProjects()
  const [newItemText, setNewItemText] = useState('')
  const checklist = project.updates_checklist || []

  const handleAddItem = async () => {
    if (!newItemText.trim()) return
    const newItem = {
      id: crypto.randomUUID(),
      text: newItemText.trim(),
      completed: false
    }
    const updatedChecklist = [...checklist, newItem]
    await updateProject({ id: project.id, updates_checklist: updatedChecklist })
    setNewItemText('')
  }

  const handleToggleItem = async (id: string) => {
    const updatedChecklist = checklist.map(item => 
      item.id === id ? { ...item, completed: !item.completed } : item
    )
    await updateProject({ id: project.id, updates_checklist: updatedChecklist })
  }

  const handleDeleteItem = async (id: string) => {
    const updatedChecklist = checklist.filter(item => item.id !== id)
    await updateProject({ id: project.id, updates_checklist: updatedChecklist })
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between border-b pb-2">
        <div className="flex items-center gap-2">
          <ListChecks className="h-4 w-4 text-blue-500" />
          <h4 className="text-sm font-bold text-slate-700">Atualizações a Realizar</h4>
        </div>
        <span className="text-[10px] font-bold text-slate-400">
          {checklist.filter(i => i.completed).length}/{checklist.length}
        </span>
      </div>

      <div className="space-y-2 max-h-60 overflow-y-auto pr-1">
        {checklist.length === 0 ? (
          <p className="text-xs text-slate-400 italic text-center py-2">Nenhuma atualização pendente.</p>
        ) : (
          checklist.map((item) => (
            <div 
              key={item.id} 
              className={cn(
                "flex items-start gap-2 p-2 rounded-lg border transition-all",
                item.completed ? "bg-slate-50 border-slate-100" : "bg-white border-slate-200 shadow-sm"
              )}
            >
              <Checkbox 
                checked={item.completed} 
                onCheckedChange={() => handleToggleItem(item.id)}
                className="mt-0.5"
              />
              <span className={cn(
                "text-xs flex-1",
                item.completed ? "text-slate-400 line-through" : "text-slate-700"
              )}>
                {item.text}
              </span>
              <Button 
                variant="ghost" 
                size="icon" 
                className="h-6 w-6 text-slate-300 hover:text-rose-500"
                onClick={() => handleDeleteItem(item.id)}
              >
                <Trash2 className="h-3 w-3" />
              </Button>
            </div>
          ))
        )}
      </div>

      <div className="flex gap-2">
        <Input 
          placeholder="Nova atualização..." 
          className="h-8 text-xs" 
          value={newItemText}
          onChange={e => setNewItemText(e.target.value)}
          onKeyDown={e => e.key === 'Enter' && handleAddItem()}
        />
        <Button 
          size="sm" 
          className="h-8 px-2 bg-blue-600 hover:bg-blue-700"
          onClick={handleAddItem}
          disabled={!newItemText.trim()}
        >
          <Plus className="h-4 w-4" />
        </Button>
      </div>
    </div>
  )
}
