import React, { useEffect, useState } from 'react'
import { useNavigate, useParams, useSearchParams } from 'react-router-dom'
import { useAuth } from '../../lib/auth/context'
import { appPath } from '../../lib/routes'

/**
 * OAuth Callback Page
 *
 * Temporary handler that receives the OAuth callback from Stack Auth.
 * It currently logs the parameters and redirects the user back to the login page.
 *
 * Follow-up: exchange the authorization code with Stack Auth to obtain a JWT
 * and store it via AuthContext, then redirect to the dashboard.
 */
export default function OAuthCallbackPage() {
  const navigate = useNavigate()
  const { provider } = useParams<{ provider: string }>()
  const [params] = useSearchParams()
  const { completeSsoLogin } = useAuth()
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const run = async () => {
      const code = params.get('code')
      const state = params.get('state')
      const tokenParam = params.get('token') || params.get('access_token') || params.get('id_token')

      console.log('[OAuthCallback] provider:', provider, 'code:', code, 'state:', state, 'tokenParam:', !!tokenParam)

      try {
        // If the hosted page returned a token directly, use it
        if (tokenParam) {
          await completeSsoLogin(tokenParam)
          navigate(appPath('/'))
          return
        }

        // Otherwise, exchange the code for a token via our backend helper
        if (code && provider) {
          const redirectUri = `${window.location.origin}${appPath(`/auth/oauth/callback/${provider}`)}`
          const apiBaseUrl = import.meta.env.VITE_API_BASE_URL || '/api'
          const res = await fetch(`${apiBaseUrl}/auth/sso/exchange`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ code, provider, redirectUri })
          })

          if (!res.ok) {
            const text = await res.text().catch(() => '')
            throw new Error(text || `Code exchange failed (${res.status})`)
          }

          const data = await res.json()
          const accessToken = data.data?.accessToken || data.accessToken
          if (!accessToken) {
            throw new Error('No access token returned from exchange')
          }

          await completeSsoLogin(accessToken)
          navigate(appPath('/'))
          return
        }

        // Nothing usable found, send back to login
        navigate('/login')
      } catch (e: any) {
        console.error('[OAuthCallback] Failed to complete SSO:', e)
        setError(e?.message || 'Failed to complete sign in')
        // After a brief pause, return to login
        setTimeout(() => navigate('/login'), 1800)
      }
    }

    run()
  }, [navigate, params, provider, completeSsoLogin])

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-950 to-slate-900 p-4">
      <div className="bg-slate-900/50 backdrop-blur rounded-lg border border-slate-800 p-8 w-full max-w-md text-center">
        <h1 className="text-2xl font-bold text-white mb-3">Completing sign in…</h1>
        {!error ? (
          <p className="text-slate-400">We’re finishing up your {provider || 'social'} sign in. You’ll be redirected shortly.</p>
        ) : (
          <p className="text-red-300">{error}</p>
        )}
      </div>
    </div>
  )
}
