import { Navigate } from 'react-router-dom'
import type { ReactNode } from 'react'
import { useAuth } from './AuthProvider'

export function ProtectedRoute({ children }: { children: ReactNode }) {
  const { user, loading } = useAuth()
  if (loading) return <div className="p-6 text-sm text-gray-500">Loading…</div>
  if (!user) return <Navigate to="/sign-in" replace />
  return <>{children}</>
}
