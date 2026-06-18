import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { supabase } from '@/lib/supabase'

export interface DraftLink {
  id: string
  url: string
  title: string
  summary: string
  tool: string
  created_at: string
}

export function useDraftLinks() {
  const queryClient = useQueryClient()

  const draftsQuery = useQuery({
    queryKey: ['draft_links'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('standalone_links')
        .select('*')
        .eq('main_function', 'draft')
        .order('created_at', { ascending: false })
      if (error) throw error
      return data as DraftLink[]
    }
  })

  const deleteDraft = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase.from('standalone_links').delete().eq('id', id)
      if (error) throw error
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['draft_links'] })
      queryClient.invalidateQueries({ queryKey: ['standalone_links'] })
    }
  })

  const validateDraft = useMutation({
    mutationFn: async ({ id, category = 'geral' }: { id: string, category?: 'geral' | 'investimento' }) => {
      // Remove a flag de rascunho e define a categoria
      const { error } = await supabase.from('standalone_links').update({ 
        main_function: '',
        category 
      }).eq('id', id)
      if (error) throw error
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['draft_links'] })
      queryClient.invalidateQueries({ queryKey: ['standalone_links'] })
    }
  })

  return { 
    drafts: draftsQuery.data ?? [], 
    deleteDraft: deleteDraft.mutateAsync,
    validateDraft: validateDraft.mutateAsync
  }
}
