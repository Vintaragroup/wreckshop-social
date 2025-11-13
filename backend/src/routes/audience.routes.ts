import { Router } from 'express'
import { z } from 'zod'
import AudienceContactModel from '../models/audience-contact'

export const audience = Router()

const ContactBody = z.object({
  email: z.string().email().optional(),
  phone: z.string().optional(),
  displayName: z.string().optional(),
  consent: z.object({ email: z.boolean().optional(), sms: z.boolean().optional() }).partial().optional(),
  tags: z.array(z.string()).optional(),
  ownerProfileId: z.string().optional(),
  source: z.string().optional(),
})

// Create contact (e.g., from landing page)
audience.post('/audience/contacts', async (req, res) => {
  const parsed = ContactBody.safeParse(req.body)
  if (!parsed.success) return res.status(400).json({ ok: false, error: parsed.error.flatten() })
  const contact = await AudienceContactModel.create(parsed.data)
  res.json({ ok: true, data: contact })
})

// List contacts (basic)
audience.get('/audience/contacts', async (_req, res) => {
  const contacts = await AudienceContactModel.find().sort({ createdAt: -1 }).limit(200)
  res.json({ ok: true, data: contacts })
})

// Stats summary for Data Intake card
// GET /api/audience/stats/summary?window=7d
audience.get('/audience/stats/summary', async (req, res) => {
  try {
    const windowParam = String(req.query.window || '7d')
    const now = new Date()
    const startOfToday = new Date(now)
    startOfToday.setHours(0, 0, 0, 0)
    const days = windowParam === '30d' ? 30 : 7
    const since = new Date(now)
    since.setDate(since.getDate() - days)

    const [profilesToday, sevenDayTotal, enrichedInWindow, pendingInWindow] = await Promise.all([
      AudienceContactModel.countDocuments({ createdAt: { $gte: startOfToday } }),
      AudienceContactModel.countDocuments({ createdAt: { $gte: since } }),
      AudienceContactModel.countDocuments({ createdAt: { $gte: since }, $or: [{ email: { $exists: true, $ne: null } }, { phone: { $exists: true, $ne: null } }] }),
      AudienceContactModel.countDocuments({ createdAt: { $gte: since }, $and: [{ $or: [{ email: { $exists: false } }, { email: null }, { email: '' }] }, { $or: [{ phone: { $exists: false } }, { phone: null }, { phone: '' }] }] }),
    ])

    const enrichedPercent = sevenDayTotal > 0 ? Math.round((enrichedInWindow / sevenDayTotal) * 100) : 0

    res.json({
      ok: true,
      data: {
        profilesToday,
        sevenDayTotal,
        enrichedPercent,
        pendingQueue: pendingInWindow,
        window: windowParam,
      },
    })
  } catch (error: any) {
    console.error('[audience] stats summary failed:', error)
    res.status(500).json({ ok: false, error: 'Internal server error' })
  }
})

// Timeseries for Data Intake sparkline
// GET /api/audience/stats/timeseries?window=7d|30d
audience.get('/audience/stats/timeseries', async (req, res) => {
  try {
    const windowParam = String(req.query.window || '7d')
    const days = windowParam === '30d' ? 30 : 7
    const now = new Date()
    const since = new Date(now)
    since.setDate(since.getDate() - days + 1) // include today as last bucket

    // Aggregate counts per day
    const rows: Array<{ _id: string; count: number }> = await (AudienceContactModel as any).aggregate([
      { $match: { createdAt: { $gte: since, $lte: now } } },
      {
        $group: {
          _id: { $dateToString: { format: '%Y-%m-%d', date: '$createdAt' } },
          count: { $sum: 1 },
        },
      },
      { $sort: { _id: 1 } },
    ])

    // Build full window with zero-fill
    const byDate: Record<string, number> = {}
    rows.forEach(r => { byDate[r._id] = r.count })

    const data: Array<{ date: string; count: number }> = []
    for (let i = days - 1; i >= 0; i--) {
      const d = new Date(now)
      d.setHours(0, 0, 0, 0)
      d.setDate(d.getDate() - i)
      const key = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`
      data.push({ date: new Date(d).toISOString(), count: byDate[key] || 0 })
    }

    res.json({ ok: true, data })
  } catch (error: any) {
    console.error('[audience] stats timeseries failed:', error)
    res.status(500).json({ ok: false, error: 'Internal server error' })
  }
})
