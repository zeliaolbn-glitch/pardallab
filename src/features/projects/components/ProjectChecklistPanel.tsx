import { useProjectStandards, useProjectChecklist } from '../hooks/useProjectStandards'
import { Checkbox } from '@/components/ui/checkbox'
import { ClipboardList } from 'lucide-react'
import { cn } from '@/lib/utils'

interface ProjectChecklistPanelProps {
  projectId: string
}

export function ProjectChecklistPanel({ projectId }: ProjectChecklistPanelProps) {
  const { standards } = useProjectStandards()
  const { checklist, toggleItem } = useProjectChecklist(projectId)

  if (standards.length === 0) return null

  const getCompleted = (standardId: string) =>
    checklist.find(c => c.standard_id === standardId)?.completed ?? false

  const completedCount = standards.filter(s => getCompleted(s.id)).length
  const progress = Math.round((completedCount / standards.length) * 100)

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <ClipboardList className="h-4 w-4 text-violet-500" />
          <span className="text-sm font-bold text-slate-700 dark:text-slate-300">Checklist do Projeto</span>
        </div>
        <span className="text-xs font-medium text-violet-600 dark:text-violet-400">
          {completedCount}/{standards.length} ({progress}%)
        </span>
      </div>

      {/* Barra de progresso */}
      <div className="h-1.5 bg-slate-100 dark:bg-slate-700 rounded-full overflow-hidden">
        <div
          className="h-full bg-violet-500 rounded-full transition-all duration-500"
          style={{ width: `${progress}%` }}
        />
      </div>

      <div className="space-y-2">
        {standards.map((standard, index) => {
          const completed = getCompleted(standard.id)
          return (
            <div
              key={standard.id}
              className={cn(
                "flex items-start gap-3 p-2.5 rounded-lg transition-colors cursor-pointer",
                completed ? "bg-violet-50 dark:bg-violet-900/20" : "hover:bg-slate-50 dark:hover:bg-slate-800/50"
              )}
              onClick={() => toggleItem({ standardId: standard.id, completed: !completed })}
            >
              <Checkbox
                checked={completed}
                onCheckedChange={(checked: boolean | 'indeterminate') =>
                  toggleItem({ standardId: standard.id, completed: checked === true })
                }
                className="mt-0.5 data-[state=checked]:bg-violet-500 data-[state=checked]:border-violet-500"
                onClick={e => e.stopPropagation()}
              />
              <div className="flex-1 min-w-0">
                <p className={cn(
                  "text-sm font-medium transition-all",
                  completed ? "line-through text-slate-400" : "text-slate-700 dark:text-slate-200"
                )}>
                  <span className="text-violet-400 dark:text-violet-500 mr-1.5 text-xs font-bold">{index + 1}.</span>
                  {standard.title}
                </p>
                {standard.description && (
                  <p className="text-xs text-slate-400 mt-0.5">{standard.description}</p>
                )}
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}
