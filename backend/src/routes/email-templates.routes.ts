import { Router } from 'express'
import { z } from 'zod'
import EmailTemplateModel from '../models/email-template'
import { ObjectId } from 'mongodb'

export const templates = Router()

const EmailTemplateBody = z.object({
  name: z.string().min(1, 'Template name is required'),
  subject: z.string().min(1, 'Subject is required'),
  fromName: z.string().min(1, 'From name is required'),
  fromEmail: z.string().email('Valid email required'),
  bodyHtml: z.string().min(1, 'Email body is required'),
  bodyText: z.string().optional(),
  preview: z.string().optional(),
  tags: z.array(z.string()).optional().default([]),
})

// Default templates for new users
const DEFAULT_TEMPLATES = [
  {
    name: 'Album Launch',
    subject: '🎵 New Album Available Now',
    fromName: 'Wreckshop Records',
    fromEmail: 'noreply@wreckshop.com',
    bodyHtml: '<h1>New Album Available</h1><p>Stream the latest release across all platforms.</p>',
    tags: ['release', 'album'],
  },
  {
    name: 'Event Presale',
    subject: '🎟️ VIP Early Access - Concert Presale',
    fromName: 'Wreckshop Events',
    fromEmail: 'events@wreckshop.com',
    bodyHtml: '<h1>Exclusive Presale</h1><p>Get your tickets before they sell out.</p>',
    tags: ['event', 'presale'],
  },
  {
    name: 'Merchandise Drop',
    subject: '👕 Limited Edition Merch Now Available',
    fromName: 'Wreckshop Shop',
    fromEmail: 'shop@wreckshop.com',
    bodyHtml: '<h1>New Merchandise</h1><p>Check out our latest drops and exclusive designs.</p>',
    tags: ['merchandise', 'shop'],
  },
  {
    name: 'Newsletter Update',
    subject: '📰 Wreckshop Newsletter - Latest Updates',
    fromName: 'Wreckshop Team',
    fromEmail: 'newsletter@wreckshop.com',
    bodyHtml: '<h1>Newsletter</h1><p>Stay updated with exclusive content and behind-the-scenes news.</p>',
    tags: ['newsletter', 'content'],
  },
  {
    name: 'Blank Template',
    subject: 'Your Subject Here',
    fromName: 'Wreckshop Records',
    fromEmail: 'noreply@wreckshop.com',
    bodyHtml: '<p>Your email content goes here.</p>',
    tags: ['custom', 'blank'],
  },
]

// Create template
templates.post('/email-templates', async (req, res) => {
  try {
    const parsed = EmailTemplateBody.safeParse(req.body)
    if (!parsed.success) {
      return res.status(400).json({ 
        ok: false, 
        error: parsed.error.flatten() 
      })
    }

    const input = parsed.data
    const userId = 'user123' // TODO: Extract from auth middleware

    const doc = await EmailTemplateModel.create({
      userId,
      ...input,
    })

    res.status(201).json({ ok: true, data: doc })
  } catch (error: any) {
    res.status(500).json({ 
      ok: false, 
      error: error.message || 'Failed to create template' 
    })
  }
})

// List templates for user
templates.get('/email-templates', async (req, res) => {
  try {
    const userId = 'user123' // TODO: Extract from auth middleware
    const search = req.query.search as string || ''

    let query = EmailTemplateModel.find({ userId })

    if (search) {
      query = query.where('name').regex(search, 'i')
    }

    const docs = await query.sort({ createdAt: -1 }).limit(200)
    
    // If user has no templates, return defaults
    if (docs.length === 0) {
      const defaultDocs = DEFAULT_TEMPLATES.map(t => ({
        _id: undefined,
        userId: null,
        ...t,
        createdAt: new Date(),
        updatedAt: new Date(),
      }))
      return res.json({ ok: true, data: defaultDocs })
    }
    
    res.json({ ok: true, data: docs })
  } catch (error: any) {
    res.status(500).json({ 
      ok: false, 
      error: error.message || 'Failed to list templates' 
    })
  }
})

// Get single template
templates.get('/email-templates/:id', async (req, res) => {
  try {
    const { id } = req.params
    
    if (!ObjectId.isValid(id)) {
      return res.status(400).json({ 
        ok: false, 
        error: 'Invalid template ID' 
      })
    }

    const userId = 'user123' // TODO: Extract from auth middleware
    const doc = await EmailTemplateModel.findOne({
      _id: id,
      userId,
    })

    if (!doc) {
      return res.status(404).json({ 
        ok: false, 
        error: 'Template not found' 
      })
    }

    res.json({ ok: true, data: doc })
  } catch (error: any) {
    res.status(500).json({ 
      ok: false, 
      error: error.message || 'Failed to get template' 
    })
  }
})

// Update template
templates.patch('/email-templates/:id', async (req, res) => {
  try {
    const { id } = req.params
    
    if (!ObjectId.isValid(id)) {
      return res.status(400).json({ 
        ok: false, 
        error: 'Invalid template ID' 
      })
    }

    const parsed = EmailTemplateBody.partial().safeParse(req.body)
    if (!parsed.success) {
      return res.status(400).json({ 
        ok: false, 
        error: parsed.error.flatten() 
      })
    }

    const userId = 'user123' // TODO: Extract from auth middleware
    const doc = await EmailTemplateModel.findOneAndUpdate(
      { _id: id, userId },
      parsed.data,
      { new: true }
    )

    if (!doc) {
      return res.status(404).json({ 
        ok: false, 
        error: 'Template not found' 
      })
    }

    res.json({ ok: true, data: doc })
  } catch (error: any) {
    res.status(500).json({ 
      ok: false, 
      error: error.message || 'Failed to update template' 
    })
  }
})

// Delete template
templates.delete('/email-templates/:id', async (req, res) => {
  try {
    const { id } = req.params
    
    if (!ObjectId.isValid(id)) {
      return res.status(400).json({ 
        ok: false, 
        error: 'Invalid template ID' 
      })
    }

    const userId = 'user123' // TODO: Extract from auth middleware
    const doc = await EmailTemplateModel.findOneAndDelete({
      _id: id,
      userId,
    })

    if (!doc) {
      return res.status(404).json({ 
        ok: false, 
        error: 'Template not found' 
      })
    }

    res.json({ ok: true, data: { _id: id, deletedAt: new Date() } })
  } catch (error: any) {
    res.status(500).json({ 
      ok: false, 
      error: error.message || 'Failed to delete template' 
    })
  }
})

// Duplicate template
templates.post('/email-templates/:id/duplicate', async (req, res) => {
  try {
    const { id } = req.params
    
    if (!ObjectId.isValid(id)) {
      return res.status(400).json({ 
        ok: false, 
        error: 'Invalid template ID' 
      })
    }

    const userId = 'user123' // TODO: Extract from auth middleware
    const original = await EmailTemplateModel.findOne({
      _id: id,
      userId,
    })

    if (!original) {
      return res.status(404).json({ 
        ok: false, 
        error: 'Template not found' 
      })
    }

    const duplicated = await EmailTemplateModel.create({
      userId,
      name: `${original.name} [COPY]`,
      subject: original.subject,
      fromName: original.fromName,
      fromEmail: original.fromEmail,
      bodyHtml: original.bodyHtml,
      bodyText: original.bodyText,
      preview: original.preview,
      tags: original.tags,
    })

    res.status(201).json({ ok: true, data: duplicated })
  } catch (error: any) {
    res.status(500).json({ 
      ok: false, 
      error: error.message || 'Failed to duplicate template' 
    })
  }
})
