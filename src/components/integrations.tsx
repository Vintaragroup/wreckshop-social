import { useState } from "react";
import {
  CheckCircle,
  AlertTriangle,
  XCircle,
  Clock,
  Zap,
  Settings,
  Plus,
  RefreshCw,
  Pause,
  Play,
  ExternalLink,
  Instagram,
  Youtube,
  Music,
  Facebook,
  Mail,
  MessageSquare,
} from "lucide-react";
import { AddIntegrationModal } from "./add-integration-modal";
import { SpotifyIntegrationCard } from "./spotify-oauth";
import { Button } from "./ui/button";
import { Badge } from "./ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Progress } from "./ui/progress";
import { Switch } from "./ui/switch";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "./ui/dialog";
import { Input } from "./ui/input";
import { Label } from "./ui/label";

const integrations = [
  {
    id: "instagram",
    name: "Instagram",
    description: "Connect Instagram Business accounts to sync follower data and insights",
    icon: Instagram,
    status: "connected",
    connectedAccount: "@wreckshoprecords",
    lastSync: "2 minutes ago",
    nextSync: "In 15 minutes",
    rateLimit: 85,
    scopes: ["read_insights", "pages_read_engagement", "business_management"],
    dataPoints: ["followers", "posts", "stories", "insights"],
    syncEnabled: true,
  },
  {
    id: "youtube",
    name: "YouTube",
    description: "Sync YouTube channel data, subscriber metrics, and video analytics",
    icon: Youtube,
    status: "connected",
    connectedAccount: "Wreckshop Records",
    lastSync: "5 minutes ago",
    nextSync: "In 25 minutes",
    rateLimit: 45,
    scopes: ["youtube.readonly", "youtube.analytics.readonly"],
    dataPoints: ["subscribers", "videos", "analytics", "comments"],
    syncEnabled: true,
  },
  {
    id: "tiktok",
    name: "TikTok",
    description: "Access TikTok Business account data and audience insights",
    icon: Music,
    status: "throttled",
    connectedAccount: "@wreckshopmusic",
    lastSync: "15 minutes ago",
    nextSync: "In 45 minutes",
    rateLimit: 95,
    scopes: ["user.info.basic", "video.list"],
    dataPoints: ["followers", "videos", "engagement"],
    syncEnabled: true,
  },
  {
    id: "facebook",
    name: "Facebook",
    description: "Connect Facebook Pages and access audience insights",
    icon: Facebook,
    status: "error",
    connectedAccount: "Wreckshop Records",
    lastSync: "2 hours ago",
    nextSync: "Paused",
    rateLimit: 0,
    scopes: ["pages_read_engagement", "pages_show_list"],
    dataPoints: ["page_likes", "posts", "insights"],
    syncEnabled: false,
    error: "Access token expired",
  },
  {
    id: "spotify",
    name: "Spotify",
    description: "Access Spotify for Artists data and listener insights",
    icon: Music,
    status: "disconnected",
    connectedAccount: null,
    lastSync: null,
    nextSync: null,
    rateLimit: 0,
    scopes: ["user-read-private", "user-top-read"],
    dataPoints: ["listeners", "tracks", "playlists", "analytics"],
    syncEnabled: false,
  },
  {
    id: "apple-music",
    name: "Apple Music",
    description: "Connect Apple Music for Artists and access analytics",
    icon: Music,
    status: "disconnected",
    connectedAccount: null,
    lastSync: null,
    nextSync: null,
    rateLimit: 0,
    scopes: ["music.read"],
    dataPoints: ["plays", "sales", "analytics"],
    syncEnabled: false,
  },
];

const emailProviders = [
  {
    id: "sendgrid",
    name: "SendGrid",
    description: "Email delivery and analytics platform",
    icon: Mail,
    status: "connected",
    config: { domain: "wreckshoprecords.com", verified: true },
  },
  {
    id: "postmark",
    name: "Postmark",
    description: "Transactional email service",
    icon: Mail,
    status: "disconnected",
    config: null,
  },
];

const smsProviders = [
  {
    id: "twilio",
    name: "Twilio",
    description: "SMS messaging and voice services",
    icon: MessageSquare,
    status: "connected",
    config: { 
      phone: "+1 (713) 555-0123", 
      tenDlcStatus: "verified",
      brandRegistration: "active"
    },
  },
  {
    id: "textmagic",
    name: "TextMagic",
    description: "Global SMS messaging platform",
    icon: MessageSquare,
    status: "disconnected",
    config: null,
  },
];

export function Integrations() {
  const [selectedIntegration, setSelectedIntegration] = useState<string | null>(null);
  const [oauthDialogOpen, setOauthDialogOpen] = useState(false);
  const [showAddIntegrationModal, setShowAddIntegrationModal] = useState(false);

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "connected":
        return <CheckCircle className="w-5 h-5 text-accent" />;
      case "throttled":
        return <AlertTriangle className="w-5 h-5 text-warning" />;
      case "error":
        return <XCircle className="w-5 h-5 text-destructive" />;
      case "disconnected":
        return <Clock className="w-5 h-5 text-muted-foreground" />;
      default:
        return <Clock className="w-5 h-5 text-muted-foreground" />;
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "connected":
        return <Badge className="bg-accent text-accent-foreground">Connected</Badge>;
      case "throttled":
        return <Badge className="bg-warning text-warning-foreground">Throttled</Badge>;
      case "error":
        return <Badge variant="destructive">Error</Badge>;
      case "disconnected":
        return <Badge variant="secondary">Disconnected</Badge>;
      default:
        return <Badge variant="secondary">{status}</Badge>;
    }
  };

  const handleConnect = (integrationId: string) => {
    setSelectedIntegration(integrationId);
    setOauthDialogOpen(true);
  };

  const handleSyncNow = (integrationId: string) => {
    // Trigger manual sync
    console.log(`Syncing ${integrationId}`);
  };

  const handleToggleSync = (integrationId: string, enabled: boolean) => {
    // Toggle sync enabled/disabled
    console.log(`Toggle sync for ${integrationId}: ${enabled}`);
  };

  return (
    <>
      <AddIntegrationModal 
        open={showAddIntegrationModal} 
        onOpenChange={setShowAddIntegrationModal}
      />
      
      <div className="space-y-6">
        {/* Page Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Integrations</h1>
          <p className="text-muted-foreground">
            Connect your platforms and configure data syncing
          </p>
        </div>
        <Button onClick={() => setShowAddIntegrationModal(true)}>
          <Plus className="w-4 h-4 mr-2" />
          Add Integration
        </Button>
      </div>

      {/* Overview Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="text-2xl font-bold text-accent">6</div>
            <div className="text-sm text-muted-foreground">Total Platforms</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="text-2xl font-bold text-accent">3</div>
            <div className="text-sm text-muted-foreground">Connected</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="text-2xl font-bold text-warning">1</div>
            <div className="text-sm text-muted-foreground">Needs Attention</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="text-2xl font-bold">5 min</div>
            <div className="text-sm text-muted-foreground">Last Sync</div>
          </CardContent>
        </Card>
      </div>

      {/* Social Media Platforms */}
      <div>
        <h2 className="text-xl font-semibold mb-4">Social Media Platforms</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {integrations.map((integration) => {
            // Special handling for Spotify - use the OAuth component
            if (integration.id === "spotify") {
              return <SpotifyIntegrationCard key={integration.id} />;
            }
            
            return (
            <Card key={integration.id}>
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                      <integration.icon className="w-5 h-5 text-primary" />
                    </div>
                    <div>
                      <CardTitle className="text-lg">{integration.name}</CardTitle>
                      <p className="text-sm text-muted-foreground">
                        {integration.description}
                      </p>
                    </div>
                  </div>
                  {getStatusIcon(integration.status)}
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  {getStatusBadge(integration.status)}
                  <Switch
                    checked={integration.syncEnabled}
                    onCheckedChange={(enabled) => handleToggleSync(integration.id, enabled)}
                    disabled={integration.status === "disconnected"}
                  />
                </div>

                {integration.connectedAccount && (
                  <div className="text-sm">
                    <span className="text-muted-foreground">Account: </span>
                    <span className="font-medium">{integration.connectedAccount}</span>
                  </div>
                )}

                {integration.status !== "disconnected" && (
                  <>
                    <div className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span className="text-muted-foreground">Last sync</span>
                        <span>{integration.lastSync}</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span className="text-muted-foreground">Next sync</span>
                        <span>{integration.nextSync}</span>
                      </div>
                    </div>

                    <div className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span className="text-muted-foreground">Rate limit</span>
                        <span>{integration.rateLimit}%</span>
                      </div>
                      <Progress value={integration.rateLimit} className="h-2" />
                    </div>
                  </>
                )}

                {integration.error && (
                  <div className="text-sm text-destructive bg-destructive/10 p-2 rounded">
                    {integration.error}
                  </div>
                )}

                <div className="flex space-x-2">
                  {integration.status === "disconnected" ? (
                    <Button
                      onClick={() => handleConnect(integration.id)}
                      className="flex-1"
                    >
                      Connect
                    </Button>
                  ) : (
                    <>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleSyncNow(integration.id)}
                        disabled={integration.status === "error"}
                      >
                        <RefreshCw className="w-4 h-4 mr-1" />
                        Sync
                      </Button>
                      <Button variant="outline" size="sm">
                        <Settings className="w-4 h-4 mr-1" />
                        Settings
                      </Button>
                    </>
                  )}
                </div>
              </CardContent>
            </Card>
          );
          })}
        </div>
      </div>

      {/* Email Providers */}
      <div>
        <h2 className="text-xl font-semibold mb-4">Email Providers</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {emailProviders.map((provider) => (
            <Card key={provider.id}>
              <CardContent className="p-4">
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center shrink-0">
                      <provider.icon className="w-5 h-5 text-primary" />
                    </div>
                    <div>
                      <div className="font-medium">{provider.name}</div>
                      <div className="text-sm text-muted-foreground">
                        {provider.description}
                      </div>
                    </div>
                  </div>
                  {getStatusBadge(provider.status)}
                </div>

                {provider.config && (
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Domain:</span>
                      <span>{provider.config.domain}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">DKIM:</span>
                      <Badge variant={provider.config.verified ? "default" : "destructive"}>
                        {provider.config.verified ? "Verified" : "Pending"}
                      </Badge>
                    </div>
                  </div>
                )}

                <div className="flex space-x-2 mt-4">
                  {provider.status === "disconnected" ? (
                    <Button className="flex-1">Connect</Button>
                  ) : (
                    <Button variant="outline" className="flex-1">
                      <Settings className="w-4 h-4 mr-2" />
                      Configure
                    </Button>
                  )}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      {/* SMS Providers */}
      <div>
        <h2 className="text-xl font-semibold mb-4">SMS Providers</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {smsProviders.map((provider) => (
            <Card key={provider.id}>
              <CardContent className="p-4">
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center shrink-0">
                      <provider.icon className="w-5 h-5 text-primary" />
                    </div>
                    <div>
                      <div className="font-medium">{provider.name}</div>
                      <div className="text-sm text-muted-foreground">
                        {provider.description}
                      </div>
                    </div>
                  </div>
                  {getStatusBadge(provider.status)}
                </div>

                {provider.config && (
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Phone:</span>
                      <span>{provider.config.phone}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">10DLC:</span>
                      <Badge variant="default">
                        {provider.config.tenDlcStatus}
                      </Badge>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Brand:</span>
                      <Badge variant="default">
                        {provider.config.brandRegistration}
                      </Badge>
                    </div>
                  </div>
                )}

                <div className="flex space-x-2 mt-4">
                  {provider.status === "disconnected" ? (
                    <Button className="flex-1">Connect</Button>
                  ) : (
                    <Button variant="outline" className="flex-1">
                      <Settings className="w-4 h-4 mr-2" />
                      Configure
                    </Button>
                  )}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      {/* OAuth Connection Dialog */}
      <Dialog open={oauthDialogOpen} onOpenChange={setOauthDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Connect to {selectedIntegration}</DialogTitle>
            <DialogDescription>
              Follow these steps to connect your {selectedIntegration} account
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div className="flex items-center space-x-2">
              <div className="w-6 h-6 bg-primary rounded-full flex items-center justify-center text-primary-foreground text-sm">
                1
              </div>
              <span>Choose your account type</span>
            </div>
            <div className="flex items-center space-x-2">
              <div className="w-6 h-6 bg-muted rounded-full flex items-center justify-center text-sm">
                2
              </div>
              <span>Grant required permissions</span>
            </div>
            <div className="flex items-center space-x-2">
              <div className="w-6 h-6 bg-muted rounded-full flex items-center justify-center text-sm">
                3
              </div>
              <span>Complete connection</span>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setOauthDialogOpen(false)}>
              Cancel
            </Button>
            <Button>
              <ExternalLink className="w-4 h-4 mr-2" />
              Continue to {selectedIntegration}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
    </>
  );
}