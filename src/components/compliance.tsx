import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Badge } from "./ui/badge";
import { Button } from "./ui/button";
import { Shield, Mail, MessageSquare, Download, Upload, FileText } from "lucide-react";

export function Compliance() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Compliance</h1>
          <p className="text-muted-foreground">Manage consent, preferences, and data protection</p>
        </div>
        <Button variant="outline"><Download className="w-4 h-4 mr-2" />Export Audit Log</Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card><CardContent className="p-4"><div className="text-2xl font-bold text-accent">18,392</div><div className="text-sm text-muted-foreground">Email Consent</div></CardContent></Card>
        <Card><CardContent className="p-4"><div className="text-2xl font-bold text-primary">12,556</div><div className="text-sm text-muted-foreground">SMS Consent</div></CardContent></Card>
        <Card><CardContent className="p-4"><div className="text-2xl font-bold text-warning">234</div><div className="text-sm text-muted-foreground">Suppressions</div></CardContent></Card>
        <Card><CardContent className="p-4"><div className="text-2xl font-bold">12</div><div className="text-sm text-muted-foreground">DSR Requests</div></CardContent></Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card><CardHeader><CardTitle className="flex items-center"><Mail className="w-5 h-5 mr-2" />Email Consent</CardTitle></CardHeader><CardContent><div className="space-y-4"><div className="flex justify-between"><span>Active Subscriptions</span><span className="font-medium">18,392</span></div><div className="flex justify-between"><span>Double Opt-in Rate</span><Badge className="bg-accent">94.2%</Badge></div><div className="flex justify-between"><span>Unsubscribe Rate</span><span className="text-sm">2.1%</span></div></div></CardContent></Card>
        
        <Card><CardHeader><CardTitle className="flex items-center"><MessageSquare className="w-5 h-5 mr-2" />SMS Compliance</CardTitle></CardHeader><CardContent><div className="space-y-4"><div className="flex justify-between"><span>10DLC Registration</span><Badge className="bg-accent">Verified</Badge></div><div className="flex justify-between"><span>Brand Registration</span><Badge className="bg-accent">Active</Badge></div><div className="flex justify-between"><span>Opt-out Rate</span><span className="text-sm">1.8%</span></div></div></CardContent></Card>
      </div>

      <Card><CardHeader><CardTitle className="flex items-center"><Shield className="w-5 h-5 mr-2" />Data Subject Requests</CardTitle></CardHeader><CardContent><div className="space-y-4"><div className="flex justify-between items-center"><span>Export Requests</span><div className="flex space-x-2"><span>8 pending</span><Button size="sm">Process</Button></div></div><div className="flex justify-between items-center"><span>Delete Requests</span><div className="flex space-x-2"><span>4 pending</span><Button size="sm" variant="destructive">Process</Button></div></div></div></CardContent></Card>
    </div>
  );
}