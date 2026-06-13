import { useState } from 'react'
import { useTools, type Tool } from '../hooks/useTools'
import { Card, CardContent } from '@/components/ui/card'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { Wrench, Plus, Pencil, Trash2, Key, User, ArrowUpDown, ArrowUp, ArrowDown } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogFooter } from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { toast } from 'sonner'
import { Badge } from '@/components/ui/badge'
import { HoverCard, HoverCardContent, HoverCardTrigger } from '@/components/ui/hover-card'
import { ExternalLink, Globe } from 'lucide-react'

export default function ToolsPage() {
  const { tools, createTool, updateTool, deleteTool } = useTools()
  const [open, setOpen] = useState(false)
  const [editTool, setEditTool] = useState<Tool | null>(null)
  const [formData, setFormData] = useState({
    name: '',
    main_function: '',
    accounts: '',
    description: '',
    url: '',
    category: 'Geral'
  })

  const [sortConfig, setSortConfig] = useState<{
    key: 'name' | 'main_function' | 'url' | 'accounts' | 'created_at' | null
    direction: 'asc' | 'desc'
  }>({ key: null, direction: 'asc' })

  const [searchQuery, setSearchQuery] = useState('')

  const handleSort = (key: 'name' | 'main_function' | 'url' | 'accounts' | 'created_at') => {
    setSortConfig(prev => {
      if (prev.key === key) {
        return { key, direction: prev.direction === 'asc' ? 'desc' : 'asc' }
      }
      return { key, direction: 'asc' }
    })
  }

  const getSortIcon = (key: 'name' | 'main_function' | 'url' | 'accounts' | 'created_at') => {
    if (sortConfig.key !== key) {
      return <ArrowUpDown className="h-3 w-3 text-slate-400" />
    }
    return sortConfig.direction === 'asc' 
      ? <ArrowUp className="h-3 w-3 text-blue-600 font-bold" />
      : <ArrowDown className="h-3 w-3 text-blue-600 font-bold" />
  }

  const filteredTools = tools.filter(tool => 
    tool.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    tool.main_function.toLowerCase().includes(searchQuery.toLowerCase()) ||
    (tool.description || '').toLowerCase().includes(searchQuery.toLowerCase()) ||
    (tool.accounts || '').toLowerCase().includes(searchQuery.toLowerCase())
  )

  const sortedTools = [...filteredTools].sort((a, b) => {
    if (!sortConfig.key) return 0
    const valA = (a[sortConfig.key] || '').toString().toLowerCase()
    const valB = (b[sortConfig.key] || '').toString().toLowerCase()
    
    if (valA < valB) return sortConfig.direction === 'asc' ? -1 : 1
    if (valA > valB) return sortConfig.direction === 'asc' ? 1 : -1
    return 0
  })

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    try {
      if (editTool) {
        await updateTool({ id: editTool.id, ...formData })
        toast.success('Ferramenta atualizada!')
      } else {
        await createTool(formData)
        toast.success('Ferramenta cadastrada!')
      }
      setOpen(false)
      setEditTool(null)
      setFormData({ name: '', main_function: '', accounts: '', description: '', url: '', category: 'Geral' })
    } catch (err: any) {
      console.error(err)
      toast.error('Erro ao salvar ferramenta: ' + (err.message || 'Verifique os dados.'))
    }
  }

  const handleEdit = (tool: Tool) => {
    setEditTool(tool)
    setFormData({
      name: tool.name,
      main_function: tool.main_function,
      accounts: tool.accounts || '',
      description: tool.description || '',
      url: tool.url || '',
      category: tool.category || 'Geral'
    })
    setOpen(true)
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex items-center gap-2">
          <Wrench className="h-8 w-8 text-blue-600" />
          <h1 className="text-3xl font-bold tracking-tight text-slate-800">Catálogo de Ferramentas</h1>
        </div>
        
        <div className="flex items-center gap-2 flex-1 md:max-w-md">
          <div className="relative flex-1">
            <Input
              placeholder="🔍 Buscar ferramentas..."
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
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
          
          <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
              <Button className="bg-blue-600 hover:bg-blue-700 h-10">
                <Plus className="mr-2 h-4 w-4" /> Nova Ferramenta
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>{editTool ? 'Editar Ferramenta' : 'Cadastrar Ferramenta'}</DialogTitle>
              </DialogHeader>
              <form onSubmit={handleSubmit} className="space-y-4 py-4">
                <div className="space-y-2">
                  <Label>Nome da Ferramenta</Label>
                  <Input required value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} />
                </div>
                <div className="space-y-2">
                  <Label>Principal Função</Label>
                  <Input required value={formData.main_function} onChange={e => setFormData({...formData, main_function: e.target.value})} />
                </div>
                <div className="space-y-2">
                  <Label>URL / Link</Label>
                  <Input value={formData.url} onChange={e => setFormData({...formData, url: e.target.value})} placeholder="https://..." />
                </div>

                <div className="space-y-2">
                  <Label>Descrição / Notas da Ferramenta</Label>
                  <Textarea value={formData.description} onChange={e => setFormData({...formData, description: e.target.value})} placeholder="Para que serve esta ferramenta?" />
                </div>
                
                <div className="p-3 bg-slate-50 rounded-lg space-y-3 border border-slate-200">
                  <Label className="text-slate-700 font-bold flex items-center gap-2"><Key className="h-4 w-4" /> Cadastros Realizados (Contas)</Label>
                  <div className="space-y-2">
                    <Label className="text-xs">Dados de Acesso (Email/Senha/Notas)</Label>
                    <Input value={formData.accounts} onChange={e => setFormData({...formData, accounts: e.target.value})} placeholder="admin@email.com | senha123" />
                  </div>
                </div>

                <DialogFooter>
                  <Button type="submit" className="w-full">Salvar Dados</Button>
                </DialogFooter>
              </form>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      <Card className="border-none shadow-md overflow-hidden">
        <CardContent className="p-0">
          <Table>
            <TableHeader className="bg-blue-50/50">
              <TableRow>
                <TableHead 
                  className="cursor-pointer select-none hover:bg-blue-100/50 transition-colors py-3"
                  onClick={() => handleSort('name')}
                >
                  <div className="flex items-center gap-1.5 font-bold text-slate-700">
                    Ferramenta {getSortIcon('name')}
                  </div>
                </TableHead>
                <TableHead 
                  className="cursor-pointer select-none hover:bg-blue-100/50 transition-colors py-3"
                  onClick={() => handleSort('main_function')}
                >
                  <div className="flex items-center gap-1.5 font-bold text-slate-700">
                    Função {getSortIcon('main_function')}
                  </div>
                </TableHead>
                <TableHead 
                  className="cursor-pointer select-none hover:bg-blue-100/50 transition-colors py-3"
                  onClick={() => handleSort('url')}
                >
                  <div className="flex items-center gap-1.5 font-bold text-slate-700">
                    Link {getSortIcon('url')}
                  </div>
                </TableHead>
                <TableHead 
                  className="cursor-pointer select-none hover:bg-blue-100/50 transition-colors py-3"
                  onClick={() => handleSort('accounts')}
                >
                  <div className="flex items-center gap-1.5 font-bold text-slate-700">
                    Conta Vinculada {getSortIcon('accounts')}
                  </div>
                </TableHead>
                <TableHead 
                  className="cursor-pointer select-none hover:bg-blue-100/50 transition-colors py-3"
                  onClick={() => handleSort('created_at')}
                >
                  <div className="flex items-center gap-1.5 font-bold text-slate-700">
                    Criado em {getSortIcon('created_at')}
                  </div>
                </TableHead>
                <TableHead className="text-right font-bold text-slate-700">Ações</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {tools.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={6} className="h-32 text-center text-gray-500">
                    Nenhuma ferramenta cadastrada ainda.
                  </TableCell>
                </TableRow>
              ) : filteredTools.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={6} className="h-32 text-center text-gray-500">
                    Nenhuma ferramenta encontrada com o termo "{searchQuery}".
                  </TableCell>
                </TableRow>
              ) : (
                sortedTools.map((tool: Tool) => (
                  <TableRow key={tool.id} className="hover:bg-blue-50/10 transition-colors">
                    <TableCell className="font-bold text-slate-800">{tool.name}</TableCell>
                    <TableCell>
                      <Badge variant="secondary" className="bg-blue-50 text-blue-700 hover:bg-blue-100 border-none">
                        {tool.main_function}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      {tool.url ? (
                        <HoverCard>
                          <HoverCardTrigger asChild>
                            <Button variant="ghost" size="icon" className="h-8 w-8 text-blue-500" onClick={() => window.open(tool.url, '_blank')}>
                              <Globe className="h-4 w-4" />
                            </Button>
                          </HoverCardTrigger>
                          <HoverCardContent className="w-80">
                            <div className="space-y-2">
                              <p className="text-sm font-bold flex items-center gap-2 text-blue-600">
                                <ExternalLink className="h-3 w-3" /> {tool.name}
                              </p>
                              <p className="text-xs text-slate-500">{tool.description || 'Sem descrição.'}</p>
                              <p className="text-[10px] text-slate-400 break-all">{tool.url}</p>
                            </div>
                          </HoverCardContent>
                        </HoverCard>
                      ) : (
                        <span className="text-slate-300">-</span>
                      )}
                    </TableCell>
                    <TableCell>
                      {tool.accounts ? (
                        <div className="flex flex-col gap-0.5">
                          <span className="text-xs font-medium text-slate-600 flex items-center gap-1.5"><User className="h-3 w-3" /> {tool.accounts}</span>
                        </div>
                      ) : (
                        <span className="text-xs text-slate-400 italic">Nenhuma conta salva</span>
                      )}
                    </TableCell>
                    <TableCell className="text-xs text-slate-500 font-medium">
                      {tool.created_at ? new Date(tool.created_at).toLocaleDateString('pt-BR') : '-'}
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end gap-2">
                        <Button size="icon" variant="ghost" className="h-8 w-8 text-blue-600" onClick={() => handleEdit(tool)}>
                          <Pencil className="h-4 w-4" />
                        </Button>
                        <Button size="icon" variant="ghost" className="h-8 w-8 text-rose-500" onClick={() => deleteTool(tool.id)}>
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
