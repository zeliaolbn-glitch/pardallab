import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { supabase } from '@/lib/supabase'

export interface DeployedProject {
  id: string
  project_name: string
  local_url?: string
  web_url: string
  default_user: string
  account_info: string
  created_at: string
}

export function useDeployedProjects() {
  const queryClient = useQueryClient()

  const deployedQuery = useQuery({
    queryKey: ['deployed_projects'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('deployed_projects')
        .select('*')
        .order('created_at', { ascending: false })
      
      if (error) throw error
      return data as DeployedProject[]
    }
  })

  const createDeployed = useMutation({
    mutationFn: async (newDep: Omit<DeployedProject, 'id' | 'created_at'>) => {
      const { data, error } = await supabase
        .from('deployed_projects')
        .insert([{
          ...newDep,
          created_at: new Date().toISOString()
        }])
        .select()
        .single()

      if (error) throw error
      return data as DeployedProject
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['deployed_projects'] })
  })

  const updateDeployed = useMutation({
    mutationFn: async ({ id, ...updates }: Partial<DeployedProject> & { id: string }) => {
      const { error } = await supabase
        .from('deployed_projects')
        .update(updates)
        .eq('id', id)
      
      if (error) throw error
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['deployed_projects'] })
  })

  const deleteDeployed = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase
        .from('deployed_projects')
        .delete()
        .eq('id', id)
      
      if (error) throw error
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['deployed_projects'] })
  })

  return { 
    deployed: deployedQuery.data ?? [], 
    createDeployed: createDeployed.mutateAsync,
    updateDeployed: updateDeployed.mutateAsync,
    deleteDeployed: deleteDeployed.mutateAsync
  }
}
