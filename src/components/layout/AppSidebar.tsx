import { 
  LayoutDashboard, 
  Lightbulb, 
  Briefcase, 
  Wrench, 
  GraduationCap,
  LogOut,
  Link2,
  Terminal,
  Globe,
  ChevronDown,
  ChevronRight,
  Settings,
  Book,
  ListTodo,
  ShieldCheck
} from 'lucide-react'
import { Link, useLocation } from 'react-router-dom'
import { cn } from '@/lib/utils'
import { useAuth } from '@/features/auth/hooks/useAuth'
import { Button } from '@/components/ui/button'
import { useState } from 'react'

const menuItems = [
  { icon: LayoutDashboard, label: 'Dashboard', path: '/dashboard' },
  { icon: ListTodo, label: 'Lembretes', path: '/reminders' },
  { icon: ShieldCheck, label: 'Contas e Cadastros', path: '/registrations' },
  { icon: Lightbulb, label: 'Ideias', path: '/ideas' },
  { icon: Briefcase, label: 'Evolução (Kanban)', path: '/projects' },
  { 
    icon: Link2, 
    label: 'Links Inseridos', 
    path: '/links',
    subItems: [
      { label: 'Principal', path: '/links' },
      { label: 'Investimentos', path: '/links/investments' },
      { label: 'Rascunhos (Bot)', path: '/links/drafts' },
    ]
  },
  { icon: Terminal, label: 'Biblioteca de Prompts', path: '/prompts' },
  { icon: Globe, label: 'Projetos Criados (Deploy)', path: '/deployed' },
  { icon: Wrench, label: 'Ferramentas', path: '/tools' },
  { icon: Book, label: 'Glossário Técnico', path: '/glossary' },
  { icon: GraduationCap, label: 'Tutoriais', path: '/tutorials' },
  { icon: Settings, label: 'Configurações', path: '/settings' },
]

export function AppSidebar() {
  const location = useLocation()
  const { signOut, user } = useAuth()
  const [openMenus, setOpenMenus] = useState<string[]>(['Links Inseridos'])

  const toggleMenu = (label: string) => {
    setOpenMenus(prev => 
      prev.includes(label) ? prev.filter(l => l !== label) : [...prev, label]
    )
  }

  return (
    <div className="flex h-full w-64 flex-col border-r bg-white shadow-sm overflow-y-auto">
      <div className="flex flex-col items-center py-6 border-b shrink-0 bg-slate-50/50">
        <img 
          src="/logo.png" 
          alt="PardalLab" 
          className="h-20 w-20 object-contain mb-2 drop-shadow-sm"
          onError={(e) => (e.currentTarget.style.display = 'none')}
        />
        <span className="text-xl font-black text-slate-800 tracking-tighter">
          PardalLab <span className="text-blue-600 text-xs">Versão_1.2.0</span>
        </span>
      </div>
      
      <nav className="flex-1 space-y-1 px-4 py-6">
        {menuItems.map((item) => {
          const hasSubItems = !!item.subItems
          const isOpen = openMenus.includes(item.label)
          const isActive = location.pathname === item.path || item.subItems?.some(s => s.path === location.pathname)

          return (
            <div key={item.label}>
              {hasSubItems ? (
                <button
                  onClick={() => toggleMenu(item.label)}
                  className={cn(
                    'w-full flex items-center justify-between rounded-lg px-3 py-2 text-sm font-medium transition-all duration-200',
                    isActive ? 'text-blue-600' : 'text-gray-500 hover:bg-gray-50 hover:text-blue-600'
                  )}
                >
                  <div className="flex items-center gap-3">
                    <item.icon className="h-5 w-5" />
                    {item.label}
                  </div>
                  {isOpen ? <ChevronDown className="h-4 w-4" /> : <ChevronRight className="h-4 w-4" />}
                </button>
              ) : (
                <Link
                  to={item.path}
                  className={cn(
                    'flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-all duration-200',
                    location.pathname === item.path
                      ? 'bg-blue-50 text-blue-600 shadow-sm'
                      : 'text-gray-500 hover:bg-gray-50 hover:text-blue-600'
                  )}
                >
                  <item.icon className="h-5 w-5" />
                  {item.label}
                </Link>
              )}

              {hasSubItems && isOpen && (
                <div className="ml-9 mt-1 space-y-1">
                  {item.subItems?.map(sub => (
                    <Link
                      key={sub.path}
                      to={sub.path}
                      className={cn(
                        'block rounded-md px-3 py-1.5 text-xs font-medium transition-colors',
                        location.pathname === sub.path
                          ? 'text-blue-600 bg-blue-50/50'
                          : 'text-gray-400 hover:text-blue-600 hover:bg-gray-50'
                      )}
                    >
                      {sub.label}
                    </Link>
                  ))}
                </div>
              )}
            </div>
          )
        })}
      </nav>

      <div className="border-t p-4 space-y-4 shrink-0">
        <div className="px-3 py-2 bg-gray-50 rounded-lg">
          <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1">Conta Ativa</p>
          <p className="text-xs font-medium text-gray-700 truncate">{user?.email}</p>
        </div>
        <Button 
          variant="ghost" 
          className="w-full justify-start gap-3 text-red-500 hover:bg-red-50 hover:text-red-600"
          onClick={signOut}
        >
          <LogOut className="h-5 w-5" />
          Sair
        </Button>
      </div>
    </div>
  )
}
