import { Dialog, DialogContent, DialogHeader, DialogTitle } from "./ui/dialog";
import { Badge } from "./ui/badge";

type JourneyAnalyticsModalProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  journey: { _id: string; name: string; status: string } | null;
}

export function JourneyAnalyticsModal({ open, onOpenChange, journey }: JourneyAnalyticsModalProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>
            Analytics · {journey?.name || 'Journey'}{' '}
            {journey && (<Badge variant="outline" className="ml-2 text-xs">{journey.status}</Badge>)}
          </DialogTitle>
        </DialogHeader>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="rounded-md border p-4">
            <div className="text-xs text-muted-foreground">Contacts Entered</div>
            <div className="text-2xl font-semibold">—</div>
          </div>
          <div className="rounded-md border p-4">
            <div className="text-xs text-muted-foreground">Completed</div>
            <div className="text-2xl font-semibold">—</div>
          </div>
          <div className="rounded-md border p-4">
            <div className="text-xs text-muted-foreground">Revenue</div>
            <div className="text-2xl font-semibold">—</div>
          </div>
        </div>
        <div className="mt-4 text-sm text-muted-foreground">
          Detailed analytics will appear here once tracking endpoints are wired.
        </div>
      </DialogContent>
    </Dialog>
  )
}
