import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Badge } from "./ui/badge";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "./ui/tabs";
import { Users, Palette, Key, CreditCard, UserPlus, Copy } from "lucide-react";
import { ThemeSelector } from "./theme-selector";

export function Settings() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Settings</h1>
        <p className="text-muted-foreground">Manage your account, team, and application preferences</p>
      </div>

      <Tabs defaultValue="users">
        <TabsList>
          <TabsTrigger value="users" className="flex items-center space-x-2"><Users className="w-4 h-4" /><span>Users & Roles</span></TabsTrigger>
          <TabsTrigger value="brand" className="flex items-center space-x-2"><Palette className="w-4 h-4" /><span>Branding</span></TabsTrigger>
          <TabsTrigger value="api" className="flex items-center space-x-2"><Key className="w-4 h-4" /><span>API Keys</span></TabsTrigger>
          <TabsTrigger value="billing" className="flex items-center space-x-2"><CreditCard className="w-4 h-4" /><span>Billing</span></TabsTrigger>
        </TabsList>

        <TabsContent value="users">
          <Card><CardHeader><CardTitle className="flex items-center justify-between">Team Members<Button><UserPlus className="w-4 h-4 mr-2" />Invite User</Button></CardTitle></CardHeader><CardContent><div className="space-y-4"><div className="flex justify-between items-center p-3 border rounded"><div><div className="font-medium">Admin User</div><div className="text-sm text-muted-foreground">admin@wreckshoprecords.com</div></div><Badge>Owner</Badge></div><div className="flex justify-between items-center p-3 border rounded"><div><div className="font-medium">Marketing Manager</div><div className="text-sm text-muted-foreground">marketing@wreckshoprecords.com</div></div><Badge variant="secondary">Editor</Badge></div></div></CardContent></Card>
        </TabsContent>

        <TabsContent value="brand">
          <div className="space-y-6">
            <ThemeSelector />
            
            <Card>
              <CardHeader>
                <CardTitle>Brand Settings</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label>Company Name</Label>
                    <Input defaultValue="Wreckshop Records" />
                  </div>
                  <div className="space-y-2">
                    <Label>Logo URL</Label>
                    <Input placeholder="https://example.com/logo.png" />
                  </div>
                  <div className="space-y-2">
                    <Label>Primary Color</Label>
                    <Input defaultValue="#7C3AED" />
                  </div>
                  <Button>Save Changes</Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="api">
          <Card><CardHeader><CardTitle className="flex items-center justify-between">API Keys<Button>Generate New Key</Button></CardTitle></CardHeader><CardContent><div className="space-y-4"><div className="flex justify-between items-center p-3 border rounded"><div><div className="font-medium">Production API Key</div><div className="text-sm text-muted-foreground">Last used: 2 hours ago</div></div><div className="flex space-x-2"><Button variant="outline" size="sm"><Copy className="w-4 h-4" /></Button><Button variant="destructive" size="sm">Revoke</Button></div></div></div></CardContent></Card>
        </TabsContent>

        <TabsContent value="billing">
          <Card><CardHeader><CardTitle>Billing & Usage</CardTitle></CardHeader><CardContent><div className="space-y-4"><div className="grid grid-cols-1 md:grid-cols-3 gap-4"><div className="text-center p-4 border rounded"><div className="text-2xl font-bold">Pro</div><div className="text-sm text-muted-foreground">Current Plan</div></div><div className="text-center p-4 border rounded"><div className="text-2xl font-bold">$299</div><div className="text-sm text-muted-foreground">Monthly</div></div><div className="text-center p-4 border rounded"><div className="text-2xl font-bold">85%</div><div className="text-sm text-muted-foreground">Usage</div></div></div></div></CardContent></Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}