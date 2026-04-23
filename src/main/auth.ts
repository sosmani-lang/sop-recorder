import { createClient, SupabaseClient } from '@supabase/supabase-js'
import { AuthResult } from '../shared/types'

// Replace these with your actual Supabase project values
const SUPABASE_URL = 'https://YOUR_PROJECT.supabase.co'
const SUPABASE_ANON_KEY = 'YOUR_ANON_KEY'

let supabase: SupabaseClient | null = null
let currentToken: string | null = null

function getSupabase(): SupabaseClient {
  if (!supabase) {
    supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY)
  }
  return supabase
}

// Login with email and password
export async function login(email: string, password: string): Promise<AuthResult> {
  try {
    const { data, error } = await getSupabase().auth.signInWithPassword({
      email,
      password
    })

    if (error) {
      return { success: false, error: error.message }
    }

    currentToken = data.session?.access_token ?? null
    return { success: true, token: currentToken ?? undefined }
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'Login failed'
    return { success: false, error: message }
  }
}

// Get the current session token
export function getToken(): string | null {
  return currentToken
}

// Logout
export async function logout(): Promise<void> {
  await getSupabase().auth.signOut()
  currentToken = null
}
