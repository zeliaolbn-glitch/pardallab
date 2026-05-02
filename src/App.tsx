import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import AuthPage from '@/features/auth/pages/AuthPage'
import Dashboard from '@/features/dashboard/pages/Dashboard'
import { ProtectedRoute } from '@/features/auth/components/ProtectedRoute'

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/auth" element={<AuthPage />} />
        
        <Route element={<ProtectedRoute />}>
          <Route path="/dashboard" element={<Dashboard />} />
        </Route>

        <Route path="/" element={<Navigate to="/dashboard" replace />} />
      </Routes>
    </BrowserRouter>
  )
}

export default App
