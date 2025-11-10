import { Router } from 'express'
import { z } from 'zod'
import CampaignModel from '../models/campaign'

export const campaigns = Router()

const CampaignBody = z.object({
  name: z.string().min(1),
  ownerProfileId: z.string().optional(),
  releaseId: z.string().optional(),
  segments: z.array(z.string()).optional(),
  tags: z.array(z.string()).optional(),
  channels: z.any().optional(), // refine later per channel schema
  schedule: z
    .object({ startAt: z.string().datetime().optional(), endAt: z.string().datetime().optional(), timezone: z.string().optional() })
    .partial()
    .optional(),
  status: z.enum(['draft', 'scheduled', 'running', 'paused', 'completed', 'failed']).optional(),
})

// Create campaign
campaigns.post('/campaigns', async (req, res) => {
  const parsed = CampaignBody.safeParse(req.body)
  if (!parsed.success) return res.status(400).json({ ok: false, error: parsed.error.flatten() })
  const input = parsed.data
  const doc = await CampaignModel.create({
    ...input,
    schedule: {
      ...input.schedule,
      startAt: input.schedule?.startAt ? new Date(input.schedule.startAt) : undefined,
      endAt: input.schedule?.endAt ? new Date(input.schedule.endAt) : undefined,
    },
  })
  res.json({ ok: true, data: doc })
})

// List campaigns
campaigns.get('/campaigns', async (_req, res) => {
  const docs = await CampaignModel.find().sort({ createdAt: -1 }).limit(200)
  res.json({ ok: true, data: docs })
})

// Get one
campaigns.get('/campaigns/:id', async (req, res) => {
  const doc = await CampaignModel.findById(req.params.id)
  if (!doc) return res.status(404).json({ ok: false, error: 'not found' })
  res.json({ ok: true, data: doc })
})

// Update
campaigns.patch('/campaigns/:id', async (req, res) => {
  const parsed = CampaignBody.partial().safeParse(req.body)
  if (!parsed.success) return res.status(400).json({ ok: false, error: parsed.error.flatten() })
  const input = parsed.data
  const update: any = { ...input }
  if (input.schedule) {
    update.schedule = {
      ...input.schedule,
      startAt: input.schedule.startAt ? new Date(input.schedule.startAt) : undefined,
      endAt: input.schedule.endAt ? new Date(input.schedule.endAt) : undefined,
    }
  }
  const doc = await CampaignModel.findByIdAndUpdate(req.params.id, update, { new: true })
  if (!doc) return res.status(404).json({ ok: false, error: 'not found' })
  res.json({ ok: true, data: doc })
})

// Preview campaign (render email)
campaigns.post('/campaigns/:id/preview', async (req, res) => {
  try {
    const { id } = req.params
    const doc = await CampaignModel.findById(id)
    if (!doc) return res.status(404).json({ ok: false, error: 'Campaign not found' })

    const emailConfig = doc.channels?.email
    if (!emailConfig) return res.status(400).json({ ok: false, error: 'No email channel configured' })

    // Simple variable substitution (firstName, lastName, etc.)
    const substituteVariables = (text: string, variables: Record<string, string> = {}) => {
      return text.replace(/\{\{(\w+)\}\}/g, (match, variable) => {
        return variables[variable] || match
      })
    }

    const sampleVariables = {
      firstName: 'Alex',
      lastName: 'Smith',
      artistName: 'Sample Artist',
    }

    const preview = {
      subject: substituteVariables(emailConfig.subject || '', sampleVariables),
      from: `${emailConfig.fromName} <${emailConfig.fromEmail}>`,
      bodyHtml: substituteVariables(emailConfig.bodyHtml || '', sampleVariables),
      preview: substituteVariables(emailConfig.bodyHtml || '', sampleVariables)
        .replace(/<[^>]*>/g, '') // Strip HTML
        .substring(0, 150),
    }

    res.json({ ok: true, data: preview })
  } catch (error: any) {
    res.status(500).json({ ok: false, error: error.message })
  }
})

// Compliance check for campaign
campaigns.post('/campaigns/:id/compliance', async (req, res) => {
  try {
    const { id } = req.params
    const doc = await CampaignModel.findById(id)
    if (!doc) return res.status(404).json({ ok: false, error: 'Campaign not found' })

    const emailConfig = doc.channels?.email
    if (!emailConfig) return res.status(400).json({ ok: false, error: 'No email channel configured' })

    const issues: Array<{ type: 'error' | 'warning' | 'info'; message: string }> = []
    const hasUnsubscribeLink = (emailConfig.bodyHtml || '').includes('unsubscribe')
    const hasFromAddress = !!(emailConfig.fromEmail && emailConfig.fromName)
    const hasSubject = !!(emailConfig.subject && emailConfig.subject.length > 0)

    // CAN-SPAM compliance
    if (!hasFromAddress) issues.push({ type: 'error', message: 'CAN-SPAM: Must include valid From address' })
    if (!hasSubject) issues.push({ type: 'error', message: 'CAN-SPAM: Must include subject line' })
    if (!hasUnsubscribeLink) {
      issues.push({ type: 'warning', message: 'CAN-SPAM: Consider adding unsubscribe link' })
    }

    // GDPR compliance
    const hasPrivacyLink = (emailConfig.bodyHtml || '').includes('privacy')
    if (!hasPrivacyLink) {
      issues.push({ type: 'info', message: 'GDPR: Consider including privacy policy link' })
    }

    // Content checks
    const subjectLength = emailConfig.subject?.length || 0
    if (subjectLength > 100) {
      issues.push({ type: 'warning', message: 'Subject line is very long (>100 chars)' })
    }
    if (subjectLength < 20) {
      issues.push({ type: 'info', message: 'Subject line is short, consider making it more descriptive' })
    }

    // Spam score (simplified)
    const spamIndicators = [
      'FREE',
      'CLICK HERE',
      'BUY NOW',
      'ACT NOW',
      'URGENT',
      'LIMITED TIME',
      'GUARANTEE',
      '$$$',
    ]
    let spamCount = 0
    const bodyUpper = (emailConfig.bodyHtml || '').toUpperCase()
    spamIndicators.forEach(indicator => {
      if (bodyUpper.includes(indicator)) spamCount++
    })

    const spamScore = Math.min(100, (spamCount / spamIndicators.length) * 50)

    const compliance = {
      canSpamCompliant: issues.filter(i => i.type === 'error' && i.message.includes('CAN-SPAM')).length === 0,
      gdprReady: issues.filter(i => i.type === 'error' && i.message.includes('GDPR')).length === 0,
      spamScore: spamScore,
      issues: issues,
      summary: `${issues.filter(i => i.type === 'error').length} critical issues, ${issues.filter(i => i.type === 'warning').length} warnings`,
    }

    res.json({ ok: true, data: compliance })
  } catch (error: any) {
    res.status(500).json({ ok: false, error: error.message })
  }
})

// Send campaign (create event record, mark as sent)
campaigns.post('/campaigns/:id/send', async (req, res) => {
  try {
    const { id } = req.params
    const doc = await CampaignModel.findByIdAndUpdate(
      id,
      {
        status: 'running',
        launchedAt: new Date(),
        metrics: {
          sent: 0,
          delivered: 0,
          opened: 0,
          clicked: 0,
          bounced: 0,
          unsubscribed: 0,
        },
      },
      { new: true }
    )

    if (!doc) return res.status(404).json({ ok: false, error: 'Campaign not found' })

    res.json({
      ok: true,
      data: {
        ...doc.toObject(),
        message: 'Campaign sent successfully',
      },
    })
  } catch (error: any) {
    res.status(500).json({ ok: false, error: error.message })
  }
})

// Get analytics for campaign
campaigns.get('/campaigns/:id/analytics', async (req, res) => {
  try {
    const { id } = req.params
    const doc = await CampaignModel.findById(id)

    if (!doc) return res.status(404).json({ ok: false, error: 'Campaign not found' })

    const metrics = doc.metrics || {}
    const sent = metrics.sent || 0
    const delivered = metrics.delivered || 0
    const opened = metrics.opened || 0
    const clicked = metrics.clicked || 0
    const bounced = metrics.bounced || 0
    const unsubscribed = metrics.unsubscribed || 0
    const complained = metrics.complained || 0
    const converted = metrics.converted || 0

    // Calculate rates
    const deliveryRate = sent > 0 ? (delivered / sent) * 100 : 0
    const openRate = delivered > 0 ? (opened / delivered) * 100 : 0
    const clickRate = opened > 0 ? (clicked / opened) * 100 : 0
    const unsubscribeRate = delivered > 0 ? (unsubscribed / delivered) * 100 : 0
    const bounceRate = sent > 0 ? (bounced / sent) * 100 : 0
    const conversionRate = clicked > 0 ? (converted / clicked) * 100 : 0

    // Calculate engagement score (0-100)
    const engagementScore = Math.round(
      (openRate * 0.4 + clickRate * 0.4 + conversionRate * 0.2) / 100
    )

    // Prepare timeline data from events
    const events = metrics.events || []
    const eventCounts = {
      sent: 0,
      delivered: 0,
      opened: 0,
      clicked: 0,
      bounced: 0,
      failed: 0,
      unsubscribed: 0,
      complained: 0,
    }

    events.forEach((event: any) => {
      if (eventCounts.hasOwnProperty(event.type)) {
        eventCounts[event.type as keyof typeof eventCounts] += event.count || 1
      }
    })

    // Timeline: group events by hour for the last 24 hours or by day for longer periods
    const now = new Date()
    const timelineData: any[] = []
    
    if (doc.launchedAt) {
      const hoursSinceLaunch = (now.getTime() - doc.launchedAt.getTime()) / (1000 * 60 * 60)
      const isRecentCampaign = hoursSinceLaunch < 48

      if (isRecentCampaign) {
        // Group by hour
        for (let i = 0; i < 24; i++) {
          const hour = new Date(now.getTime() - i * 60 * 60 * 1000)
          const hourStart = new Date(hour.getFullYear(), hour.getMonth(), hour.getDate(), hour.getHours(), 0, 0)
          const hourEnd = new Date(hourStart.getTime() + 60 * 60 * 1000)

          const hourEvents = events.filter((e: any) => {
            const eventTime = new Date(e.timestamp)
            return eventTime >= hourStart && eventTime < hourEnd
          })

          timelineData.unshift({
            time: hourStart.toISOString(),
            label: hourStart.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' }),
            opened: hourEvents.filter((e: any) => e.type === 'opened').reduce((sum: number, e: any) => sum + (e.count || 1), 0),
            clicked: hourEvents.filter((e: any) => e.type === 'clicked').reduce((sum: number, e: any) => sum + (e.count || 1), 0),
            bounced: hourEvents.filter((e: any) => e.type === 'bounced').reduce((sum: number, e: any) => sum + (e.count || 1), 0),
          })
        }
      } else {
        // Group by day for last 14 days
        for (let i = 0; i < 14; i++) {
          const day = new Date(now.getTime() - i * 24 * 60 * 60 * 1000)
          const dayStart = new Date(day.getFullYear(), day.getMonth(), day.getDate(), 0, 0, 0)
          const dayEnd = new Date(dayStart.getTime() + 24 * 60 * 60 * 1000)

          const dayEvents = events.filter((e: any) => {
            const eventTime = new Date(e.timestamp)
            return eventTime >= dayStart && eventTime < dayEnd
          })

          timelineData.unshift({
            time: dayStart.toISOString(),
            label: dayStart.toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
            opened: dayEvents.filter((e: any) => e.type === 'opened').reduce((sum: number, e: any) => sum + (e.count || 1), 0),
            clicked: dayEvents.filter((e: any) => e.type === 'clicked').reduce((sum: number, e: any) => sum + (e.count || 1), 0),
            bounced: dayEvents.filter((e: any) => e.type === 'bounced').reduce((sum: number, e: any) => sum + (e.count || 1), 0),
          })
        }
      }
    }

    const analytics = {
      // Basic metrics
      metrics: {
        sent,
        delivered,
        opened,
        clicked,
        bounced,
        unsubscribed,
        complained,
        converted,
      },

      // Calculated rates
      rates: {
        deliveryRate: Math.round(deliveryRate * 100) / 100,
        openRate: Math.round(openRate * 100) / 100,
        clickRate: Math.round(clickRate * 100) / 100,
        unsubscribeRate: Math.round(unsubscribeRate * 100) / 100,
        bounceRate: Math.round(bounceRate * 100) / 100,
        conversionRate: Math.round(conversionRate * 100) / 100,
      },

      // Summary scores
      engagementScore,
      campaignStatus: doc.status,
      launchedAt: doc.launchedAt,
      createdAt: doc.createdAt,

      // Timeline data
      timeline: timelineData,

      // Event breakdown
      eventCounts,
    }

    res.json({ ok: true, data: analytics })
  } catch (error: any) {
    res.status(500).json({ ok: false, error: error.message })
  }
})

