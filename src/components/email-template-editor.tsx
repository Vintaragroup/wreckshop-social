import { useState, useEffect } from 'react'
import { Save, Copy, Trash2, X, Eye, RotateCcw } from 'lucide-react'
import { Button } from './ui/button'
import { Input } from './ui/input'
import { Textarea } from './ui/textarea'
import { Card, CardContent, CardHeader, CardTitle } from './ui/card'
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs'
import { toast } from 'sonner'
import { apiUrl } from '../lib/api'

interface EmailTemplate {
  _id?: string
  name: string
  subject: string
  fromName: string
  fromEmail: string
  bodyHtml: string
  bodyText?: string
  preview?: string
  tags?: string[]
  createdAt?: string
}

interface EmailTemplateEditorProps {
  templateId?: string
  onClose: () => void
  onSave?: (template: EmailTemplate) => void
}

export function EmailTemplateEditor({ templateId, onClose, onSave }: EmailTemplateEditorProps) {
  const [loading, setLoading] = useState(false)
  const [template, setTemplate] = useState<EmailTemplate>({
    name: '',
    subject: '',
    fromName: '',
    fromEmail: '',
    bodyHtml: '',
    bodyText: '',
    tags: [],
  })
  const [dirty, setDirty] = useState(false)

  // Load existing template if editing
  useEffect(() => {
    if (templateId) {
      loadTemplate()
    }
  }, [templateId])

  const loadTemplate = async () => {
    try {
      setLoading(true)
      const res = await fetch(apiUrl(`/email-templates/${templateId}`))
      if (!res.ok) throw new Error('Failed to load template')
      const json = await res.json()
      setTemplate(json.data)
      setDirty(false)
    } catch (error: any) {
      toast.error(error.message)
    } finally {
      setLoading(false)
    }
  }

  const handleChange = (field: keyof EmailTemplate, value: any) => {
    setTemplate(prev => ({ ...prev, [field]: value }))
    setDirty(true)
  }

  const handleSave = async () => {
    if (!template.name.trim()) {
      toast.error('Template name is required')
      return
    }
    if (!template.subject.trim()) {
      toast.error('Subject is required')
      return
    }
    if (!template.fromEmail.trim()) {
      toast.error('From email is required')
      return
    }
    if (!template.bodyHtml.trim()) {
      toast.error('Email body is required')
      return
    }

    try {
      setLoading(true)
      const method = templateId ? 'PATCH' : 'POST'
      const url = templateId ? apiUrl(`/email-templates/${templateId}`) : apiUrl('/email-templates')

      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(template),
      })

      if (!res.ok) {
        const json = await res.json()
        throw new Error(json.error || 'Failed to save template')
      }

      const json = await res.json()
      toast.success(templateId ? 'Template updated' : 'Template created')
      setDirty(false)
      if (onSave) onSave(json.data)
    } catch (error: any) {
      toast.error(error.message)
    } finally {
      setLoading(false)
    }
  }

  const handleReset = () => {
    if (templateId) {
      loadTemplate()
    } else {
      setTemplate({
        name: '',
        subject: '',
        fromName: '',
        fromEmail: '',
        bodyHtml: '',
        bodyText: '',
        tags: [],
      })
    }
    setDirty(false)
  }

  const generatePlainText = () => {
    // Simple conversion from HTML to plain text
    const plainText = template.bodyHtml
      .replace(/<[^>]*>/g, '') // Remove HTML tags
      .replace(/&nbsp;/g, ' ')
      .replace(/&#?\w+;/g, '') // Remove HTML entities
      .trim()
    handleChange('bodyText', plainText)
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">
            {templateId ? 'Edit Template' : 'Create Email Template'}
          </h2>
          <p className="text-sm text-muted-foreground">
            {templateId ? 'Update your email template details' : 'Create a new reusable email template'}
          </p>
        </div>
        <Button variant="ghost" size="sm" onClick={onClose}>
          <X className="w-4 h-4" />
        </Button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Editor Panel */}
        <div className="lg:col-span-2 space-y-4">
          {/* Basic Info */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Template Details</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <label className="text-sm font-medium">Template Name</label>
                <Input
                  placeholder="e.g., Album Release Announcement"
                  value={template.name}
                  onChange={(e) => handleChange('name', e.target.value)}
                  disabled={loading}
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium">From Name</label>
                  <Input
                    placeholder="e.g., Travis Scott"
                    value={template.fromName}
                    onChange={(e) => handleChange('fromName', e.target.value)}
                    disabled={loading}
                  />
                </div>
                <div>
                  <label className="text-sm font-medium">From Email</label>
                  <Input
                    type="email"
                    placeholder="noreply@example.com"
                    value={template.fromEmail}
                    onChange={(e) => handleChange('fromEmail', e.target.value)}
                    disabled={loading}
                  />
                </div>
              </div>

              <div>
                <label className="text-sm font-medium">Subject Line</label>
                <Input
                  placeholder="e.g., 🎵 {{artistName}} - New Album Out Now"
                  value={template.subject}
                  onChange={(e) => handleChange('subject', e.target.value)}
                  disabled={loading}
                />
                <p className="text-xs text-muted-foreground mt-1">
                  Tip: Use {`{{firstName}}`} for personalization
                </p>
              </div>
            </CardContent>
          </Card>

          {/* Email Content */}
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle className="text-lg">Email Content</CardTitle>
              <Button
                variant="outline"
                size="sm"
                onClick={generatePlainText}
                disabled={!template.bodyHtml || loading}
              >
                Generate Plain Text
              </Button>
            </CardHeader>
            <CardContent className="space-y-4">
              <Tabs defaultValue="html" className="w-full">
                <TabsList>
                  <TabsTrigger value="html">HTML</TabsTrigger>
                  <TabsTrigger value="text">Plain Text</TabsTrigger>
                </TabsList>

                <TabsContent value="html" className="space-y-2">
                  <label className="text-sm font-medium">HTML Body</label>
                  <Textarea
                    placeholder="Paste your HTML email body here..."
                    value={template.bodyHtml}
                    onChange={(e) => handleChange('bodyHtml', e.target.value)}
                    disabled={loading}
                    rows={12}
                    className="font-mono text-xs"
                  />
                </TabsContent>

                <TabsContent value="text" className="space-y-2">
                  <label className="text-sm font-medium">Plain Text Version</label>
                  <Textarea
                    placeholder="Fallback plain text version..."
                    value={template.bodyText}
                    onChange={(e) => handleChange('bodyText', e.target.value)}
                    disabled={loading}
                    rows={12}
                    className="font-mono text-xs"
                  />
                </TabsContent>
              </Tabs>
            </CardContent>
          </Card>

          {/* Actions */}
          <div className="flex gap-2 justify-end">
            <Button
              variant="outline"
              onClick={handleReset}
              disabled={!dirty && !templateId || loading}
            >
              <RotateCcw className="w-4 h-4 mr-2" />
              Reset
            </Button>
            <Button
              onClick={handleSave}
              disabled={!dirty || loading}
            >
              <Save className="w-4 h-4 mr-2" />
              {loading ? 'Saving...' : templateId ? 'Update Template' : 'Create Template'}
            </Button>
          </div>
        </div>

        {/* Preview Panel */}
        <div className="lg:col-span-1">
          <Card className="sticky top-4 h-fit">
            <CardHeader>
              <CardTitle className="text-lg flex items-center gap-2">
                <Eye className="w-4 h-4" />
                Preview
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <div className="text-xs text-muted-foreground">From:</div>
                <div className="text-sm font-medium">
                  {template.fromName || '[From Name]'} &lt;{template.fromEmail || 'noreply@example.com'}&gt;
                </div>
              </div>

              <div className="space-y-2">
                <div className="text-xs text-muted-foreground">Subject:</div>
                <div className="text-sm font-medium line-clamp-2">
                  {template.subject || '[Subject line]'}
                </div>
              </div>

              <div className="space-y-2">
                <div className="text-xs text-muted-foreground">Preview:</div>
                <div className="bg-muted p-3 rounded text-xs line-clamp-3">
                  {template.bodyHtml ? (
                    <div
                      dangerouslySetInnerHTML={{ __html: template.bodyHtml }}
                      className="prose prose-sm max-w-none"
                    />
                  ) : (
                    <span className="text-muted-foreground">[Email body preview]</span>
                  )}
                </div>
              </div>

              <div className="pt-2 border-t space-y-2">
                <div className="text-xs text-muted-foreground">Template Status:</div>
                <div className="text-sm">
                  {templateId ? (
                    <span className="text-green-600">✓ Saved</span>
                  ) : (
                    <span className="text-amber-600">Draft</span>
                  )}
                </div>
                {template.createdAt && (
                  <div className="text-xs text-muted-foreground">
                    Created: {new Date(template.createdAt).toLocaleDateString()}
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
