import { useEffect, useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "./ui/dialog";
import { Badge } from "./ui/badge";
import { apiUrl } from "../lib/api";

type JourneyAnalyticsData = {
  journeyId: string;
  journeyName: string;
  status: string;
  contactsEntered: number;
  contactsCompleted: number;
  completionRate: string;
  estimatedRevenue: number;
  stepMetrics?: Array<{ stepId: string; entered: number; completed: number; dropped: number }>;
}

type JourneyAnalyticsModalProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  journey: { _id: string; name: string; status: string } | null;
}

export function JourneyAnalyticsModal({ open, onOpenChange, journey }: JourneyAnalyticsModalProps) {
  const [analytics, setAnalytics] = useState<JourneyAnalyticsData | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!open || !journey?._id) return;

    let aborted = false;

    async function load() {
      setLoading(true);
      setError(null);
      try {
        const res = await fetch(apiUrl(`/journeys/${journey!._id}/analytics`), {
          credentials: 'include',
        });
        if (!res.ok) throw new Error(`Failed to load analytics (${res.status})`);
        const json = await res.json();
        if (!aborted) setAnalytics(json.data);
      } catch (e: any) {
        if (!aborted) setError(e?.message || 'Failed to load analytics');
      } finally {
        if (!aborted) setLoading(false);
      }
    }

    load();
    return () => { aborted = true };
  }, [open, journey?._id]);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>
            Analytics · {journey?.name || 'Journey'}{' '}
            {journey && (<Badge variant="outline" className="ml-2 text-xs">{journey.status}</Badge>)}
          </DialogTitle>
        </DialogHeader>

        {loading && (
          <div className="text-sm text-muted-foreground text-center py-8">Loading analytics…</div>
        )}

        {error && (
          <div className="text-sm text-destructive text-center py-4">{error}</div>
        )}

        {analytics && (
          <>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div className="rounded-md border p-4">
                <div className="text-xs text-muted-foreground">Contacts Entered</div>
                <div className="text-2xl font-semibold">{analytics.contactsEntered.toLocaleString()}</div>
              </div>
              <div className="rounded-md border p-4">
                <div className="text-xs text-muted-foreground">Completed</div>
                <div className="text-2xl font-semibold">{analytics.contactsCompleted.toLocaleString()}</div>
              </div>
              <div className="rounded-md border p-4">
                <div className="text-xs text-muted-foreground">Completion Rate</div>
                <div className="text-2xl font-semibold">{analytics.completionRate}%</div>
              </div>
            </div>

            {analytics.stepMetrics && analytics.stepMetrics.length > 0 && (
              <div className="mt-6 border rounded-md p-4">
                <h3 className="text-sm font-semibold mb-3">Step Performance</h3>
                <div className="space-y-2 text-sm">
                  {analytics.stepMetrics.map((m, idx) => (
                    <div key={idx} className="flex justify-between items-center">
                      <span className="text-muted-foreground">Step {idx + 1}</span>
                      <span className="font-medium">
                        {m.entered} entered, {m.completed} completed, {m.dropped} dropped
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </>
        )}

        {!loading && !error && !analytics && (
          <div className="text-sm text-muted-foreground">No analytics data available yet.</div>
        )}
      </DialogContent>
    </Dialog>
  )
}
