import { createBrowserClient } from '@supabase/ssr'

export function createClient() {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
  const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

  // If credentials are not set, return a mock client for demo mode
  if (!supabaseUrl || !supabaseKey) {
    console.warn('Supabase credentials not found. Running in demo mode.')
    return null as any // Will be handled in the component
  }

  return createBrowserClient(supabaseUrl, supabaseKey)
}
