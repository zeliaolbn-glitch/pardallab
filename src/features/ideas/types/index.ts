export type IdeaStatus = 'draft' | 'active' | 'archived'

export interface Idea {
  id: string
  user_id: string
  title: string
  description: string | null
  status: IdeaStatus
  created_at: string
}

export interface CreateIdeaInput {
  title: string
  description?: string
  status?: IdeaStatus
}
