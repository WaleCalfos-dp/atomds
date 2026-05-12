import { Routes, Route, Navigate } from 'react-router-dom'
import { ProtectedRoute } from './auth/ProtectedRoute'
import { isConfigured } from './lib/supabaseClient'
import SignInPage from './pages/SignInPage'
import SignUpPage from './pages/SignUpPage'
import PortalPage from './pages/PortalPage'

export default function App() {
  if (!isConfigured) return <SetupNeeded />
  return (
    <Routes>
      <Route path="/sign-in" element={<SignInPage />} />
      <Route path="/sign-up" element={<SignUpPage />} />
      <Route
        path="/"
        element={
          <ProtectedRoute>
            <PortalPage />
          </ProtectedRoute>
        }
      />
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  )
}

function SetupNeeded() {
  return (
    <div className="min-h-screen grid place-items-center p-6">
      <div className="max-w-md space-y-3 bg-white p-6 border border-gray-200 rounded-md">
        <h1 className="text-lg font-semibold">Setup needed</h1>
        <p className="text-sm text-gray-700">
          Copy <code className="px-1 bg-gray-100 rounded">apps/portal/.env.example</code> to{' '}
          <code className="px-1 bg-gray-100 rounded">apps/portal/.env.local</code> and fill in your Supabase project URL and anon key. Then restart <code className="px-1 bg-gray-100 rounded">npm run dev:portal</code>.
        </p>
        <p className="text-sm text-gray-700">
          See <code className="px-1 bg-gray-100 rounded">apps/portal/README.md</code> for the schema + auth-settings steps.
        </p>
      </div>
    </div>
  )
}
