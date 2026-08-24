import { Navigate, useLocation } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

export default function ProtectedRoute({ children, requireAdmin = false }) {
  const { token, role } = useAuth()
  const location = useLocation()

  if (!token) {
    return <Navigate to="/login" replace state={{ from: location.pathname }} />
  }

  if (requireAdmin && role !== 'Admin') {
    return <Navigate to="/classes" replace />
  }

  return children
}
