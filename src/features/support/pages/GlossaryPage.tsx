import { useState } from 'react'
import { useGlossary, type GlossaryItem } from '../hooks/useGlossary'
import { Card, CardContent } from '@/components/ui/card'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { Book, Plus, Pencil, Trash2, ExternalLink, Search, ArrowUpDown, ArrowUp, ArrowDown } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogFooter } from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { toast } from 'sonner'
import { Badge } from '@/components/ui/badge'

export default function GlossaryPage() {
  const { items, createItem, updateItem, deleteItem } = useGlossary()
  const [open, setOpen] = useState(false)
  const [searchTerm, setSearchTerm] = useState('')
  const [editItem, setEditItem] = useState<GlossaryItem | null>(null)
  const [formData, setFormData] = useState({
    expression: '',
    description: '',
    usage: '',
    tutorial_link: ''
  })
  const [sortConfig, setSortConfig] = useState<{
    key: 'expression' | 'usage' | 'description' | null
    direction: 'asc' | 'desc'
  }>({ key: null, direction: 'asc' })

  const handleSort = (key: 'expression' | 'usage' | 'description') => {
    setSortConfig(prev => {
      if (prev.key === key) {
        return { key, direction: prev.direction === 'asc' ? 'desc' : 'asc' }
      }
      return { key, direction: 'asc' }
    })
  }

  const getSortIcon = (key: 'expression' | 'usage' | 'description') => {
    if (sortConfig.key !== key) {
      return <ArrowUpDown className="h-3 w-3 text-slate-400" />
    }
    return sortConfig.direction === 'asc' 
      ? <ArrowUp className="h-3 w-3 text-indigo-600 font-bold" />
      : <ArrowDown className="h-3 w-3 text-indigo-600 font-bold" />
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (editItem) {
      await updateItem({ id: editItem.id, ...formData })
      toast.success('Termo atualizado!')
    } else {
      await createItem(formData)
      toast.success('Termo cadastrado no glossário!')
    }
    setOpen(false)
    setEditItem(null)
    setFormData({ expression: '', description: '', usage: '', tutorial_link: '' })
  }

  const handleEdit = (item: GlossaryItem) => {
    setEditItem(item)
    setFormData({
      expression: item.expression,
      description: item.description || '',
      usage: item.usage || '',
      tutorial_link: item.tutorial_link || ''
    })
    setOpen(true)
  }

  const filteredItems = items.filter(i => 
    i.expression.toLowerCase().includes(searchTerm.toLowerCase()) ||
    i.description?.toLowerCase().includes(searchTerm.toLowerCase())
  )

  const sortedItems = [...filteredItems].sort((a, b) => {
    if (!sortConfig.key) return 0
    const valA = (a[sortConfig.key] || '').toString().toLowerCase()
    const valB = (b[sortConfig.key] || '').toString().toLowerCase()

    if (valA < valB) return sortConfig.direction === 'asc' ? -1 : 1
    if (valA > valB) return sortConfig.direction === 'asc' ? 1 : -1
    return 0
  })

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Book className="h-8 w-8 text-indigo-600" />
          <h1 className="text-3xl font-bold tracking-tight">Glossário Técnico</h1>
        </div>
        
        <div className="flex items-center gap-3">
          <div className="relative w-64 flex items-center">
            <Search className="absolute left-3 h-4 w-4 text-slate-400 pointer-events-none" />
            <Input 
              placeholder="Pesquisar termo..." 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="bg-white border-slate-200 h-10 text-sm shadow-sm pl-9 pr-10 w-full"
            />
            {searchTerm && (
              <button 
                type="button" 
                onClick={() => setSearchTerm('')}
                className="absolute right-3 text-slate-400 hover:text-slate-600 text-xs font-medium"
              >
                ✕
              </button>
            )}
          </div>

          <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
              <Button className="bg-indigo-600 hover:bg-indigo-700">
                <Plus className="mr-2 h-4 w-4" /> Novo Termo
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[500px]">
              <DialogHeader>
                <DialogTitle>{editItem ? 'Editar Termo' : 'Adicionar ao Glossário'}</DialogTitle>
              </DialogHeader>
              <form onSubmit={handleSubmit} className="space-y-4 py-4">
                <div className="space-y-2">
                  <Label>Expressão / Termo</Label>
                  <Input required value={formData.expression} onChange={e => setFormData({...formData, expression: e.target.value})} placeholder="Ex: API, Hooks, Deploy..." />
                </div>
                <div className="space-y-2">
                  <Label>Descrição / Definição</Label>
                  <Textarea required value={formData.description} onChange={e => setFormData({...formData, description: e.target.value})} rows={3} />
                </div>
                <div className="space-y-2">
                  <Label>Como usar (Uso)</Label>
                  <Input value={formData.usage} onChange={e => setFormData({...formData, usage: e.target.value})} placeholder="Ex: Utilizado para integração..." />
                </div>
                <div className="space-y-2">
                  <Label>Link Tutorial / Referência</Label>
                  <Input value={formData.tutorial_link} onChange={e => setFormData({...formData, tutorial_link: e.target.value})} placeholder="https://..." />
                </div>
                <DialogFooter>
                  <Button type="submit" className="w-full bg-indigo-600">Salvar Termo</Button>
                </DialogFooter>
              </form>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      <Card className="border-none shadow-md overflow-hidden">
        <CardContent className="p-0">
          <Table>
            <TableHeader className="bg-indigo-50/50">
              <TableRow>
                <TableHead 
                  className="w-[200px] cursor-pointer select-none hover:bg-indigo-100/50 transition-colors py-3"
                  onClick={() => handleSort('expression')}
                >
                  <div className="flex items-center gap-1.5 font-bold text-slate-700">
                    Expressão {getSortIcon('expression')}
                  </div>
                </TableHead>
                <TableHead 
                  className="cursor-pointer select-none hover:bg-indigo-100/50 transition-colors py-3"
                  onClick={() => handleSort('description')}
                >
                  <div className="flex items-center gap-1.5 font-bold text-slate-700">
                    Descrição {getSortIcon('description')}
                  </div>
                </TableHead>
                <TableHead 
                  className="cursor-pointer select-none hover:bg-indigo-100/50 transition-colors py-3"
                  onClick={() => handleSort('usage')}
                >
                  <div className="flex items-center gap-1.5 font-bold text-slate-700">
                    Uso {getSortIcon('usage')}
                  </div>
                </TableHead>
                <TableHead className="text-right font-bold text-slate-700">Ações</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredItems.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={4} className="h-32 text-center text-gray-500">
                    Nenhum termo encontrado no glossário.
                  </TableCell>
                </TableRow>
              ) : (
                sortedItems.map((item) => (
                  <TableRow key={item.id} className="hover:bg-indigo-50/10 transition-colors">
                    <TableCell className="font-bold text-indigo-900">{item.expression}</TableCell>
                    <TableCell className="text-sm text-slate-600 max-w-xs whitespace-pre-wrap">{item.description}</TableCell>
                    <TableCell>
                      <Badge variant="outline" className="font-normal text-slate-500 border-slate-200">
                        {item.usage || '-'}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end gap-2">
                        {item.tutorial_link && (
                          <Button size="icon" variant="ghost" className="h-8 w-8 text-blue-500" onClick={() => window.open(item.tutorial_link, '_blank')}>
                            <ExternalLink className="h-4 w-4" />
                          </Button>
                        )}
                        <Button size="icon" variant="ghost" className="h-8 w-8 text-indigo-600" onClick={() => handleEdit(item)}>
                          <Pencil className="h-4 w-4" />
                        </Button>
                        <Button size="icon" variant="ghost" className="h-8 w-8 text-rose-500" onClick={() => {
                          if(confirm('Deseja excluir este termo?')) deleteItem(item.id)
                        }}>
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
    </div>
  )
}
