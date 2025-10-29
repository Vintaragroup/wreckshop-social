import { Badge } from './ui/badge'
import { Check, Loader2, X, Clock } from 'lucide-react'

export type IngestStatus = 'idle' | 'pending' | 'success' | 'error'

export function IngestStatusBadge({ status }: { status: IngestStatus }) {
  if (status === 'idle') {
    return (
      <Badge variant="outline" className="gap-1" aria-label="Ingest status: idle">
        <Clock className="h-3 w-3" /> Idle
      </Badge>
    )
  }
  if (status === 'pending') {
    return (
      <Badge className="gap-1 bg-primary text-primary-foreground" aria-live="polite" aria-label="Ingest status: pending">
        <Loader2 className="h-3 w-3 animate-spin" /> Ingesting
      </Badge>
    )
  }
  if (status === 'success') {
    return (
      <Badge className="gap-1 bg-emerald-600 text-emerald-50" aria-label="Ingest status: success">
        <Check className="h-3 w-3" /> Queued
      </Badge>
    )
  }
  return (
    <Badge className="gap-1 bg-destructive text-destructive-foreground" aria-label="Ingest status: error">
      <X className="h-3 w-3" /> Failed
    </Badge>
  )
}
