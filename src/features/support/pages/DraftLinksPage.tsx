import { useState } from 'react'
import { useDraftLinks } from '../hooks/useDraftLinks'
import { Card, CardContent } from '@/components/ui/card'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { Check, Trash2, Clock, Search, ArrowUpDown, ArrowUp, ArrowDown } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { toast } from 'sonner'
import { EditStandaloneLinkModal } from '../components/EditStandaloneLinkModal'

export default function DraftLinksPage() {
  const { drafts, deleteDraft, validateDraft } = useDraftLinks()
  const [searchQuery, setSearchQuery] = useState('')
  const [sortConfig, setSortConfig] = useState<{
    key: 'created_at' | 'title' | 'status' | null
    direction: 'asc' | 'desc'
  }>({ key: null, direction: 'asc' })

  const handleSort = (key: 'created_at' | 'title' | 'status') => {
    setSortConfig(prev => {
      if (prev.key === key) {
        return { key, direction: prev.direction === 'asc' ? 'desc' : 'asc' }
      }
      return { key, direction: 'asc' }
    })
  }

  const getSortIcon = (key: 'created_at' | 'title' | 'status') => {
    if (sortConfig.key !== key) {
      return <ArrowUpDown className="h-3 w-3 text-slate-400" />
    }
    return sortConfig.direction === 'asc' 
      ? <ArrowUp className="h-3 w-3 text-amber-600 font-bold" />
      : <ArrowDown className="h-3 w-3 text-amber-600 font-bold" />
  }

  const filteredDrafts = drafts.filter(draft => 
    (draft.title || '').toLowerCase().includes(searchQuery.toLowerCase()) ||
    (draft.url || '').toLowerCase().includes(searchQuery.toLowerCase()) ||
    (draft.summary || '').toLowerCase().includes(searchQuery.toLowerCase())
  )

  const sortedDrafts = [...filteredDrafts].sort((a, b) => {
    if (!sortConfig.key) return 0
    let valA = ''
    let valB = ''
    if (sortConfig.key === 'status') {
      valA = 'pendente'
      valB = 'pendente'
    } else {
      valA = (a[sortConfig.key] || '').toString().toLowerCase()
      valB = (b[sortConfig.key] || '').toString().toLowerCase()
    }

    if (valA < valB) return sortConfig.direction === 'asc' ? -1 : 1
    if (valA > valB) return sortConfig.direction === 'asc' ? 1 : -1
    return 0
  })

  const handleValidate = async (id: string) => {
    try {
      await validateDraft(id)
      toast.success('Link movido para Biblioteca de Vídeos!')
    } catch (e) {
      toast.error('Erro ao validar link.')
    }
  }

  const getYoutubeId = (url: string) => {
    const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#&?]*).*/;
    const match = url.match(regExp);
    return (match && match[2].length === 11) ? match[2] : null;
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex items-center gap-2">
          <Clock className="h-8 w-8 text-amber-500" />
          <h1 className="text-3xl font-bold tracking-tight text-slate-800">Rascunhos (Telegram Bot)</h1>
        </div>
        
        <div className="flex items-center gap-2 flex-1 md:max-w-md">
          <div className="relative flex-1 flex items-center">
            <Search className="absolute left-3 h-4 w-4 text-slate-400 pointer-events-none" />
            <Input
              placeholder="Buscar rascunhos..."
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
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
      </div>

      <Card className="border-none shadow-md overflow-hidden">
        <CardContent className="p-0">
          <Table>
            <TableHeader className="bg-amber-50/50">
              <TableRow>
                <TableHead 
                  className="cursor-pointer select-none hover:bg-amber-100/50 transition-colors py-3"
                  onClick={() => handleSort('created_at')}
                >
                  <div className="flex items-center gap-1.5 font-bold text-slate-700">
                    Data de Inserção {getSortIcon('created_at')}
                  </div>
                </TableHead>
                <TableHead 
                  className="cursor-pointer select-none hover:bg-amber-100/50 transition-colors py-3"
                  onClick={() => handleSort('title')}
                >
                  <div className="flex items-center gap-1.5 font-bold text-slate-700">
                    Link Enviado {getSortIcon('title')}
                  </div>
                </TableHead>
                <TableHead 
                  className="cursor-pointer select-none hover:bg-amber-100/50 transition-colors py-3"
                  onClick={() => handleSort('status')}
                >
                  <div className="flex items-center gap-1.5 font-bold text-slate-700">
                    Status {getSortIcon('status')}
                  </div>
                </TableHead>
                <TableHead className="text-right font-bold text-slate-700">Ações</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {drafts.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={4} className="h-32 text-center text-gray-500">
                    Nenhum rascunho pendente de triagem.
                  </TableCell>
                </TableRow>
              ) : filteredDrafts.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={4} className="h-32 text-center text-gray-500">
                    Nenhum rascunho encontrado com o termo "{searchQuery}".
                  </TableCell>
                </TableRow>
              ) : (
                sortedDrafts.map((draft) => {
                  const ytid = getYoutubeId(draft.url)
                  return (
                  <TableRow key={draft.id}>
                    <TableCell className="text-xs text-gray-500">
                      {new Date(draft.created_at).toLocaleString()}
                    </TableCell>
                    <TableCell className="font-medium text-blue-600 hover:underline cursor-pointer truncate max-w-xs">
                      <div className="flex items-center gap-3">
                        {ytid ? (
                          <div className="h-10 w-16 bg-slate-200 rounded shrink-0 overflow-hidden relative group">
                            <img src={`https://img.youtube.com/vi/${ytid}/default.jpg`} className="w-full h-full object-cover" />
                          </div>
                        ) : null}
                        <div className="flex flex-col gap-1">
                          <a href={draft.url} target="_blank" rel="noopener noreferrer" className="font-semibold text-sm line-clamp-1">{draft.title || draft.url}</a>
                          <span className="text-[10px] text-slate-500 truncate">{draft.summary}</span>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-amber-100 text-amber-800">
                        Pendente
                      </span>
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end gap-2">
                        <EditStandaloneLinkModal link={draft as any} />
                        <Button size="icon" variant="ghost" className="h-8 w-8 text-emerald-600" onClick={() => handleValidate(draft.id)} title="Aprovar e Enviar para Biblioteca">
                          <Check className="h-4 w-4" />
                        </Button>
                        <Button size="icon" variant="ghost" className="h-8 w-8 text-rose-500" onClick={() => deleteDraft(draft.id)} title="Excluir Rascunho">
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                  )
                })
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  )
}
