import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'

export interface DeployedProject {
  id: string
  project_name: string
  local_url?: string
  web_url: string
  default_user: string
  account_info: string
  created_at: string
}

const STORAGE_KEY = 'ideaflow_deployed_projects'

const getLocalDeployed = (): DeployedProject[] => {
  const data = localStorage.getItem(STORAGE_KEY)
  return data ? JSON.parse(data) : []
}

export function useDeployedProjects() {
  const queryClient = useQueryClient()
  const deployedQuery = useQuery({ queryKey: ['deployed_projects'], queryFn: async () => getLocalDeployed() })

  const createDeployed = useMutation({
    mutationFn: async (newDep: Omit<DeployedProject, 'id' | 'created_at'>) => {
      const data = getLocalDeployed()
      const entry = { ...newDep, id: crypto.randomUUID(), created_at: new Date().toISOString() }
      localStorage.setItem(STORAGE_KEY, JSON.stringify([entry, ...data]))
      return entry
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['deployed_projects'] })
  })

  const updateDeployed = useMutation({
    mutationFn: async ({ id, ...updates }: Partial<DeployedProject> & { id: string }) => {
      const data = getLocalDeployed()
      const updated = data.map(d => d.id === id ? { ...d, ...updates } : d)
      localStorage.setItem(STORAGE_KEY, JSON.stringify(updated))
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['deployed_projects'] })
  })

  return { 
    deployed: deployedQuery.data ?? [], 
    createDeployed: createDeployed.mutateAsync,
    updateDeployed: updateDeployed.mutateAsync 
  }
}
