import { BrowserRouter, Routes, Route } from 'react-router-dom'
import AuthPage from '@/features/auth/pages/AuthPage'
import Dashboard from '@/features/dashboard/pages/Dashboard'
import LandingPage from '@/features/landing/pages/LandingPage'
import { ProtectedRoute } from '@/features/auth/components/ProtectedRoute'
import { DashboardLayout } from '@/components/layout/DashboardLayout'

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/auth" element={<AuthPage />} />
        
        <Route element={<ProtectedRoute />}>
          <Route element={<DashboardLayout />}>
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/ideas" element={<div>Módulo de Ideias (Em breve)</div>} />
            <Route path="/projects" element={<div>Módulo de Projetos (Em breve)</div>} />
            <Route path="/tools" element={<div>Ferramentas (Em breve)</div>} />
            <Route path="/tutorials" element={<div>Tutoriais (Em breve)</div>} />
          </Route>
        </Route>
      </Routes>
    </BrowserRouter>
  )
}

export default App
