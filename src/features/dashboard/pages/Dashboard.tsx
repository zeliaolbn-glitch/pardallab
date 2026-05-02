import { Button } from '@/components/ui/button'
import { useAuth } from '@/features/auth/hooks/useAuth'

export default function Dashboard() {
  const { user, signOut } = useAuth()

  return (
    <div className="p-8">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">Dashboard</h1>
        <div className="flex items-center gap-4">
          <span className="text-sm text-gray-600">{user?.email}</span>
          <Button onClick={signOut} variant="outline">Sair</Button>
        </div>
      </div>
      <div className="mt-8 rounded-lg border-2 border-dashed border-gray-300 p-12 text-center">
        <p className="text-gray-500">Bem-vindo ao IdeaFlow! Comece criando sua primeira ideia.</p>
      </div>
    </div>
  )
}
