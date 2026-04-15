import { createClient } from '@supabase/supabase-js'

const supabaseUrl = import.meta.env.VITE_PUBLIC_SUPABASE_URL!
const supabaseAnonKey = import.meta.env.VITE_PUBLIC_SUPABASE_ANON_KEY!

export const supabase = createClient(supabaseUrl, supabaseAnonKey)

/**
 * `redirectTo` for OAuth (must be listed under Supabase → Authentication → URL Configuration).
 * Set `VITE_SUPABASE_OAUTH_REDIRECT_URL` to the full URL, or omit to use this app’s `/volunteer` route.
 */
export function getOAuthRedirectUrl(): string {
  const explicit = import.meta.env.VITE_SUPABASE_OAUTH_REDIRECT_URL?.trim()
  if (explicit) return explicit

  if (typeof window === 'undefined') {
    return ''
  }

  const base = import.meta.env.BASE_URL.replace(/\/$/, '')
  const path = `${base}/volunteer`.replace(/\/{2,}/g, '/')
  const pathname = path.startsWith('/') ? path : `/${path}`
  return new URL(pathname, window.location.origin).href
}