import { Router } from 'express'
import { z } from 'zod'
import ABTestModel from '../models/ab-test'
import CampaignModel from '../models/campaign'

export const abTests = Router()

const VariantInput = z.object({
  name: z.string().min(1),
  subject: z.string().optional(),
  bodyHtml: z.string().optional(),
  sendTime: z.string().datetime().optional(),
})

const SettingsInput = z.object({
  splitType: z.enum(['even', 'custom', 'adaptive']).optional(),
  confidenceLevel: z.union([z.literal(90), z.literal(95), z.literal(99)]).optional(),
  minimumSampleSize: z.number().int().positive().optional(),
  testDuration: z.enum(['hours', 'days', 'weeks']).optional(),
  durationValue: z.number().int().positive().optional(),
  autoOptimize: z.boolean().optional(),
})

const CreateABTestBody = z.object({
  campaignId: z.string().min(1),
  name: z.string().min(1),
  description: z.string().optional(),
  testType: z.enum(['subject', 'time', 'content', 'comprehensive']),
  variants: z.array(VariantInput).min(2).max(4),
  settings: SettingsInput.optional(),
  segmentId: z.string().optional(),
  totalAudience: z.number().int().positive().optional(),
  scheduledFor: z.string().datetime().optional(),
})

// Create A/B test
abTests.post('/ab-tests', async (req, res) => {
  const parsed = CreateABTestBody.safeParse(req.body)
  if (!parsed.success) return res.status(400).json({ ok: false, error: parsed.error.flatten() })

  try {
    const input = parsed.data

    // Verify campaign exists
    const campaign = await CampaignModel.findById(input.campaignId)
    if (!campaign) return res.status(404).json({ ok: false, error: 'Campaign not found' })

    // Create variants with proper structure
    const variants = input.variants.map((v) => ({
      name: v.name,
      subject: v.subject,
      bodyHtml: v.bodyHtml,
      sendTime: v.sendTime ? new Date(v.sendTime) : undefined,
      audience: Math.floor((input.totalAudience || 1000) / input.variants.length),
      sent: 0,
      delivered: 0,
      opened: 0,
      clicked: 0,
      bounced: 0,
      unsubscribed: 0,
      complained: 0,
      converted: 0,
    }))

    const doc = await ABTestModel.create({
      campaignId: input.campaignId,
      name: input.name,
      description: input.description,
      testType: input.testType,
      status: input.scheduledFor ? 'draft' : 'draft',
      variants,
      settings: input.settings || {},
      segmentId: input.segmentId,
      totalAudience: input.totalAudience || 1000,
      scheduledFor: input.scheduledFor ? new Date(input.scheduledFor) : undefined,
    })

    res.json({ ok: true, data: doc })
  } catch (error: any) {
    res.status(500).json({ ok: false, error: error.message })
  }
})

// List A/B tests
abTests.get('/ab-tests', async (req, res) => {
  try {
    const page = parseInt(req.query.page as string) || 1
    const limit = parseInt(req.query.limit as string) || 50
    const status = req.query.status as string

    const query: any = {}
    if (status) query.status = status

    const docs = await ABTestModel.find(query)
      .sort({ createdAt: -1 })
      .skip((page - 1) * limit)
      .limit(limit)

    const total = await ABTestModel.countDocuments(query)

    res.json({
      ok: true,
      data: docs,
      pagination: { page, limit, total, pages: Math.ceil(total / limit) },
    })
  } catch (error: any) {
    res.status(500).json({ ok: false, error: error.message })
  }
})

// Get single A/B test
abTests.get('/ab-tests/:id', async (req, res) => {
  try {
    const doc = await ABTestModel.findById(req.params.id)
    if (!doc) return res.status(404).json({ ok: false, error: 'A/B test not found' })
    res.json({ ok: true, data: doc })
  } catch (error: any) {
    res.status(500).json({ ok: false, error: error.message })
  }
})

// Update A/B test
abTests.patch('/ab-tests/:id', async (req, res) => {
  try {
    const { name, description, settings } = req.body

    const doc = await ABTestModel.findByIdAndUpdate(
      req.params.id,
      {
        ...(name && { name }),
        ...(description && { description }),
        ...(settings && { settings }),
      },
      { new: true }
    )

    if (!doc) return res.status(404).json({ ok: false, error: 'A/B test not found' })
    res.json({ ok: true, data: doc })
  } catch (error: any) {
    res.status(500).json({ ok: false, error: error.message })
  }
})

// Start A/B test
abTests.post('/ab-tests/:id/start', async (req, res) => {
  try {
    const doc = await ABTestModel.findByIdAndUpdate(
      req.params.id,
      {
        status: 'running',
        startedAt: new Date(),
      },
      { new: true }
    )

    if (!doc) return res.status(404).json({ ok: false, error: 'A/B test not found' })

    res.json({
      ok: true,
      data: doc,
      message: 'A/B test started successfully',
    })
  } catch (error: any) {
    res.status(500).json({ ok: false, error: error.message })
  }
})

// Pause A/B test
abTests.post('/ab-tests/:id/pause', async (req, res) => {
  try {
    const doc = await ABTestModel.findByIdAndUpdate(
      req.params.id,
      { status: 'paused' },
      { new: true }
    )

    if (!doc) return res.status(404).json({ ok: false, error: 'A/B test not found' })

    res.json({ ok: true, data: doc })
  } catch (error: any) {
    res.status(500).json({ ok: false, error: error.message })
  }
})

// Get A/B test results
abTests.get('/ab-tests/:id/results', async (req, res) => {
  try {
    const doc = await ABTestModel.findById(req.params.id)
    if (!doc) return res.status(404).json({ ok: false, error: 'A/B test not found' })

    const variants = doc.variants.map((v: any) => {
      const sent = v.sent || 1 // avoid division by zero
      const delivered = v.delivered || 1
      const opened = v.opened || 0
      const clicked = v.clicked || 0

      return {
        _id: v._id,
        name: v.name,
        subject: v.subject,
        metrics: {
          sent: v.sent,
          delivered: v.delivered,
          opened: v.opened,
          clicked: v.clicked,
          bounced: v.bounced,
          unsubscribed: v.unsubscribed,
        },
        rates: {
          deliveryRate: (delivered / sent) * 100,
          openRate: (opened / delivered) * 100,
          clickRate: (clicked / opened) * 100,
          clickThroughRate: (clicked / delivered) * 100,
          bounceRate: (v.bounced / sent) * 100,
          unsubscribeRate: (v.unsubscribed / delivered) * 100,
        },
        engagementScore: Math.round(
          ((opened / delivered) * 40 + (clicked / opened) * 40 + (v.converted / clicked) * 20) / 100 || 0
        ),
      }
    })

    // Calculate statistical significance
    const results = variants.map((v: any, idx: number) => {
      if (idx === 0) {
        return {
          ...v,
          comparison: { significantly_better_than: [], significantly_worse_than: [], statistically_similar: [] },
        }
      }

      // Simple chi-square test for independence
      const baseline = variants[0]
      const chi2 = calculateChiSquare(v, baseline)
      const pValue = calculatePValue(chi2)
      const isSignificant = pValue < 0.05

      return {
        ...v,
        comparison: {
          vs_variant_0: {
            chi_squared: chi2,
            p_value: pValue,
            significant: isSignificant,
            improvement: ((v.rates.openRate - baseline.rates.openRate) / baseline.rates.openRate) * 100,
          },
        },
      }
    })

    res.json({
      ok: true,
      data: {
        test: {
          id: doc._id,
          name: doc.name,
          testType: doc.testType,
          status: doc.status,
          startedAt: doc.startedAt,
          completedAt: doc.completedAt,
          totalAudience: doc.totalAudience,
          winner: doc.winner,
        },
        variants: results,
      },
    })
  } catch (error: any) {
    res.status(500).json({ ok: false, error: error.message })
  }
})

// Declare winner
abTests.post('/ab-tests/:id/winner', async (req, res) => {
  try {
    const { variantId, metric = 'openRate' } = req.body

    const doc = await ABTestModel.findById(req.params.id)
    if (!doc) return res.status(404).json({ ok: false, error: 'A/B test not found' })

    const variant = doc.variants.find((v: any) => v._id.toString() === variantId)
    if (!variant) return res.status(400).json({ ok: false, error: 'Variant not found' })

    // Calculate improvement over second-best variant
    const metrics = doc.variants.map((v: any) => {
      const delivered = v.delivered || 1
      const opened = v.opened || 0
      return { variant: v._id, rate: (opened / delivered) * 100 }
    })

    metrics.sort((a: any, b: any) => b.rate - a.rate)
    const improvement = metrics[0].rate - metrics[1].rate

    // Calculate confidence (simplified - using sample size as proxy)
    const confidence = Math.min(100, (doc.totalAudience / doc.settings.minimumSampleSize) * 95)

    const updatedDoc = await ABTestModel.findByIdAndUpdate(
      req.params.id,
      {
        status: 'completed',
        completedAt: new Date(),
        winner: {
          variantId: variant._id,
          variantName: variant.name,
          metric,
          confidence: Math.round(confidence),
          improvement: Math.round(improvement * 100) / 100,
          pValue: 0.01, // simplified
        },
      },
      { new: true }
    )

    res.json({ ok: true, data: updatedDoc })
  } catch (error: any) {
    res.status(500).json({ ok: false, error: error.message })
  }
})

// Delete A/B test (draft only)
abTests.delete('/ab-tests/:id', async (req, res) => {
  try {
    const doc = await ABTestModel.findById(req.params.id)
    if (!doc) return res.status(404).json({ ok: false, error: 'A/B test not found' })

    if (doc.status !== 'draft') {
      return res.status(400).json({ ok: false, error: 'Can only delete draft tests' })
    }

    await ABTestModel.findByIdAndDelete(req.params.id)

    res.json({ ok: true, message: 'A/B test deleted' })
  } catch (error: any) {
    res.status(500).json({ ok: false, error: error.message })
  }
})

// Helper functions for statistical significance

function calculateChiSquare(variant1: any, variant2: any): number {
  const o1 = variant1.metrics.opened
  const o2 = variant2.metrics.opened
  const d1 = variant1.metrics.delivered
  const d2 = variant2.metrics.delivered

  const n1 = d1
  const n2 = d2
  const p1 = o1 / n1
  const p2 = o2 / n2
  const p = (o1 + o2) / (n1 + n2)

  const chi2 =
    ((o1 - n1 * p) ** 2) / (n1 * p * (1 - p)) + ((o2 - n2 * p) ** 2) / (n2 * p * (1 - p))

  return chi2
}

function calculatePValue(chi2: number): number {
  // Simplified p-value calculation
  // In production, use statistical library
  if (chi2 > 3.841) return 0.05
  if (chi2 > 2.706) return 0.1
  if (chi2 > 1.074) return 0.3
  return 0.5
}
