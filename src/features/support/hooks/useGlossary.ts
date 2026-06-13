import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { supabase } from '@/lib/supabase'

export interface GlossaryItem {
  id: string
  expression: string
  description: string
  usage: string
  tutorial_link: string
}

export function useGlossary() {
  const queryClient = useQueryClient()

  const glossaryQuery = useQuery({
    queryKey: ['glossary'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('glossary')
        .select('*')
        .order('expression', { ascending: true })
      
      if (error) throw error
      return data as GlossaryItem[]
    }
  })

  const createItem = useMutation({
    mutationFn: async (newItem: Omit<GlossaryItem, 'id'>) => {
      const { data, error } = await supabase.from('glossary').insert([newItem]).select().single()
      if (error) throw error
      return data
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['glossary'] })
  })

  const updateItem = useMutation({
    mutationFn: async ({ id, ...updates }: Partial<GlossaryItem> & { id: string }) => {
      const { error } = await supabase.from('glossary').update(updates).eq('id', id)
      if (error) throw error
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['glossary'] })
  })

  const deleteItem = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase.from('glossary').delete().eq('id', id)
      if (error) throw error
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['glossary'] })
  })

  return {
    items: glossaryQuery.data ?? [],
    isLoading: glossaryQuery.isLoading,
    createItem: createItem.mutateAsync,
    updateItem: updateItem.mutateAsync,
    deleteItem: deleteItem.mutateAsync
  }
}
