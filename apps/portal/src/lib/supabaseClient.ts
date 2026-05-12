import { createClient } from '@supabase/supabase-js'

const url = import.meta.env.VITE_SUPABASE_URL
const anonKey = import.meta.env.VITE_SUPABASE_ANON_KEY

export const isConfigured = Boolean(url && anonKey)

if (!isConfigured && import.meta.env.DEV) {
  // eslint-disable-next-line no-console
  console.warn(
    '[portal] Missing Supabase env vars. Copy apps/portal/.env.example to apps/portal/.env.local and fill in VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY.',
  )
}

// Always construct a client — using harmless placeholders when env is missing — so
// the app still boots and we can show a friendly "Setup needed" screen instead of
// the dev-server crashing on import.
export const supabase = createClient(
  url ?? 'https://placeholder.supabase.co',
  anonKey ?? 'placeholder-anon-key',
  { auth: { persistSession: true, autoRefreshToken: true } },
)
