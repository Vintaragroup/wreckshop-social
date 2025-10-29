import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Badge } from "./ui/badge";
import { Button } from "./ui/button";
import { Download, TrendingUp, Users, Mail, MessageSquare, Music } from "lucide-react";

export function Analytics() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Analytics</h1>
          <p className="text-muted-foreground">Track performance across all channels and campaigns</p>
        </div>
        <Button variant="outline"><Download className="w-4 h-4 mr-2" />Export Report</Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card><CardContent className="p-4"><div className="flex items-center space-x-2"><Mail className="w-5 h-5 text-primary" /><div><div className="text-2xl font-bold">24.8%</div><div className="text-sm text-muted-foreground">Email Open Rate</div></div></div></CardContent></Card>
        <Card><CardContent className="p-4"><div className="flex items-center space-x-2"><MessageSquare className="w-5 h-5 text-accent" /><div><div className="text-2xl font-bold">8.7%</div><div className="text-sm text-muted-foreground">SMS CTR</div></div></div></CardContent></Card>
        <Card><CardContent className="p-4"><div className="flex items-center space-x-2"><Music className="w-5 h-5 text-warning" /><div><div className="text-2xl font-bold">2.1M</div><div className="text-sm text-muted-foreground">Monthly Streams</div></div></div></CardContent></Card>
        <Card><CardContent className="p-4"><div className="flex items-center space-x-2"><TrendingUp className="w-5 h-5 text-destructive" /><div><div className="text-2xl font-bold">$127K</div><div className="text-sm text-muted-foreground">Revenue</div></div></div></CardContent></Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card><CardHeader><CardTitle>Channel Performance</CardTitle></CardHeader><CardContent><div className="space-y-4"><div className="flex justify-between items-center"><span>Email Campaigns</span><Badge className="bg-accent">24.8% open</Badge></div><div className="flex justify-between items-center"><span>SMS Messages</span><Badge className="bg-primary">97.2% delivery</Badge></div><div className="flex justify-between items-center"><span>Smart Links</span><Badge className="bg-warning">8.7% CTR</Badge></div></div></CardContent></Card>
        
        <Card><CardHeader><CardTitle>Attribution Funnel</CardTitle></CardHeader><CardContent><div className="space-y-4"><div className="flex justify-between"><span>Emails Sent</span><span className="font-medium">105,430</span></div><div className="flex justify-between"><span>Delivered</span><span className="font-medium">104,891</span></div><div className="flex justify-between"><span>Opened</span><span className="font-medium">26,013</span></div><div className="flex justify-between"><span>Clicked</span><span className="font-medium">5,234</span></div><div className="flex justify-between"><span>Converted</span><span className="font-medium">891</span></div></div></CardContent></Card>
      </div>
    </div>
  );
}