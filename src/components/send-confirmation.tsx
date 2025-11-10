import { useState } from 'react'
import { Send, AlertCircle, CheckCircle, Clock } from 'lucide-react'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from './ui/dialog'
import { Button } from './ui/button'
import { Card, CardContent, CardHeader, CardTitle } from './ui/card'
import { Badge } from './ui/badge'
import { Separator } from './ui/separator'
import { Checkbox } from './ui/checkbox'
import { Label } from './ui/label'
import { toast } from 'sonner'
import { apiUrl } from '../lib/api'

interface SendConfirmationProps {
  open?: boolean
  onOpenChange?: (open: boolean) => void
  campaignId: string
  campaignName: string
  segmentName?: string
  estimatedRecipients?: number
  sendImmediately?: boolean
  scheduledTime?: Date
  onSend?: () => void
}

export function SendConfirmation({
  open,
  onOpenChange,
  campaignId,
  campaignName,
  segmentName,
  estimatedRecipients = 0,
  sendImmediately = true,
  scheduledTime,
  onSend,
}: SendConfirmationProps) {
  const [confirmed, setConfirmed] = useState(false)
  const [sending, setSending] = useState(false)
  const [certify, setCertify] = useState(false)

  const handleSend = async () => {
    if (!confirmed || !certify) {
      toast.error('Please confirm all requirements')
      return
    }

    try {
      setSending(true)
      const res = await fetch(apiUrl(`/campaigns/${campaignId}/send`), {
        method: 'POST',
      })
      if (!res.ok) throw new Error('Failed to send campaign')
      const json = await res.json()

      toast.success(`Campaign "${campaignName}" sent successfully!`)
      onSend?.()
      onOpenChange?.(false)
      setConfirmed(false)
      setCertify(false)
    } catch (error: any) {
      toast.error(error.message)
    } finally {
      setSending(false)
    }
  }

  const sendTimeDisplay = sendImmediately
    ? 'Immediately'
    : scheduledTime
      ? `${scheduledTime.toLocaleDateString()} at ${scheduledTime.toLocaleTimeString()}`
      : 'Not scheduled'

  return (
    <Dialog open={open ?? true} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-lg max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Send className="w-5 h-5" />
            Send Campaign
          </DialogTitle>
          <DialogDescription>
            Review and confirm before sending
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          {/* Campaign Summary */}
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-base">Campaign Summary</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <span className="text-xs text-muted-foreground">Campaign Name</span>
                  <div className="font-medium text-sm mt-1">{campaignName}</div>
                </div>
                <div>
                  <span className="text-xs text-muted-foreground">Segment</span>
                  <div className="font-medium text-sm mt-1">{segmentName || 'None'}</div>
                </div>
              </div>

              <Separator />

              <div>
                <span className="text-xs text-muted-foreground">Estimated Recipients</span>
                <div className="flex items-baseline gap-2 mt-1">
                  <span className="text-2xl font-bold">
                    {estimatedRecipients.toLocaleString()}
                  </span>
                  <span className="text-sm text-muted-foreground">subscribers</span>
                </div>
              </div>

              <div>
                <span className="text-xs text-muted-foreground">Send Time</span>
                <div className="flex items-center gap-2 mt-1">
                  <Clock className="w-4 h-4 text-muted-foreground" />
                  <span className="text-sm font-medium">{sendTimeDisplay}</span>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Warnings */}
          <Card className="border-yellow-200 bg-yellow-50">
            <CardContent className="p-4 space-y-2">
              <div className="flex gap-2">
                <AlertCircle className="w-5 h-5 text-yellow-600 shrink-0 mt-0.5" />
                <div className="text-sm text-yellow-900">
                  <div className="font-medium">Important Reminders</div>
                  <ul className="mt-2 space-y-1 text-xs list-disc list-inside">
                    <li>Campaign cannot be cancelled once sent</li>
                    <li>Please verify all content before sending</li>
                    <li>Double-check personalization variables</li>
                    <li>Ensure compliance with email regulations</li>
                  </ul>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Confirmations */}
          <Card>
            <CardContent className="p-4 space-y-3">
              <div className="flex items-start gap-3">
                <Checkbox
                  id="confirmed"
                  checked={confirmed}
                  onCheckedChange={(checked) => setConfirmed(checked as boolean)}
                />
                <Label htmlFor="confirmed" className="text-sm cursor-pointer flex-1">
                  I have reviewed the campaign content and confirm it is correct
                </Label>
              </div>

              <div className="flex items-start gap-3">
                <Checkbox
                  id="certify"
                  checked={certify}
                  onCheckedChange={(checked) => setCertify(checked as boolean)}
                />
                <Label htmlFor="certify" className="text-sm cursor-pointer flex-1">
                  I certify that all recipients have opted in and this complies with email laws
                </Label>
              </div>
            </CardContent>
          </Card>

          {/* Tips */}
          <Card className="bg-blue-50 border-blue-200">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm flex items-center gap-2">
                <CheckCircle className="w-4 h-4 text-blue-600" />
                Best Practices
              </CardTitle>
            </CardHeader>
            <CardContent className="text-xs text-blue-900 space-y-1">
              <div>✓ Send during peak engagement hours (9-11am, 1-3pm)</div>
              <div>✓ Avoid Fridays and weekends for business content</div>
              <div>✓ Use A/B testing to optimize performance</div>
              <div>✓ Monitor engagement metrics after sending</div>
            </CardContent>
          </Card>
        </div>

        <DialogFooter className="gap-2">
          <Button
            variant="outline"
            onClick={() => onOpenChange?.(false)}
            disabled={sending}
          >
            Cancel
          </Button>
          <Button
            onClick={handleSend}
            disabled={!confirmed || !certify || sending}
            className="flex items-center gap-2"
          >
            <Send className="w-4 h-4" />
            {sending ? 'Sending...' : 'Confirm & Send'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
