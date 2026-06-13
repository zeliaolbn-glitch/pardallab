import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { supabase } from '@/lib/supabase'

export interface Tool {
  id: string
  name: string
  description?: string
  url: string
  category?: string
  main_function: string
  accounts?: string 
  user_id?: string
  created_at?: string
}

export function useTools() {
  const queryClient = useQueryClient()

  const { data: tools, isLoading } = useQuery({
    queryKey: ['tools'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('tools')
        .select('*')
        .order('name', { ascending: true })

      if (error) throw error
      return data as Tool[]
    }
  })

  const createTool = useMutation({
    mutationFn: async (newTool: Omit<Tool, 'id'>) => {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) throw new Error('Usuário não autenticado.')

      const { name, main_function, url, accounts, description, category } = newTool
      
      const { data, error } = await supabase
        .from('tools')
        .insert([{ 
          name, 
          main_function, 
          url, 
          accounts, 
          description, 
          category,
          user_id: user.id,
          created_at: new Date().toISOString()
        }])
        .select()
        .single()

      if (error) {
        console.error('Supabase Error (Tools):', error)
        throw new Error(error.message)
      }
      return data as Tool
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['tools'] })
  })

  const updateTool = useMutation({
    mutationFn: async ({ id, name, main_function, url, accounts, description, category }: Partial<Tool> & { id: string }) => {
      const updates = { name, main_function, url, accounts, description, category }
      const { error } = await supabase
        .from('tools')
        .update(updates)
        .eq('id', id)
      
      if (error) throw error
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['tools'] })
  })

  const deleteTool = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase
        .from('tools')
        .delete()
        .eq('id', id)
      
      if (error) throw error
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['tools'] })
  })

  return {
    tools: Array.isArray(tools) ? tools : [],
    isLoading,
    createTool: createTool.mutateAsync,
    updateTool: updateTool.mutateAsync,
    deleteTool: deleteTool.mutateAsync
  }
}
