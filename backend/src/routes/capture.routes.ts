import { Router } from 'express'
import { z } from 'zod'
import crypto from 'crypto'
import CaptureLinkModel from '../models/capture-link'
import AudienceContactModel from '../models/audience-contact'
import { env } from '../env'
import QRCode from 'qrcode'

export const capture = Router()

function generateSlug(len = 8) {
  // Generate URL-safe base64 string and trim
  return crypto.randomBytes(8).toString('base64url').replace(/[^a-zA-Z0-9_-]/g, '').slice(0, len)
}

const CreateLinkBody = z.object({
  title: z.string().optional(),
  description: z.string().optional(),
  ownerProfileId: z.string().optional(),
  allowedChannels: z.array(z.enum(['email', 'sms'])).optional(),
  tags: z.array(z.string()).optional(),
  redirectUrl: z.string().url().optional(),
})

capture.post('/audience/capture-links', async (req, res) => {
  const parsed = CreateLinkBody.safeParse(req.body)
  if (!parsed.success) return res.status(400).json({ ok: false, error: parsed.error.flatten() })

  const baseUrl = (env.CORS_ORIGIN || '').replace(/\/$/, '') || 'http://localhost:5176'
  let slug = generateSlug(8)
  let attempts = 0
  // Try to avoid collisions
  while (attempts < 3) {
    try {
      const doc = await CaptureLinkModel.create({
        slug,
        title: parsed.data.title,
        description: parsed.data.description,
        ownerProfileId: parsed.data.ownerProfileId,
        allowedChannels: parsed.data.allowedChannels?.length ? parsed.data.allowedChannels : ['email', 'sms'],
        tags: parsed.data.tags || [],
        redirectUrl: parsed.data.redirectUrl,
      })
      const url = `${baseUrl}/c/${doc.slug}`
      return res.json({ ok: true, data: { slug: doc.slug, url, link: doc } })
    } catch (err: any) {
      if (err?.code === 11000) {
        slug = generateSlug(8)
        attempts += 1
        continue
      }
      console.error('[capture:create-link] error', err)
      return res.status(500).json({ ok: false, error: 'Failed to create capture link' })
    }
  }
  return res.status(500).json({ ok: false, error: 'Failed to create capture link (collision)' })
})

// List recent capture links (admin/internal UI)
capture.get('/audience/capture-links', async (req, res) => {
  const limit = Math.min(Number(req.query.limit) || 10, 100)
  const links = await CaptureLinkModel.find({}, { __v: 0 }).sort({ createdAt: -1 }).limit(limit)
  return res.json({ ok: true, data: links })
})

// Public metadata about a capture link
capture.get('/audience/capture-links/:slug', async (req, res) => {
  const slug = req.params.slug
  const link = await CaptureLinkModel.findOne({ slug })
  if (!link || link.disabled) return res.status(404).json({ ok: false, error: 'Not found' })
  // Increment visits count (best-effort)
  CaptureLinkModel.updateOne({ _id: link._id }, { $inc: { 'stats.visits': 1 } }).catch(() => {})
  return res.json({ ok: true, data: {
    slug: link.slug,
    title: link.title,
    description: link.description,
    allowedChannels: link.allowedChannels,
    tags: link.tags,
    redirectUrl: link.redirectUrl,
  } })
})

// Submit opt-in for a capture link
const SubmitBody = z.object({
  displayName: z.string().optional(),
  email: z.string().email().optional(),
  phone: z.string().optional(),
  consent: z.object({ email: z.boolean().optional(), sms: z.boolean().optional() }).partial().optional(),
})

capture.post('/audience/capture/:slug', async (req, res) => {
  const slug = req.params.slug
  const parsed = SubmitBody.safeParse(req.body)
  if (!parsed.success) return res.status(400).json({ ok: false, error: parsed.error.flatten() })
  const link = await CaptureLinkModel.findOne({ slug })
  if (!link || link.disabled) return res.status(404).json({ ok: false, error: 'Not found' })

  // Validate provided channels match allowed channels
  const wantEmail = !!parsed.data.consent?.email
  const wantSms = !!parsed.data.consent?.sms
  if ((wantEmail && !link.allowedChannels.includes('email')) || (wantSms && !link.allowedChannels.includes('sms')))
    return res.status(400).json({ ok: false, error: 'Channel not allowed for this capture link' })

  const contact = await AudienceContactModel.create({
    displayName: parsed.data.displayName,
    email: parsed.data.email,
    phone: parsed.data.phone,
    consent: { email: wantEmail, sms: wantSms },
    source: 'capture-link',
    tags: Array.from(new Set([...(link.tags || []), 'capture'])),
    ownerProfileId: link.ownerProfileId as any,
  })

  // Increment submissions (best-effort)
  CaptureLinkModel.updateOne({ _id: link._id }, { $inc: { 'stats.submissions': 1 } }).catch(() => {})

  return res.json({ ok: true, data: { contactId: contact._id, redirectUrl: link.redirectUrl || null } })
})

// Delete a capture link
capture.delete('/audience/capture-links/:slug', async (req, res) => {
  const slug = req.params.slug
  const result = await CaptureLinkModel.findOneAndDelete({ slug })
  if (!result) return res.status(404).json({ ok: false, error: 'Not found' })
  return res.json({ ok: true })
})

// QR code SVG for a capture link
capture.get('/audience/capture-links/:slug/qr', async (req, res) => {
  const slug = req.params.slug
  const link = await CaptureLinkModel.findOne({ slug })
  if (!link || link.disabled) return res.status(404).type('text/plain').send('Not found')
  const baseUrl = (env.CORS_ORIGIN || '').replace(/\/$/, '') || 'http://localhost:5176'
  const url = `${baseUrl}/c/${link.slug}`
  const size = Math.min(Math.max(Number(req.query.size) || 256, 128), 1024)
  try {
    const svg = await QRCode.toString(url, { type: 'svg', width: size, margin: 1 })
    res.setHeader('Content-Type', 'image/svg+xml')
    return res.send(svg)
  } catch (e) {
    console.error('[capture:qr] error', e)
    return res.status(500).type('text/plain').send('Failed to generate QR')
  }
})

// Enable/disable a capture link
const PatchBody = z.object({ disabled: z.boolean() })
capture.patch('/audience/capture-links/:slug', async (req, res) => {
  const slug = req.params.slug
  const parsed = PatchBody.safeParse(req.body)
  if (!parsed.success) return res.status(400).json({ ok: false, error: parsed.error.flatten() })
  const link = await CaptureLinkModel.findOneAndUpdate({ slug }, { $set: { disabled: parsed.data.disabled } }, { new: true })
  if (!link) return res.status(404).json({ ok: false, error: 'Not found' })
  return res.json({ ok: true, data: link })
})
