import { useDraftLinks } from '../hooks/useDraftLinks'
import { Card, CardContent } from '@/components/ui/card'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { Check, Trash2, Clock } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { toast } from 'sonner'
import { EditStandaloneLinkModal } from '../components/EditStandaloneLinkModal'

export default function DraftLinksPage() {
  const { drafts, deleteDraft, validateDraft } = useDraftLinks()

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
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Clock className="h-8 w-8 text-amber-500" />
          <h1 className="text-3xl font-bold tracking-tight">Rascunhos (Telegram Bot)</h1>
        </div>
      </div>

      <Card className="border-none shadow-md overflow-hidden">
        <CardContent className="p-0">
          <Table>
            <TableHeader className="bg-amber-50/50">
              <TableRow>
                <TableHead>Data Recebimento</TableHead>
                <TableHead>Link Enviado</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Ações</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {drafts.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={4} className="h-32 text-center text-gray-500">
                    Nenhum rascunho pendente de triagem.
                  </TableCell>
                </TableRow>
              ) : (
                drafts.map((draft) => {
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
