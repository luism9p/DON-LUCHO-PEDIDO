import { Navigate } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'
import LoadingSpinner from './LoadingSpinner'

export default function ProtectedRoute({ children }) {
  const { session, loading } = useAuth()

  if (loading) return <LoadingSpinner />
  if (!session) return <Navigate to="/admin/login" replace />

  return children
}
