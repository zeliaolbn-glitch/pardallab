import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { supabase } from '@/lib/supabase'
import type { Project, CreateProjectInput } from '../types'

export function useProjects() {
  const queryClient = useQueryClient()

  const projectsQuery = useQuery({
    queryKey: ['projects'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('projects')
        .select('*')
        .order('created_at', { ascending: false })

      if (error) throw error
      return data as Project[]
    }
  })

  const createProjectMutation = useMutation({
    mutationFn: async (newProject: CreateProjectInput) => {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) throw new Error('User not authenticated')

      const { data, error } = await supabase
        .from('projects')
        .insert([{ ...newProject, user_id: user.id }])
        .select()
        .single()

      if (error) throw error

      // If converting from an idea, update the idea status
      if (newProject.idea_id) {
        await supabase
          .from('ideas')
          .update({ status: 'archived' })
          .eq('id', newProject.idea_id)
        
        queryClient.invalidateQueries({ queryKey: ['ideas'] })
      }

      return data as Project
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['projects'] })
    }
  })

  const deleteProjectMutation = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase
        .from('projects')
        .delete()
        .eq('id', id)

      if (error) throw error
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['projects'] })
    }
  })

  return {
    projects: projectsQuery.data ?? [],
    isLoading: projectsQuery.isLoading,
    createProject: createProjectMutation.mutateAsync,
    isCreating: createProjectMutation.isPending,
    deleteProject: deleteProjectMutation.mutateAsync
  }
}
