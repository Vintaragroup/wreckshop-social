import { useState } from 'react'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from './ui/dialog'
import { EmailTemplateEditor } from './email-template-editor'
import { TemplateLibrary } from './email-template-library'

interface EmailTemplate {
  _id?: string
  name: string
  subject: string
  fromName: string
  fromEmail: string
  bodyHtml: string
  bodyText?: string
  tags?: string[]
  createdAt?: string
}

interface EmailTemplatesProps {
  onSelectTemplate?: (template: EmailTemplate) => void
}

export function EmailTemplates({ onSelectTemplate }: EmailTemplatesProps) {
  const [view, setView] = useState<'list' | 'create' | 'edit'>('list')
  const [editingId, setEditingId] = useState<string | null>(null)
  const [selectedTemplate, setSelectedTemplate] = useState<EmailTemplate | null>(null)

  const handleCreateNew = () => {
    setEditingId(null)
    setView('create')
  }

  const handleEditTemplate = (templateId: string) => {
    setEditingId(templateId)
    setView('edit')
  }

  const handleSelectTemplate = (template: EmailTemplate) => {
    setSelectedTemplate(template)
    if (onSelectTemplate) {
      onSelectTemplate(template)
    }
  }

  const handleSaveTemplate = (template: EmailTemplate) => {
    if (view === 'create') {
      // After creating, show list
      setView('list')
    } else {
      // After editing, return to list
      setView('list')
    }
  }

  const handleCloseEditor = () => {
    setView('list')
    setEditingId(null)
  }

  return (
    <div className="space-y-6">
      {view === 'list' ? (
        <TemplateLibrary
          onSelectTemplate={handleSelectTemplate}
          onEditTemplate={handleEditTemplate}
          onCreateNew={handleCreateNew}
        />
      ) : (
        <EmailTemplateEditor
          templateId={editingId || undefined}
          onClose={handleCloseEditor}
          onSave={handleSaveTemplate}
        />
      )}
    </div>
  )
}

// Export a modal version for use in campaign builder
interface EmailTemplateModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  onSelectTemplate: (template: EmailTemplate) => void
}

export function EmailTemplateModal({
  open,
  onOpenChange,
  onSelectTemplate,
}: EmailTemplateModalProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Select Email Template</DialogTitle>
        </DialogHeader>
        <TemplateLibrary
          onSelectTemplate={(template) => {
            onSelectTemplate(template)
            onOpenChange(false)
          }}
        />
      </DialogContent>
    </Dialog>
  )
}
