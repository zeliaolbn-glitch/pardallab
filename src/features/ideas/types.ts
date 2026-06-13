export type IdeaStatus = 'pending' | 'converted' | 'archived'

export interface Idea {
  id: string
  title: string
  description: string
  category?: string // Adicionado
  status: IdeaStatus
  created_at: string
}
