import { Music, Instagram, Youtube, CheckCircle2, Clock, AlertCircle, RefreshCw } from "lucide-react";
import { motion } from "motion/react";
import { useState } from "react";

export function IntegrationHub() {
  const [syncingAll, setSyncingAll] = useState(false);
  const [hoveredIntegration, setHoveredIntegration] = useState<string | null>(null);

  const integrations = [
    { 
      name: "Spotify for Artists", 
      icon: Music, 
      color: "#1DB954", 
      status: "connected",
      lastSync: "2 mins ago",
      metrics: "Saves, Playlists, Repeat Listeners"
    },
    { 
      name: "TikTok Creator", 
      icon: Music, 
      color: "#00F2EA", 
      status: "connected",
      lastSync: "5 mins ago",
      metrics: "Sound Uses, Creator Engagement"
    },
    { 
      name: "Instagram Business", 
      icon: Instagram, 
      color: "#E4405F", 
      status: "connected",
      lastSync: "1 min ago",
      metrics: "Reel Engagement, DM Activity"
    },
    { 
      name: "YouTube Analytics", 
      icon: Youtube, 
      color: "#FF0000", 
      status: "syncing",
      lastSync: "syncing...",
      metrics: "Watch Time, Geographic Data"
    },
    { 
      name: "Apple Music for Artists", 
      icon: Music, 
      color: "#FA57C1", 
      status: "connected",
      lastSync: "8 mins ago",
      metrics: "Pre-adds, Library Adds, Regions"
    },
    { 
      name: "SoundCloud", 
      icon: Music, 
      color: "#FF8800", 
      status: "disconnected",
      lastSync: "Not connected",
      metrics: "Connect to enable discovery"
    }
  ];

  const getStatusIcon = (status: string) => {
    switch(status) {
      case 'connected':
        return <CheckCircle2 className="h-4 w-4 text-[#00FF00]" />;
      case 'syncing':
        return <Clock className="h-4 w-4 text-[#00CFFF] animate-pulse" />;
      default:
        return <AlertCircle className="h-4 w-4 text-muted-foreground" />;
    }
  };

  return (
    <div className="bg-gradient-to-br from-white to-gray-50 dark:from-[#1E1E1E] dark:to-[#0a0a0a] p-8 rounded-lg">
      {/* Header */}
      <div className="mb-8">
        <h3 className="text-2xl uppercase tracking-wide mb-1 text-foreground">OAuth Integration Hub</h3>
        <p className="text-sm text-muted-foreground">Secure platform connections with auto-refreshing Stack Auth tokens</p>
      </div>

      {/* Connection Status Banner */}
      <div className="mb-8 p-4 rounded-lg bg-gradient-to-r from-[#00CFFF]/10 to-[#FF00FF]/10 border border-[#00CFFF]/30">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <motion.div 
              className="w-2 h-2 rounded-full bg-[#00FF00]"
              animate={{ scale: [1, 1.3, 1], opacity: [1, 0.6, 1] }}
              transition={{ duration: 2, repeat: Infinity }}
            />
            <div>
              <div className="text-sm font-medium text-foreground">All systems operational</div>
              <div className="text-xs text-muted-foreground">5 platforms streaming data • Auto-refresh: Active</div>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <div className="text-xs uppercase tracking-wider text-[#00CFFF] px-3 py-1 rounded bg-[#00CFFF]/20 border border-[#00CFFF]/50">
              OAuth 2.0 Secured
            </div>
            <motion.button
              className="px-3 py-1 rounded bg-gradient-to-r from-[#00CFFF]/20 to-[#FF00FF]/20 border border-[#00CFFF]/50 text-[#00CFFF] text-xs uppercase tracking-wider hover:bg-[#00CFFF]/30 transition-all flex items-center gap-2"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => {
                setSyncingAll(true);
                setTimeout(() => setSyncingAll(false), 3000);
              }}
            >
              <RefreshCw className={`h-3 w-3 ${syncingAll ? 'animate-spin' : ''}`} />
              {syncingAll ? 'Syncing...' : 'Sync All'}
            </motion.button>
          </div>
        </div>
      </div>

      {/* Platform Cards Grid */}
      <div className="grid grid-cols-2 gap-6">
        {integrations.map((integration, index) => (
          <motion.div
            key={integration.name}
            className="p-6 rounded-lg bg-white dark:bg-card/30 border border-gray-200 dark:border-border/30 hover:border-[#00CFFF]/50 dark:hover:border-primary/50 transition-all group shadow-sm dark:shadow-none"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: index * 0.1 }}
          >
            {/* Header */}
            <div className="flex items-start justify-between mb-4">
              <div className="flex items-center gap-3">
                <div 
                  className="p-3 rounded-lg transition-transform group-hover:scale-110"
                  style={{ backgroundColor: `${integration.color}20` }}
                >
                  <integration.icon 
                    className="h-6 w-6" 
                    style={{ color: integration.color }}
                  />
                </div>
                <div>
                  <h4 className="font-medium text-sm text-foreground">{integration.name}</h4>
                  <div className="flex items-center gap-2 mt-1">
                    {getStatusIcon(integration.status)}
                    <span className="text-xs text-muted-foreground capitalize">
                      {integration.status}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Metrics */}
            <div className="space-y-2 mb-4">
              <div className="flex justify-between text-xs">
                <span className="text-muted-foreground">Last Sync</span>
                <span className="text-foreground">{integration.lastSync}</span>
              </div>
              <div className="flex flex-col gap-1">
                <span className="text-xs text-muted-foreground">Discovery Metrics</span>
                <span className="text-xs text-foreground">{integration.metrics}</span>
              </div>
            </div>

            {/* Progress Bar */}
            {integration.status === 'syncing' && (
              <div className="mb-4">
                <div className="h-1 w-full bg-gray-200 dark:bg-card/50 rounded-full overflow-hidden">
                  <motion.div
                    className="h-full bg-gradient-to-r from-[#00CFFF] to-[#FF00FF]"
                    initial={{ width: '0%' }}
                    animate={{ width: '100%' }}
                    transition={{ duration: 2, repeat: Infinity }}
                  />
                </div>
                <div className="text-xs text-muted-foreground mt-1">Fetching identity data...</div>
              </div>
            )}

            {/* Action Button */}
            <button 
              className={`w-full py-2 rounded-lg text-xs uppercase tracking-wider transition-all ${
                integration.status === 'disconnected'
                  ? 'bg-gradient-to-r from-[#00CFFF]/20 to-[#FF00FF]/20 border border-[#00CFFF]/50 text-[#00CFFF] hover:bg-[#00CFFF]/30'
                  : 'bg-gray-100 dark:bg-card/50 border border-gray-300 dark:border-border/30 text-gray-700 dark:text-muted-foreground hover:border-gray-400 dark:hover:border-border/50'
              }`}
            >
              {integration.status === 'disconnected' ? 'Connect via OAuth' : 'Manage Connection'}
            </button>
          </motion.div>
        ))}
      </div>

      {/* Token Status Footer */}
      <div className="mt-8 p-4 rounded-lg bg-white dark:bg-card/20 border border-gray-200 dark:border-border/30 shadow-sm dark:shadow-none">
        <div className="flex items-center justify-between text-xs">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="h-4 w-4 text-[#00CFFF]" />
            <span className="text-muted-foreground">Stack Auth auto-refresh: <span className="text-foreground">Enabled</span></span>
          </div>
          <div className="flex items-center gap-4">
            <span className="text-muted-foreground">Next refresh: <span className="text-foreground">12 hours</span></span>
            <span className="text-muted-foreground">API uptime: <span className="text-[#00FF00]">99.9%</span></span>
          </div>
        </div>
      </div>
    </div>
  );
}