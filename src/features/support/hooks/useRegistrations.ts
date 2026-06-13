import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { supabase } from '@/lib/supabase'

export interface Registration {
  id: string
  platform: string
  user_account: string
  reminder: string
  reason: string
  start_date: string
  end_date: string
  bot_alert: boolean
  created_at: string
}

export function useRegistrations() {
  const queryClient = useQueryClient()

  const registrationsQuery = useQuery({ 
    queryKey: ['registrations'], 
    queryFn: async () => {
      const { data, error } = await supabase
        .from('account_registrations')
        .select('*')
        .order('created_at', { ascending: false })
      
      if (error) throw error
      return data as Registration[]
    }
  })

  const createRegistration = useMutation({
    mutationFn: async (newReg: Omit<Registration, 'id' | 'created_at'>) => {
      const { data, error } = await supabase
        .from('account_registrations')
        .insert([newReg])
        .select()
        .single()

      if (error) throw error
      return data as Registration
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['registrations'] })
  })

  const updateRegistration = useMutation({
    mutationFn: async ({ id, ...updates }: Partial<Registration> & { id: string }) => {
      const { error } = await supabase
        .from('account_registrations')
        .update(updates)
        .eq('id', id)
      
      if (error) throw error
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['registrations'] })
  })

  const deleteRegistration = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase
        .from('account_registrations')
        .delete()
        .eq('id', id)
      
      if (error) throw error
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['registrations'] })
  })

  return {
    registrations: Array.isArray(registrationsQuery.data) ? registrationsQuery.data : [],
    isLoading: registrationsQuery.isLoading,
    createRegistration: createRegistration.mutateAsync,
    updateRegistration: updateRegistration.mutateAsync,
    deleteRegistration: deleteRegistration.mutateAsync
  }
}
