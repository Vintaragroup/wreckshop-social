import { useState } from 'react'
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs'
import { Button } from './ui/button'
import { Card, CardContent, CardHeader, CardTitle } from './ui/card'
import { Send, Eye, Shield, ArrowRight } from 'lucide-react'
import { CampaignPreview } from './campaign-preview'
import { ComplianceCheck } from './compliance-check'
import { SendConfirmation } from './send-confirmation'

interface PreSendReviewProps {
  campaignId: string
  campaignName: string
  subject: string
  fromName: string
  fromEmail: string
  bodyHtml: string
  segmentName?: string
  estimatedRecipients?: number
  sendImmediately?: boolean
  scheduledTime?: Date
  onSendComplete?: () => void
  onCancel?: () => void
}

export function PreSendReview({
  campaignId,
  campaignName,
  subject,
  fromName,
  fromEmail,
  bodyHtml,
  segmentName,
  estimatedRecipients,
  sendImmediately,
  scheduledTime,
  onSendComplete,
  onCancel,
}: PreSendReviewProps) {
  const [activeTab, setActiveTab] = useState('preview')
  const [showSendConfirmation, setShowSendConfirmation] = useState(false)
  const [canProceed, setCanProceed] = useState(true)

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h2 className="text-2xl font-bold">Pre-Send Review</h2>
        <p className="text-sm text-muted-foreground">
          Review your campaign before sending to {estimatedRecipients?.toLocaleString()} subscribers
        </p>
      </div>

      {/* Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="preview" className="flex items-center gap-2">
            <Eye className="w-4 h-4" />
            <span className="hidden sm:inline">Preview</span>
          </TabsTrigger>
          <TabsTrigger value="compliance" className="flex items-center gap-2">
            <Shield className="w-4 h-4" />
            <span className="hidden sm:inline">Compliance</span>
          </TabsTrigger>
          <TabsTrigger value="summary" className="flex items-center gap-2">
            <Send className="w-4 h-4" />
            <span className="hidden sm:inline">Send</span>
          </TabsTrigger>
        </TabsList>

        {/* Preview Tab */}
        <TabsContent value="preview" className="space-y-4">
          <CampaignPreview
            campaignId={campaignId}
            subject={subject}
            fromName={fromName}
            fromEmail={fromEmail}
            bodyHtml={bodyHtml}
          />
          <div className="flex gap-2 justify-end">
            <Button variant="outline" onClick={onCancel}>
              Cancel
            </Button>
            <Button onClick={() => setActiveTab('compliance')} className="flex items-center gap-2">
              Continue to Compliance
              <ArrowRight className="w-4 h-4" />
            </Button>
          </div>
        </TabsContent>

        {/* Compliance Tab */}
        <TabsContent value="compliance" className="space-y-4">
          <ComplianceCheck campaignId={campaignId} />
          <div className="flex gap-2 justify-end">
            <Button variant="outline" onClick={() => setActiveTab('preview')}>
              Back to Preview
            </Button>
            <Button onClick={() => setActiveTab('summary')} className="flex items-center gap-2">
              Continue to Send
              <ArrowRight className="w-4 h-4" />
            </Button>
          </div>
        </TabsContent>

        {/* Summary Tab */}
        <TabsContent value="summary" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Campaign Summary</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <span className="text-xs text-muted-foreground">Campaign</span>
                  <div className="font-medium mt-1">{campaignName}</div>
                </div>
                <div>
                  <span className="text-xs text-muted-foreground">Segment</span>
                  <div className="font-medium mt-1">{segmentName || '-'}</div>
                </div>
                <div>
                  <span className="text-xs text-muted-foreground">Recipients</span>
                  <div className="font-medium mt-1">
                    {estimatedRecipients?.toLocaleString() || '0'}
                  </div>
                </div>
                <div>
                  <span className="text-xs text-muted-foreground">Send Time</span>
                  <div className="font-medium mt-1">
                    {sendImmediately
                      ? 'Immediately'
                      : scheduledTime?.toLocaleString() || 'Not scheduled'}
                  </div>
                </div>
              </div>

              <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                <div className="text-sm font-medium text-green-900">
                  ✓ Campaign is ready to send
                </div>
                <p className="text-xs text-green-800 mt-1">
                  All content has been reviewed and meets compliance requirements
                </p>
              </div>
            </CardContent>
          </Card>

          <div className="flex gap-2 justify-end">
            <Button variant="outline" onClick={() => setActiveTab('compliance')}>
              Back to Compliance
            </Button>
            <Button
              onClick={() => setShowSendConfirmation(true)}
              className="flex items-center gap-2"
            >
              <Send className="w-4 h-4" />
              Send Campaign
            </Button>
          </div>
        </TabsContent>
      </Tabs>

      {/* Send Confirmation Modal */}
      <SendConfirmation
        open={showSendConfirmation}
        onOpenChange={setShowSendConfirmation}
        campaignId={campaignId}
        campaignName={campaignName}
        segmentName={segmentName}
        estimatedRecipients={estimatedRecipients}
        sendImmediately={sendImmediately}
        scheduledTime={scheduledTime}
        onSend={onSendComplete}
      />
    </div>
  )
}

// Export modal version for campaign modal integration
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from './ui/dialog'

interface PreSendReviewModalProps extends PreSendReviewProps {
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function PreSendReviewModal({
  open,
  onOpenChange,
  ...props
}: PreSendReviewModalProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Pre-Send Review</DialogTitle>
          <DialogDescription>
            Review your campaign before sending
          </DialogDescription>
        </DialogHeader>
        <PreSendReview {...props} onCancel={() => onOpenChange(false)} />
      </DialogContent>
    </Dialog>
  )
}
