import { useState } from 'react'
import { useProjects } from '@/features/projects/hooks/useProjects'
import { usePrompts, useStandardPrompts, type Prompt, type StandardPromptItem } from '../hooks/usePrompts'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog'
import { Badge } from '@/components/ui/badge'
import { toast } from 'sonner'
import {
  Terminal, Copy, Download, Plus, Pencil, Trash2,
  Sparkles, ChevronDown, ChevronUp, GripVertical, ArrowUpDown, X
} from 'lucide-react'

// ── Sub-painel: Prompt Padrão ────────────────────────────────────────────────
function StandardPromptsPanel({ onClose }: { onClose: () => void }) {
  const { items, createItem, updateItem, deleteItem } = useStandardPrompts()
  const [editId, setEditId] = useState<string | null>(null)
  const [newFocus, setNewFocus] = useState('')
  const [newDesc, setNewDesc] = useState('')
  const [sortAsc, setSortAsc] = useState(true)

  const sorted = [...items].sort((a, b) =>
    sortAsc ? a.order_index - b.order_index : b.order_index - a.order_index
  )

  const handleAdd = async () => {
    if (!newFocus.trim()) return
    try {
      await createItem({ focus: newFocus.trim(), description: newDesc.trim(), order_index: items.length })
      setNewFocus('')
      setNewDesc('')
      toast.success('Item adicionado!')
    } catch {
      toast.error('Erro ao adicionar.')
    }
  }

  const handleUpdate = async (item: StandardPromptItem, focus: string, desc: string) => {
    try {
      await updateItem({ id: item.id, focus, description: desc })
      setEditId(null)
      toast.success('Atualizado!')
    } catch {
      toast.error('Erro ao atualizar.')
    }
  }

  return (
    <div className="fixed inset-0 z-50 bg-black/40 flex items-center justify-center p-4" onClick={onClose}>
      <div
        className="bg-white dark:bg-slate-900 rounded-2xl shadow-2xl w-full max-w-2xl max-h-[90vh] flex flex-col overflow-hidden"
        onClick={e => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b bg-gradient-to-r from-violet-50 to-indigo-50 dark:from-violet-950/30 dark:to-indigo-950/30">
          <div>
            <h2 className="text-xl font-bold text-violet-900 dark:text-violet-300 flex items-center gap-2">
              <Sparkles className="h-5 w-5" /> Prompt Padrão
            </h2>
            <p className="text-xs text-violet-600 dark:text-violet-400 mt-0.5">Lista de focos e instruções recorrentes</p>
          </div>
          <div className="flex items-center gap-2">
            <Button
              size="sm" variant="outline"
              className="h-8 text-xs"
              onClick={() => setSortAsc(!sortAsc)}
            >
              <ArrowUpDown className="h-3 w-3 mr-1" />
              {sortAsc ? 'Crescente' : 'Decrescente'}
            </Button>
            <Button size="icon" variant="ghost" className="h-8 w-8" onClick={onClose}>
              <X className="h-4 w-4" />
            </Button>
          </div>
        </div>

        {/* Lista */}
        <div className="flex-1 overflow-y-auto p-4 space-y-2">
          {sorted.length === 0 ? (
            <div className="text-center py-12 text-slate-400 text-sm">Nenhum item ainda. Adicione abaixo.</div>
          ) : sorted.map((item) => (
            <StandardPromptRow
              key={item.id}
              item={item}
              isEditing={editId === item.id}
              onEdit={() => setEditId(item.id)}
              onSave={handleUpdate}
              onCancel={() => setEditId(null)}
              onDelete={() => deleteItem(item.id)}
              onMoveUp={() => updateItem({ id: item.id, order_index: Math.max(0, item.order_index - 1) })}
              onMoveDown={() => updateItem({ id: item.id, order_index: item.order_index + 1 })}
            />
          ))}
        </div>

        {/* Adicionar novo */}
        <div className="border-t p-4 bg-slate-50 dark:bg-slate-800/50 space-y-3">
          <p className="text-xs font-bold text-slate-500 uppercase tracking-wider">Adicionar Item</p>
          <div className="flex gap-2">
            <div className="flex-1 space-y-2">
              <Input
                placeholder="Foco (ex: SEO, UX, Performance...)"
                value={newFocus}
                onChange={e => setNewFocus(e.target.value)}
                className="h-8 text-sm"
              />
              <Input
                placeholder="Descrição da instrução..."
                value={newDesc}
                onChange={e => setNewDesc(e.target.value)}
                className="h-8 text-sm"
                onKeyDown={e => e.key === 'Enter' && handleAdd()}
              />
            </div>
            <Button
              className="bg-violet-600 hover:bg-violet-700 h-full px-4"
              onClick={handleAdd}
              disabled={!newFocus.trim()}
            >
              <Plus className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}

// ── Linha individual do Prompt Padrão ────────────────────────────────────────
function StandardPromptRow({
  item, isEditing, onEdit, onSave, onCancel, onDelete, onMoveUp, onMoveDown
}: {
  item: StandardPromptItem
  isEditing: boolean
  onEdit: () => void
  onSave: (item: StandardPromptItem, focus: string, desc: string) => void
  onCancel: () => void
  onDelete: () => void
  onMoveUp: () => void
  onMoveDown: () => void
}) {
  const [focus, setFocus] = useState(item.focus)
  const [desc, setDesc] = useState(item.description)

  if (isEditing) {
    return (
      <div className="bg-violet-50 dark:bg-violet-900/20 border border-violet-200 rounded-lg p-3 space-y-2">
        <Input value={focus} onChange={e => setFocus(e.target.value)} className="h-7 text-sm font-bold" />
        <Input value={desc} onChange={e => setDesc(e.target.value)} className="h-7 text-sm" />
        <div className="flex gap-2 justify-end">
          <Button size="sm" variant="ghost" className="h-7 text-xs" onClick={onCancel}>Cancelar</Button>
          <Button size="sm" className="h-7 text-xs bg-violet-600" onClick={() => onSave(item, focus, desc)}>Salvar</Button>
        </div>
      </div>
    )
  }

  return (
    <div className="flex items-center gap-2 p-3 bg-white dark:bg-slate-800 border border-slate-100 dark:border-slate-700 rounded-lg hover:shadow-sm transition-all group">
      <GripVertical className="h-4 w-4 text-slate-300 shrink-0" />
      <div className="flex flex-col flex-1 min-w-0">
        <span className="text-sm font-bold text-violet-700 dark:text-violet-400 truncate">{item.focus}</span>
        <span className="text-xs text-slate-500 truncate">{item.description || '—'}</span>
      </div>
      <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
        <Button size="icon" variant="ghost" className="h-6 w-6" onClick={onMoveUp}><ChevronUp className="h-3 w-3" /></Button>
        <Button size="icon" variant="ghost" className="h-6 w-6" onClick={onMoveDown}><ChevronDown className="h-3 w-3" /></Button>
        <Button size="icon" variant="ghost" className="h-6 w-6 text-blue-500" onClick={onEdit}><Pencil className="h-3 w-3" /></Button>
        <Button size="icon" variant="ghost" className="h-6 w-6 text-rose-500" onClick={onDelete}><Trash2 className="h-3 w-3" /></Button>
      </div>
    </div>
  )
}

// ── Modal de Criar/Editar Prompt Manual ──────────────────────────────────────
function PromptModal({ prompt, open, onClose }: { prompt?: Prompt | null, open: boolean, onClose: () => void }) {
  const { createPrompt, updatePrompt } = usePrompts()
  const [form, setForm] = useState({
    title: prompt?.title || '',
    content: prompt?.content || '',
    category: prompt?.category || 'Geral',
    order_index: prompt?.order_index ?? 0
  })
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    try {
      if (prompt) {
        await updatePrompt({ id: prompt.id, ...form })
        toast.success('Prompt atualizado!')
      } else {
        await createPrompt(form)
        toast.success('Prompt criado!')
      }
      onClose()
    } catch {
      toast.error('Erro ao salvar.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={v => !v && onClose()}>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle>{prompt ? 'Editar Prompt' : 'Novo Prompt'}</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4 py-2">
          <div className="grid grid-cols-3 gap-4">
            <div className="col-span-2 space-y-2">
              <Label>Título</Label>
              <Input required value={form.title} onChange={e => setForm({ ...form, title: e.target.value })} placeholder="Ex: Prompt para Landing Page" />
            </div>
            <div className="space-y-2">
              <Label>Categoria</Label>
              <Input value={form.category} onChange={e => setForm({ ...form, category: e.target.value })} placeholder="Ex: SEO, UI, Dev" />
            </div>
          </div>
          <div className="space-y-2">
            <Label>Conteúdo do Prompt</Label>
            <Textarea
              required
              value={form.content}
              onChange={e => setForm({ ...form, content: e.target.value })}
              className="font-mono text-xs min-h-[200px]"
              placeholder="Cole ou escreva seu prompt aqui..."
            />
          </div>
          <div className="space-y-2">
            <Label>Ordem</Label>
            <Input type="number" className="w-24" value={form.order_index} onChange={e => setForm({ ...form, order_index: Number(e.target.value) })} />
          </div>
          <DialogFooter>
            <Button type="submit" disabled={loading} className="bg-blue-600 hover:bg-blue-700 w-full">
              {loading ? 'Salvando...' : 'Salvar Prompt'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}

// ── Página Principal ─────────────────────────────────────────────────────────
export default function PromptsPage() {
  const { projects } = useProjects()
  const { prompts, deletePrompt } = usePrompts()

  const [showStandard, setShowStandard] = useState(false)
  const [modalOpen, setModalOpen] = useState(false)
  const [editPrompt, setEditPrompt] = useState<Prompt | null>(null)
  const [sortBy, setSortBy] = useState<'order' | 'title' | 'category'>('order')
  const [sortAsc, setSortAsc] = useState(true)
  const [search, setSearch] = useState('')
  const [expandedId, setExpandedId] = useState<string | null>(null)

  // Prompts de projetos (automáticos)
  const projectPrompts = projects.filter(p => p.prompt_used).map(p => ({
    id: p.id, title: p.title, content: p.prompt_used!, category: 'Projeto', order_index: 999, created_at: p.created_at
  }))

  // Todos os prompts combinados
  const allPrompts: Prompt[] = [...prompts, ...projectPrompts]

  const filtered = allPrompts
    .filter(p =>
      p.title.toLowerCase().includes(search.toLowerCase()) ||
      p.content.toLowerCase().includes(search.toLowerCase()) ||
      p.category.toLowerCase().includes(search.toLowerCase())
    )
    .sort((a, b) => {
      const va = sortBy === 'order' ? a.order_index : sortBy === 'title' ? a.title : a.category
      const vb = sortBy === 'order' ? b.order_index : sortBy === 'title' ? b.title : b.category
      if (va < vb) return sortAsc ? -1 : 1
      if (va > vb) return sortAsc ? 1 : -1
      return 0
    })

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text)
    toast.success('Prompt copiado!')
  }

  const downloadAsTxt = (title: string, content: string) => {
    const el = document.createElement('a')
    el.href = URL.createObjectURL(new Blob([content], { type: 'text/plain' }))
    el.download = `${title.replace(/\s+/g, '_')}_prompt.txt`
    document.body.appendChild(el)
    el.click()
    el.remove()
  }

  const handleEdit = (p: Prompt) => {
    setEditPrompt(p)
    setModalOpen(true)
  }

  const handleDelete = async (p: Prompt) => {
    if (!confirm(`Deletar o prompt "${p.title}"?`)) return
    try {
      await deletePrompt(p.id)
      toast.success('Prompt removido!')
    } catch {
      toast.error('Erro ao remover.')
    }
  }

  const cycleSortBy = (field: 'order' | 'title' | 'category') => {
    if (sortBy === field) setSortAsc(!sortAsc)
    else { setSortBy(field); setSortAsc(true) }
  }

  return (
    <div className="space-y-6">
      {showStandard && <StandardPromptsPanel onClose={() => setShowStandard(false)} />}

      {/* Header */}
      <div className="flex items-start justify-between gap-4">
        <div className="flex items-center gap-2">
          <Terminal className="h-8 w-8 text-blue-600" />
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Biblioteca de Prompts</h1>
            <p className="text-sm text-slate-500 mt-0.5">Prompts estruturados para replicação rápida.</p>
          </div>
        </div>
        <div className="flex items-center gap-2 flex-wrap justify-end">
          {/* Botão Prompt Padrão */}
          <Button
            variant="outline"
            className="border-violet-300 text-violet-700 hover:bg-violet-50 gap-2"
            onClick={() => setShowStandard(true)}
          >
            <Sparkles className="h-4 w-4" />
            Prompt Padrão
          </Button>
          {/* Botão Novo Prompt */}
          <Button
            className="bg-blue-600 hover:bg-blue-700 gap-2"
            onClick={() => { setEditPrompt(null); setModalOpen(true) }}
          >
            <Plus className="h-4 w-4" />
            Novo Prompt
          </Button>
        </div>
      </div>

      {/* Barra de filtros */}
      <div className="flex items-center gap-2 flex-wrap">
        <Input
          placeholder="Buscar prompts..."
          className="w-64"
          value={search}
          onChange={e => setSearch(e.target.value)}
        />
        <div className="flex items-center gap-1 ml-auto">
          <span className="text-xs text-slate-400 mr-1">Ordenar por:</span>
          {(['order', 'title', 'category'] as const).map(f => (
            <Button
              key={f}
              size="sm"
              variant={sortBy === f ? 'default' : 'outline'}
              className={`h-8 text-xs px-3 ${sortBy === f ? 'bg-blue-600' : ''}`}
              onClick={() => cycleSortBy(f)}
            >
              {f === 'order' ? 'Ordem' : f === 'title' ? 'Título' : 'Categoria'}
              {sortBy === f && <ArrowUpDown className="h-3 w-3 ml-1" />}
            </Button>
          ))}
        </div>
      </div>

      {/* Lista fina de prompts */}
      <div className="flex flex-col gap-1">
        {filtered.length === 0 ? (
          <div className="py-20 text-center bg-slate-50 rounded-xl border-2 border-dashed">
            <Terminal className="h-12 w-12 text-slate-300 mx-auto mb-4" />
            <p className="text-slate-500">Nenhum prompt encontrado.</p>
            <Button className="mt-4 bg-blue-600" onClick={() => { setEditPrompt(null); setModalOpen(true) }}>
              <Plus className="h-4 w-4 mr-2" /> Criar primeiro prompt
            </Button>
          </div>
        ) : (
          filtered.map((p) => {
            const isExpanded = expandedId === p.id
            return (
              <div
                key={p.id}
                className="border border-slate-200 dark:border-slate-700 rounded-lg bg-white dark:bg-slate-800 overflow-hidden shadow-sm hover:shadow-md transition-shadow"
              >
                {/* Linha principal (sempre visível) */}
                <div
                  className="flex items-center gap-3 px-4 py-2.5 cursor-pointer group"
                  onClick={() => setExpandedId(isExpanded ? null : p.id)}
                >
                  <ChevronDown
                    className={`h-3.5 w-3.5 text-slate-400 shrink-0 transition-transform duration-200 ${isExpanded ? 'rotate-180' : ''}`}
                  />
                  <Badge variant="outline" className="text-[10px] h-4 shrink-0 px-1.5">{p.category}</Badge>
                  <span className="text-sm font-semibold text-slate-800 dark:text-slate-100 truncate flex-1">{p.title}</span>
                  <span className="text-xs text-slate-400 truncate max-w-[240px] hidden md:block">
                    {p.content.replace(/\n/g, ' ').substring(0, 80)}…
                  </span>
                  {/* Ações — aparecem ao hover */}
                  <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity shrink-0" onClick={e => e.stopPropagation()}>
                    <Button variant="ghost" size="icon" className="h-6 w-6 text-slate-400 hover:text-blue-600" onClick={() => copyToClipboard(p.content)} title="Copiar">
                      <Copy className="h-3 w-3" />
                    </Button>
                    <Button variant="ghost" size="icon" className="h-6 w-6 text-slate-400 hover:text-green-600" onClick={() => downloadAsTxt(p.title, p.content)} title="Baixar">
                      <Download className="h-3 w-3" />
                    </Button>
                    {p.category !== 'Projeto' && (
                      <>
                        <Button variant="ghost" size="icon" className="h-6 w-6 text-slate-400 hover:text-indigo-600" onClick={() => handleEdit(p)} title="Editar">
                          <Pencil className="h-3 w-3" />
                        </Button>
                        <Button variant="ghost" size="icon" className="h-6 w-6 text-slate-400 hover:text-rose-500" onClick={() => handleDelete(p)} title="Deletar">
                          <Trash2 className="h-3 w-3" />
                        </Button>
                      </>
                    )}
                  </div>
                </div>

                {/* Conteúdo expandido */}
                {isExpanded && (
                  <div className="border-t border-slate-100 dark:border-slate-700 px-4 pb-4 pt-3">
                    <pre className="text-xs text-slate-100 bg-slate-900 p-4 rounded-lg whitespace-pre-wrap font-mono max-h-72 overflow-y-auto">
                      {p.content}
                    </pre>
                    <div className="flex gap-2 mt-3">
                      <Button size="sm" variant="outline" className="h-7 text-xs" onClick={() => copyToClipboard(p.content)}>
                        <Copy className="h-3 w-3 mr-1" /> Copiar
                      </Button>
                      <Button size="sm" variant="outline" className="h-7 text-xs" onClick={() => downloadAsTxt(p.title, p.content)}>
                        <Download className="h-3 w-3 mr-1" /> Baixar .txt
                      </Button>
                    </div>
                  </div>
                )}
              </div>
            )
          })
        )}
      </div>

      {/* Modal de criar/editar */}
      <PromptModal
        prompt={editPrompt}
        open={modalOpen}
        onClose={() => { setModalOpen(false); setEditPrompt(null) }}
      />
    </div>
  )
}
