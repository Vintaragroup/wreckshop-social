import { useState, useEffect } from 'react'
import { Plus, Search, Copy, Trash2, Edit2, Eye, MoreHorizontal } from 'lucide-react'
import { Button } from './ui/button'
import { Input } from './ui/input'
import { Badge } from './ui/badge'
import { Card, CardContent, CardHeader, CardTitle } from './ui/card'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from './ui/table'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from './ui/dropdown-menu'
import { toast } from 'sonner'
import { apiUrl } from '../lib/api'

interface EmailTemplate {
  _id: string
  name: string
  subject: string
  fromName: string
  fromEmail: string
  bodyHtml: string
  tags?: string[]
  createdAt: string
}

interface TemplateLibraryProps {
  onSelectTemplate?: (template: EmailTemplate) => void
  onEditTemplate?: (templateId: string) => void
  onCreateNew?: () => void
}

export function TemplateLibrary({
  onSelectTemplate,
  onEditTemplate,
  onCreateNew,
}: TemplateLibraryProps) {
  const [templates, setTemplates] = useState<EmailTemplate[]>([])
  const [loading, setLoading] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    loadTemplates()
  }, [])

  const loadTemplates = async () => {
    try {
      setLoading(true)
      setError(null)
      const res = await fetch(apiUrl('/email-templates'))
      if (!res.ok) throw new Error('Failed to load templates')
      const json = await res.json()
      setTemplates(json.data || [])
    } catch (err: any) {
      setError(err.message)
      toast.error(err.message)
    } finally {
      setLoading(false)
    }
  }

  const handleDelete = async (templateId: string) => {
    if (!confirm('Are you sure? This cannot be undone.')) return

    try {
      const res = await fetch(apiUrl(`/email-templates/${templateId}`), {
        method: 'DELETE',
      })
      if (!res.ok) throw new Error('Failed to delete template')
      setTemplates(templates.filter(t => t._id !== templateId))
      toast.success('Template deleted')
    } catch (err: any) {
      toast.error(err.message)
    }
  }

  const handleDuplicate = async (template: EmailTemplate) => {
    try {
      const res = await fetch(apiUrl(`/email-templates/${template._id}/duplicate`), {
        method: 'POST',
      })
      if (!res.ok) throw new Error('Failed to duplicate template')
      const json = await res.json()
      setTemplates([json.data, ...templates])
      toast.success('Template duplicated')
    } catch (err: any) {
      toast.error(err.message)
    }
  }

  const filteredTemplates = templates.filter(t =>
    t.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    t.subject.toLowerCase().includes(searchQuery.toLowerCase())
  )

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">Email Templates</h2>
          <p className="text-sm text-muted-foreground">
            Create and manage reusable email templates
          </p>
        </div>
        <Button onClick={onCreateNew}>
          <Plus className="w-4 h-4 mr-2" />
          New Template
        </Button>
      </div>

      {/* Search */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
        <Input
          placeholder="Search templates..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="pl-10"
        />
      </div>

      {/* Templates List */}
      {loading ? (
        <Card>
          <CardContent className="p-8 text-center text-muted-foreground">
            Loading templates...
          </CardContent>
        </Card>
      ) : error ? (
        <Card className="border-destructive">
          <CardContent className="p-8 text-center text-destructive">
            {error}
          </CardContent>
        </Card>
      ) : filteredTemplates.length === 0 ? (
        <Card>
          <CardContent className="p-8 text-center space-y-4">
            <div className="text-muted-foreground">
              {templates.length === 0
                ? 'No templates yet. Create your first one!'
                : 'No templates match your search.'}
            </div>
            {templates.length === 0 && (
              <Button onClick={onCreateNew}>
                <Plus className="w-4 h-4 mr-2" />
                Create Template
              </Button>
            )}
          </CardContent>
        </Card>
      ) : (
        <Card>
          <CardHeader>
            <CardTitle>{filteredTemplates.length} Templates</CardTitle>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Name</TableHead>
                  <TableHead>Subject</TableHead>
                  <TableHead>From</TableHead>
                  <TableHead>Tags</TableHead>
                  <TableHead>Created</TableHead>
                  <TableHead className="w-12"></TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredTemplates.map((template) => (
                  <TableRow key={template._id}>
                    <TableCell>
                      <div className="font-medium">{template.name}</div>
                    </TableCell>
                    <TableCell>
                      <div className="text-sm text-muted-foreground line-clamp-1">
                        {template.subject}
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="text-sm">
                        <div className="font-medium text-xs">{template.fromName}</div>
                        <div className="text-xs text-muted-foreground">{template.fromEmail}</div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex gap-1 flex-wrap">
                        {template.tags && template.tags.length > 0 ? (
                          template.tags.map(tag => (
                            <Badge key={tag} variant="secondary" className="text-xs">
                              {tag}
                            </Badge>
                          ))
                        ) : (
                          <span className="text-xs text-muted-foreground">-</span>
                        )}
                      </div>
                    </TableCell>
                    <TableCell className="text-sm text-muted-foreground">
                      {new Date(template.createdAt).toLocaleDateString()}
                    </TableCell>
                    <TableCell>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="sm">
                            <MoreHorizontal className="w-4 h-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          {onSelectTemplate && (
                            <DropdownMenuItem
                              onClick={() => onSelectTemplate(template)}
                              className="flex items-center space-x-2"
                            >
                              <Eye className="w-4 h-4" />
                              <span>Select</span>
                            </DropdownMenuItem>
                          )}
                          {onEditTemplate && (
                            <DropdownMenuItem
                              onClick={() => onEditTemplate(template._id)}
                              className="flex items-center space-x-2"
                            >
                              <Edit2 className="w-4 h-4" />
                              <span>Edit</span>
                            </DropdownMenuItem>
                          )}
                          <DropdownMenuItem
                            onClick={() => handleDuplicate(template)}
                            className="flex items-center space-x-2"
                          >
                            <Copy className="w-4 h-4" />
                            <span>Duplicate</span>
                          </DropdownMenuItem>
                          <DropdownMenuItem
                            onClick={() => handleDelete(template._id)}
                            className="flex items-center space-x-2 text-destructive"
                          >
                            <Trash2 className="w-4 h-4" />
                            <span>Delete</span>
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
