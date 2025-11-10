import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from './ui/dialog'
import { CampaignAnalytics } from './campaign-analytics'

interface CampaignAnalyticsModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  campaignId: string
  campaignName: string
}

export function CampaignAnalyticsModal({
  open,
  onOpenChange,
  campaignId,
  campaignName,
}: CampaignAnalyticsModalProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-6xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Campaign Analytics</DialogTitle>
          <DialogDescription>
            View detailed performance metrics and engagement data
          </DialogDescription>
        </DialogHeader>
        <CampaignAnalytics campaignId={campaignId} campaignName={campaignName} />
      </DialogContent>
    </Dialog>
  )
}
