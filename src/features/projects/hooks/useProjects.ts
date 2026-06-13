import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { supabase } from '@/lib/supabase'
import { toast } from 'sonner'
import type { Project, CreateProjectInput, ProjectStatus } from '../types'

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
      // Remove campos que não existem na tabela do Supabase se necessário, 
      // ou garante que o idea_id seja tratado.
      const { idea_id, ...projectData } = newProject
      
      const { data, error } = await supabase
        .from('projects')
        .insert([{
          ...projectData,
          status: (newProject.status as ProjectStatus) || 'IDEIA',
          created_at: new Date().toISOString()
        }])
        .select()
        .single()

      if (error) throw error

      // Se veio de uma ideia, deleta a ideia do banco
      if (idea_id) {
        await supabase.from('ideas').delete().eq('id', idea_id)
      }

      return data as Project
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['projects'] })
      queryClient.invalidateQueries({ queryKey: ['ideas'] })
    }
  })

  const updateProjectStatus = useMutation({
    mutationFn: async ({ id, status }: { id: string, status: ProjectStatus }) => {
      const { error } = await supabase
        .from('projects')
        .update({ status })
        .eq('id', id)
      
      if (error) throw error
    },
    onMutate: async ({ id, status }) => {
      await queryClient.cancelQueries({ queryKey: ['projects'] })
      const previousProjects = queryClient.getQueryData(['projects'])
      queryClient.setQueryData(['projects'], (old: Project[] | undefined) => {
        if (!Array.isArray(old)) return []
        return old.map(p => p.id === id ? { ...p, status } : p)
      })
      return { previousProjects }
    },
    onError: (_err, _variables, context) => {
      if (context?.previousProjects) {
        queryClient.setQueryData(['projects'], context.previousProjects)
      }
      toast.error('Erro ao atualizar status no Supabase.')
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ['projects'] })
    }
  })

  const updateProjectMutation = useMutation({
    mutationFn: async ({ id, ...updates }: Partial<Project> & { id: string }) => {
      // Segurança: remove prompt_used para não quebrar caso a coluna não exista no Supabase
      const safeUpdates = { ...updates }
      delete safeUpdates.prompt_used

      const { error } = await supabase
        .from('projects')
        .update(safeUpdates)
        .eq('id', id)
      
      if (error) throw error
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['projects'] })
    }
  })

  const deleteProject = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase
        .from('projects')
        .delete()
        .eq('id', id)
      
      if (error) throw error
    },
    onMutate: async (id) => {
      await queryClient.cancelQueries({ queryKey: ['projects'] })
      const previousProjects = queryClient.getQueryData(['projects'])
      queryClient.setQueryData(['projects'], (old: Project[] | undefined) => {
        if (!Array.isArray(old)) return []
        return old.filter(p => p.id !== id)
      })
      return { previousProjects }
    },
    onError: (_err, _id, context) => {
      if (context?.previousProjects) {
        queryClient.setQueryData(['projects'], context.previousProjects)
      }
      toast.error('Erro ao deletar projeto do Supabase.')
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ['projects'] })
    }
  })

  return {
    projects: Array.isArray(projectsQuery.data) ? projectsQuery.data : [],
    isLoading: projectsQuery.isLoading,
    createProject: createProjectMutation.mutateAsync,
    isCreating: createProjectMutation.isPending,
    updateProject: updateProjectMutation.mutateAsync,
    isUpdating: updateProjectMutation.isPending,
    updateProjectStatus: updateProjectStatus.mutateAsync,
    deleteProject: deleteProject.mutateAsync
  }
}
