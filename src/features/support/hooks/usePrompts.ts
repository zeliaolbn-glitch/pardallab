import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { supabase } from '@/lib/supabase'

export interface Prompt {
  id: string
  title: string
  content: string
  category: string
  order_index: number
  created_at: string
}

export interface StandardPromptItem {
  id: string
  focus: string
  description: string
  order_index: number
}

export function usePrompts() {
  const queryClient = useQueryClient()

  const promptsQuery = useQuery({
    queryKey: ['prompts'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('prompts')
        .select('*')
        .order('order_index', { ascending: true })
      if (error) throw error
      return data as Prompt[]
    }
  })

  const createPrompt = useMutation({
    mutationFn: async (p: Omit<Prompt, 'id' | 'created_at'>) => {
      const { data, error } = await supabase.from('prompts').insert([p]).select().single()
      if (error) throw error
      return data as Prompt
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['prompts'] })
  })

  const updatePrompt = useMutation({
    mutationFn: async ({ id, ...updates }: Partial<Prompt> & { id: string }) => {
      const { error } = await supabase.from('prompts').update(updates).eq('id', id)
      if (error) throw error
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['prompts'] })
  })

  const deletePrompt = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase.from('prompts').delete().eq('id', id)
      if (error) throw error
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['prompts'] })
  })

  return {
    prompts: promptsQuery.data ?? [],
    isLoading: promptsQuery.isLoading,
    createPrompt: createPrompt.mutateAsync,
    updatePrompt: updatePrompt.mutateAsync,
    deletePrompt: deletePrompt.mutateAsync
  }
}

export function useStandardPrompts() {
  const queryClient = useQueryClient()

  const query = useQuery({
    queryKey: ['standard_prompts'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('standard_prompts')
        .select('*')
        .order('order_index', { ascending: true })
      if (error) throw error
      return data as StandardPromptItem[]
    }
  })

  const create = useMutation({
    mutationFn: async (item: Omit<StandardPromptItem, 'id'>) => {
      const { data, error } = await supabase.from('standard_prompts').insert([item]).select().single()
      if (error) throw error
      return data
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['standard_prompts'] })
  })

  const update = useMutation({
    mutationFn: async ({ id, ...updates }: Partial<StandardPromptItem> & { id: string }) => {
      const { error } = await supabase.from('standard_prompts').update(updates).eq('id', id)
      if (error) throw error
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['standard_prompts'] })
  })

  const remove = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase.from('standard_prompts').delete().eq('id', id)
      if (error) throw error
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['standard_prompts'] })
  })

  return {
    items: query.data ?? [],
    isLoading: query.isLoading,
    createItem: create.mutateAsync,
    updateItem: update.mutateAsync,
    deleteItem: remove.mutateAsync
  }
}
