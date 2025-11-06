import { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "./ui/dialog";
import { Label } from "./ui/label";
import { Input } from "./ui/input";
import { Button } from "./ui/button";
import { Textarea } from "./ui/textarea";
import { toast } from "sonner";
import { apiUrl } from "../lib/api";

interface SegmentGroup {
  id: string;
  rules: Array<{
    id: string;
    field: string;
    operator: string;
    value: string;
    connector?: "AND" | "OR";
  }>;
  connector?: "AND" | "OR";
}

interface SaveSegmentModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  segmentName: string;
  segmentDescription: string;
  groups: SegmentGroup[];
  estimatedSize: number;
  onSaved?: (segment: any) => void;
}

export function SaveSegmentModal({
  open,
  onOpenChange,
  segmentName,
  segmentDescription,
  groups,
  estimatedSize,
  onSaved,
}: SaveSegmentModalProps) {
  const [name, setName] = useState(segmentName);
  const [description, setDescription] = useState(segmentDescription);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Update local state when props change
  useEffect(() => {
    setName(segmentName);
    setDescription(segmentDescription);
    setError(null);
  }, [segmentName, segmentDescription, open]);

  async function save() {
    // Validation
    if (!name.trim()) {
      setError("Segment name is required");
      toast.error("Please enter a segment name");
      return;
    }

    // Validate at least one rule exists
    const hasRules = groups.some((g) => g.rules.some((r) => r.field && r.operator && r.value));
    if (!hasRules) {
      setError("At least one rule is required");
      toast.error("Please add at least one filter rule");
      return;
    }

    setSaving(true);
    setError(null);

    try {
      const payload = {
        name: name.trim(),
        description: description.trim(),
        filters: groups,
        estimatedCount: estimatedSize,
      };

      const res = await fetch(apiUrl("/segments"), {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify(payload),
      });

      if (!res.ok) {
        const errData = await res.json();
        throw new Error(errData.error || `Save failed (${res.status})`);
      }

      const json = await res.json();
      toast.success(`Segment "${name}" saved successfully`);
      onSaved?.(json.data);
      onOpenChange(false);
      
      // Reset form
      setName("");
      setDescription("");
      setError(null);
    } catch (e) {
      const message = (e as any)?.message || "Failed to save segment";
      setError(message);
      console.error("Save segment error:", e);
      toast.error(message);
    } finally {
      setSaving(false);
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>Save Segment</DialogTitle>
          <DialogDescription>
            Save this audience segment for use in journeys and campaigns
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          {/* Segment Preview */}
          <div className="rounded-md bg-muted/50 p-4">
            <div className="text-sm font-medium mb-2">Segment Summary</div>
            <div className="text-sm space-y-1 text-muted-foreground">
              <div>
                <span className="font-medium">Estimated Users:</span>{" "}
                {estimatedSize.toLocaleString()}
              </div>
              <div>
                <span className="font-medium">Rules:</span>{" "}
                {groups.reduce((total, g) => total + g.rules.length, 0)} condition
                {groups.reduce((total, g) => total + g.rules.length, 0) !== 1 ? "s" : ""}
              </div>
            </div>
          </div>

          {/* Error Display */}
          {error && (
            <div className="rounded-md bg-destructive/10 p-3 text-sm text-destructive">
              {error}
            </div>
          )}

          {/* Name Input */}
          <div>
            <Label htmlFor="save-name">Segment Name *</Label>
            <Input
              id="save-name"
              placeholder="e.g., Hip-Hop Superfans"
              value={name}
              onChange={(e) => {
                setName(e.target.value);
                setError(null);
              }}
              disabled={saving}
              className="mt-1"
            />
            <p className="text-xs text-muted-foreground mt-1">
              Give this segment a descriptive name for easy identification
            </p>
          </div>

          {/* Description Input */}
          <div>
            <Label htmlFor="save-description">Description</Label>
            <Textarea
              id="save-description"
              placeholder="Optional description of this segment's purpose and characteristics"
              value={description}
              onChange={(e) => {
                setDescription(e.target.value);
                setError(null);
              }}
              disabled={saving}
              className="mt-1 resize-none"
              rows={3}
            />
            <p className="text-xs text-muted-foreground mt-1">
              Helps your team understand when to use this segment
            </p>
          </div>

          {/* Info Box */}
          <div className="rounded-md bg-blue-50 dark:bg-blue-950/30 p-3 text-sm text-blue-900 dark:text-blue-100">
            <div className="font-medium mb-1">This segment will be available for:</div>
            <ul className="list-disc list-inside space-y-1 text-xs">
              <li>Targeting in journey creation</li>
              <li>Targeting in email campaigns</li>
              <li>Targeting in SMS campaigns</li>
              <li>Audience analysis and export</li>
            </ul>
          </div>
        </div>

        {/* Actions */}
        <div className="flex justify-end gap-2 pt-4 border-t">
          <Button
            variant="ghost"
            onClick={() => onOpenChange(false)}
            disabled={saving}
          >
            Cancel
          </Button>
          <Button
            onClick={save}
            disabled={!name.trim() || saving}
          >
            {saving ? "Saving..." : "Save Segment"}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
