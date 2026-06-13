import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { Toaster } from 'sonner'
import { ThemeProvider } from './contexts/ThemeContext'
import { DashboardLayout } from './components/layout/DashboardLayout'
import Dashboard from './features/dashboard/pages/Dashboard'
import IdeasPage from './features/ideas/pages/IdeasPage'
import ProjectsPage from './features/projects/pages/ProjectsPage'
import ToolsPage from './features/support/pages/ToolsPage'
import VideoLinksPage from './features/support/pages/VideoLinksPage'
import DraftLinksPage from './features/support/pages/DraftLinksPage'
import PromptsPage from './features/support/pages/PromptsPage'
import TutorialsPage from './features/support/pages/TutorialsPage'
import DeployedProjectsPage from './features/support/pages/DeployedProjectsPage'
import SettingsPage from './features/support/pages/SettingsPage'
import GlossaryPage from './features/support/pages/GlossaryPage'
import RemindersPage from './features/support/pages/RemindersPage'
import RegistrationsPage from './features/support/pages/RegistrationsPage'
import AuthPage from './features/auth/pages/AuthPage'
import { useAuth } from './features/auth/hooks/useAuth'

const queryClient = new QueryClient()

function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const { user, isLoading } = useAuth()
  
  if (isLoading) return <div className="h-screen w-screen flex items-center justify-center bg-slate-50">Carregando PardalLab...</div>
  if (!user) return <Navigate to="/auth" replace />
  
  return <>{children}</>
}

export default function App() {
  return (
    <ThemeProvider>
      <QueryClientProvider client={queryClient}>
        <BrowserRouter>
        <Routes>
          <Route path="/auth" element={<AuthPage />} />
          
          <Route path="/" element={
            <ProtectedRoute>
              <DashboardLayout />
            </ProtectedRoute>
          }>
            <Route index element={<Navigate to="/dashboard" replace />} />
            <Route path="dashboard" element={<Dashboard />} />
            <Route path="ideas" element={<IdeasPage />} />
            <Route path="projects" element={<ProjectsPage />} />
            <Route path="tools" element={<ToolsPage />} />
            <Route path="links" element={<VideoLinksPage />} />
            <Route path="links/drafts" element={<DraftLinksPage />} />
            <Route path="prompts" element={<PromptsPage />} />
            <Route path="tutorials" element={<TutorialsPage />} />
            <Route path="deployed" element={<DeployedProjectsPage />} />
            <Route path="settings" element={<SettingsPage />} />
            <Route path="glossary" element={<GlossaryPage />} />
            <Route path="reminders" element={<RemindersPage />} />
            <Route path="registrations" element={<RegistrationsPage />} />
          </Route>
        </Routes>
        <Toaster position="top-right" richColors />
      </BrowserRouter>
    </QueryClientProvider>
    </ThemeProvider>
  )
}
