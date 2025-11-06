import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "./ui/dialog";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { Checkbox } from "./ui/checkbox";
import { Button } from "./ui/button";

interface CreateContactModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onCreated?: (contact: any) => void;
}

export default function CreateContactModal({ open, onOpenChange, onCreated }: CreateContactModalProps) {
  const [displayName, setDisplayName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [consentEmail, setConsentEmail] = useState(true);
  const [consentSms, setConsentSms] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const reset = () => {
    setDisplayName("");
    setEmail("");
    setPhone("");
    setConsentEmail(true);
    setConsentSms(false);
    setError(null);
  };

  const handleClose = () => {
    if (!submitting) {
      reset();
      onOpenChange(false);
    }
  };

  const handleCreate = async () => {
    setSubmitting(true);
    setError(null);
    try {
      const payload: any = {
        displayName: displayName || undefined,
        email: email || undefined,
        phone: phone || undefined,
        consent: { email: consentEmail, sms: consentSms },
      };
      const res = await fetch('/api/audience/contacts', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });
      const json = await res.json();
      if (!res.ok) throw new Error(json?.error || 'Failed to create contact');
      onCreated?.(json.data);
      reset();
      onOpenChange(false);
    } catch (e: any) {
      setError(e.message);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Add Audience Contact</DialogTitle>
          <DialogDescription>Store an email/phone with consent flags to reach fans via owned channels.</DialogDescription>
        </DialogHeader>
        <div className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="displayName">Display name</Label>
              <Input id="displayName" value={displayName} onChange={(e) => setDisplayName(e.target.value)} placeholder="e.g., Sarah Johnson" />
            </div>
            <div>
              <Label htmlFor="email">Email</Label>
              <Input id="email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="email@example.com" />
            </div>
            <div>
              <Label htmlFor="phone">Phone</Label>
              <Input id="phone" value={phone} onChange={(e) => setPhone(e.target.value)} placeholder="+1 555 123 4567" />
            </div>
            <div className="flex items-center gap-4 mt-6">
              <div className="flex items-center gap-2">
                <Checkbox id="consentEmail" checked={consentEmail} onCheckedChange={(v) => setConsentEmail(Boolean(v))} />
                <Label htmlFor="consentEmail">Email consent</Label>
              </div>
              <div className="flex items-center gap-2">
                <Checkbox id="consentSms" checked={consentSms} onCheckedChange={(v) => setConsentSms(Boolean(v))} />
                <Label htmlFor="consentSms">SMS consent</Label>
              </div>
            </div>
          </div>
          {error && <div className="text-sm text-destructive">{error}</div>}
        </div>
        <DialogFooter>
          <Button variant="ghost" onClick={handleClose} disabled={submitting}>Cancel</Button>
          <Button onClick={handleCreate} disabled={submitting}>Create</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
