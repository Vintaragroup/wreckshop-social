import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../../components/ui/card";
import { Input } from "../../components/ui/input";
import { Button } from "../../components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "../../components/ui/table";
import { Badge } from "../../components/ui/badge";
import CreateContactModal from "../../components/create-contact-modal";
import { Plug, Megaphone, UserPlus, Users, Rocket, ChevronRight, ChevronDown, Link as LinkIcon, Copy, ExternalLink, QrCode, Trash2 } from "lucide-react";
import { toast } from "sonner";
import CreateCaptureLinkModal from "../../components/create-capture-link-modal";
import { Label } from "../../components/ui/label";

interface AudienceContact {
  _id: string;
  displayName?: string;
  email?: string;
  phone?: string;
  consent?: {
    email?: boolean;
    sms?: boolean;
  };
  tags?: string[];
  createdAt?: string;
}

type FunnelStepProps = { label: string; icon: React.ReactNode; sub?: string };
function FunnelStep({ label, icon, sub }: FunnelStepProps) {
  return (
    <div className="rounded-md border bg-card px-4 py-3 shadow-sm flex items-start gap-3 min-w-[180px]">
      <div className="mt-0.5 text-primary">{icon}</div>
      <div>
        <div className="font-medium leading-none">{label}</div>
        {sub ? (
          <div className="text-xs text-muted-foreground mt-1">{sub}</div>
        ) : null}
      </div>
    </div>
  );
}

export default function AudienceContactsPage() {
  const [contacts, setContacts] = useState<AudienceContact[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [query, setQuery] = useState("");
  const [openCreate, setOpenCreate] = useState(false);
  const navigate = useNavigate();
  const [lastCaptureUrl, setLastCaptureUrl] = useState<string | null>(null)
  const [openCreateLink, setOpenCreateLink] = useState(false)
  const [links, setLinks] = useState<any[]>([])

  const loadContacts = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch('/api/audience/contacts');
      const json = await res.json();
      if (!res.ok) throw new Error(json?.error || 'Failed to load contacts');
      setContacts(Array.isArray(json?.data) ? json.data : (json?.data?.items || []));
    } catch (e: any) {
      setError(e.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadContacts();
  }, []);

  const loadLinks = async () => {
    try {
      const res = await fetch('/api/audience/capture-links?limit=10')
      const json = await res.json()
      if (!res.ok) throw new Error(json?.error || 'Failed to load capture links')
      setLinks(Array.isArray(json?.data) ? json.data : [])
    } catch (e: any) {
      // silent
    }
  }

  useEffect(() => { loadLinks() }, [])

  const filtered = useMemo(() => {
    if (!query) return contacts;
    const q = query.toLowerCase();
    return contacts.filter((c) =>
      (c.displayName || '').toLowerCase().includes(q) ||
      (c.email || '').toLowerCase().includes(q) ||
      (c.phone || '').toLowerCase().includes(q)
    );
  }, [contacts, query]);

  return (
    <div className="p-4 md:p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight">Audience contacts</h1>
          <p className="text-sm text-muted-foreground">Manage owned-channel contacts and consent for email/SMS campaigns.</p>
        </div>
        <Button onClick={() => setOpenCreate(true)}>Add contact</Button>
      </div>

      <Card>
        <CardHeader className="gap-2">
          <CardTitle>Grow your direct fan connections</CardTitle>
          <CardDescription>Follow this funnel to convert platform followers into compliant, owned email/SMS contacts.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Horizontal flow for md+; vertical for small screens */}
          <div className="hidden md:flex items-center justify-between gap-2">
            <FunnelStep label="Connect platforms" icon={<Plug className="h-4 w-4" />} sub="Spotify, Instagram, YouTube, TikTok" />
            <ChevronRight className="h-5 w-5 text-muted-foreground" />
            <FunnelStep label="Promote capture link" icon={<Megaphone className="h-4 w-4" />} sub="Bio, posts, stories, live" />
            <ChevronRight className="h-5 w-5 text-muted-foreground" />
            <FunnelStep label="Fans opt-in" icon={<UserPlus className="h-4 w-4" />} sub="Email and/or SMS consent" />
            <ChevronRight className="h-5 w-5 text-muted-foreground" />
            <FunnelStep label="Contacts grow" icon={<Users className="h-4 w-4" />} sub="Segment with tags & taste" />
            <ChevronRight className="h-5 w-5 text-muted-foreground" />
            <FunnelStep label="Run campaigns" icon={<Rocket className="h-4 w-4" />} sub="Email • SMS" />
          </div>
          <div className="md:hidden grid gap-2">
            <FunnelStep label="Connect platforms" icon={<Plug className="h-4 w-4" />} sub="Spotify, Instagram, YouTube, TikTok" />
            <ChevronDown className="h-5 w-5 mx-auto text-muted-foreground" />
            <FunnelStep label="Promote capture link" icon={<Megaphone className="h-4 w-4" />} sub="Bio, posts, stories, live" />
            <ChevronDown className="h-5 w-5 mx-auto text-muted-foreground" />
            <FunnelStep label="Fans opt-in" icon={<UserPlus className="h-4 w-4" />} sub="Email and/or SMS consent" />
            <ChevronDown className="h-5 w-5 mx-auto text-muted-foreground" />
            <FunnelStep label="Contacts grow" icon={<Users className="h-4 w-4" />} sub="Segment with tags & taste" />
            <ChevronDown className="h-5 w-5 mx-auto text-muted-foreground" />
            <FunnelStep label="Run campaigns" icon={<Rocket className="h-4 w-4" />} sub="Email • SMS" />
          </div>

          <div className="flex flex-wrap items-center gap-2 pt-2">
            <Button variant="default" onClick={() => navigate('/integrations')}>
              Connect platforms
            </Button>
            <Button variant="default" onClick={() => setOpenCreateLink(true)}>
              <span className="inline-flex items-center gap-2"><LinkIcon className="h-4 w-4" /> Generate capture link</span>
            </Button>
            {lastCaptureUrl ? (
              <Button variant="secondary" onClick={async () => { await navigator.clipboard.writeText(lastCaptureUrl!); toast.success('Copied'); }}>
                <span className="inline-flex items-center gap-2"><Copy className="h-4 w-4" /> Copy last link</span>
              </Button>
            ) : null}
            <Button variant="secondary" onClick={() => setOpenCreate(true)}>
              Add contact manually
            </Button>
            <Button variant="outline" onClick={() => navigate('/campaigns/email')}>
              Create email campaign
            </Button>
            <Button variant="outline" onClick={() => navigate('/campaigns/sms')}>
              Create SMS campaign
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Recent capture links */}
      <Card>
        <CardHeader className="gap-2">
          <CardTitle>Capture links</CardTitle>
          <CardDescription>Shareable links for collecting compliant opt-ins.</CardDescription>
        </CardHeader>
        <CardContent>
          {links.length === 0 ? (
            <div className="text-sm text-muted-foreground">No links yet. Generate one above.</div>
          ) : (
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Title / Slug</TableHead>
                    <TableHead>Channels</TableHead>
                    <TableHead>Tags / Redirect</TableHead>
                    <TableHead>Stats</TableHead>
                    <TableHead>Created</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {links.map((l) => {
                    const url = `${window.location.origin}/c/${l.slug}`
                    return (
                      <TableRow key={l._id || l.slug}>
                        <TableCell>
                          <div className="font-medium">{l.title || 'Untitled'}</div>
                          <div className="text-xs text-muted-foreground">/{l.slug}</div>
                        </TableCell>
                        <TableCell>
                          <div className="flex gap-2 text-xs">
                            {Array.isArray(l.allowedChannels) && l.allowedChannels.includes('email') ? <Badge>Email</Badge> : null}
                            {Array.isArray(l.allowedChannels) && l.allowedChannels.includes('sms') ? <Badge>SMS</Badge> : null}
                          </div>
                        </TableCell>
                        <TableCell className="text-sm">
                          <div className="flex flex-wrap gap-1 mb-1">
                            {(l.tags || []).slice(0, 5).map((t: string) => (
                              <Badge key={t} variant="secondary">{t}</Badge>
                            ))}
                            {Array.isArray(l.tags) && l.tags.length > 5 ? (
                              <span className="text-xs text-muted-foreground">+{l.tags.length - 5} more</span>
                            ) : null}
                          </div>
                          {l.redirectUrl ? (
                            <a href={l.redirectUrl} target="_blank" rel="noreferrer" className="text-xs text-blue-500 underline break-all">{l.redirectUrl}</a>
                          ) : (
                            <span className="text-xs text-muted-foreground">No redirect</span>
                          )}
                        </TableCell>
                        <TableCell className="text-sm">
                          {(l.stats?.visits ?? 0)} visits • {(l.stats?.submissions ?? 0)} submissions
                        </TableCell>
                        <TableCell className="text-sm">
                          <div className="flex items-center gap-2">
                            {l.disabled ? <Badge variant="destructive">Disabled</Badge> : null}
                            <span>{l.createdAt ? new Date(l.createdAt).toLocaleString() : '—'}</span>
                          </div>
                        </TableCell>
                        <TableCell className="text-right">
                          <div className="inline-flex gap-2">
                            <Button variant="secondary" size="sm" onClick={async () => { await navigator.clipboard.writeText(url); toast.success('Link copied') }}>
                              <Copy className="h-4 w-4" />
                            </Button>
                            <Button variant="outline" size="sm" asChild>
                              <a href={url} target="_blank" rel="noreferrer">
                                <ExternalLink className="h-4 w-4" />
                              </a>
                            </Button>
                            <Button variant="outline" size="sm" asChild>
                              <a href={`/api/audience/capture-links/${l.slug}/qr?size=512`} target="_blank" rel="noreferrer">
                                <QrCode className="h-4 w-4" />
                              </a>
                            </Button>
                            <Button
                              variant={l.disabled ? 'default' : 'outline'}
                              size="sm"
                              onClick={async () => {
                                try {
                                  const res = await fetch(`/api/audience/capture-links/${l.slug}`, {
                                    method: 'PATCH',
                                    headers: { 'Content-Type': 'application/json' },
                                    body: JSON.stringify({ disabled: !l.disabled }),
                                  })
                                  const json = await res.json()
                                  if (!res.ok) throw new Error(json?.error || 'Failed to update link')
                                  toast.success(json.data.disabled ? 'Link disabled' : 'Link enabled')
                                  loadLinks()
                                } catch (e: any) {
                                  toast.error('Update failed', { description: e.message })
                                }
                              }}
                            >
                              {l.disabled ? 'Enable' : 'Disable'}
                            </Button>
                            <Button
                              variant="destructive"
                              size="sm"
                              onClick={async () => {
                                if (!window.confirm('Delete this capture link? This cannot be undone.')) return
                                try {
                                  const res = await fetch(`/api/audience/capture-links/${l.slug}`, { method: 'DELETE' })
                                  const json = await res.json().catch(() => ({}))
                                  if (!res.ok) throw new Error(json?.error || 'Failed to delete link')
                                  toast.success('Link deleted')
                                  loadLinks()
                                } catch (e: any) {
                                  toast.error('Delete failed', { description: e.message })
                                }
                              }}
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    )
                  })}
                </TableBody>
              </Table>
            </div>
          )}
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="gap-2">
          <CardTitle>Contacts</CardTitle>
          <CardDescription>Search and manage your audience contacts.</CardDescription>
          <div className="w-full md:max-w-sm">
            <Input placeholder="Search by name, email, or phone" value={query} onChange={(e) => setQuery(e.target.value)} />
          </div>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="text-sm text-muted-foreground">Loading contacts…</div>
          ) : error ? (
            <div className="text-sm text-destructive">{error}</div>
          ) : filtered.length === 0 ? (
            <div className="text-sm text-muted-foreground">No contacts found.</div>
          ) : (
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Name</TableHead>
                    <TableHead>Email</TableHead>
                    <TableHead>Phone</TableHead>
                    <TableHead>Consent</TableHead>
                    <TableHead>Created</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filtered.map((c) => (
                    <TableRow key={c._id}>
                      <TableCell className="font-medium">{c.displayName || '—'}</TableCell>
                      <TableCell>{c.email || '—'}</TableCell>
                      <TableCell>{c.phone || '—'}</TableCell>
                      <TableCell>
                        <div className="flex gap-2">
                          <Badge variant={c.consent?.email ? 'default' : 'secondary'}>Email {c.consent?.email ? 'yes' : 'no'}</Badge>
                          <Badge variant={c.consent?.sms ? 'default' : 'secondary'}>SMS {c.consent?.sms ? 'yes' : 'no'}</Badge>
                        </div>
                      </TableCell>
                      <TableCell>{c.createdAt ? new Date(c.createdAt).toLocaleString() : '—'}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          )}
        </CardContent>
      </Card>

      <CreateContactModal
        open={openCreate}
        onOpenChange={setOpenCreate}
        onCreated={() => {
          loadContacts();
        }}
      />

      <CreateCaptureLinkModal
        open={openCreateLink}
        onOpenChange={setOpenCreateLink}
        onCreated={({ url }) => {
          setLastCaptureUrl(url)
          loadLinks()
        }}
      />
    </div>
  );
}
