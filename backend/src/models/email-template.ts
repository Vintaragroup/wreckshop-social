import mongoose, { Schema, model, InferSchemaType } from 'mongoose'

const EmailTemplateSchema = new Schema(
  {
    userId: { type: String, required: true, index: true },
    name: { type: String, required: true, index: true },
    subject: { type: String, required: true },
    fromName: { type: String, required: true },
    fromEmail: { type: String, required: true, match: /^[^\s@]+@[^\s@]+\.[^\s@]+$/ },
    bodyHtml: { type: String, required: true },
    bodyText: { type: String },
    preview: { type: String },
    tags: { type: [String], default: [], index: true },
  },
  { timestamps: true }
)

// Index for efficient querying
EmailTemplateSchema.index({ userId: 1, createdAt: -1 })
EmailTemplateSchema.index({ userId: 1, name: 'text', subject: 'text' })

export type EmailTemplate = InferSchemaType<typeof EmailTemplateSchema>

const EmailTemplateModel = (mongoose.models as any)?.EmailTemplate || model('EmailTemplate', EmailTemplateSchema)
export default EmailTemplateModel
