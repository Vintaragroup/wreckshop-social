import { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/card'
import { Input } from '../components/ui/input'
import { Button } from '../components/ui/button'
import { Checkbox } from '../components/ui/checkbox'

type LinkMeta = {
  slug: string
  title?: string
  description?: string
  allowedChannels: string[]
  redirectUrl?: string | null
}

export default function CapturePage() {
  const { slug } = useParams()
  const navigate = useNavigate()
  const [meta, setMeta] = useState<LinkMeta | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [displayName, setDisplayName] = useState('')
  const [email, setEmail] = useState('')
  const [phone, setPhone] = useState('')
  const [consentEmail, setConsentEmail] = useState(true)
  const [consentSms, setConsentSms] = useState(false)
  const [submitting, setSubmitting] = useState(false)
  const [submitted, setSubmitted] = useState(false)

  useEffect(() => {
    let active = true
    async function load() {
      setLoading(true)
      setError(null)
      try {
        const res = await fetch(`/api/audience/capture-links/${slug}`)
        const json = await res.json()
        if (!res.ok) throw new Error(json?.error || 'Not found')
        if (!active) return
        setMeta(json.data)
        // default consent based on allowed channels
        setConsentEmail(json.data.allowedChannels.includes('email'))
        setConsentSms(json.data.allowedChannels.includes('sms') && false)
      } catch (e: any) {
        setError(e.message)
      } finally {
        setLoading(false)
      }
    }
    if (slug) load()
    return () => { active = false }
  }, [slug])

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    try {
      setSubmitting(true)
      const res = await fetch(`/api/audience/capture/${slug}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          displayName: displayName || undefined,
          email: email || undefined,
          phone: phone || undefined,
          consent: {
            email: meta?.allowedChannels.includes('email') ? !!consentEmail : undefined,
            sms: meta?.allowedChannels.includes('sms') ? !!consentSms : undefined,
          },
        }),
      })
      const json = await res.json()
      if (!res.ok) throw new Error(json?.error || 'Failed to submit')
      setSubmitted(true)
      const redirect = json?.data?.redirectUrl as string | null
      if (redirect) {
        setTimeout(() => { window.location.href = redirect }, 1200)
      }
    } catch (e) {
      alert((e as any).message || 'Submission failed')
    } finally {
      setSubmitting(false)
    }
  }

  if (loading) return <div className="min-h-screen grid place-items-center text-sm text-muted-foreground">Loading…</div>
  if (error) return (
    <div className="min-h-screen grid place-items-center">
      <Card className="max-w-md">
        <CardHeader>
          <CardTitle>Link not available</CardTitle>
          <CardDescription>{error}</CardDescription>
        </CardHeader>
        <CardContent>
          <Button onClick={() => navigate('/')}>Go home</Button>
        </CardContent>
      </Card>
    </div>
  )

  return (
    <div className="min-h-screen grid place-items-center p-4">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle>{meta?.title || 'Join the list'}</CardTitle>
          <CardDescription>{meta?.description || 'Get updates by email and/or SMS.'}</CardDescription>
        </CardHeader>
        <CardContent>
          {submitted ? (
            <div className="py-6">
              <p className="text-green-600 font-medium">Thanks! You’re in.</p>
              {meta?.redirectUrl ? (
                <p className="text-sm text-muted-foreground mt-2">Redirecting…</p>
              ) : (
                <Button className="mt-4" onClick={() => navigate('/')}>Back to site</Button>
              )}
            </div>
          ) : (
            <form onSubmit={onSubmit} className="space-y-4">
              <div>
                <label className="text-sm mb-1 block">Name</label>
                <Input value={displayName} onChange={(e) => setDisplayName(e.target.value)} placeholder="Optional" />
              </div>
              {meta?.allowedChannels.includes('email') ? (
                <div>
                  <label className="text-sm mb-1 block">Email</label>
                  <Input type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="you@example.com" />
                </div>
              ) : null}
              {meta?.allowedChannels.includes('sms') ? (
                <div>
                  <label className="text-sm mb-1 block">Phone</label>
                  <Input type="tel" value={phone} onChange={(e) => setPhone(e.target.value)} placeholder="(555) 123-4567" />
                </div>
              ) : null}
              <div className="space-y-2">
                {meta?.allowedChannels.includes('email') ? (
                  <label className="flex items-center gap-2 text-sm">
                    <Checkbox checked={consentEmail} onCheckedChange={(v) => setConsentEmail(!!v)} />
                    I agree to receive email updates.
                  </label>
                ) : null}
                {meta?.allowedChannels.includes('sms') ? (
                  <label className="flex items-center gap-2 text-sm">
                    <Checkbox checked={consentSms} onCheckedChange={(v) => setConsentSms(!!v)} />
                    I agree to receive SMS messages.
                  </label>
                ) : null}
              </div>
              <Button type="submit" disabled={submitting}>{submitting ? 'Submitting…' : 'Join'}</Button>
            </form>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
