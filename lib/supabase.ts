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

function decodeOAuthErrorMessage(raw: string): string {
  try {
    return decodeURIComponent(raw.replace(/\+/g, ' '))
  } catch {
    return raw.replace(/\+/g, ' ')
  }
}

/**
 * Run once before React mounts so PKCE / implicit OAuth callbacks are processed
 * before any component reads auth state. Cleans leftover query params and
 * stores one-shot messages for the login UI (see Login.tsx).
 */
export async function bootstrapOAuthRedirect(): Promise<void> {
  if (typeof window === 'undefined') return

  await supabase.auth.getSession()

  const url = new URL(window.location.href)
  const rawError =
    url.searchParams.get('error_description') ?? url.searchParams.get('error')
  const oauthError = rawError ? decodeOAuthErrorMessage(rawError) : null

  let needsReplace = false

  if (oauthError) {
    try {
      sessionStorage.setItem('paws_auth_redirect_error', oauthError)
    } catch {
      /* ignore */
    }
    url.searchParams.delete('error')
    url.searchParams.delete('error_description')
    url.searchParams.delete('error_code')
    needsReplace = true
  }

  // If `code` is still present, PKCE exchange did not run (e.g. missing
  // code_verifier — common when the OAuth flow finishes in another browser).
  if (url.searchParams.has('code')) {
    try {
      sessionStorage.setItem('paws_oauth_incomplete', '1')
    } catch {
      /* ignore */
    }
    url.searchParams.delete('code')
    url.searchParams.delete('state')
    needsReplace = true
  }

  if (needsReplace) {
    const qs = url.searchParams.toString()
    window.history.replaceState(
      window.history.state,
      '',
      url.pathname + (qs ? `?${qs}` : '') + url.hash
    )
  }
}