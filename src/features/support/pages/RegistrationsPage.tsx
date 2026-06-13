import { useState } from 'react'
import { useRegistrations, type Registration } from '../hooks/useRegistrations'
import { Card, CardContent } from '@/components/ui/card'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { ShieldCheck, Plus, Pencil, Trash2, Calendar, Bell, BellOff, Info } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogFooter } from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Switch } from '@/components/ui/switch'
import { toast } from 'sonner'
import { Badge } from '@/components/ui/badge'
import { format } from 'date-fns'
import { ptBR } from 'date-fns/locale'

export default function RegistrationsPage() {
  const { registrations, createRegistration, updateRegistration, deleteRegistration } = useRegistrations()
  const [open, setOpen] = useState(false)
  const [editReg, setEditReg] = useState<Registration | null>(null)
  const [formData, setFormData] = useState({
    platform: '',
    user_account: '',
    reminder: '',
    reason: '',
    start_date: '',
    end_date: '',
    bot_alert: true
  })

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    try {
      if (editReg) {
        await updateRegistration({ id: editReg.id, ...formData })
        toast.success('Cadastro atualizado!')
      } else {
        await createRegistration(formData)
        toast.success('Cadastro realizado!')
      }
      setOpen(false)
      setEditReg(null)
      resetForm()
    } catch (err) {
      toast.error('Erro ao salvar cadastro. Verifique o banco de dados.')
    }
  }

  const resetForm = () => {
    setFormData({
      platform: '',
      user_account: '',
      reminder: '',
      reason: '',
      start_date: '',
      end_date: '',
      bot_alert: true
    })
  }

  const handleEdit = (reg: Registration) => {
    setEditReg(reg)
    setFormData({
      platform: reg.platform,
      user_account: reg.user_account,
      reminder: reg.reminder || '',
      reason: reg.reason || '',
      start_date: reg.start_date || '',
      end_date: reg.end_date || '',
      bot_alert: reg.bot_alert
    })
    setOpen(true)
  }

  const formatDate = (dateStr: string) => {
    if (!dateStr) return '-'
    try {
      return format(new Date(dateStr), 'dd/MM/yyyy', { locale: ptBR })
    } catch {
      return dateStr
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <ShieldCheck className="h-8 w-8 text-emerald-600" />
          <h1 className="text-3xl font-bold tracking-tight">Contas e Cadastros</h1>
        </div>
        
        <Dialog open={open} onOpenChange={(val: boolean) => { setOpen(val); if(!val) { setEditReg(null); resetForm() } }}>
          <DialogTrigger asChild>
            <Button className="bg-emerald-600 hover:bg-emerald-700">
              <Plus className="mr-2 h-4 w-4" /> Novo Cadastro
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[500px]">
            <DialogHeader>
              <DialogTitle>{editReg ? 'Editar Cadastro' : 'Cadastrar Conta/Plataforma'}</DialogTitle>
            </DialogHeader>
            <form onSubmit={handleSubmit} className="space-y-4 py-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Plataforma</Label>
                  <Input required value={formData.platform} onChange={e => setFormData({...formData, platform: e.target.value})} placeholder="Ex: AWS, Netflix, Hostgator" />
                </div>
                <div className="space-y-2">
                  <Label>Usuário / Conta</Label>
                  <Input required value={formData.user_account} onChange={e => setFormData({...formData, user_account: e.target.value})} placeholder="Email ou login" />
                </div>
              </div>

              <div className="space-y-2">
                <Label>Lembrete (O que é?)</Label>
                <Input value={formData.reminder} onChange={e => setFormData({...formData, reminder: e.target.value})} placeholder="Ex: Assinatura Anual" />
              </div>

              <div className="space-y-2">
                <Label>Motivo / Observação</Label>
                <Input value={formData.reason} onChange={e => setFormData({...formData, reason: e.target.value})} placeholder="Ex: Servidor do Projeto X" />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Data Início</Label>
                  <Input type="date" value={formData.start_date} onChange={e => setFormData({...formData, start_date: e.target.value})} />
                </div>
                <div className="space-y-2">
                  <Label>Data Fim (Vencimento)</Label>
                  <Input type="date" value={formData.end_date} onChange={e => setFormData({...formData, end_date: e.target.value})} />
                </div>
              </div>

              <div className="flex items-center justify-between p-3 bg-emerald-50 rounded-lg border border-emerald-100">
                <div className="flex items-center gap-2">
                  <Bell className="h-4 w-4 text-emerald-600" />
                  <div className="space-y-0.5">
                    <Label className="text-emerald-900 font-bold">Alerta via Bot</Label>
                    <p className="text-[10px] text-emerald-600">Avisar 1 dia antes do vencimento</p>
                  </div>
                </div>
                <Switch 
                  checked={formData.bot_alert} 
                  onCheckedChange={(val: boolean) => setFormData({...formData, bot_alert: val})} 
                />
              </div>

              <DialogFooter>
                <Button type="submit" className="w-full bg-emerald-600">Salvar Dados</Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      <Card className="border-none shadow-md overflow-hidden">
        <CardContent className="p-0">
          <Table>
            <TableHeader className="bg-emerald-50/50">
              <TableRow>
                <TableHead>Plataforma / Conta</TableHead>
                <TableHead>Lembrete</TableHead>
                <TableHead>Datas</TableHead>
                <TableHead>Alerta</TableHead>
                <TableHead className="text-right">Ações</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {registrations.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={5} className="h-32 text-center text-gray-500">
                    Nenhum cadastro realizado ainda.
                  </TableCell>
                </TableRow>
              ) : (
                registrations.map((reg) => (
                  <TableRow key={reg.id} className="hover:bg-emerald-50/10 transition-colors">
                    <TableCell>
                      <div className="flex flex-col">
                        <span className="font-bold text-slate-800">{reg.platform}</span>
                        <span className="text-xs text-slate-500">{reg.user_account}</span>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex flex-col">
                        <span className="text-sm font-medium text-slate-700">{reg.reminder || '-'}</span>
                        <span className="text-[11px] text-slate-400 italic">{reg.reason}</span>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex flex-col text-xs">
                        <span className="flex items-center gap-1 text-slate-400"><Calendar className="h-3 w-3" /> {formatDate(reg.start_date)}</span>
                        <span className="flex items-center gap-1 font-bold text-rose-500"><Calendar className="h-3 w-3" /> {formatDate(reg.end_date)}</span>
                      </div>
                    </TableCell>
                    <TableCell>
                      {reg.bot_alert ? (
                        <Badge className="bg-emerald-100 text-emerald-700 border-emerald-200 hover:bg-emerald-200">
                          <Bell className="h-3 w-3 mr-1" /> Ativo
                        </Badge>
                      ) : (
                        <Badge variant="outline" className="text-slate-300 border-slate-200">
                          <BellOff className="h-3 w-3 mr-1" /> Inativo
                        </Badge>
                      )}
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end gap-2">
                        <Button size="icon" variant="ghost" className="h-8 w-8 text-blue-600" onClick={() => handleEdit(reg)}>
                          <Pencil className="h-4 w-4" />
                        </Button>
                        <Button size="icon" variant="ghost" className="h-8 w-8 text-rose-500" onClick={() => {
                          if(confirm('Excluir este cadastro?')) deleteRegistration(reg.id)
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

      <div className="bg-blue-50 border border-blue-100 rounded-lg p-4 flex gap-3 items-start">
        <Info className="h-5 w-5 text-blue-600 shrink-0 mt-0.5" />
        <div className="text-sm text-blue-800">
          <p className="font-bold">Dica do Pardal:</p>
          <p>Use esta aba para não esquecer de renovar domínios, assinaturas de servidores ou prazos importantes de projetos.</p>
        </div>
      </div>
    </div>
  )
}
