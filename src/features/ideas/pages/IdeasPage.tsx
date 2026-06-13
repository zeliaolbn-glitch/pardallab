import { useState } from 'react'
import { useIdeas } from '../hooks/useIdeas'
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Lightbulb, Trash2, Search } from 'lucide-react'
import { CreateIdeaModal } from '../components/CreateIdeaModal'
import { ConvertIdeaModal } from '../components/ConvertIdeaModal'
import { Input } from '@/components/ui/input'
import { toast } from 'sonner'

export default function IdeasPage() {
  const { ideas, isLoading, deleteIdea } = useIdeas()
  const [searchTerm, setSearchTerm] = useState('')

  // Garantia absoluta de que ideas é um array
  const safeIdeas = Array.isArray(ideas) ? ideas : []

  const filteredIdeas = safeIdeas.filter(idea => 
    idea?.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    idea?.description?.toLowerCase().includes(searchTerm.toLowerCase())
  )

  const handleDelete = async (id: string, title: string) => {
    if (window.confirm(`Deseja realmente excluir a ideia: "${title}"?`)) {
      try {
        await deleteIdea(id)
        toast.success('Ideia excluída com sucesso!')
      } catch (err) {
        toast.error('Erro ao excluir ideia.')
      }
    }
  }

  const formatDate = (dateString: any) => {
    if (!dateString) return 'Sem data'
    try {
      const date = new Date(dateString)
      return isNaN(date.getTime()) ? 'Data inválida' : date.toLocaleDateString()
    } catch (e) {
      return 'Erro na data'
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex items-center gap-2">
          <div className="bg-blue-100 p-2 rounded-lg">
            <Lightbulb className="h-6 w-6 text-blue-600" />
          </div>
          <h1 className="text-3xl font-bold tracking-tight">Banco de Ideias</h1>
        </div>
        
        <div className="flex items-center gap-3">
          <div className="relative w-64">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
            <Input 
              placeholder="Pesquisar ideias..." 
              className="pl-10 bg-white border-slate-200"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <CreateIdeaModal />
        </div>
      </div>

      {isLoading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[1, 2, 3].map(i => <div key={i} className="h-48 bg-slate-100 animate-pulse rounded-xl" />)}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredIdeas.length === 0 ? (
            <div className="col-span-full py-20 text-center text-slate-400">
              {searchTerm ? 'Nenhuma ideia encontrada para essa busca.' : 'Nenhuma ideia capturada ainda.'}
            </div>
          ) : (
            filteredIdeas.map((idea) => (
              <Card key={idea.id} className="group border-none shadow-sm hover:shadow-md transition-all ring-1 ring-slate-100">
                <CardHeader className="pb-3">
                  <div className="flex justify-between items-start">
                    <span className="text-[10px] font-bold text-blue-600 uppercase tracking-widest bg-blue-50 px-2 py-0.5 rounded">
                      {idea.category || 'Geral'}
                    </span>
                    <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                      <Button 
                        variant="ghost" 
                        size="icon" 
                        className="h-8 w-8 text-rose-500 hover:bg-rose-50"
                        onClick={() => handleDelete(idea.id, idea.title)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                  <CardTitle className="text-xl font-bold mt-2 text-slate-800">{idea.title}</CardTitle>
                  <CardDescription className="line-clamp-3 text-slate-500 min-h-[60px]">
                    {idea.description || 'Nenhuma descrição detalhada.'}
                  </CardDescription>
                </CardHeader>
                <CardContent className="pt-0 flex justify-between items-center border-t border-slate-50 mt-2 py-3">
                  <span className="text-[10px] text-slate-400">
                    Criado em: {formatDate(idea.created_at)}
                  </span>
                  <ConvertIdeaModal idea={idea} />
                </CardContent>
              </Card>
            ))
          )}
        </div>
      )}
    </div>
  )
}
