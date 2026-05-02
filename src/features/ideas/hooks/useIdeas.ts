import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { supabase } from '@/lib/supabase'
import type { Idea, CreateIdeaInput } from '../types'

export function useIdeas() {
  const queryClient = useQueryClient()

  const ideasQuery = useQuery({
    queryKey: ['ideas'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('ideas')
        .select('*')
        .order('created_at', { ascending: false })

      if (error) throw error
      return data as Idea[]
    }
  })

  const createIdeaMutation = useMutation({
    mutationFn: async (newIdea: CreateIdeaInput) => {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) throw new Error('User not authenticated')

      const { data, error } = await supabase
        .from('ideas')
        .insert([{ ...newIdea, user_id: user.id }])
        .select()
        .single()

      if (error) throw error
      return data as Idea
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['ideas'] })
    }
  })

  const deleteIdeaMutation = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase
        .from('ideas')
        .delete()
        .eq('id', id)

      if (error) throw error
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['ideas'] })
    }
  })

  return {
    ideas: ideasQuery.data ?? [],
    isLoading: ideasQuery.isLoading,
    error: ideasQuery.error,
    createIdea: createIdeaMutation.mutateAsync,
    isCreating: createIdeaMutation.isPending,
    deleteIdea: deleteIdeaMutation.mutateAsync
  }
}
