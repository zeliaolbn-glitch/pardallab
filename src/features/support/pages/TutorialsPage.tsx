import { Card, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { PlayCircle, GraduationCap } from 'lucide-react'

const tutorials = [
  {
    title: 'Como capturar sua primeira ideia',
    description: 'Aprenda a registrar insights rapidamente no dashboard.',
    duration: '2 min',
    videoId: 'dQw4w9WgXcQ' // Exemplo
  },
  {
    title: 'Transformando Ideia em Projeto',
    description: 'Entenda o fluxo de conversão e como gerenciar seu funil.',
    duration: '3 min',
    videoId: 'dQw4w9WgXcQ'
  },
  {
    title: 'Usando a IA para detalhamento',
    description: 'Dicas de como usar o assistente Gemini para criar planos de ação.',
    duration: '5 min',
    videoId: 'dQw4w9WgXcQ'
  }
]

export default function TutorialsPage() {
  return (
    <div className="space-y-6">
      <div className="flex items-center gap-2">
        <GraduationCap className="h-8 w-8 text-blue-600" />
        <h1 className="text-3xl font-bold tracking-tight">Tutoriais e Guias</h1>
      </div>
      <p className="text-gray-500 max-w-2xl">
        Aprenda a extrair o máximo potencial do IdeaFlow com nossos guias rápidos em vídeo.
      </p>

      <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-2">
        {tutorials.map((tutorial) => (
          <Card key={tutorial.title} className="overflow-hidden border-none shadow-md">
            <div className="aspect-video bg-gray-100 flex items-center justify-center group cursor-pointer relative">
              <img 
                src={`https://img.youtube.com/vi/${tutorial.videoId}/maxresdefault.jpg`} 
                alt={tutorial.title}
                className="absolute inset-0 w-full h-full object-cover opacity-80"
              />
              <div className="absolute inset-0 bg-black/20 group-hover:bg-black/40 transition-colors" />
              <PlayCircle className="h-12 w-12 text-white relative z-10 drop-shadow-lg" />
            </div>
            <CardHeader>
              <div className="flex items-center justify-between text-xs text-blue-600 font-medium">
                <span>VÍDEO AULA</span>
                <span>{tutorial.duration}</span>
              </div>
              <CardTitle className="mt-2 text-xl">{tutorial.title}</CardTitle>
              <CardDescription>{tutorial.description}</CardDescription>
            </CardHeader>
          </Card>
        ))}
      </div>
    </div>
  )
}
