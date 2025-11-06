import { useState } from 'react'
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from './ui/dialog'
import { Input } from './ui/input'
import { Label } from './ui/label'
import { Button } from './ui/button'
import { Checkbox } from './ui/checkbox'
import { toast } from 'sonner'

type Props = {
  open: boolean
  onOpenChange: (v: boolean) => void
  onCreated?: (payload: { url: string; slug: string; link: any }) => void
}

export default function CreateCaptureLinkModal({ open, onOpenChange, onCreated }: Props) {
  const [title, setTitle] = useState('')
  const [description, setDescription] = useState('')
  const [allowEmail, setAllowEmail] = useState(true)
  const [allowSms, setAllowSms] = useState(false)
  const [redirectUrl, setRedirectUrl] = useState('')
  const [tags, setTags] = useState('')
  const [submitting, setSubmitting] = useState(false)

  const reset = () => {
    setTitle('')
    setDescription('')
    setAllowEmail(true)
    setAllowSms(false)
    setRedirectUrl('')
    setTags('')
  }

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    try {
      setSubmitting(true)
      const body: any = {
        title: title || undefined,
        description: description || undefined,
        allowedChannels: [allowEmail ? 'email' : null, allowSms ? 'sms' : null].filter(Boolean),
        redirectUrl: redirectUrl || undefined,
        tags: tags ? tags.split(',').map((t) => t.trim()).filter(Boolean) : undefined,
      }
      const res = await fetch('/api/audience/capture-links', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
      })
      const json = await res.json()
      if (!res.ok) throw new Error(json?.error || 'Failed to create capture link')
      const payload = { url: json?.data?.url as string, slug: json?.data?.slug as string, link: json?.data?.link }
      try { await navigator.clipboard.writeText(payload.url) } catch {}
      toast.success('Capture link created', { description: payload.url })
      onCreated?.(payload)
      onOpenChange(false)
      reset()
    } catch (e: any) {
      toast.error('Failed to create capture link', { description: e.message })
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={(v) => { if (!v) reset(); onOpenChange(v) }}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Create capture link</DialogTitle>
          <DialogDescription>Customize title, channels, and optional redirect.</DialogDescription>
        </DialogHeader>
        <form onSubmit={onSubmit} className="space-y-4">
          <div className="grid gap-2">
            <Label htmlFor="cap-title">Title</Label>
            <Input id="cap-title" value={title} onChange={(e) => setTitle(e.target.value)} placeholder="Join the list" />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="cap-desc">Description</Label>
            <Input id="cap-desc" value={description} onChange={(e) => setDescription(e.target.value)} placeholder="Get updates by email and/or SMS." />
          </div>
          <div className="grid gap-2">
            <Label>Allowed channels</Label>
            <div className="flex items-center gap-6">
              <label className="flex items-center gap-2 text-sm"><Checkbox checked={allowEmail} onCheckedChange={(v) => setAllowEmail(!!v)} /> Email</label>
              <label className="flex items-center gap-2 text-sm"><Checkbox checked={allowSms} onCheckedChange={(v) => setAllowSms(!!v)} /> SMS</label>
            </div>
          </div>
          <div className="grid gap-2">
            <Label htmlFor="cap-redirect">Redirect URL (optional)</Label>
            <Input id="cap-redirect" value={redirectUrl} onChange={(e) => setRedirectUrl(e.target.value)} placeholder="https://yoursite.com/thanks" />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="cap-tags">Tags (comma-separated)</Label>
            <Input id="cap-tags" value={tags} onChange={(e) => setTags(e.target.value)} placeholder="houston, presave, vip" />
          </div>
          <div className="flex justify-end gap-2 pt-2">
            <Button type="button" variant="secondary" onClick={() => onOpenChange(false)}>Cancel</Button>
            <Button type="submit" disabled={submitting}>{submitting ? 'Creating…' : 'Create link'}</Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
}
