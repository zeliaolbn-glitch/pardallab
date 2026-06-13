import { useDeployedProjects } from '../hooks/useDeployedProjects'
import { useProjects } from '@/features/projects/hooks/useProjects'
import { Card, CardContent } from '@/components/ui/card'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { Globe, Plus, ExternalLink } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { useState } from 'react'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogFooter } from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { toast } from 'sonner'
import { HoverCard, HoverCardContent, HoverCardTrigger } from '@/components/ui/hover-card'
import { Badge } from '@/components/ui/badge'

export default function DeployedProjectsPage() {
  const { deployed: manualDeployed, createDeployed } = useDeployedProjects()
  const { projects } = useProjects()
  const [open, setOpen] = useState(false)
  const [formData, setFormData] = useState({
    project_name: '',
    local_url: '',
    web_url: '',
    default_user: '',
    account_info: ''
  })

  // Links automáticos dos projetos
  const autoDeployed = projects
    .filter((p: any) => p.result_link)
    .map((p: any) => ({
      id: p.id,
      project_name: p.title,
      web_url: p.result_link!,
      local_url: '',
      default_user: 'N/A',
      account_info: 'Evolução Local',
      isAuto: true
    }))

  const allDeployed = [
    ...autoDeployed,
    ...manualDeployed.map((d: any) => ({ ...d, isAuto: false }))
  ]

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    await createDeployed(formData)
    toast.success('Registro de deploy salvo!')
    setOpen(false)
    setFormData({ project_name: '', local_url: '', web_url: '', default_user: '', account_info: '' })
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Globe className="h-8 w-8 text-blue-600" />
          <h1 className="text-3xl font-bold tracking-tight">Projetos Publicados (Deploy)</h1>
        </div>
        
        <Dialog open={open} onOpenChange={setOpen}>
          <DialogTrigger asChild>
            <Button className="bg-blue-600 hover:bg-blue-700">
              <Plus className="mr-2 h-4 w-4" /> Registrar Novo Deploy
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[450px]">
            <DialogHeader>
              <DialogTitle>Dados do Projeto Criado</DialogTitle>
            </DialogHeader>
            <form onSubmit={handleSubmit} className="space-y-4 py-4">
              <div className="space-y-2">
                <Label>Nome do Projeto</Label>
                <Input required value={formData.project_name} onChange={e => setFormData({...formData, project_name: e.target.value})} />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Link Local</Label>
                  <Input value={formData.local_url} onChange={e => setFormData({...formData, local_url: e.target.value})} placeholder="http://localhost..." />
                </div>
                <div className="space-y-2">
                  <Label>Link Web</Label>
                  <Input required value={formData.web_url} onChange={e => setFormData({...formData, web_url: e.target.value})} placeholder="https://..." />
                </div>
              </div>
              <div className="space-y-2">
                <Label>Usuário Padrão</Label>
                <Input value={formData.default_user} onChange={e => setFormData({...formData, default_user: e.target.value})} />
              </div>
              <div className="space-y-2">
                <Label>Conta / Local</Label>
                <Input value={formData.account_info} onChange={e => setFormData({...formData, account_info: e.target.value})} />
              </div>
              <DialogFooter>
                <Button type="submit" className="w-full">Salvar Registro</Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      <Card className="border-none shadow-md overflow-hidden">
        <CardContent className="p-0">
          <Table>
            <TableHeader className="bg-blue-50/50">
              <TableRow>
                <TableHead>Fonte</TableHead>
                <TableHead>Conta / Local</TableHead>
                <TableHead>Projeto</TableHead>
                <TableHead>Link (Web)</TableHead>
                <TableHead>Usuário Padrão</TableHead>
                <TableHead className="text-right">Ações</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {allDeployed.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={6} className="h-32 text-center text-gray-500">
                    Nenhum projeto registrado ou linkado.
                  </TableCell>
                </TableRow>
              ) : (
                allDeployed.map((d: any) => (
                  <TableRow key={d.id} className="hover:bg-blue-50/10 transition-colors">
                    <TableCell>
                      <Badge variant={d.isAuto ? 'secondary' : 'outline'} className={d.isAuto ? 'bg-emerald-50 text-emerald-700 border-emerald-100' : ''}>
                        {d.isAuto ? 'Automático' : 'Manual'}
                      </Badge>
                    </TableCell>
                    <TableCell className="font-bold text-gray-700">{d.account_info}</TableCell>
                    <TableCell>{d.project_name}</TableCell>
                    <TableCell>
                      <HoverCard openDelay={200}>
                        <HoverCardTrigger asChild>
                          <span className="text-blue-600 font-medium cursor-pointer hover:underline truncate max-w-[200px] block">
                            {d.web_url}
                          </span>
                        </HoverCardTrigger>
                        <HoverCardContent className="w-80 h-48 p-0 bg-white border-2 border-blue-200 overflow-hidden shadow-2xl" side="left">
                          <div className="w-full h-full relative">
                            <iframe 
                              src={d.web_url} 
                              className="w-[200%] h-[200%] scale-50 origin-top-left border-none pointer-events-none" 
                              title="Preview" 
                            />
                            <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent flex items-end p-2">
                              <Badge className="bg-blue-600">Preview</Badge>
                            </div>
                          </div>
                        </HoverCardContent>
                      </HoverCard>
                    </TableCell>
                    <TableCell className="text-xs font-mono text-gray-500">{d.default_user || '-'}</TableCell>
                    <TableCell className="text-right">
                      <Button variant="ghost" size="sm" onClick={() => window.open(d.web_url, '_blank')}>
                        <ExternalLink className="h-4 w-4" />
                      </Button>
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
