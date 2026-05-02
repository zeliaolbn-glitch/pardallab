import { BrowserRouter, Routes, Route } from 'react-router-dom'
import AuthPage from '@/features/auth/pages/AuthPage'
import Dashboard from '@/features/dashboard/pages/Dashboard'
import LandingPage from '@/features/landing/pages/LandingPage'
import IdeasPage from '@/features/ideas/pages/IdeasPage'
import ProjectsPage from '@/features/projects/pages/ProjectsPage'
import ToolsPage from '@/features/support/pages/ToolsPage'
import TutorialsPage from '@/features/support/pages/TutorialsPage'
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
            <Route path="/tools" element={<ToolsPage />} />
            <Route path="/tutorials" element={<TutorialsPage />} />
          </Route>
        </Route>
      </Routes>
      <Toaster position="top-right" richColors />
    </BrowserRouter>
  )
}

export default App
