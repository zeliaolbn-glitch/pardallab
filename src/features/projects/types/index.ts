export type ProjectStatus = 
  | 'IDEIA' 
  | 'INICIADA' 
  | 'FERRAMENTAS ESCOLHIDAS' 
  | 'INICIO DO CODIGO' 
  | 'IMPLEMENTAÇÃO LOCAL' 
  | 'VALIDADA' 
  | 'IMPLEMENTAÇÃO WEB' 
  | 'APP WINDOWS/APK'

export const PROJECT_STATUS_FLOW: ProjectStatus[] = [
  'IDEIA',
  'INICIADA',
  'FERRAMENTAS ESCOLHIDAS',
  'INICIO DO CODIGO',
  'IMPLEMENTAÇÃO LOCAL',
  'VALIDADA',
  'IMPLEMENTAÇÃO WEB',
  'APP WINDOWS/APK'
]

export interface ProjectAccount {
  account_name: string
  username: string
  password?: string
  url?: string
}

export interface Project {
  id: string
  user_id: string
  idea_id?: string
  title: string
  description: string | null
  status: ProjectStatus
  created_at: string
  project_date?: string
  
  // Novos campos Onda 1 e 2
  prompt_used?: string
  result_link?: string // Link do projeto criado
  
  // Informações de Vídeo (Fases anteriores)
  video_link?: string
  video_function?: string
  video_tool?: string
  video_summary?: string
  
  tools_used?: string
  category?: string
  notes?: string
  updates_checklist?: { id: string; text: string; completed: boolean }[]
}

export interface CreateProjectInput {
  title: string
  description?: string
  status?: ProjectStatus
  idea_id?: string
  project_date?: string
  prompt_used?: string
  result_link?: string
  video_link?: string
  video_function?: string
  video_tool?: string
  video_summary?: string
  tools_used?: string
  category?: string
  notes?: string
  updates_checklist?: { id: string; text: string; completed: boolean }[]
}
