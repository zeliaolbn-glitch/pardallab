import { useState } from 'react'
import { useTutorials, type Tutorial } from '../hooks/useTutorials'
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card'
import { PlayCircle, GraduationCap, Pencil, Trash2, Image as ImageIcon, Map, CheckCircle2 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { TutorialImageModal } from '../components/TutorialImageModal'
import { TutorialTimelineModal } from '../components/TutorialTimelineModal'
import { TutorialVideoModal } from '../components/TutorialVideoModal'

export default function TutorialsPage() {
  const { tutorials, deleteTutorial } = useTutorials()
  
  // Modal states
  const [videoModalOpen, setVideoModalOpen] = useState(false)
  const [imageModalOpen, setImageModalOpen] = useState(false)
  const [timelineModalOpen, setTimelineModalOpen] = useState(false)
  
  const [editTutorial, setEditTutorial] = useState<Tutorial | null>(null)

  const handleEdit = (t: Tutorial) => {
    setEditTutorial(t)
    if (t.type === 'video') setVideoModalOpen(true)
    if (t.type === 'image') setImageModalOpen(true)
    if (t.type === 'timeline') setTimelineModalOpen(true)
  }

  const handleNew = (type: 'video' | 'image' | 'timeline') => {
    setEditTutorial(null)
    if (type === 'video') setVideoModalOpen(true)
    if (type === 'image') setImageModalOpen(true)
    if (type === 'timeline') setTimelineModalOpen(true)
  }

  const videos = tutorials.filter(t => t.type === 'video' || !t.type)
  const images = tutorials.filter(t => t.type === 'image')
  const timelines = tutorials.filter(t => t.type === 'timeline')

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <GraduationCap className="h-8 w-8 text-blue-600" />
          <h1 className="text-3xl font-bold tracking-tight">Tutoriais e Guias</h1>
        </div>
      </div>

      <Tabs defaultValue="videos" className="w-full">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6">
          <TabsList className="bg-slate-100 dark:bg-slate-900 p-1">
            <TabsTrigger value="videos" className="gap-2"><PlayCircle className="h-4 w-4" /> Vídeos</TabsTrigger>
            <TabsTrigger value="images" className="gap-2"><ImageIcon className="h-4 w-4" /> Rascunhos & Imagens</TabsTrigger>
            <TabsTrigger value="timelines" className="gap-2"><Map className="h-4 w-4" /> Organogramas</TabsTrigger>
          </TabsList>

          <div className="flex gap-2">
            <Button variant="outline" className="gap-2" onClick={() => handleNew('video')}>
              <PlayCircle className="h-4 w-4 text-rose-500" /> Novo Vídeo
            </Button>
            <Button variant="outline" className="gap-2" onClick={() => handleNew('image')}>
              <ImageIcon className="h-4 w-4 text-emerald-500" /> Novo Rascunho
            </Button>
            <Button className="bg-indigo-600 hover:bg-indigo-700 gap-2" onClick={() => handleNew('timeline')}>
              <Map className="h-4 w-4" /> Novo Organograma
            </Button>
          </div>
        </div>

        {/* VÍDEOS */}
        <TabsContent value="videos" className="space-y-4">
          {videos.length === 0 && <p className="text-slate-500 py-10 text-center">Nenhum vídeo cadastrado.</p>}
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
            {videos.map((tutorial) => (
              <Card key={tutorial.id} className="overflow-hidden border-none shadow-md group relative">
                <div className="absolute top-2 right-2 z-20 flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                  <Button size="icon" variant="secondary" className="h-8 w-8" onClick={() => handleEdit(tutorial)}>
                    <Pencil className="h-4 w-4" />
                  </Button>
                  <Button size="icon" variant="destructive" className="h-8 w-8" onClick={() => deleteTutorial(tutorial.id)}>
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
                <div className="aspect-video bg-slate-900 flex items-center justify-center relative">
                  <img 
                    src={`https://img.youtube.com/vi/${tutorial.content?.videoId}/maxresdefault.jpg`} 
                    alt={tutorial.title}
                    className="absolute inset-0 w-full h-full object-cover opacity-80"
                  />
                  <div className="absolute inset-0 bg-black/20" />
                  <PlayCircle className="h-12 w-12 text-white relative z-10 drop-shadow-lg hover:scale-110 transition-transform cursor-pointer" onClick={() => window.open(`https://youtube.com/watch?v=${tutorial.content?.videoId}`, '_blank')} />
                </div>
                <CardHeader>
                  <div className="flex items-center justify-between text-xs text-rose-600 font-medium">
                    <span>VÍDEO AULA</span>
                    <span>{tutorial.content?.duration}</span>
                  </div>
                  <CardTitle className="mt-2 text-lg line-clamp-2">{tutorial.title}</CardTitle>
                  <CardDescription className="line-clamp-2">{tutorial.description}</CardDescription>
                </CardHeader>
              </Card>
            ))}
          </div>
        </TabsContent>

        {/* IMAGENS E RASCUNHOS */}
        <TabsContent value="images" className="space-y-4">
          {images.length === 0 && <p className="text-slate-500 py-10 text-center">Nenhum rascunho com imagem.</p>}
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
            {images.map((tutorial) => (
              <Card key={tutorial.id} className="overflow-hidden border-none shadow-md group relative">
                <div className="absolute top-2 right-2 z-20 flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                  <Button size="icon" variant="secondary" className="h-8 w-8" onClick={() => handleEdit(tutorial)}>
                    <Pencil className="h-4 w-4" />
                  </Button>
                  <Button size="icon" variant="destructive" className="h-8 w-8" onClick={() => deleteTutorial(tutorial.id)}>
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
                <div className="aspect-video bg-slate-100 dark:bg-slate-900 flex items-center justify-center relative overflow-hidden">
                  {tutorial.content?.imageUrl ? (
                    <img src={tutorial.content.imageUrl} alt={tutorial.title} className="w-full h-full object-cover" />
                  ) : (
                    <ImageIcon className="h-12 w-12 text-slate-300" />
                  )}
                  {tutorial.status === 'completed' && (
                    <div className="absolute top-2 left-2 bg-emerald-500 text-white text-xs px-2 py-1 rounded-full flex items-center gap-1 font-bold">
                      <CheckCircle2 className="h-3 w-3" /> CONCLUÍDO
                    </div>
                  )}
                  {tutorial.status === 'draft' && (
                    <div className="absolute top-2 left-2 bg-amber-500 text-white text-xs px-2 py-1 rounded-full flex items-center gap-1 font-bold">
                      RASCUNHO
                    </div>
                  )}
                </div>
                <CardHeader>
                  <CardTitle className="mt-2 text-lg line-clamp-2">{tutorial.title}</CardTitle>
                  <CardDescription className="line-clamp-2">{tutorial.description}</CardDescription>
                </CardHeader>
              </Card>
            ))}
          </div>
        </TabsContent>

        {/* ORGANOGRAMA / LINHA DO TEMPO */}
        <TabsContent value="timelines" className="space-y-4">
          {timelines.length === 0 && <p className="text-slate-500 py-10 text-center">Nenhum organograma criado.</p>}
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
            {timelines.map((tutorial) => (
              <Card key={tutorial.id} className="border shadow-sm group relative">
                <div className="absolute top-4 right-4 z-20 flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                  <Button size="icon" variant="secondary" className="h-8 w-8" onClick={() => handleEdit(tutorial)}>
                    <Pencil className="h-4 w-4" />
                  </Button>
                  <Button size="icon" variant="destructive" className="h-8 w-8" onClick={() => deleteTutorial(tutorial.id)}>
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
                <CardHeader className="border-b bg-slate-50/50 dark:bg-slate-900/50">
                  <div className="flex items-center gap-2 text-indigo-600 font-bold text-sm mb-2">
                    <Map className="h-4 w-4" /> ORGANOGRAMA
                  </div>
                  <CardTitle>{tutorial.title}</CardTitle>
                  <CardDescription>{tutorial.description}</CardDescription>
                </CardHeader>
                <CardContent className="pt-6">
                  <div className="space-y-4 relative">
                    {tutorial.content?.steps?.slice(0, 3).map((step: any, idx: number) => (
                      <div key={idx} className="flex gap-4 relative">
                        {idx < 2 && idx < (tutorial.content.steps.length - 1) && (
                          <div className="absolute left-[11px] top-6 bottom-[-20px] w-0.5 bg-indigo-100 dark:bg-indigo-900" />
                        )}
                        <div className="h-6 w-6 rounded-full bg-indigo-100 dark:bg-indigo-900/50 text-indigo-600 dark:text-indigo-400 text-xs font-bold flex items-center justify-center shrink-0 border-2 border-white dark:border-slate-950 z-10">
                          {idx + 1}
                        </div>
                        <div className="pt-0.5">
                          <p className="font-semibold text-sm line-clamp-1">{step.title}</p>
                          <p className="text-xs text-slate-500 line-clamp-1">{step.text}</p>
                        </div>
                      </div>
                    ))}
                    {(tutorial.content?.steps?.length || 0) > 3 && (
                      <div className="text-xs text-slate-400 font-medium ml-10 italic">
                        + {(tutorial.content.steps.length - 3)} passos...
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>
      </Tabs>

      {/* Modals */}
      <TutorialVideoModal 
        open={videoModalOpen} 
        onClose={() => { setVideoModalOpen(false); setEditTutorial(null) }} 
        tutorial={editTutorial} 
      />
      
      <TutorialImageModal 
        open={imageModalOpen} 
        onClose={() => { setImageModalOpen(false); setEditTutorial(null) }} 
        tutorial={editTutorial} 
      />
      
      <TutorialTimelineModal 
        open={timelineModalOpen} 
        onClose={() => { setTimelineModalOpen(false); setEditTutorial(null) }} 
        tutorial={editTutorial} 
      />
    </div>
  )
}
