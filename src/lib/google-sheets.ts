const getSheetsUrl = () => {
  const savedSettings = localStorage.getItem('ideaflow_settings')
  if (savedSettings) {
    const settings = JSON.parse(savedSettings)
    if (settings.googleSheetsUrl) return settings.googleSheetsUrl
  }
  return import.meta.env.VITE_GOOGLE_SHEETS_URL
}

export const sheetsApi = {
  async fetch(sheet: string) {
    const url = getSheetsUrl()
    if (!url) return []
    
    try {
      const response = await fetch(`${url}?sheet=${sheet}`)
      if (!response.ok) return []
      return await response.json()
    } catch (error) {
      console.error('Erro ao buscar dados:', error)
      return []
    }
  },

  async post(sheet: string, action: string, payload: any) {
    const url = getSheetsUrl()
    if (!url) {
      throw new Error('URL do Google Sheets não configurada.')
    }

    try {
      await fetch(url, {
        method: 'POST',
        mode: 'no-cors',
        headers: {
          'Content-Type': 'text/plain',
        },
        body: JSON.stringify({ sheet, action, payload })
      })

      return { success: true }
    } catch (error) {
      console.error('Erro no POST para Google Sheets:', error)
      throw error
    }
  }
}
