import { useState, useEffect } from "react";
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
  Loader2,
} from "lucide-react";
import { AddIntegrationModal } from "./add-integration-modal";
import { SpotifyIntegrationCard } from "./spotify-oauth";
import { SpotifyDiscoveryCard } from "./spotify-discovery";
import { InstagramConnectionCard } from "./instagram-connection";
import { Button } from "./ui/button";
import { Badge } from "./ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Progress } from "./ui/progress";
import { Switch } from "./ui/switch";
import { useAuth } from "../lib/auth/context";
import { apiRequest } from "../lib/api";
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

const socialPlatforms = [
  {
    id: "instagram",
    name: "Instagram",
    description: "Connect Instagram Business accounts to sync follower data and insights",
    icon: Instagram,
    features: ["Read follower insights", "Access content metrics", "Publish content", "Manage messages"],
  },
  {
    id: "spotify",
    name: "Spotify",
    description: "Access Spotify for Artists data and listener insights",
    icon: Music,
    features: ["Listener insights", "Stream counts", "Playlist tracking", "Demographics"],
  },
  {
    id: "youtube",
    name: "YouTube",
    description: "Sync YouTube channel data, subscriber metrics, and video analytics",
    icon: Youtube,
    features: ["Subscribers", "Videos", "Analytics", "Comments"],
  },
  {
    id: "facebook",
    name: "Facebook",
    description: "Connect Facebook Pages and access audience insights",
    icon: Facebook,
    features: ["Page likes", "Posts", "Insights", "Audience data"],
  },
  {
    id: "tiktok",
    name: "TikTok",
    description: "Access TikTok Business account data and audience insights",
    icon: Music,
    features: ["Followers", "Videos", "Engagement", "Analytics"],
  },
  {
    id: "apple-music",
    name: "Apple Music",
    description: "Connect Apple Music for Artists and access analytics",
    icon: Music,
    features: ["Plays", "Sales", "Analytics", "Reports"],
  },
];

const emailProviders = [
  {
    id: "sendgrid",
    name: "SendGrid",
    description: "Email delivery and analytics platform",
    icon: Mail,
    features: ["Email campaigns", "Automation", "Analytics", "Templates"],
  },
  {
    id: "postmark",
    name: "Postmark",
    description: "Transactional email service",
    icon: Mail,
    features: ["Transactional email", "API access", "Delivery tracking", "Logs"],
  },
];

const smsProviders = [
  {
    id: "twilio",
    name: "Twilio",
    description: "SMS messaging and voice services",
    icon: MessageSquare,
    features: ["SMS campaigns", "MMS support", "Global reach", "Two-way messaging"],
  },
  {
    id: "textmagic",
    name: "TextMagic",
    description: "Global SMS messaging platform",
    icon: MessageSquare,
    features: ["SMS campaigns", "MMS support", "Global reach", "Two-way messaging"],
  },
];

export function Integrations() {
  const { user, token } = useAuth();
  const [selectedIntegration, setSelectedIntegration] = useState<string | null>(null);
  const [oauthDialogOpen, setOauthDialogOpen] = useState(false);
  const [showAddIntegrationModal, setShowAddIntegrationModal] = useState(false);
  const [connectionStatuses, setConnectionStatuses] = useState<Record<string, any>>({});
  const [loadingStatuses, setLoadingStatuses] = useState<Set<string>>(new Set());

  // Fetch connection statuses from API
  useEffect(() => {
    const fetchConnectionStatuses = async () => {
      if (!user || !token) return;

      try {
        // The backend expects an artistId; Auth.user.id is the Prisma artist id
        const artistId = user.id
        const data = await apiRequest<{ ok: true; integrations?: Record<string, any> }>(
          `/integrations/status/${artistId}`
        )
        const statuses: Record<string, any> = {};
        if (data?.integrations) {
          Object.entries(data.integrations).forEach(([platform, integration]: [string, any]) => {
            if (integration?.connected) {
              statuses[platform] = {
                connected: true,
                data: integration,
              };
            }
          });
        }
        setConnectionStatuses(statuses);
      } catch (error) {
        console.error("Failed to fetch connection statuses:", error);
      }
    };

    fetchConnectionStatuses();
  }, [user, token]);

  const isConnected = (platformId: string): boolean => {
    return connectionStatuses[platformId]?.connected ?? false;
  };

  const getConnectionData = (platformId: string) => {
    return connectionStatuses[platformId]?.data;
  };

  const handleConnect = (integrationId: string) => {
    setSelectedIntegration(integrationId);
    setOauthDialogOpen(true);
  };

  const handleDisconnect = async (platformId: string) => {
    if (!user || !token || !confirm(`Are you sure you want to disconnect ${platformId}?`)) return;

    setLoadingStatuses((prev) => new Set(prev).add(platformId));
    try {
      await apiRequest(`/integrations/${platformId}/${user.id}`, { method: "DELETE" })
      setConnectionStatuses((prev) => {
        const updated = { ...prev };
        delete updated[platformId];
        return updated;
      });
    } catch (error) {
      console.error("Failed to disconnect:", error);
    } finally {
      setLoadingStatuses((prev) => {
        const updated = new Set(prev);
        updated.delete(platformId);
        return updated;
      });
    }
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
          {/* Instagram - Using OAuth Component */}
          {user && <InstagramConnectionCard userId={user.id} onConnectionChange={() => {
            // Refresh connection statuses
            setConnectionStatuses((prev) => ({ ...prev }));
          }} />}

          {/* Spotify */}
          <SpotifyIntegrationCard />

          {/* YouTube, Facebook, TikTok, Apple Music - Placeholder Cards */}
          {socialPlatforms.filter(p => p.id !== "instagram" && p.id !== "spotify").map((platform) => {
            const connected = isConnected(platform.id);
            const data = getConnectionData(platform.id);
            const isLoading = loadingStatuses.has(platform.id);

            return (
              <Card key={platform.id}>
                <CardContent className="p-4">
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center space-x-3">
                      <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center shrink-0">
                        <platform.icon className="w-5 h-5 text-primary" />
                      </div>
                      <div>
                        <div className="font-medium">{platform.name}</div>
                        <div className="text-sm text-muted-foreground">
                          {platform.description}
                        </div>
                      </div>
                    </div>
                    {connected ? (
                      <Badge className="bg-accent text-accent-foreground">Connected</Badge>
                    ) : (
                      <Badge variant="secondary">Disconnected</Badge>
                    )}
                  </div>

                  {connected && data && (
                    <div className="space-y-2 text-sm mb-4">
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Account:</span>
                        <span className="font-medium">{data.username || data.email || "Connected"}</span>
                      </div>
                      {data.followers && (
                        <div className="flex justify-between">
                          <span className="text-muted-foreground">Followers:</span>
                          <span>{data.followers.toLocaleString()}</span>
                        </div>
                      )}
                      {data.connectedAt && (
                        <div className="flex justify-between">
                          <span className="text-muted-foreground">Connected:</span>
                          <span>{new Date(data.connectedAt).toLocaleDateString()}</span>
                        </div>
                      )}
                    </div>
                  )}

                  {!connected && (
                    <div className="space-y-2 mb-4">
                      <div className="text-sm text-muted-foreground font-medium mb-2">Available features:</div>
                      <div className="space-y-1">
                        {platform.features.map((feature) => (
                          <div key={feature} className="text-sm flex items-center text-muted-foreground">
                            <span className="w-1.5 h-1.5 rounded-full bg-primary mr-2"></span>
                            {feature}
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  <div className="flex space-x-2">
                    {connected ? (
                      <Button 
                        variant="destructive" 
                        className="flex-1"
                        disabled={isLoading}
                        onClick={() => handleDisconnect(platform.id)}
                      >
                        {isLoading ? (
                          <>
                            <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                            Disconnecting...
                          </>
                        ) : (
                          "Disconnect"
                        )}
                      </Button>
                    ) : (
                      <Button 
                        className="flex-1"
                        onClick={() => handleConnect(platform.id)}
                        disabled={isLoading}
                      >
                        {isLoading ? (
                          <>
                            <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                            Connecting...
                          </>
                        ) : (
                          <>
                            <Plus className="w-4 h-4 mr-2" />
                            Connect {platform.name}
                          </>
                        )}
                      </Button>
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
          {emailProviders.map((provider) => {
            const connected = isConnected(provider.id);
            const data = getConnectionData(provider.id);
            const isLoading = loadingStatuses.has(provider.id);

            return (
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
                    {connected ? (
                      <Badge className="bg-accent text-accent-foreground">Connected</Badge>
                    ) : (
                      <Badge variant="secondary">Disconnected</Badge>
                    )}
                  </div>

                  {connected && data && (
                    <div className="space-y-2 text-sm mb-4">
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Domain:</span>
                        <span className="font-medium">{data.domain || "Configured"}</span>
                      </div>
                      {data.verified && (
                        <div className="flex justify-between">
                          <span className="text-muted-foreground">Status:</span>
                          <Badge variant="default">Verified</Badge>
                        </div>
                      )}
                    </div>
                  )}

                  {!connected && (
                    <div className="space-y-2 mb-4">
                      <div className="text-sm text-muted-foreground font-medium mb-2">Available features:</div>
                      <div className="space-y-1">
                        {provider.features.map((feature) => (
                          <div key={feature} className="text-sm flex items-center text-muted-foreground">
                            <span className="w-1.5 h-1.5 rounded-full bg-primary mr-2"></span>
                            {feature}
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  <div className="flex space-x-2">
                    {connected ? (
                      <Button 
                        variant="outline" 
                        className="flex-1"
                        disabled={isLoading}
                      >
                        <Settings className="w-4 h-4 mr-2" />
                        Configure
                      </Button>
                    ) : (
                      <Button 
                        className="flex-1"
                        onClick={() => handleConnect(provider.id)}
                        disabled={isLoading}
                      >
                        {isLoading ? (
                          <>
                            <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                            Connecting...
                          </>
                        ) : (
                          <>
                            <Plus className="w-4 h-4 mr-2" />
                            Connect
                          </>
                        )}
                      </Button>
                    )}
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      </div>

      {/* SMS Providers */}
      <div>
        <h2 className="text-xl font-semibold mb-4">SMS Providers</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {smsProviders.map((provider) => {
            const connected = isConnected(provider.id);
            const data = getConnectionData(provider.id);
            const isLoading = loadingStatuses.has(provider.id);

            return (
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
                    {connected ? (
                      <Badge className="bg-accent text-accent-foreground">Connected</Badge>
                    ) : (
                      <Badge variant="secondary">Disconnected</Badge>
                    )}
                  </div>

                  {connected && data && (
                    <div className="space-y-2 text-sm mb-4">
                      {data.phone && (
                        <div className="flex justify-between">
                          <span className="text-muted-foreground">Phone:</span>
                          <span className="font-medium">{data.phone}</span>
                        </div>
                      )}
                      {data.tenDlcStatus && (
                        <div className="flex justify-between">
                          <span className="text-muted-foreground">10DLC:</span>
                          <Badge variant="default">{data.tenDlcStatus}</Badge>
                        </div>
                      )}
                      {data.brandRegistration && (
                        <div className="flex justify-between">
                          <span className="text-muted-foreground">Brand:</span>
                          <Badge variant="default">{data.brandRegistration}</Badge>
                        </div>
                      )}
                    </div>
                  )}

                  {!connected && (
                    <div className="space-y-2 mb-4">
                      <div className="text-sm text-muted-foreground font-medium mb-2">Available features:</div>
                      <div className="space-y-1">
                        {provider.features.map((feature) => (
                          <div key={feature} className="text-sm flex items-center text-muted-foreground">
                            <span className="w-1.5 h-1.5 rounded-full bg-primary mr-2"></span>
                            {feature}
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  <div className="flex space-x-2">
                    {connected ? (
                      <Button 
                        variant="outline" 
                        className="flex-1"
                        disabled={isLoading}
                      >
                        <Settings className="w-4 h-4 mr-2" />
                        Configure
                      </Button>
                    ) : (
                      <Button 
                        className="flex-1"
                        onClick={() => handleConnect(provider.id)}
                        disabled={isLoading}
                      >
                        {isLoading ? (
                          <>
                            <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                            Connecting...
                          </>
                        ) : (
                          <>
                            <Plus className="w-4 h-4 mr-2" />
                            Connect
                          </>
                        )}
                      </Button>
                    )}
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      </div>

      {/* User Discovery */}
      <div>
        <h2 className="text-xl font-semibold mb-4">Audience Discovery</h2>
        <SpotifyDiscoveryCard />
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