import { useState } from "react";
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

const events = [
  {
    id: 1,
    title: "Astroworld Festival 2024",
    artist: "Travis Scott",
    date: "2024-12-15",
    time: "20:00",
    venue: "NRG Stadium",
    city: "Houston, TX",
    capacity: 50000,
    ticketsSold: 48500,
    ticketUrl: "https://tickets.astroworldfest.com",
    status: "live",
    smartLinks: 2,
    revenue: "$2.4M",
  },
  {
    id: 2,
    title: "Love Sick Tour - Houston",
    artist: "Don Toliver",
    date: "2025-01-08",
    time: "21:00",
    venue: "Toyota Center",
    city: "Houston, TX",
    capacity: 18000,
    ticketsSold: 15200,
    ticketUrl: "https://tickets.toyotacenter.com",
    status: "on_sale",
    smartLinks: 1,
    revenue: "$890K",
  },
  {
    id: 3,
    title: "Houston Underground Showcase",
    artist: "Maxo Kream",
    date: "2025-02-14",
    time: "19:30",
    venue: "House of Blues",
    city: "Houston, TX",
    capacity: 1200,
    ticketsSold: 0,
    ticketUrl: null,
    status: "announced",
    smartLinks: 0,
    revenue: "$0",
  },
];

export function ContentEvents() {
  const [searchQuery, setSearchQuery] = useState("");
  const [showCreateEventModal, setShowCreateEventModal] = useState(false);

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
        <Button onClick={() => setShowCreateEventModal(true)}>
          <Plus className="w-4 h-4 mr-2" />
          Create Event
        </Button>
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
          <CardTitle>Events ({events.length})</CardTitle>
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
              {events.map((event) => (
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
                          {new Date(event.date).toLocaleDateString()}
                        </div>
                        <div className="text-sm text-muted-foreground">
                          {event.time}
                        </div>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center space-x-2">
                      <MapPin className="w-4 h-4 text-muted-foreground" />
                      <div>
                        <div className="font-medium">{event.venue}</div>
                        <div className="text-sm text-muted-foreground">
                          {event.city}
                        </div>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center space-x-2">
                      <Users className="w-4 h-4 text-muted-foreground" />
                      <div>
                        <div className="font-medium">
                          {event.ticketsSold.toLocaleString()} / {event.capacity.toLocaleString()}
                        </div>
                        <div className="text-sm text-muted-foreground">
                          {Math.round((event.ticketsSold / event.capacity) * 100)}% sold
                        </div>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>{getStatusBadge(event.status)}</TableCell>
                  <TableCell className="font-medium">{event.revenue}</TableCell>
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
                        <DropdownMenuItem className="text-destructive">
                          <Trash2 className="w-4 h-4 mr-2" />
                          Cancel Event
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
    </>
  );
}