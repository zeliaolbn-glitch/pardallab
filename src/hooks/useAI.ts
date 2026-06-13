import { useState } from 'react'
import { GoogleGenerativeAI } from '@google/generative-ai'

const getApiKey = () => {
  const savedSettings = localStorage.getItem('ideaflow_settings')
  if (savedSettings) {
    const settings = JSON.parse(savedSettings)
    if (settings.geminiApiKey) return settings.geminiApiKey
  }
  return import.meta.env.VITE_GEMINI_API_KEY
}

export function useAI() {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const generateActionPlan = async (title: string, description: string) => {
    const apiKey = getApiKey()
    
    if (!apiKey) {
      return 'Chave de API do Gemini não configurada nas Configurações ou no .env.local'
    }

    setLoading(true)
    setError(null)
    try {
      const genAI = new GoogleGenerativeAI(apiKey)
      const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' })
      const prompt = `
        Você é um consultor especialista em startups e novos negócios. 
        Analise a seguinte ideia e forneça um plano de ação estruturado em Markdown:
        
        Título: ${title}
        Descrição: ${description}
        
        Por favor, inclua:
        1. 3 Primeiros passos práticos.
        2. Principais desafios a superar.
        3. Sugestão de ferramentas ou tecnologia.
      `
      
      const result = await model.generateContent(prompt)
      const response = await result.response
      return response.text()
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Falha ao gerar conteúdo pela IA'
      setError(message)
      throw err
    } finally {
      setLoading(false)
    }
  }

  const extractVideoInfo = async (url: string, title: string) => {
    const apiKey = getApiKey()
    
    if (!apiKey) {
      return null
    }

    setLoading(true)
    setError(null)
    try {
      const genAI = new GoogleGenerativeAI(apiKey)
      const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' })
      const prompt = `
        Você é um assistente que organiza links de vídeos e ferramentas.
        Estou salvando o seguinte vídeo:
        URL: ${url}
        Título Original do YouTube: ${title}
        
        Sua tarefa é analisar o título e a URL (e qualquer contexto público que você saiba sobre isso) para extrair e deduzir as informações abaixo.
        
        Retorne APENAS um objeto JSON válido, sem formatação markdown ou crases em volta, exatamente com estas 3 chaves:
        {
          "main_function": "Descrição curta da função ou objetivo do vídeo (ex: Criar automação, Design de Logo)",
          "tool": "O nome da ferramenta ou tecnologia principal usada (ex: Make, ChatGPT, Photoshop). Se não souber, coloque 'Geral'",
          "summary": "Um breve resumo (1 ou 2 frases) sobre o que esse vídeo ensina ou aborda."
        }
      `
      
      const result = await model.generateContent(prompt)
      const response = await result.response
      const text = response.text().replace(/```json/g, '').replace(/```/g, '').trim()
      
      return JSON.parse(text)
    } catch (err) {
      console.error("Erro no Gemini ao extrair info de vídeo:", err)
      return null
    } finally {
      setLoading(false)
    }
  }

  return {
    generateActionPlan,
    extractVideoInfo,
    loading,
    error
  }
}
