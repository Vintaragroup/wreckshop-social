import { useEffect, useState } from "react";
import {
  Plus,
  Search,
  Music,
  Link,
  ExternalLink,
  MoreHorizontal,
  Edit,
  Trash2,
  Eye,
} from "lucide-react";
import { CreateReleaseModal } from "./create-release-modal";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "./ui/table";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "./ui/dropdown-menu";
 

type ReleaseDoc = {
  _id: string
  title: string
  isrc?: string
  upc?: string
  releaseDate?: string
  links?: Record<string, string>
  tags?: string[]
  createdAt?: string
}

export function ContentReleases() {
  const [items, setItems] = useState<ReleaseDoc[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  
  const [showCreateReleaseModal, setShowCreateReleaseModal] = useState(false);
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  async function loadReleases() {
    setLoading(true)
    setError(null)
    try {
      const res = await fetch('/api/releases')
      const json = await res.json()
      if (!res.ok) throw new Error(json?.error || `Failed to load releases (${res.status})`)
      setItems(json.data || [])
    } catch (e: any) {
      setError(e.message)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => { loadReleases() }, [])

  const filteredReleases = items.filter(r => {
    const matchesSearch = r.title.toLowerCase().includes(searchQuery.toLowerCase())
    // status/type not stored yet; keep filters as pass-through
    return matchesSearch
  })

  const handleGenerateSmartLink = (releaseId: string) => {
    console.log(`Generating smart link for release ${releaseId}`);
  };

  return (
    <>
      <CreateReleaseModal 
        open={showCreateReleaseModal} 
        onOpenChange={setShowCreateReleaseModal}
        onCreated={() => { setShowCreateReleaseModal(false); loadReleases() }}
      />
      
      <div className="space-y-6">
        {/* Page Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Releases</h1>
          <p className="text-muted-foreground">
            Manage music releases and track performance across platforms
          </p>
        </div>
        <Button onClick={() => setShowCreateReleaseModal(true)}>
          <Plus className="w-4 h-4 mr-2" />
          Add Release
        </Button>
      </div>

      {/* Stats Overview */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="text-2xl font-bold text-primary">{items.length}</div>
            <div className="text-sm text-muted-foreground">Total Releases</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="text-2xl font-bold text-accent">3.2B</div>
            <div className="text-sm text-muted-foreground">Total Streams</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="text-2xl font-bold text-warning">11</div>
            <div className="text-sm text-muted-foreground">Smart Links</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="text-2xl font-bold">$1.2M</div>
            <div className="text-sm text-muted-foreground">Total Revenue</div>
          </CardContent>
        </Card>
      </div>

      {/* Releases Table */}
      <Card>
        <CardHeader>
          <CardTitle>
            Releases {loading ? '(loading...)' : `(${filteredReleases.length})`}
            {error ? <span className="text-destructive text-xs ml-2">{error}</span> : null}
          </CardTitle>
        </CardHeader>
        <CardContent className="p-4 space-y-4">
          <div className="relative max-w-sm">
            <Search className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input
              className="pl-9"
              placeholder="Search releases by title..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Release</TableHead>
                <TableHead>Release Date</TableHead>
                <TableHead className="w-12"></TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredReleases.map((r) => (
                <TableRow key={r._id}>
                  <TableCell>
                    <div className="flex items-center space-x-3">
                      <div className="w-12 h-12 bg-muted rounded-lg flex items-center justify-center">
                        <Music className="w-6 h-6 text-muted-foreground" />
                      </div>
                      <div>
                        <div className="font-medium">{r.title}</div>
                        {r.isrc ? (
                          <div className="text-sm text-muted-foreground">ISRC: {r.isrc}</div>
                        ) : null}
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>
                    {r.releaseDate ? new Date(r.releaseDate).toLocaleDateString() : '-'}
                  </TableCell>
                  <TableCell>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="sm">
                          <MoreHorizontal className="w-4 h-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem>
                          <Eye className="w-4 h-4 mr-2" />
                          View Details
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => handleGenerateSmartLink(r._id)}>
                          <Link className="w-4 h-4 mr-2" />
                          Generate Smart Link
                        </DropdownMenuItem>
                        <DropdownMenuItem>
                          <Edit className="w-4 h-4 mr-2" />
                          Edit Release
                        </DropdownMenuItem>
                        <DropdownMenuItem>
                          <ExternalLink className="w-4 h-4 mr-2" />
                          View on Platforms
                        </DropdownMenuItem>
                        <DropdownMenuItem className="text-destructive">
                          <Trash2 className="w-4 h-4 mr-2" />
                          Delete
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              ))}
              {!loading && filteredReleases.length === 0 && (
                <TableRow>
                  <TableCell colSpan={3}>
                    <div className="p-8 text-center">
                      <h3 className="text-lg font-medium mb-2">Create your first release</h3>
                      <p className="text-muted-foreground mb-4">
                        Create your first release or connect a current release to improve outreach.
                      </p>
                      <Button onClick={() => setShowCreateReleaseModal(true)}>
                        <Plus className="w-4 h-4 mr-2" />
                        Add Release
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
    </>
  );
}