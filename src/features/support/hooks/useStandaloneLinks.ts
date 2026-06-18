import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { supabase } from '@/lib/supabase'

export interface StandaloneLink {
  id: string
  title: string
  url: string
  main_function: string
  tool: string
  summary: string
  rating?: number
  created_at: string
  category?: string
}

export function useStandaloneLinks(category: 'geral' | 'investimento' = 'geral') {
  const queryClient = useQueryClient()

  const linksQuery = useQuery({
    queryKey: ['standalone_links', category],
    queryFn: async () => {
      let query = supabase
        .from('standalone_links')
        .select('*')
        .neq('main_function', 'draft')
        .order('created_at', { ascending: false })
      
      if (category === 'investimento') {
        query = query.eq('category', 'investimento')
      } else {
        query = query.or('category.is.null,category.neq.investimento')
      }

      const { data, error } = await query
      
      if (error) throw error
      return data as StandaloneLink[]
    }
  })

  const createLink = useMutation({
    mutationFn: async (newLink: Omit<StandaloneLink, 'id' | 'created_at'>) => {
      const { data, error } = await supabase
        .from('standalone_links')
        .insert([{
          ...newLink,
          category,
          created_at: new Date().toISOString()
        }])
        .select()
        .single()

      if (error) throw error
      return data as StandaloneLink
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['standalone_links'] })
      queryClient.invalidateQueries({ queryKey: ['draft_links'] })
    }
  })

  const updateLink = useMutation({
    mutationFn: async ({ id, ...updates }: Partial<StandaloneLink> & { id: string }) => {
      const { error } = await supabase
        .from('standalone_links')
        .update(updates)
        .eq('id', id)
      
      if (error) throw error
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['standalone_links'] })
      queryClient.invalidateQueries({ queryKey: ['draft_links'] })
    }
  })

  const deleteLink = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase
        .from('standalone_links')
        .delete()
        .eq('id', id)
      
      if (error) throw error
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['standalone_links'] })
      queryClient.invalidateQueries({ queryKey: ['draft_links'] })
    }
  })

  return {
    links: Array.isArray(linksQuery.data) ? linksQuery.data : [],
    isLoading: linksQuery.isLoading,
    createLink: createLink.mutateAsync,
    updateLink: updateLink.mutateAsync,
    deleteLink: deleteLink.mutateAsync
  }
}
