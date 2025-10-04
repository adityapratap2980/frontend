import { Routes, Route, Navigate } from "react-router-dom"
import Dashboard from "@/pages/Dashboard"
import PredictionPage from "./pages/PredictionPage"
import ProfilePage from "./pages/ProfilePage"
import AISuggestionsPage from "./pages/Aisuggestions"
import LoginPage from "./pages/Login"
import RegisterPage from "./pages/Register"
import CasesPage from "./pages/CasesPage"
function App() {
  return (
    <Routes>
      <Route path="/dashboard" element={<RequireAuth><Dashboard /></RequireAuth>} />
      <Route path="/dashboard/cases" element={<RequireAuth><CasesPage /></RequireAuth>} />
      <Route path="/dashboard/prediction" element={<RequireAuth><PredictionPage /></RequireAuth>} />
      <Route path="/dashboard/profile" element={<RequireAuth><ProfilePage /></RequireAuth>} />
      <Route path="/dashboard/ai-suggestions" element={<RequireAuth><AISuggestionsPage /></RequireAuth>} />
      <Route path="/login" element={<GuestOnly><LoginPage /></GuestOnly>} />
      <Route path="/register" element={<GuestOnly><RegisterPage /></GuestOnly>} />
      <Route path="/" element={<Navigate to="/login" replace />} />
      {/* <Route path="/reset-password" element={<ResetPassword />} /> */}
      {/* <Route path="/verify-email" element={<VerifyEmail />} /> */}
      {/* <Route path="*" element={<NotFound />} /> */}
    </Routes>
  )
}

function RequireAuth({ children }: { children: React.ReactNode }) {
  const token = typeof window !== 'undefined' ? localStorage.getItem('auth_token') : null
  if (!token) {
    return <Navigate to="/login" replace />
  }
  return <>{children}</>
}

function GuestOnly({ children }: { children: React.ReactNode }) {
  const token = typeof window !== 'undefined' ? localStorage.getItem('auth_token') : null
  if (token) {
    return <Navigate to="/dashboard" replace />
  }
  return <>{children}</>
}

export default App