import { createClient } from '@supabase/supabase-js'

/**
 * Supabase client configuration
 * Uses environment variables for security.
 * Ensure VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY are set in .env
 */

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY

/**
 * Validates credentials before client creation.
 * If missing, we export a null client and a status flag.
 */
export const isSupabaseConfigured = Boolean(supabaseUrl && supabaseAnonKey)

if (!isSupabaseConfigured) {
  console.warn('Supabase credentials missing. Please check your .env file.')
}

// Create client only if configured, otherwise export null to avoid crashing the app
export const supabase = isSupabaseConfigured 
  ? createClient(supabaseUrl, supabaseAnonKey)
  : null
