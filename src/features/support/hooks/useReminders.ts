import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { supabase } from '@/lib/supabase'

export interface Reminder {
  id: string
  content: string
  completed: boolean
  created_at: string
}

export function useReminders() {
  const queryClient = useQueryClient()

  const remindersQuery = useQuery({
    queryKey: ['reminders'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('reminders')
        .select('*')
        .order('completed', { ascending: true }) // Não completados primeiro
        .order('created_at', { ascending: false })
      
      if (error) throw error
      return data as Reminder[]
    }
  })

  const createReminder = useMutation({
    mutationFn: async (content: string) => {
      const { data, error } = await supabase.from('reminders').insert([{ content }]).select().single()
      if (error) throw error
      return data
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['reminders'] })
  })

  const toggleReminder = useMutation({
    mutationFn: async ({ id, completed }: { id: string; completed: boolean }) => {
      const { error } = await supabase.from('reminders').update({ completed }).eq('id', id)
      if (error) throw error
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['reminders'] })
  })

  const updateReminder = useMutation({
    mutationFn: async ({ id, content }: { id: string; content: string }) => {
      const { error } = await supabase.from('reminders').update({ content }).eq('id', id)
      if (error) throw error
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['reminders'] })
  })

  const deleteReminder = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase.from('reminders').delete().eq('id', id)
      if (error) throw error
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['reminders'] })
  })

  return {
    reminders: remindersQuery.data ?? [],
    isLoading: remindersQuery.isLoading,
    createReminder: createReminder.mutateAsync,
    toggleReminder: toggleReminder.mutateAsync,
    updateReminder: updateReminder.mutateAsync,
    deleteReminder: deleteReminder.mutateAsync
  }
}
