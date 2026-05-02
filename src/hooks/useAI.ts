import { useState } from 'react'
import { GoogleGenerativeAI } from '@google/generative-ai'

const API_KEY = import.meta.env.VITE_GEMINI_API_KEY
const genAI = new GoogleGenerativeAI(API_KEY || '')

export function useAI() {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const generateActionPlan = async (title: string, description: string) => {
    if (!API_KEY) {
      return 'Chave de API do Gemini não configurada no arquivo .env.local'
    }

    setLoading(true)
    setError(null)
    try {
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

  return {
    generateActionPlan,
    loading,
    error
  }
}
