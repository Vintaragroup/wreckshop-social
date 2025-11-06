import { useEffect, useMemo, useState } from "react";
import { Plus, Search, Link, Copy, QrCode, MoreHorizontal, Edit, Trash2, Eye } from "lucide-react";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Badge } from "./ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "./ui/table";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "./ui/dropdown-menu";

type CaptureLink = {
  slug: string
  title: string
  description?: string
  allowedChannels?: string[]
  tags?: string[]
  redirectUrl?: string
  disabled?: boolean
  stats?: { visits?: number; submissions?: number }
  createdAt?: string
}

export function ContentAssets() {
  const [searchQuery, setSearchQuery] = useState("");
  const [links, setLinks] = useState<CaptureLink[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [isError, setIsError] = useState<string | null>(null)

  const fetchLinks = async () => {
    setIsLoading(true)
    setIsError(null)
    try {
      const res = await fetch('/api/audience/capture-links?limit=100', { credentials: 'include' })
      if (!res.ok) throw new Error(`${res.status} ${res.statusText}`)
      const json = await res.json()
      setLinks(json?.data ?? [])
    } catch (e: any) {
      console.error('Failed to load links', e)
      setIsError(e?.message || 'Failed to load')
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    fetchLinks()
  }, [])

  const filtered = useMemo(() => {
    const q = searchQuery.toLowerCase()
    return links.filter(l =>
      (l.title?.toLowerCase().includes(q) ?? false) ||
      (l.slug?.toLowerCase().includes(q) ?? false) ||
      (l.tags || []).some(t => t.toLowerCase().includes(q))
    )
  }, [links, searchQuery])
  
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Assets & Links</h1>
          <p className="text-muted-foreground">Manage smart links and digital assets</p>
        </div>
        <Button><Plus className="w-4 h-4 mr-2" />Create Smart Link</Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card><CardContent className="p-4"><div className="text-2xl font-bold text-primary">{links.length}</div><div className="text-sm text-muted-foreground">Total Links</div></CardContent></Card>
        <Card><CardContent className="p-4"><div className="text-2xl font-bold text-accent">{links.reduce((s, l) => s + (l.stats?.visits || 0), 0).toLocaleString()}</div><div className="text-sm text-muted-foreground">Total Clicks</div></CardContent></Card>
        <Card><CardContent className="p-4"><div className="text-2xl font-bold text-warning">—</div><div className="text-sm text-muted-foreground">Avg. CTR</div></CardContent></Card>
        <Card><CardContent className="p-4"><div className="text-2xl font-bold">—</div><div className="text-sm text-muted-foreground">Revenue Tracked</div></CardContent></Card>
      </div>

      <Card>
        <CardHeader><CardTitle>Smart Links ({filtered.length})</CardTitle></CardHeader>
        <CardContent>
          <div className="mb-4">
            <div className="relative max-w-md">
              <Input placeholder="Search by title, slug, or tag…" value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} className="pl-10" />
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">🔎</span>
            </div>
          </div>
          {isLoading && <div className="text-sm text-muted-foreground p-4">Loading links…</div>}
          {isError && <div className="text-sm text-destructive p-4">Failed to load links: {isError}</div>}
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Title</TableHead>
                <TableHead>Slug</TableHead>
                <TableHead>Tags</TableHead>
                <TableHead>Clicks</TableHead>
                <TableHead>Created</TableHead>
                <TableHead className="w-12"></TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {!isLoading && !isError && filtered.map((l) => (
                <TableRow key={l.slug}>
                  <TableCell><div className="font-medium">{l.title}</div></TableCell>
                  <TableCell>
                    <div className="flex items-center space-x-2">
                      <code className="text-sm bg-muted px-2 py-1 rounded">wreck.sh/{l.slug}</code>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={async () => {
                          try {
                            const url = `${window.location.origin}/c/${l.slug}`
                            await navigator.clipboard.writeText(url)
                          } catch (e) {
                            console.error('Failed to copy', e)
                          }
                        }}
                        aria-label="Copy link"
                        title="Copy link"
                      >
                        <Copy className="w-4 h-4" />
                      </Button>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex flex-wrap gap-1">
                      {(l.tags || []).map((t) => (<Badge key={t} variant="outline">{t}</Badge>))}
                      {l.redirectUrl && (<Badge variant="secondary">redirect</Badge>)}
                    </div>
                  </TableCell>
                  <TableCell className="font-medium">{(l.stats?.visits || 0).toLocaleString()}</TableCell>
                  <TableCell className="text-sm text-muted-foreground">{l.createdAt ? new Date(l.createdAt).toLocaleDateString() : '—'}</TableCell>
                  <TableCell>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild><Button variant="ghost" size="sm"><MoreHorizontal className="w-4 h-4" /></Button></DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem><Eye className="w-4 h-4 mr-2" />Analytics</DropdownMenuItem>
                        <DropdownMenuItem onClick={() => window.open(`/api/audience/capture-links/${l.slug}/qr?size=512`, '_blank')}><QrCode className="w-4 h-4 mr-2" />QR Code</DropdownMenuItem>
                        <DropdownMenuItem><Edit className="w-4 h-4 mr-2" />Edit</DropdownMenuItem>
                        <DropdownMenuItem className="text-destructive"><Trash2 className="w-4 h-4 mr-2" />Delete</DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              ))}
              {!isLoading && !isError && filtered.length === 0 && (
                <TableRow>
                  <TableCell colSpan={6}>
                    <div className="p-8 text-center text-sm text-muted-foreground">
                      No smart links yet. Create your first link to start tracking clicks.
                    </div>
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}