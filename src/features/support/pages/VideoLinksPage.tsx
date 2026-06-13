import { useStandaloneLinks } from '../hooks/useStandaloneLinks'
import { useProjects } from '@/features/projects/hooks/useProjects'
import { Card, CardContent } from '@/components/ui/card'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { Video, Plus, ExternalLink, Search, Trash2, ArrowUpDown, Star } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { useState, useEffect } from 'react'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogFooter } from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { toast } from 'sonner'
import { cn } from '@/lib/utils'
import { EditVideoLinkModal } from '../components/EditVideoLinkModal'
import { EditStandaloneLinkModal } from '../components/EditStandaloneLinkModal'
import { HoverCard, HoverCardContent, HoverCardTrigger } from '@/components/ui/hover-card'
import { Badge } from '@/components/ui/badge'

// Componente auxiliar para buscar título do YouTube dinamicamente
const YoutubeTitle = ({ url, fallback }: { url: string, fallback: string }) => {
  const [title, setTitle] = useState(fallback)
  useEffect(() => {
    if (!url) return
    fetch(`https://noembed.com/embed?url=${url}`)
      .then(res => res.json())
      .then(data => { if (data.title) setTitle(data.title) })
      .catch(() => {})
  }, [url])
  return <span className="font-medium text-slate-800">{title}</span>
}

export default function VideoLinksPage() {
  const { links: standaloneLinks, createLink, deleteLink, updateLink } = useStandaloneLinks()
  const { projects } = useProjects()
  const [open, setOpen] = useState(false)
  const [searchTerm, setSearchTerm] = useState('')
  const [filterFunction, setFilterFunction] = useState('Todas')
  const [filterTool, setFilterTool] = useState('Todas')
  const [formData, setFormData] = useState({
    title: '',
    url: '',
    main_function: '',
    tool: '',
    summary: ''
  })
  const [sortConfig, setSortConfig] = useState<{ key: string, direction: 'asc' | 'desc' | null }>({ key: 'created_at', direction: 'desc' })

  const handleSort = (key: string) => {
    let direction: 'asc' | 'desc' = 'asc'
    if (sortConfig.key === key && sortConfig.direction === 'asc') {
      direction = 'desc'
    }
    setSortConfig({ key, direction })
  }

  // Extrair links dos projetos automáticos
  const projectLinks = (Array.isArray(projects) ? projects : [])
    .filter((p: any) => p.video_link)
    .map((p: any) => ({
      ...p,
      isAuto: true
    }))

  const allLinks = [
    ...projectLinks,
    ...standaloneLinks.map((l: any) => ({ ...l, isAuto: false }))
  ]

  // Obter opções únicas para os filtros
  const functions = ['Todas', ...new Set(allLinks.map(l => l.main_function || l.video_function).filter(Boolean))]
  const tools = ['Todas', ...new Set(allLinks.map(l => l.tool || l.video_tool).filter(Boolean))]

  const filteredLinks = allLinks.filter(l => {
    const matchesSearch = (l.title || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
      (l.main_function || l.video_function || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
      (l.tool || l.video_tool || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
      (l.summary || l.video_summary || '').toLowerCase().includes(searchTerm.toLowerCase())
    
    const matchesFunction = filterFunction === 'Todas' || (l.main_function || l.video_function) === filterFunction
    const matchesTool = filterTool === 'Todas' || (l.tool || l.video_tool) === filterTool
    
    return matchesSearch && matchesFunction && matchesTool
  }).sort((a, b) => {
    if (!sortConfig.key || !sortConfig.direction) return 0
    const aValue = a[sortConfig.key] || ''
    const bValue = b[sortConfig.key] || ''
    
    if (aValue < bValue) return sortConfig.direction === 'asc' ? -1 : 1
    if (aValue > bValue) return sortConfig.direction === 'asc' ? 1 : -1
    return 0
  })

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    await createLink(formData)
    toast.success('Link salvo com sucesso!')
    setOpen(false)
    setFormData({ title: '', url: '', main_function: '', tool: '', summary: '' })
  }

  const getYoutubeID = (url: string) => {
    if (!url) return null
    const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#&?]*).*/
    const match = url.match(regExp)
    return (match && match[2].length === 11) ? match[2] : null
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Video className="h-8 w-8 text-blue-600" />
          <h1 className="text-3xl font-bold tracking-tight">Biblioteca de Links e Vídeos</h1>
        </div>
        
        <Dialog open={open} onOpenChange={setOpen}>
          <DialogTrigger asChild>
            <Button className="bg-blue-600 hover:bg-blue-700 shadow-md">
              <Plus className="mr-2 h-4 w-4" /> Novo Link
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-md">
            <DialogHeader>
              <DialogTitle>Cadastrar Novo Link Útil</DialogTitle>
            </DialogHeader>
            <form onSubmit={handleSubmit} className="space-y-4 pt-4">
              <div className="space-y-2">
                <Label>Título do Conteúdo</Label>
                <Input required value={formData.title} onChange={e => setFormData({...formData, title: e.target.value})} placeholder="Ex: Tutorial Shadcn UI" />
              </div>
              <div className="space-y-2">
                <Label>URL do Link / Vídeo</Label>
                <Input required value={formData.url} onChange={e => setFormData({...formData, url: e.target.value})} placeholder="https://..." />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Função Principal</Label>
                  <Input required value={formData.main_function} onChange={e => setFormData({...formData, main_function: e.target.value})} placeholder="Ex: UI/UX" />
                </div>
                <div className="space-y-2">
                  <Label>Ferramenta</Label>
                  <Input required value={formData.tool} onChange={e => setFormData({...formData, tool: e.target.value})} placeholder="Ex: React" />
                </div>
              </div>
              <div className="space-y-2">
                <Label>Resumo (Opcional)</Label>
                <Input value={formData.summary} onChange={e => setFormData({...formData, summary: e.target.value})} placeholder="Sobre o que é este link?" />
              </div>
              <DialogFooter>
                <Button type="submit" className="w-full bg-blue-600">Salvar Link</Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      {/* Barra de Busca e Filtros - Maior Destaque */}
      <Card className="border-none shadow-lg bg-slate-50/50">
        <CardContent className="p-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="space-y-2">
              <Label className="text-xs font-bold text-blue-600 uppercase flex items-center gap-1.5">
                <Search className="h-3 w-3" /> Pesquisa Geral
              </Label>
              <Input 
                placeholder="Título, ferramenta, função..." 
                className="bg-white border-slate-200 focus:ring-2 focus:ring-blue-500"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>

            <div className="space-y-2">
              <Label className="text-xs font-bold text-blue-600 uppercase">Filtrar por Função</Label>
              <select 
                className="w-full h-10 rounded-md border border-slate-200 bg-white px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 shadow-sm"
                value={filterFunction}
                onChange={(e) => setFilterFunction(e.target.value)}
              >
                {functions.map(f => <option key={f} value={f}>{f}</option>)}
              </select>
            </div>

            <div className="space-y-2">
              <Label className="text-xs font-bold text-blue-600 uppercase">Filtrar por Ferramenta</Label>
              <select 
                className="w-full h-10 rounded-md border border-slate-200 bg-white px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 shadow-sm"
                value={filterTool}
                onChange={(e) => setFilterTool(e.target.value)}
              >
                {tools.map(t => <option key={t} value={t}>{t}</option>)}
              </select>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card className="border-none shadow-md overflow-hidden">
        <CardContent className="p-0">
          <Table>
            <TableHeader className="bg-blue-50/50">
              <TableRow>
                <TableHead className="cursor-pointer hover:bg-blue-100/50 transition-colors" onClick={() => handleSort('isAuto')}>
                  <div className="flex items-center gap-2">Origem <ArrowUpDown className="h-3 w-3" /></div>
                </TableHead>
                <TableHead className="cursor-pointer hover:bg-blue-100/50 transition-colors" onClick={() => handleSort('title')}>
                  <div className="flex items-center gap-2">Título <ArrowUpDown className="h-3 w-3" /></div>
                </TableHead>
                <TableHead>Função Principal</TableHead>
                <TableHead>Ferramenta</TableHead>
                <TableHead>Avaliação</TableHead>
                <TableHead className="text-right">Ações</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredLinks.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={5} className="h-32 text-center text-gray-500">
                    Nenhum link encontrado.
                  </TableCell>
                </TableRow>
              ) : (
                filteredLinks.map((link) => (
                  <TableRow key={link.id} className="hover:bg-blue-50/10 transition-colors">
                    <TableCell>
                      <Badge variant={link.isAuto ? 'secondary' : 'outline'} className={link.isAuto ? 'bg-blue-50 text-blue-700 border-blue-100' : ''}>
                        {link.isAuto ? `Projeto - ${link.title}` : 'Manual'}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <HoverCard openDelay={200}>
                        <HoverCardTrigger asChild>
                          <div className="cursor-pointer hover:text-blue-600 transition-colors">
                            {link.isAuto ? (
                              <YoutubeTitle url={link.video_link} fallback={link.title} />
                            ) : (
                              <span className="font-medium text-slate-800">{link.title}</span>
                            )}
                          </div>
                        </HoverCardTrigger>
                        <HoverCardContent className="w-80 p-0 bg-white border-2 border-blue-200 overflow-hidden shadow-2xl" side="right">
                          {getYoutubeID(link.url || link.video_link) ? (
                            <div className="flex flex-col">
                              <img 
                                src={`https://img.youtube.com/vi/${getYoutubeID(link.url || link.video_link)}/hqdefault.jpg`} 
                                alt="Preview" 
                                className="w-full h-40 object-cover"
                              />
                              <div className="p-3 bg-blue-50/50">
                                <p className="text-xs font-bold text-blue-800 uppercase tracking-tighter">Resumo do Vídeo</p>
                                <div className="max-h-32 overflow-y-auto mt-1 pr-1 custom-scrollbar">
                                  <p className="text-[11px] text-slate-600 whitespace-pre-wrap">{link.summary || link.video_summary || 'Sem resumo disponível.'}</p>
                                </div>
                              </div>
                            </div>
                          ) : (
                            <div className="p-4 text-center space-y-2">
                              <ExternalLink className="h-8 w-8 text-blue-400 mx-auto" />
                              <p className="text-xs font-medium text-blue-800 uppercase tracking-tighter">Link Externo</p>
                              <div className="max-h-32 overflow-y-auto mt-1 pr-1 custom-scrollbar">
                                <p className="text-[10px] text-slate-500 whitespace-pre-wrap text-left">{link.summary || link.video_summary || 'Sem descrição.'}</p>
                              </div>
                            </div>
                          )}
                        </HoverCardContent>
                      </HoverCard>
                    </TableCell>
                    <TableCell className="text-slate-600">{link.main_function || link.video_function}</TableCell>
                    <TableCell>
                      <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-slate-100 text-slate-800">
                        {link.tool || link.video_tool || '-'}
                      </span>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-0.5">
                        {[1, 2, 3, 4, 5].map((star) => (
                          <button
                            key={star}
                            disabled={link.isAuto}
                            onClick={async () => {
                              if (link.isAuto) return
                              try {
                                await updateLink({ id: link.id, rating: star })
                                toast.success('Avaliação atualizada!')
                              } catch (e: any) {
                                if (e.message?.includes('rating')) {
                                  toast.error('A coluna "rating" não existe no banco. Execute o comando SQL no Supabase.')
                                } else {
                                  toast.error('Erro ao avaliar: ' + (e.message || 'Erro desconhecido.'))
                                }
                              }
                            }}
                            className={cn(
                              "transition-transform active:scale-125",
                              link.isAuto ? "cursor-default" : "cursor-pointer hover:scale-110"
                            )}
                          >
                            <Star 
                              className={cn(
                                "h-4 w-4",
                                (link.rating || 0) >= star ? "fill-yellow-400 text-yellow-400" : "text-slate-300"
                              )} 
                            />
                          </button>
                        ))}
                      </div>
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end gap-2">
                        {link.isAuto ? (
                          <>
                            <EditVideoLinkModal project={link} />
                            <Button size="icon" variant="ghost" className="h-8 w-8 text-blue-600" onClick={() => window.open(link.url || link.video_link, '_blank')}>
                              <ExternalLink className="h-4 w-4" />
                            </Button>
                            <Button size="icon" variant="ghost" className="h-8 w-8 text-rose-500" onClick={() => deleteLink(link.id)}>
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </>
                        ) : (
                          <>
                            <EditStandaloneLinkModal link={link} />
                            <Button size="icon" variant="ghost" className="h-8 w-8 text-blue-600" onClick={() => window.open(link.url || link.video_link, '_blank')}>
                              <ExternalLink className="h-4 w-4" />
                            </Button>
                            <Button size="icon" variant="ghost" className="h-8 w-8 text-rose-500" onClick={() => deleteLink(link.id)}>
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </>
                        )}
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
