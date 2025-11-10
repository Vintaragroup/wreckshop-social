import { useEffect, useState } from 'react'
import { Mail, Smartphone, Monitor, Copy, Check } from 'lucide-react'
import { Button } from './ui/button'
import { Card, CardContent, CardHeader, CardTitle } from './ui/card'
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs'
import { toast } from 'sonner'
import { apiUrl } from '../lib/api'

interface CampaignPreviewProps {
  campaignId: string
  subject: string
  fromName: string
  fromEmail: string
  bodyHtml: string
}

interface PreviewData {
  subject: string
  from: string
  bodyHtml: string
  preview: string
}

export function CampaignPreview({
  campaignId,
  subject,
  fromName,
  fromEmail,
  bodyHtml,
}: CampaignPreviewProps) {
  const [preview, setPreview] = useState<PreviewData | null>(null)
  const [loading, setLoading] = useState(false)
  const [copied, setCopied] = useState(false)

  useEffect(() => {
    loadPreview()
  }, [campaignId])

  const loadPreview = async () => {
    try {
      setLoading(true)
      const res = await fetch(apiUrl(`/campaigns/${campaignId}/preview`), {
        method: 'POST',
      })
      if (!res.ok) throw new Error('Failed to load preview')
      const json = await res.json()
      setPreview(json.data)
    } catch (error: any) {
      toast.error(error.message)
    } finally {
      setLoading(false)
    }
  }

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  if (loading) {
    return (
      <Card>
        <CardContent className="p-8 text-center text-muted-foreground">
          Loading preview...
        </CardContent>
      </Card>
    )
  }

  if (!preview) {
    return (
      <Card>
        <CardContent className="p-8 text-center text-muted-foreground">
          Unable to load preview
        </CardContent>
      </Card>
    )
  }

  return (
    <div className="space-y-4">
      {/* Desktop Preview */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-lg">
            <Monitor className="w-4 h-4" />
            Desktop Preview
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="border rounded-lg overflow-hidden bg-white">
            <div className="bg-gray-50 border-b p-4">
              <div className="text-sm font-medium text-gray-900">{preview.from}</div>
              <div className="text-sm text-gray-600 line-clamp-1">{preview.subject}</div>
            </div>
            <div className="p-6 min-h-64 bg-white">
              <div
                dangerouslySetInnerHTML={{ __html: preview.bodyHtml }}
                className="prose prose-sm max-w-none"
              />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Mobile Preview */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-lg">
            <Smartphone className="w-4 h-4" />
            Mobile Preview
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex justify-center">
            <div className="w-80 border-8 border-black rounded-2xl overflow-hidden bg-black">
              <div className="bg-gray-50 border-b p-3">
                <div className="text-xs font-medium text-gray-900 truncate">
                  {preview.from}
                </div>
                <div className="text-xs text-gray-600 line-clamp-1">{preview.subject}</div>
              </div>
              <div className="p-4 min-h-96 bg-white overflow-y-auto max-h-96">
                <div
                  dangerouslySetInnerHTML={{ __html: preview.bodyHtml }}
                  className="prose prose-sm max-w-none text-xs"
                />
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Email Headers */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-lg">
            <Mail className="w-4 h-4" />
            Email Headers
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="space-y-1">
            <div className="text-xs font-medium text-muted-foreground">FROM</div>
            <div className="flex items-center justify-between bg-muted p-2 rounded text-sm">
              <span>{preview.from}</span>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => copyToClipboard(preview.from)}
              >
                {copied ? (
                  <Check className="w-4 h-4" />
                ) : (
                  <Copy className="w-4 h-4" />
                )}
              </Button>
            </div>
          </div>

          <div className="space-y-1">
            <div className="text-xs font-medium text-muted-foreground">SUBJECT</div>
            <div className="flex items-center justify-between bg-muted p-2 rounded text-sm">
              <span className="line-clamp-1">{preview.subject}</span>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => copyToClipboard(preview.subject)}
              >
                {copied ? (
                  <Check className="w-4 h-4" />
                ) : (
                  <Copy className="w-4 h-4" />
                )}
              </Button>
            </div>
          </div>

          <div className="space-y-1">
            <div className="text-xs font-medium text-muted-foreground">PREVIEW TEXT</div>
            <div className="flex items-center justify-between bg-muted p-2 rounded text-sm">
              <span className="line-clamp-1">{preview.preview}</span>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => copyToClipboard(preview.preview)}
              >
                {copied ? (
                  <Check className="w-4 h-4" />
                ) : (
                  <Copy className="w-4 h-4" />
                )}
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Tips */}
      <Card className="bg-blue-50 border-blue-200">
        <CardHeader>
          <CardTitle className="text-base">Preview Tips</CardTitle>
        </CardHeader>
        <CardContent className="text-sm space-y-2 text-muted-foreground">
          <div>• Subject line should be under 50 characters for mobile</div>
          <div>• Preview text appears next to subject in many email clients</div>
          <div>• Test personalization variables before sending</div>
          <div>• Images may not load in all email clients</div>
        </CardContent>
      </Card>
    </div>
  )
}
