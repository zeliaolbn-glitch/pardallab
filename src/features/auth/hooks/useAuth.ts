import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { supabase } from '@/lib/supabase'
import { toast } from 'sonner'
import type { User } from '@supabase/supabase-js'

export function useAuth() {
  const [user, setUser] = useState<User | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const navigate = useNavigate()

  useEffect(() => {
    // Verificar sessão atual ao carregar
    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user ?? null)
      setIsLoading(false)
    })

    // Escutar mudanças na autenticação (login/logout)
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null)
      setIsLoading(false)
    })

    return () => subscription.unsubscribe()
  }, [])

  const signIn = async (email: string, password: string) => {
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password
    })

    if (error) {
      toast.error('Erro no login: ' + error.message)
      throw error
    }

    toast.success('Bem-vindo ao PardalLab!')
    navigate('/dashboard')
    return data
  }

  const signOut = async () => {
    await supabase.auth.signOut()
    localStorage.removeItem('ideaflow_user') // Limpeza legada
    navigate('/auth')
    toast.info('Sessão encerrada.')
  }

  const updatePassword = async (newPassword: string) => {
    const { error } = await supabase.auth.updateUser({
      password: newPassword
    })

    if (error) {
      toast.error('Erro ao mudar senha: ' + error.message)
      throw error
    }

    toast.success('Senha atualizada com sucesso!')
  }

  return {
    user,
    isLoading,
    signIn,
    signOut,
    updatePassword,
    isAdmin: user?.email === 'zeliaobn@gmail.com'
  }
}
