import { Router } from 'express'
import { z } from 'zod'
import SegmentModel from '../models/segment'
import ProfileModel from '../models/profile'

export const segments = Router()

const SegmentBody = z.object({
  name: z.string().min(1),
  description: z.string().optional(),
  ownerProfileId: z.string().optional(),
  query: z.any().optional(),
  tags: z.array(z.string()).optional(),
  estimatedCount: z.number().int().nonnegative().optional(),
})

// Create segment (basic)
segments.post('/segments', async (req, res) => {
  const parsed = SegmentBody.safeParse(req.body)
  if (!parsed.success) return res.status(400).json({ ok: false, error: parsed.error.flatten() })
  const doc = await SegmentModel.create(parsed.data)
  res.json({ ok: true, data: doc })
})

// List segments with optional search
segments.get('/segments', async (req, res) => {
  const q = String(req.query.q || '').trim()
  const filter: any = {}
  if (q) filter.name = { $regex: q, $options: 'i' }
  const docs = await SegmentModel.find(filter).sort({ updatedAt: -1 }).limit(200)
  res.json({ ok: true, data: docs })
})

// Get single segment
segments.get('/segments/:id', async (req, res) => {
  try {
    const doc = await SegmentModel.findById(req.params.id)
    if (!doc) return res.status(404).json({ ok: false, error: 'not found' })
    res.json({ ok: true, data: doc })
  } catch (e) {
    res.status(400).json({ ok: false, error: (e as any).message })
  }
})

// Delete segment
segments.delete('/segments/:id', async (req, res) => {
  try {
    const doc = await SegmentModel.findByIdAndDelete(req.params.id)
    if (!doc) return res.status(404).json({ ok: false, error: 'not found' })
    res.json({ ok: true })
  } catch (e) {
    res.status(400).json({ ok: false, error: (e as any).message })
  }
})

// Get users in a segment (for export)
segments.get('/segments/:id/users', async (req, res) => {
  try {
    const segment = await SegmentModel.findById(req.params.id)
    if (!segment) return res.status(404).json({ ok: false, error: 'not found' })

    // Build MongoDB query from filters
    const query = buildQueryFromFilters(segment.query || {})
    const users = await ProfileModel.find(query)
      .select('name email followersCount genres matchScore')
      .limit(10000)
      .lean()

    res.json({ ok: true, data: users })
  } catch (e) {
    console.error(e)
    res.status(500).json({ ok: false, error: (e as any)?.message })
  }
})

// Helper function to build MongoDB query from segment filters
function buildQueryFromFilters(filters: any): any {
  const query: any = {}
  
  if (!filters || typeof filters !== 'object') return query
  
  // Handle different filter structures based on segment builder format
  if (Array.isArray(filters)) {
    // If filters is array of groups (from segment builder)
    filters.forEach((group: any) => {
      if (Array.isArray(group.rules)) {
        group.rules.forEach((rule: any) => {
          if (rule.field && rule.operator && rule.value) {
            applyRule(query, rule)
          }
        })
      }
    })
  }
  
  return query
}

// Apply individual filter rule to MongoDB query
function applyRule(query: any, rule: any): void {
  const { field, operator, value } = rule
  
  switch (field) {
    case 'genre':
      if (operator === 'includes') {
        query.genres = { $in: value.split(',').map((v: string) => v.trim()) }
      } else if (operator === 'excludes') {
        query.genres = { $nin: value.split(',').map((v: string) => v.trim()) }
      }
      break
      
    case 'followerCount':
    case 'followersCount':
      if (operator === 'greater_than') {
        query.followersCount = { ...query.followersCount, $gte: parseInt(value) }
      } else if (operator === 'less_than') {
        query.followersCount = { ...query.followersCount, $lte: parseInt(value) }
      } else if (operator === 'equal') {
        query.followersCount = parseInt(value)
      }
      break
      
    case 'matchScore':
      if (operator === 'greater_than') {
        query.matchScore = { ...query.matchScore, $gte: parseFloat(value) }
      } else if (operator === 'less_than') {
        query.matchScore = { ...query.matchScore, $lte: parseFloat(value) }
      } else if (operator === 'equal') {
        query.matchScore = parseFloat(value)
      }
      break
  }
}
