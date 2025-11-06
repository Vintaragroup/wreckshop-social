import { useEffect, useState } from "react";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "./ui/dialog";
import { Label } from "./ui/label";
import { Input } from "./ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./ui/select";
import { Button } from "./ui/button";
import { toast } from "sonner";

type JourneyStep = {
  id: string;
  type: 'trigger' | 'delay' | 'condition' | 'email' | 'sms' | 'branch' | 'exit' | 'webhook';
  name?: string;
  config?: any;
};

export type JourneyDoc = {
  _id: string;
  name: string;
  description?: string;
  status: 'draft' | 'active' | 'paused';
  segmentId?: string;
  triggerKey?: string;
  steps: JourneyStep[];
  createdAt?: string;
  updatedAt?: string;
};

interface EditJourneyModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  journey: JourneyDoc | null;
  onSaved?: (j: JourneyDoc) => void;
}

export function EditJourneyModal({ open, onOpenChange, journey, onSaved }: EditJourneyModalProps) {
  const isDraft = journey?.status === 'draft';
  const [name, setName] = useState("");
  const [triggerKey, setTriggerKey] = useState("");
  const [segmentId, setSegmentId] = useState<string>("");
  const [segments, setSegments] = useState<Array<{ _id: string; name: string; estimatedCount?: number }>>([]);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    setName(journey?.name || "");
    setTriggerKey(journey?.triggerKey || "");
    setSegmentId(journey?.segmentId || "");
  }, [journey]);

  useEffect(() => {
    let aborted = false;
    async function load() {
      try {
        const res = await fetch('/api/segments', { credentials: 'include' });
        if (!res.ok) throw new Error('failed to load segments');
        const json = await res.json();
        if (!aborted) setSegments(json.data || []);
      } catch {
        // ignore
      }
    }
    if (open) load();
    return () => { aborted = true };
  }, [open]);

  async function save() {
    if (!journey) return;
    setSaving(true);
    try {
      const body = { name, triggerKey, segmentId: segmentId || undefined };
      const res = await fetch(`/api/journeys/${journey._id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify(body),
      });
      if (!res.ok) throw new Error(`save failed (${res.status})`);
      const json = await res.json();
      toast.success('Journey updated');
      onSaved?.(json.data);
      onOpenChange(false);
    } catch (e) {
      // surface later
      console.error(e);
      toast.error((e as any)?.message || 'Failed to save journey');
    } finally {
      setSaving(false);
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-lg">
        <DialogHeader>
          <DialogTitle>Edit Journey</DialogTitle>
          <DialogDescription>Update basic settings for this journey</DialogDescription>
        </DialogHeader>
        <div className="space-y-3">
          <div>
            <Label>Name</Label>
            <Input value={name} onChange={(e) => setName(e.target.value)} disabled={!isDraft} />
          </div>
          <div>
            <Label>Trigger</Label>
            <Select value={triggerKey} onValueChange={setTriggerKey}>
              <SelectTrigger disabled={!isDraft}>
                <SelectValue placeholder="Select trigger" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="new-subscriber">New Subscriber</SelectItem>
                <SelectItem value="first-stream">First Stream</SelectItem>
                <SelectItem value="inactive-30">Inactive 30 Days</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div>
            <Label>Target Segment</Label>
            <Select value={segmentId} onValueChange={setSegmentId}>
              <SelectTrigger>
                <SelectValue placeholder="Select segment" />
              </SelectTrigger>
              <SelectContent>
                {segments.map((s) => (
                  <SelectItem key={s._id} value={s._id}>
                    {s.name}{s.estimatedCount !== undefined ? ` (${s.estimatedCount.toLocaleString()})` : ''}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>
        <div className="flex justify-end gap-2 pt-2">
          <Button variant="ghost" onClick={() => onOpenChange(false)}>Cancel</Button>
          <Button onClick={save} disabled={!isDraft || saving}>Save</Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}
