import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { ExternalLink, Wrench } from 'lucide-react'

const tools = [
  {
    name: 'Canva',
    description: 'Design gráfico simplificado para criar logos e posts.',
    url: 'https://canva.com',
    category: 'Design'
  },
  {
    name: 'Replicate',
    description: 'Execute modelos de IA na nuvem via API.',
    url: 'https://replicate.com',
    category: 'IA'
  },
  {
    name: 'Notion',
    description: 'Espaço de trabalho completo para notas e docs.',
    url: 'https://notion.so',
    category: 'Produtividade'
  },
  {
    name: 'Vercel',
    description: 'Plataforma para deploy rápido de apps frontend.',
    url: 'https://vercel.com',
    category: 'DevOps'
  },
  {
    name: 'Supabase',
    description: 'Backend as a Service com banco de dados Postgres.',
    url: 'https://supabase.com',
    category: 'Backend'
  },
  {
    name: 'Cursor',
    description: 'Editor de código com IA integrada para acelerar o dev.',
    url: 'https://cursor.sh',
    category: 'Dev'
  }
]

export default function ToolsPage() {
  return (
    <div className="space-y-6">
      <div className="flex items-center gap-2">
        <Wrench className="h-8 w-8 text-blue-600" />
        <h1 className="text-3xl font-bold tracking-tight">Ferramentas Curadas</h1>
      </div>
      <p className="text-gray-500 max-w-2xl">
        Uma seleção de ferramentas essenciais para transformar suas ideias em produtos de mercado.
      </p>

      <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
        {tools.map((tool) => (
          <Card key={tool.name} className="border-none shadow-md hover:shadow-lg transition-shadow">
            <CardHeader>
              <div className="flex items-center justify-between">
                <span className="text-xs font-semibold text-blue-600 uppercase tracking-wider">
                  {tool.category}
                </span>
              </div>
              <CardTitle className="mt-2">{tool.name}</CardTitle>
              <CardDescription>{tool.description}</CardDescription>
            </CardHeader>
            <CardContent>
              <Button 
                variant="outline" 
                className="w-full text-blue-600 border-blue-100 hover:bg-blue-50"
                onClick={() => window.open(tool.url, '_blank')}
              >
                <ExternalLink className="mr-2 h-4 w-4" /> Visitar Ferramenta
              </Button>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}
