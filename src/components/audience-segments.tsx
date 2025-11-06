import { useEffect, useState } from "react";
import {
  Plus,
  Trash2,
  Eye,
  Copy,
  Download,
  MoreHorizontal,
  Search,
  ArrowLeft,
} from "lucide-react";
import { Button } from "./ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Badge } from "./ui/badge";
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
import { Input } from "./ui/input";
import { toast } from "sonner";
import { apiUrl } from "../lib/api";

type Segment = {
  _id: string;
  name: string;
  description?: string;
  estimatedCount?: number;
  createdAt?: string;
  updatedAt?: string;
  filters?: any;
};

interface AudienceSegmentsProps {
  onPageChange?: (page: string) => void;
  onSelectSegment?: (segment: Segment) => void;
}

export function AudienceSegments({
  onPageChange,
  onSelectSegment,
}: AudienceSegmentsProps) {
  const [segments, setSegments] = useState<Segment[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    loadSegments();
  }, []);

  async function loadSegments() {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch(apiUrl("/segments"), {
        credentials: "include",
      });
      if (!res.ok) throw new Error(`Failed to load (${res.status})`);
      const json = await res.json();
      setSegments(json.data || []);
    } catch (e) {
      const message = (e as any)?.message || "Failed to load segments";
      setError(message);
      console.error("Load segments error:", e);
    } finally {
      setLoading(false);
    }
  }

  async function deleteSegment(id: string, name: string) {
    if (!confirm(`Delete segment "${name}"? This cannot be undone.`)) return;

    try {
      const res = await fetch(apiUrl(`/segments/${id}`), {
        method: "DELETE",
        credentials: "include",
      });
      if (!res.ok) throw new Error(`Delete failed (${res.status})`);
      toast.success(`Segment "${name}" deleted`);
      setSegments((s) => s.filter((x) => x._id !== id));
    } catch (e) {
      const message = (e as any)?.message || "Failed to delete";
      console.error("Delete error:", e);
      toast.error(message);
    }
  }

  async function duplicateSegment(segment: Segment) {
    try {
      const newName = `${segment.name} (Copy)`;
      const res = await fetch(apiUrl("/segments"), {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({
          name: newName,
          description: segment.description,
          filters: segment.filters,
          estimatedCount: segment.estimatedCount,
        }),
      });
      if (!res.ok) throw new Error(`Duplicate failed (${res.status})`);
      const json = await res.json();
      toast.success(`Segment duplicated as "${newName}"`);
      setSegments((s) => [...s, json.data]);
    } catch (e) {
      const message = (e as any)?.message || "Failed to duplicate";
      console.error("Duplicate error:", e);
      toast.error(message);
    }
  }

  async function exportSegmentUsers(id: string, name: string) {
    try {
      const res = await fetch(apiUrl(`/segments/${id}/users`), {
        credentials: "include",
      });
      if (!res.ok) throw new Error(`Export failed (${res.status})`);
      const json = await res.json();
      const users = json.data || [];

      // Convert to CSV
      if (users.length === 0) {
        toast.error("No users in this segment");
        return;
      }

      const headers = Object.keys(users[0]);
      const csv = [
        headers.join(","),
        ...users.map((user: any) =>
          headers
            .map((h) => {
              const val = user[h];
              return typeof val === "string" && val.includes(",")
                ? `"${val}"`
                : val;
            })
            .join(",")
        ),
      ].join("\n");

      const blob = new Blob([csv], { type: "text/csv" });
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `${name}-${new Date().toISOString().split("T")[0]}.csv`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);

      toast.success(`Exported ${users.length} users`);
    } catch (e) {
      const message = (e as any)?.message || "Failed to export";
      console.error("Export error:", e);
      toast.error(message);
    }
  }

  const filteredSegments = segments.filter(
    (s) =>
      s.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (s.description || "").toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => onPageChange?.("audience")}
            className="p-2"
          >
            <ArrowLeft className="w-4 h-4" />
            <span className="sr-only">Back to Audience</span>
          </Button>
          <div>
            <h1 className="text-3xl font-bold">Audience Segments</h1>
            <p className="text-muted-foreground">
              Manage and use saved audience segments across campaigns
            </p>
          </div>
        </div>
        <Button onClick={() => onPageChange?.("segment-builder")}>
          <Plus className="w-4 h-4 mr-2" />
          Create Segment
        </Button>
      </div>

      {/* Error Message */}
      {error && !loading && (
        <div className="rounded-md bg-destructive/10 p-3 text-sm text-destructive">
          {error}{" "}
          <button
            onClick={loadSegments}
            className="underline ml-2 hover:no-underline"
          >
            Retry
          </button>
        </div>
      )}

      {/* Search Bar */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
        <Input
          placeholder="Search segments by name or description..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="pl-10"
        />
      </div>

      {/* Segments List */}
      <Card>
        <CardHeader>
          <CardTitle>
            Saved Segments ({filteredSegments.length})
          </CardTitle>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="text-center py-12">
              <p className="text-muted-foreground">Loading segments...</p>
            </div>
          ) : filteredSegments.length === 0 && segments.length === 0 ? (
            <div className="text-center py-12">
              <h3 className="text-lg font-medium mb-2">No segments yet</h3>
              <p className="text-muted-foreground mb-4">
                Create your first segment using the Segment Builder
              </p>
              <Button onClick={() => onPageChange?.("segment-builder")}>
                <Plus className="w-4 h-4 mr-2" />
                Create Segment
              </Button>
            </div>
          ) : filteredSegments.length === 0 ? (
            <div className="text-center py-8">
              <p className="text-muted-foreground">No segments match your search</p>
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Segment</TableHead>
                  <TableHead>Estimated Users</TableHead>
                  <TableHead>Created</TableHead>
                  <TableHead className="w-24">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredSegments.map((segment) => (
                  <TableRow key={segment._id}>
                    <TableCell>
                      <div
                        className="cursor-pointer hover:underline"
                        onClick={() => onSelectSegment?.(segment)}
                      >
                        <div className="font-medium">{segment.name}</div>
                        {segment.description && (
                          <div className="text-sm text-muted-foreground max-w-md truncate">
                            {segment.description}
                          </div>
                        )}
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge variant="outline">
                        {(segment.estimatedCount || 0).toLocaleString()}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-sm text-muted-foreground">
                      {segment.createdAt
                        ? new Date(segment.createdAt).toLocaleDateString()
                        : "-"}
                    </TableCell>
                    <TableCell>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="sm">
                            <MoreHorizontal className="w-4 h-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem
                            onSelect={() => onSelectSegment?.(segment)}
                          >
                            <Eye className="w-4 h-4 mr-2" />
                            View Details
                          </DropdownMenuItem>
                          <DropdownMenuItem
                            onSelect={() => duplicateSegment(segment)}
                          >
                            <Copy className="w-4 h-4 mr-2" />
                            Duplicate
                          </DropdownMenuItem>
                          <DropdownMenuItem
                            onSelect={() =>
                              exportSegmentUsers(segment._id, segment.name)
                            }
                          >
                            <Download className="w-4 h-4 mr-2" />
                            Export Users
                          </DropdownMenuItem>
                          <DropdownMenuItem
                            onSelect={() =>
                              deleteSegment(segment._id, segment.name)
                            }
                            className="text-destructive"
                          >
                            <Trash2 className="w-4 h-4 mr-2" />
                            Delete
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
