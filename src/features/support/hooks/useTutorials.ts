import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { supabase } from '@/lib/supabase'

export type TutorialType = 'video' | 'image' | 'timeline'
export type TutorialStatus = 'draft' | 'completed'

export interface Tutorial {
  id: string
  title: string
  description: string
  type: TutorialType
  status: TutorialStatus
  content: any // JSON flexível: { videoId: string } ou { imageUrl: string } ou { steps: { title: string, text: string }[] }
  created_at: string
}

export function useTutorials() {
  const queryClient = useQueryClient()

  const tutorialsQuery = useQuery({
    queryKey: ['tutorials'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('tutorials')
        .select('*')
        .order('created_at', { ascending: false })
      if (error) throw error
      return data as Tutorial[]
    }
  })

  const createTutorial = useMutation({
    mutationFn: async (newT: Omit<Tutorial, 'id' | 'created_at'>) => {
      const { data, error } = await supabase
        .from('tutorials')
        .insert([newT])
        .select()
        .single()
      if (error) throw error
      return data
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['tutorials'] })
  })

  const updateTutorial = useMutation({
    mutationFn: async ({ id, ...updates }: Partial<Tutorial> & { id: string }) => {
      const { error } = await supabase
        .from('tutorials')
        .update(updates)
        .eq('id', id)
      if (error) throw error
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['tutorials'] })
  })

  const deleteTutorial = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase
        .from('tutorials')
        .delete()
        .eq('id', id)
      if (error) throw error
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['tutorials'] })
  })

  // Helper para upload de imagens no Storage do Supabase
  const uploadTutorialImage = async (file: File): Promise<string> => {
    const fileExt = file.name.split('.').pop()
    const fileName = `${Math.random().toString(36).substring(2)}-${Date.now()}.${fileExt}`
    const filePath = `images/${fileName}`

    const { error: uploadError } = await supabase.storage
      .from('tutorial_images')
      .upload(filePath, file)

    if (uploadError) throw uploadError

    const { data } = supabase.storage
      .from('tutorial_images')
      .getPublicUrl(filePath)

    return data.publicUrl
  }

  return {
    tutorials: tutorialsQuery.data ?? [],
    isLoading: tutorialsQuery.isLoading,
    createTutorial: createTutorial.mutateAsync,
    updateTutorial: updateTutorial.mutateAsync,
    deleteTutorial: deleteTutorial.mutateAsync,
    uploadTutorialImage
  }
}
