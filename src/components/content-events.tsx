import { useEffect, useMemo, useState } from "react";
import {
  Plus,
  Search,
  Calendar,
  MapPin,
  Users,
  ExternalLink,
  MoreHorizontal,
  Edit,
  Trash2,
  Eye,
  Link,
  RefreshCw,
} from "lucide-react";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Badge } from "./ui/badge";
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
import { CreateEventModal } from "./create-event-modal";
// Events will be wired to a live API in a follow-up; start with empty state
type EventRow = {
  id: string | number
  title: string
  artist?: string
  date?: string
  time?: string
  venue?: string
  city?: string
  capacity?: number
  ticketsSold?: number
  ticketUrl?: string | null
  status?: string
  revenue?: string
}

export function ContentEvents() {
  const [searchQuery, setSearchQuery] = useState("");
  const [showCreateEventModal, setShowCreateEventModal] = useState(false);
  const [events, setEvents] = useState<EventRow[]>([]);
  const [isLoading, setIsLoading] = useState(false)
  const [isError, setIsError] = useState<string | null>(null)

  const fetchEvents = async (q?: string) => {
    setIsLoading(true)
    setIsError(null)
    try {
      const params = new URLSearchParams()
      if (q && q.trim()) params.set('q', q.trim())
      const qs = params.toString() ? `?${params.toString()}` : ''
      const res = await fetch(`/api/events${qs}`, { credentials: 'include' })
      if (!res.ok) throw new Error(`${res.status} ${res.statusText}`)
      const json = await res.json()
      setEvents(json?.data ?? [])
    } catch (e: any) {
      console.error('Failed to load events', e)
      setIsError(e?.message || 'Failed to load')
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    fetchEvents()
  }, [])

  const visibleEvents = useMemo(() => {
    const q = searchQuery.toLowerCase()
    return events.filter(ev =>
      (ev.title?.toLowerCase().includes(q) ?? false) ||
      (ev.artist?.toLowerCase().includes(q) ?? false) ||
      (ev.venue?.toLowerCase?.() ? (ev.venue as any).toLowerCase() : false)
    )
  }, [events, searchQuery])

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "live":
        return <Badge className="bg-accent text-accent-foreground">Live</Badge>;
      case "on_sale":
        return <Badge className="bg-primary text-primary-foreground">On Sale</Badge>;
      case "announced":
        return <Badge variant="secondary">Announced</Badge>;
      case "sold_out":
        return <Badge className="bg-warning text-warning-foreground">Sold Out</Badge>;
      case "cancelled":
        return <Badge variant="destructive">Cancelled</Badge>;
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };

  return (
    <>
      <CreateEventModal 
        open={showCreateEventModal} 
        onOpenChange={setShowCreateEventModal}
        onCreated={() => fetchEvents(searchQuery)}
      />
      
      <div className="space-y-6">
        {/* Page Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Events</h1>
          <p className="text-muted-foreground">
            Manage concerts, festivals, and promotional events
          </p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" onClick={() => fetchEvents(searchQuery)}>
            <RefreshCw className="w-4 h-4 mr-2" />
            Refresh
          </Button>
          <Button onClick={() => setShowCreateEventModal(true)}>
            <Plus className="w-4 h-4 mr-2" />
            Create Event
          </Button>
        </div>
      </div>

      {/* Stats Overview */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="text-2xl font-bold text-primary">8</div>
            <div className="text-sm text-muted-foreground">Total Events</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="text-2xl font-bold text-accent">63.7K</div>
            <div className="text-sm text-muted-foreground">Tickets Sold</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="text-2xl font-bold text-warning">92%</div>
            <div className="text-sm text-muted-foreground">Avg. Capacity</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="text-2xl font-bold">$3.3M</div>
            <div className="text-sm text-muted-foreground">Total Revenue</div>
          </CardContent>
        </Card>
      </div>

      {/* Search */}
      <Card>
        <CardContent className="p-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input
              placeholder="Search events by title, artist, or venue..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
          </div>
        </CardContent>
      </Card>

      {/* Events Table */}
      <Card>
        <CardHeader>
          <CardTitle>Events ({visibleEvents.length}{isLoading ? ' • loading…' : ''}) {isError && (<span className="text-xs text-destructive ml-2">{isError}</span>)}</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Event</TableHead>
                <TableHead>Date & Time</TableHead>
                <TableHead>Venue</TableHead>
                <TableHead>Capacity</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Revenue</TableHead>
                <TableHead className="w-12"></TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {visibleEvents.map((event) => (
                <TableRow key={event.id}>
                  <TableCell>
                    <div>
                      <div className="font-medium">{event.title}</div>
                      <div className="text-sm text-muted-foreground">
                        {event.artist}
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center space-x-2">
                      <Calendar className="w-4 h-4 text-muted-foreground" />
                      <div>
                        <div className="font-medium">
                          {event.date ? new Date(event.date).toLocaleDateString() : '-'}
                        </div>
                        <div className="text-sm text-muted-foreground">
                          {event.time || '-'}
                        </div>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center space-x-2">
                      <MapPin className="w-4 h-4 text-muted-foreground" />
                      <div>
                        <div className="font-medium">{event.venue || '-'}</div>
                        <div className="text-sm text-muted-foreground">
                          {event.city || '-'}
                        </div>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center space-x-2">
                      <Users className="w-4 h-4 text-muted-foreground" />
                      <div>
                        <div className="font-medium">
                          {(event.ticketsSold ?? 0).toLocaleString()} / {(event.capacity ?? 0).toLocaleString()}
                        </div>
                        <div className="text-sm text-muted-foreground">
                          {event.capacity ? Math.round(((event.ticketsSold ?? 0) / event.capacity) * 100) : 0}% sold
                        </div>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>{getStatusBadge(event.status || 'announced')}</TableCell>
                  <TableCell className="font-medium">{event.revenue || '—'}</TableCell>
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
                        <DropdownMenuItem>
                          <Link className="w-4 h-4 mr-2" />
                          Create Smart Link
                        </DropdownMenuItem>
                        <DropdownMenuItem>
                          <Edit className="w-4 h-4 mr-2" />
                          Edit Event
                        </DropdownMenuItem>
                        {event.ticketUrl && (
                          <DropdownMenuItem>
                            <ExternalLink className="w-4 h-4 mr-2" />
                            View Tickets
                          </DropdownMenuItem>
                        )}
                        <DropdownMenuItem
                          className="text-destructive"
                          onClick={async () => {
                            if (!confirm('Delete this event?')) return
                            try {
                              const res = await fetch(`/api/events/${event.id}` , { method: 'DELETE', credentials: 'include' })
                              if (!res.ok) throw new Error(`${res.status} ${res.statusText}`)
                              fetchEvents(searchQuery)
                            } catch (e) {
                              console.error('Failed to delete event', e)
                            }
                          }}
                        >
                          <Trash2 className="w-4 h-4 mr-2" />
                          Delete Event
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              ))}
              {!isLoading && !isError && visibleEvents.length === 0 && (
                <TableRow>
                  <TableCell colSpan={7}>
                    <div className="p-8 text-center">
                      <h3 className="text-lg font-medium mb-2">Create your first event</h3>
                      <p className="text-muted-foreground mb-4">Schedule concerts, festivals, and promotional events. Track capacity and ticket sales.</p>
                      <Button onClick={() => setShowCreateEventModal(true)}>
                        <Plus className="w-4 h-4 mr-2" />
                        Create Event
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