import { Suspense, lazy } from 'react'
import { Navigate, Route, Routes } from 'react-router-dom'
import Navigation from './components/Navigation'
import ProtectedRoute from './routes/ProtectedRoute'
import LoginPage from './pages/LoginPage'
import SignUpPage from './pages/SignUpPage'
import ClassesPage from './pages/ClassesPage'
import MyBookingsPage from './pages/MyBookingsPage'
import TrainersPage from './pages/TrainersPage'

const AdminPanel = lazy(() => import('./pages/AdminPanel'))

export default function App() {
  return (
    <div className="app-shell">
      <Navigation />
      <main className="page-container">
        <Suspense fallback={<div className="loading-spinner">Loading page...</div>}>
          <Routes>
            <Route path="/" element={<Navigate to="/classes" replace />} />
            <Route path="/login" element={<LoginPage />} />
            <Route path="/signup" element={<SignUpPage />} />
            
            <Route
              path="/classes"
              element={
                <ProtectedRoute>
                  <ClassesPage />
                </ProtectedRoute>
              }
            />
            <Route
              path="/my-bookings"
              element={
                <ProtectedRoute>
                  <MyBookingsPage />
                </ProtectedRoute>
              }
            />
            <Route
              path="/trainers"
              element={
                <ProtectedRoute>
                  <TrainersPage />
                </ProtectedRoute>
              }
            />
            <Route
              path="/admin"
              element={
                <ProtectedRoute requireAdmin={true}>
                  <AdminPanel />
                </ProtectedRoute>
              }
            />
            
            <Route path="*" element={<Navigate to="/classes" replace />} />
          </Routes>
        </Suspense>
      </main>
    </div>
  )
}
