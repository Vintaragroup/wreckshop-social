import { useState } from "react";
import { Plus, Search, Link, Copy, QrCode, MoreHorizontal, Edit, Trash2, Eye } from "lucide-react";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Badge } from "./ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "./ui/table";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "./ui/dropdown-menu";

const assets = [
  { id: 1, name: "UTOPIA - Full Album", type: "track", shortUrl: "wreck.sh/utopia", platforms: ["Spotify", "Apple", "YouTube"], tags: ["licensing", "payout"], clicks: 125430, created: "2023-07-28" },
  { id: 2, name: "Travis Scott - Tour Announcement", type: "landing", shortUrl: "wreck.sh/tour24", platforms: ["All"], tags: ["promo"], clicks: 89230, created: "2024-01-15" },
  { id: 3, name: "FE!N Music Video", type: "video", shortUrl: "wreck.sh/fein", platforms: ["YouTube", "Instagram"], tags: ["content"], clicks: 67890, created: "2024-02-01" },
];

export function ContentAssets() {
  const [searchQuery, setSearchQuery] = useState("");
  
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
        <Card><CardContent className="p-4"><div className="text-2xl font-bold text-primary">47</div><div className="text-sm text-muted-foreground">Total Links</div></CardContent></Card>
        <Card><CardContent className="p-4"><div className="text-2xl font-bold text-accent">2.1M</div><div className="text-sm text-muted-foreground">Total Clicks</div></CardContent></Card>
        <Card><CardContent className="p-4"><div className="text-2xl font-bold text-warning">8.7%</div><div className="text-sm text-muted-foreground">Avg. CTR</div></CardContent></Card>
        <Card><CardContent className="p-4"><div className="text-2xl font-bold">$127K</div><div className="text-sm text-muted-foreground">Revenue Tracked</div></CardContent></Card>
      </div>

      <Card>
        <CardHeader><CardTitle>Smart Links ({assets.length})</CardTitle></CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Name</TableHead>
                <TableHead>Type</TableHead>
                <TableHead>Short URL</TableHead>
                <TableHead>Platforms</TableHead>
                <TableHead>Clicks</TableHead>
                <TableHead>Created</TableHead>
                <TableHead className="w-12"></TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {assets.map((asset) => (
                <TableRow key={asset.id}>
                  <TableCell><div className="font-medium">{asset.name}</div></TableCell>
                  <TableCell><Badge variant="outline">{asset.type}</Badge></TableCell>
                  <TableCell>
                    <div className="flex items-center space-x-2">
                      <code className="text-sm bg-muted px-2 py-1 rounded">{asset.shortUrl}</code>
                      <Button variant="ghost" size="sm"><Copy className="w-4 h-4" /></Button>
                    </div>
                  </TableCell>
                  <TableCell><div className="text-sm">{asset.platforms.join(", ")}</div></TableCell>
                  <TableCell className="font-medium">{asset.clicks.toLocaleString()}</TableCell>
                  <TableCell className="text-sm text-muted-foreground">{asset.created}</TableCell>
                  <TableCell>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild><Button variant="ghost" size="sm"><MoreHorizontal className="w-4 h-4" /></Button></DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem><Eye className="w-4 h-4 mr-2" />Analytics</DropdownMenuItem>
                        <DropdownMenuItem><QrCode className="w-4 h-4 mr-2" />QR Code</DropdownMenuItem>
                        <DropdownMenuItem><Edit className="w-4 h-4 mr-2" />Edit</DropdownMenuItem>
                        <DropdownMenuItem className="text-destructive"><Trash2 className="w-4 h-4 mr-2" />Delete</DropdownMenuItem>
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
  );
}