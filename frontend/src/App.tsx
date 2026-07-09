import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom'
import { ToastProvider } from './components/Toast'
import Layout from './components/Layout'
import Dashboard from './pages/Dashboard'
import Insights from './pages/Insights'
import Schedule from './pages/Schedule'
import Patients from './pages/Patients'
import PatientProfile from './pages/PatientProfile'
import PatientReview from './pages/PatientReview'
import ReviewQueue from './pages/ReviewQueue'
import Settings from './pages/Settings'
import Login from './pages/Login'
import Landing from './pages/Landing'
import Pricing from './pages/Pricing'
import { getSession } from './auth'

function RequireAuth({ children }: { children: React.ReactNode }) {
  return getSession() ? <>{children}</> : <Navigate to="/login" replace />;
}

function App() {
  return (
    <ToastProvider>
      <Router>
        <Routes>
          <Route path="/" element={<Landing />} />
          <Route path="/pricing" element={<Pricing />} />
          <Route path="/login" element={<Login />} />
          <Route path="/app" element={<RequireAuth><Layout /></RequireAuth>}>
            <Route index element={<Navigate to="/app/dashboard" replace />} />
            <Route path="dashboard" element={<Dashboard />} />
            <Route path="insight" element={<Insights />} />
            <Route path="schedule" element={<Schedule />} />
            <Route path="patients" element={<Patients />} />
            <Route path="patients/:patientId" element={<PatientProfile />} />
            <Route path="patients/:patientId/review" element={<PatientReview />} />
            <Route path="review" element={<ReviewQueue />} />
            <Route path="settings" element={<Settings />} />
          </Route>
        </Routes>
      </Router>
    </ToastProvider>
  )
}

export default App
