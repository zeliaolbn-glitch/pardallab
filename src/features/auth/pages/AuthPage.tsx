import { useState } from 'react'
import { supabase } from '@/lib/supabase'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { useAuth } from '@/features/auth/hooks/useAuth'

export default function AuthPage() {
  const { signInWithGoogle } = useAuth()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState('')

  const handleEmailLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setMessage('')
    
    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    })

    if (error) {
      setMessage(error.message)
    }
    setLoading(false)
  }

  const handleSignUp = async () => {
    setLoading(true)
    setMessage('')
    const { error } = await supabase.auth.signUp({
      email,
      password,
    })
    if (error) setMessage(error.message)
    else setMessage('Check your email for the confirmation link!')
    setLoading(false)
  }

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-gray-50 p-4">
      <div className="w-full max-w-md space-y-8 rounded-xl bg-white p-8 shadow-lg">
        <div className="text-center">
          <h1 className="text-3xl font-extrabold text-blue-600">IdeaFlow</h1>
          <p className="mt-2 text-gray-600">Transforme suas ideias em projetos incríveis</p>
        </div>

        <div className="mt-8 space-y-4">
          <Button 
            onClick={signInWithGoogle} 
            variant="outline" 
            className="w-full py-6 text-lg font-semibold"
          >
            Entrar com Google
          </Button>

          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <span className="w-full border-t border-gray-300"></span>
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="bg-white px-2 text-gray-500">Ou use seu email</span>
            </div>
          </div>

          <form onSubmit={handleEmailLogin} className="space-y-4">
            <Input
              type="email"
              placeholder="seu@email.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
            <Input
              type="password"
              placeholder="Sua senha"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
            <div className="flex gap-2">
              <Button type="submit" disabled={loading} className="flex-1 bg-blue-600 hover:bg-blue-700">
                Entrar
              </Button>
              <Button type="button" onClick={handleSignUp} disabled={loading} variant="ghost" className="flex-1">
                Cadastrar
              </Button>
            </div>
          </form>

          {message && (
            <p className="text-center text-sm font-medium text-red-500">{message}</p>
          )}
        </div>
      </div>
    </div>
  )
}
