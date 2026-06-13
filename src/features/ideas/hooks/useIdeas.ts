import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { supabase } from '@/lib/supabase'
import type { Idea, IdeaStatus } from '../types'
import { toast } from 'sonner'

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
    mutationFn: async (newIdea: { title: string; description: string; category: string }) => {
      const { data, error } = await supabase
        .from('ideas')
        .insert([{
          ...newIdea,
          status: 'pending' as IdeaStatus,
          created_at: new Date().toISOString()
        }])
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
    onMutate: async (id) => {
      await queryClient.cancelQueries({ queryKey: ['ideas'] })
      const previousIdeas = queryClient.getQueryData(['ideas'])
      queryClient.setQueryData(['ideas'], (old: Idea[] | undefined) => {
        if (!Array.isArray(old)) return []
        return old.filter(i => i.id !== id)
      })
      return { previousIdeas }
    },
    onError: (_err, _id, context) => {
      if (context?.previousIdeas) {
        queryClient.setQueryData(['ideas'], context.previousIdeas)
      }
      toast.error('Erro ao deletar ideia do Supabase.')
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ['ideas'] })
    }
  })

  return {
    ideas: Array.isArray(ideasQuery.data) ? ideasQuery.data : [],
    isLoading: ideasQuery.isLoading,
    createIdea: createIdeaMutation.mutateAsync,
    isCreating: createIdeaMutation.isPending,
    deleteIdea: deleteIdeaMutation.mutateAsync
  }
}
