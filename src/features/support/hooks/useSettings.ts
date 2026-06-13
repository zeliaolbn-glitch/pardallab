import { useState, useEffect } from 'react'

export interface Settings {
  telegramToken: string
  telegramChatId: string
  googleSheetsUrl: string
  geminiApiKey: string
  autoFillVideoAI?: boolean
  lastBackup: string | null
}

const STORAGE_KEY = 'ideaflow_settings'

const defaultSettings: Settings = {
  telegramToken: '',
  telegramChatId: '',
  googleSheetsUrl: import.meta.env.VITE_GOOGLE_SHEETS_URL || '',
  geminiApiKey: import.meta.env.VITE_GEMINI_API_KEY || '',
  autoFillVideoAI: false,
  lastBackup: null
}

export function useSettings() {
  const [settings, setSettings] = useState<Settings>(() => {
    const saved = localStorage.getItem(STORAGE_KEY)
    return saved ? JSON.parse(saved) : defaultSettings
  })

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(settings))
  }, [settings])

  const updateSettings = (updates: Partial<Settings>) => {
    setSettings(prev => ({ ...prev, ...updates }))
  }

  const exportAllData = () => {
    const allData = {
      ideas: localStorage.getItem('ideaflow_ideas'),
      projects: localStorage.getItem('ideaflow_projects'),
      tools: localStorage.getItem('ideaflow_tools'),
      standalone_links: localStorage.getItem('ideaflow_standalone_links'),
      settings: JSON.stringify(settings)
    }
    const blob = new Blob([JSON.stringify(allData, null, 2)], { type: 'application/json' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `ideaflow_backup_${new Date().toISOString().split('T')[0]}.json`
    a.click()
    updateSettings({ lastBackup: new Date().toISOString() })
  }

  const importAllData = (jsonData: string) => {
    try {
      const data = JSON.parse(jsonData)
      if (data.ideas) localStorage.setItem('ideaflow_ideas', data.ideas)
      if (data.projects) localStorage.setItem('ideaflow_projects', data.projects)
      if (data.tools) localStorage.setItem('ideaflow_tools', data.tools)
      if (data.standalone_links) localStorage.setItem('ideaflow_standalone_links', data.standalone_links)
      if (data.settings) setSettings(JSON.parse(data.settings))
      return true
    } catch (e) {
      console.error('Erro ao importar backup:', e)
      return false
    }
  }

  return {
    settings,
    updateSettings,
    exportAllData,
    importAllData
  }
}
