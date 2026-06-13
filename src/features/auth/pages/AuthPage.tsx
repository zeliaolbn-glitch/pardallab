import { useState } from 'react'
import { useAuth } from '../hooks/useAuth'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { LogIn } from 'lucide-react'

export default function AuthPage() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const { signIn } = useAuth()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    try {
      await signIn(email, password)
    } catch (err) {
      // O toast de erro já é disparado no hook
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50 p-4">
      <div className="w-full max-w-md space-y-8">
        <div className="text-center space-y-4">
          <div className="flex flex-col items-center justify-center gap-4">
            <img 
              src="/logo.png" 
              alt="PardalLab Logo" 
              className="h-32 w-32 object-contain drop-shadow-xl animate-in zoom-in duration-700"
              onError={(e) => (e.currentTarget.style.display = 'none')}
            />
            <h1 className="text-4xl font-black text-slate-900 tracking-tighter">
              Pardal<span className="text-blue-600">Lab</span>
            </h1>
          </div>
          <p className="text-slate-500 font-medium italic">"Seu caos criativo, organizado com inteligência."</p>
        </div>

        <Card className="border-none shadow-2xl ring-1 ring-slate-200 bg-white/80 backdrop-blur-sm">
          <CardHeader className="space-y-1">
            <CardTitle className="text-2xl font-bold text-center">Login Administrativo</CardTitle>
            <CardDescription className="text-center">
              Apenas administradores cadastrados podem acessar.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="email">E-mail</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="seu@email.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="bg-slate-50 border-slate-200"
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="password">Senha</Label>
                <Input
                  id="password"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="bg-slate-50 border-slate-200"
                  required
                />
              </div>
              <Button type="submit" className="w-full bg-blue-600 hover:bg-blue-700 h-11" disabled={loading}>
                {loading ? 'Validando Acesso...' : 'Entrar no PardalLab'}
                <LogIn className="ml-2 h-4 w-4" />
              </Button>
            </form>
          </CardContent>
        </Card>

        <p className="text-center text-xs text-slate-400">
          Acesso restrito &copy; {new Date().getFullYear()} PardalLab.
        </p>
      </div>
    </div>
  )
}
