export type ProjectStatus = 'planning' | 'in_progress' | 'completed'

export interface Project {
  id: string
  user_id: string
  idea_id?: string
  title: string
  description: string | null
  category: string | null
  status: ProjectStatus
  created_at: string
}

export interface CreateProjectInput {
  title: string
  description?: string
  category?: string
  status?: ProjectStatus
  idea_id?: string
}
