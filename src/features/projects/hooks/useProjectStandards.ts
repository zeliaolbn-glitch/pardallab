import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { supabase } from '@/lib/supabase'

export interface ProjectStandard {
  id: string
  title: string
  description: string
  order_index: number
  created_at: string
}

export interface ProjectChecklist {
  id: string
  project_id: string
  standard_id: string
  completed: boolean
}

export function useProjectStandards() {
  const queryClient = useQueryClient()

  const standardsQuery = useQuery({
    queryKey: ['project_standards'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('project_standards')
        .select('*')
        .order('order_index', { ascending: true })
      if (error) throw error
      return data as ProjectStandard[]
    }
  })

  const createStandard = useMutation({
    mutationFn: async (standard: { title: string; description: string; order_index: number }) => {
      const { data, error } = await supabase.from('project_standards').insert([standard]).select().single()
      if (error) throw error
      return data
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['project_standards'] })
  })

  const updateStandard = useMutation({
    mutationFn: async ({ id, ...updates }: Partial<ProjectStandard> & { id: string }) => {
      const { error } = await supabase.from('project_standards').update(updates).eq('id', id)
      if (error) throw error
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['project_standards'] })
  })

  const deleteStandard = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase.from('project_standards').delete().eq('id', id)
      if (error) throw error
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['project_standards'] })
  })

  return {
    standards: standardsQuery.data ?? [],
    isLoading: standardsQuery.isLoading,
    createStandard: createStandard.mutateAsync,
    updateStandard: updateStandard.mutateAsync,
    deleteStandard: deleteStandard.mutateAsync
  }
}

export function useProjectChecklist(projectId: string) {
  const queryClient = useQueryClient()

  const checklistQuery = useQuery({
    queryKey: ['project_checklist', projectId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('project_checklist')
        .select('*')
        .eq('project_id', projectId)
      if (error) throw error
      return data as ProjectChecklist[]
    },
    enabled: !!projectId
  })

  const toggleItem = useMutation({
    mutationFn: async ({ standardId, completed }: { standardId: string; completed: boolean }) => {
      const { error } = await supabase
        .from('project_checklist')
        .upsert({
          project_id: projectId,
          standard_id: standardId,
          completed
        }, { onConflict: 'project_id,standard_id' })
      if (error) throw error
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['project_checklist', projectId] })
  })

  return {
    checklist: checklistQuery.data ?? [],
    toggleItem: toggleItem.mutateAsync
  }
}
