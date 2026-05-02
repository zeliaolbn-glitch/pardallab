import { BrowserRouter, Routes, Route } from 'react-router-dom'
import AuthPage from '@/features/auth/pages/AuthPage'
import Dashboard from '@/features/dashboard/pages/Dashboard'
import LandingPage from '@/features/landing/pages/LandingPage'
import IdeasPage from '@/features/ideas/pages/IdeasPage'
import ProjectsPage from '@/features/projects/pages/ProjectsPage'
import { ProtectedRoute } from '@/features/auth/components/ProtectedRoute'
import { DashboardLayout } from '@/components/layout/DashboardLayout'
import { Toaster } from '@/components/ui/sonner'

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/auth" element={<AuthPage />} />
        
        <Route element={<ProtectedRoute />}>
          <Route element={<DashboardLayout />}>
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/ideas" element={<IdeasPage />} />
            <Route path="/projects" element={<ProjectsPage />} />
            <Route path="/tools" element={<div>Módulo de Ferramentas (Em breve)</div>} />
            <Route path="/tutorials" element={<div>Tutoriais (Em breve)</div>} />
          </Route>
        </Route>
      </Routes>
      <Toaster position="top-right" richColors />
    </BrowserRouter>
  )
}

export default App
