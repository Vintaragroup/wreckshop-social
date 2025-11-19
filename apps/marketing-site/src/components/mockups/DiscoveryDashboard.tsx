import { Music, Instagram, Youtube, TrendingUp, Users, MapPin, Zap, Globe, Network } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import { useState, useEffect } from "react";

export function DiscoveryDashboard() {
  const [selectedDay, setSelectedDay] = useState<number | null>(null);
  const [hoveredPlatform, setHoveredPlatform] = useState<string | null>(null);
  const [expandedFan, setExpandedFan] = useState<string | null>(null);
  const [activeView, setActiveView] = useState<'velocity' | 'network' | 'geo'>('velocity');
  const [realtimeUpdates, setRealtimeUpdates] = useState<any[]>([]);
  const [hoveredNode, setHoveredNode] = useState<string | null>(null);

  const platforms = [
    { name: "Spotify", icon: Music, color: "#1DB954", listeners: 124500, growth: 12, newToday: 420 },
    { name: "TikTok", icon: Music, color: "#00F2EA", listeners: 89200, growth: 34, newToday: 890 },
    { name: "Instagram", icon: Instagram, color: "#E4405F", listeners: 67800, growth: 8, newToday: 210 },
    { name: "YouTube", icon: Youtube, color: "#FF0000", listeners: 45300, growth: 18, newToday: 340 },
    { name: "Apple Music", icon: Music, color: "#FA57C1", listeners: 38900, growth: 15, newToday: 280 }
  ];

  const chartData = [
    { day: "Mon", newFans: 245, matches: 172, avg: 208 },
    { day: "Tue", newFans: 362, matches: 253, avg: 307 },
    { day: "Wed", newFans: 295, matches: 207, avg: 251 },
    { day: "Thu", newFans: 478, matches: 335, avg: 406 },
    { day: "Fri", newFans: 525, matches: 368, avg: 446 },
    { day: "Sat", newFans: 612, matches: 429, avg: 520 },
    { day: "Sun", newFans: 689, matches: 482, avg: 585 }
  ];

  // Geographic data for bubble map
  const geoData = [
    { city: "Los Angeles", lat: 34, lng: -118, fans: 12400, growth: 18 },
    { city: "New York", lat: 40.7, lng: -74, fans: 9800, growth: 12 },
    { city: "Atlanta", lat: 33.7, lng: -84.4, fans: 8600, growth: 24 },
    { city: "Miami", lat: 25.8, lng: -80.2, fans: 6200, growth: 15 },
    { city: "Chicago", lat: 41.9, lng: -87.6, fans: 5400, growth: 9 },
    { city: "Austin", lat: 30.3, lng: -97.7, fans: 4100, growth: 31 }
  ];

  // Network graph data showing platform connections
  const networkNodes = [
    { id: "spotify", x: 50, y: 50, color: "#1DB954", size: 40, fans: 124500 },
    { id: "tiktok", x: 20, y: 20, color: "#00F2EA", size: 35, fans: 89200 },
    { id: "instagram", x: 80, y: 25, color: "#E4405F", size: 30, fans: 67800 },
    { id: "youtube", x: 25, y: 75, color: "#FF0000", size: 28, fans: 45300 },
    { id: "apple", x: 75, y: 75, color: "#FA57C1", size: 26, fans: 38900 }
  ];

  const networkEdges = [
    { from: "spotify", to: "tiktok", strength: 85, fans: 12400 },
    { from: "spotify", to: "instagram", strength: 72, fans: 8900 },
    { from: "spotify", to: "youtube", strength: 65, fans: 6700 },
    { from: "spotify", to: "apple", strength: 58, fans: 5200 },
    { from: "tiktok", to: "instagram", strength: 78, fans: 9800 },
    { from: "tiktok", to: "youtube", strength: 45, fans: 4100 },
    { from: "instagram", to: "youtube", strength: 52, fans: 5600 },
    { from: "youtube", to: "apple", strength: 38, fans: 2800 }
  ];

  const topFans = [
    { 
      name: "Sarah M.", 
      platforms: 5, 
      engagement: 98, 
      location: "Los Angeles, CA",
      details: "Last seen: Spotify 2m ago • Saved 12 tracks • Shared to 3 playlists"
    },
    { 
      name: "Marcus T.", 
      platforms: 4, 
      engagement: 94, 
      location: "Atlanta, GA",
      details: "Last seen: TikTok 15m ago • Created 2 videos • 45K video views"
    },
    { 
      name: "Elena R.", 
      platforms: 5, 
      engagement: 91, 
      location: "Miami, FL",
      details: "Last seen: Instagram 8m ago • Posted 5 stories • 892 interactions"
    },
    { 
      name: "Jordan K.", 
      platforms: 3, 
      engagement: 87, 
      location: "New York, NY",
      details: "Last seen: YouTube 1h ago • Watched 8 videos • Avg 92% watch time"
    }
  ];

  // Simulate real-time discovery updates
  useEffect(() => {
    const names = ["Alex K.", "Jordan M.", "Sam P.", "Taylor R.", "Morgan L.", "Casey W."];
    const platforms = ["Spotify + TikTok", "Instagram + YouTube", "All 5 platforms", "Spotify + Apple"];
    
    const interval = setInterval(() => {
      const newUpdate = {
        id: Date.now(),
        name: names[Math.floor(Math.random() * names.length)],
        platforms: platforms[Math.floor(Math.random() * platforms.length)],
        affinity: Math.floor(Math.random() * 20) + 80
      };
      
      setRealtimeUpdates(prev => [newUpdate, ...prev].slice(0, 5));
    }, 3000);

    return () => clearInterval(interval);
  }, []);

  const formatNumber = (num: number) => {
    if (num >= 1000) return `${(num / 1000).toFixed(1)}K`;
    return num.toString();
  };

  return (
    <div className="bg-gradient-to-br from-white to-gray-50 dark:from-[#1E1E1E] dark:to-[#0a0a0a] p-8 rounded-lg">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h3 className="text-2xl uppercase tracking-wide mb-1 text-foreground">Cross-Platform Discovery</h3>
          <p className="text-sm text-muted-foreground">Real-time audience intelligence across 5 platforms</p>
        </div>
        <div className="px-4 py-2 rounded-lg bg-[#00CFFF]/20 border border-[#00CFFF]/50 cursor-pointer hover:bg-[#00CFFF]/30 transition-all">
          <div className="flex items-center gap-2">
            <motion.div 
              className="w-2 h-2 rounded-full bg-[#00CFFF]"
              animate={{ scale: [1, 1.3, 1], opacity: [1, 0.5, 1] }}
              transition={{ duration: 2, repeat: Infinity }}
            />
            <span className="text-sm uppercase tracking-wider text-[#00CFFF]">Live Sync</span>
          </div>
        </div>
      </div>

      {/* Platform Stats Grid with Hover Effects */}
      <div className="grid grid-cols-5 gap-4 mb-8">
        {platforms.map((platform, index) => (
          <motion.div
            key={platform.name}
            className="p-4 rounded-lg bg-white dark:bg-card/30 border border-gray-200 dark:border-border/30 hover:border-[#00CFFF]/50 dark:hover:border-primary/50 transition-all shadow-sm dark:shadow-none cursor-pointer relative overflow-hidden"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            whileHover={{ y: -4, scale: 1.02 }}
            transition={{ delay: index * 0.1 }}
            onMouseEnter={() => setHoveredPlatform(platform.name)}
            onMouseLeave={() => setHoveredPlatform(null)}
          >
            <div className="flex items-center gap-2 mb-3">
              <motion.div 
                className="p-2 rounded-lg"
                style={{ backgroundColor: `${platform.color}20` }}
                whileHover={{ rotate: 360 }}
                transition={{ duration: 0.5 }}
              >
                <platform.icon className="h-4 w-4" style={{ color: platform.color }} />
              </motion.div>
            </div>
            <div className="space-y-1">
              <div className="text-xs text-muted-foreground uppercase tracking-wider">
                {platform.name}
              </div>
              <motion.div 
                className="text-xl font-bold text-foreground"
                key={platform.listeners}
              >
                {formatNumber(platform.listeners)}
              </motion.div>
              <div className="text-xs font-semibold" style={{ color: platform.color }}>
                +{platform.growth}%
              </div>
            </div>

            {/* Hover Tooltip */}
            {hoveredPlatform === platform.name && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="absolute inset-0 bg-gradient-to-br from-white/95 to-gray-50/95 dark:from-[#1E1E1E]/95 dark:to-[#0a0a0a]/95 p-4 flex flex-col justify-center"
              >
                <div className="text-xs text-muted-foreground mb-1">New today</div>
                <div className="text-2xl font-bold" style={{ color: platform.color }}>
                  +{platform.newToday}
                </div>
                <div className="text-xs text-muted-foreground mt-2">
                  {platform.growth > 20 ? "🔥 Trending" : "📈 Growing"}
                </div>
              </motion.div>
            )}
          </motion.div>
        ))}
      </div>

      {/* Main Visualization Area with Tabs */}
      <div className="mb-8 p-6 rounded-lg bg-white dark:bg-card/20 border border-gray-200 dark:border-border/30 shadow-sm dark:shadow-none">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-4">
            <h4 className="uppercase tracking-wide text-sm text-muted-foreground">Discovery Intelligence</h4>
            <div className="flex gap-2">
              <button
                onClick={() => setActiveView('velocity')}
                className={`px-3 py-1 rounded text-xs uppercase tracking-wider transition-all ${
                  activeView === 'velocity'
                    ? 'bg-gradient-to-r from-[#00CFFF]/20 to-[#FF00FF]/20 border border-[#00CFFF]/50 text-[#00CFFF]'
                    : 'bg-gray-100 dark:bg-card/50 border border-gray-300 dark:border-border/30 text-gray-700 dark:text-muted-foreground hover:border-gray-400 dark:hover:border-border/50'
                }`}
              >
                📊 Velocity
              </button>
              <button
                onClick={() => setActiveView('network')}
                className={`px-3 py-1 rounded text-xs uppercase tracking-wider transition-all ${
                  activeView === 'network'
                    ? 'bg-gradient-to-r from-[#00CFFF]/20 to-[#FF00FF]/20 border border-[#00CFFF]/50 text-[#00CFFF]'
                    : 'bg-gray-100 dark:bg-card/50 border border-gray-300 dark:border-border/30 text-gray-700 dark:text-muted-foreground hover:border-gray-400 dark:hover:border-border/50'
                }`}
              >
                🕸️ Network
              </button>
              <button
                onClick={() => setActiveView('geo')}
                className={`px-3 py-1 rounded text-xs uppercase tracking-wider transition-all ${
                  activeView === 'geo'
                    ? 'bg-gradient-to-r from-[#00CFFF]/20 to-[#FF00FF]/20 border border-[#00CFFF]/50 text-[#00CFFF]'
                    : 'bg-gray-100 dark:bg-card/50 border border-gray-300 dark:border-border/30 text-gray-700 dark:text-muted-foreground hover:border-gray-400 dark:hover:border-border/50'
                }`}
              >
                🌍 Geographic
              </button>
            </div>
          </div>
          {activeView === 'velocity' && (
            <div className="flex gap-4 text-xs">
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-[#00CFFF]" />
                <span className="text-muted-foreground">New Superfans</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-[#FF00FF]" />
                <span className="text-muted-foreground">Cross-Platform</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-gray-400 dark:bg-gray-600" />
                <span className="text-muted-foreground">7-Day Avg</span>
              </div>
            </div>
          )}
        </div>
        
        <AnimatePresence mode="wait">
          {/* Velocity Chart View */}
          {activeView === 'velocity' && (
            <motion.div
              key="velocity"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 20 }}
              className="space-y-4"
            >
              {/* Enhanced bar chart with trend line */}
              <div className="relative">
                <div className="flex items-end justify-between gap-2 h-48 relative">
                  {chartData.map((data, i) => (
                    <div 
                      key={i} 
                      className="flex-1 flex flex-col items-center gap-1 cursor-pointer relative"
                      onMouseEnter={() => setSelectedDay(i)}
                      onMouseLeave={() => setSelectedDay(null)}
                    >
                      <div className="w-full flex flex-col-reverse gap-1 h-full justify-end">
                        <motion.div 
                          className="w-full rounded-t bg-gradient-to-t from-[#00CFFF] to-[#00CFFF]/50 hover:from-[#00CFFF]/80 hover:to-[#00CFFF]/30 transition-all"
                          initial={{ height: 0 }}
                          animate={{ height: `${(data.newFans / 689) * 100}%` }}
                          transition={{ delay: i * 0.1, duration: 0.5 }}
                        />
                        <motion.div 
                          className="w-full rounded-t bg-gradient-to-t from-[#FF00FF] to-[#FF00FF]/50 hover:from-[#FF00FF]/80 hover:to-[#FF00FF]/30 transition-all"
                          initial={{ height: 0 }}
                          animate={{ height: `${(data.matches / 689) * 100}%` }}
                          transition={{ delay: i * 0.1 + 0.2, duration: 0.5 }}
                        />
                      </div>

                      {/* Tooltip on hover */}
                      {selectedDay === i && (
                        <motion.div
                          initial={{ opacity: 0, y: -10 }}
                          animate={{ opacity: 1, y: -10 }}
                          className="absolute -top-24 left-1/2 -translate-x-1/2 bg-gray-900 dark:bg-white text-white dark:text-gray-900 px-3 py-2 rounded-lg text-xs whitespace-nowrap z-10 shadow-lg"
                        >
                          <div className="font-bold text-[#00CFFF]">{data.newFans} new fans</div>
                          <div className="text-[#FF00FF]">{data.matches} matched</div>
                          <div className="text-gray-400 dark:text-gray-600">Avg: {data.avg}</div>
                          <div className="absolute bottom-0 left-1/2 -translate-x-1/2 translate-y-1/2 w-2 h-2 bg-gray-900 dark:bg-white rotate-45" />
                        </motion.div>
                      )}
                    </div>
                  ))}

                  {/* Trend line overlay */}
                  <svg className="absolute inset-0 pointer-events-none" style={{ width: '100%', height: '100%' }}>
                    <motion.path
                      d={`M ${chartData.map((d, i) => `${(i / (chartData.length - 1)) * 100}%,${100 - (d.avg / 689) * 100}%`).join(' L ')}`}
                      stroke="rgba(128, 128, 128, 0.5)"
                      strokeWidth="2"
                      fill="none"
                      strokeDasharray="5,5"
                      initial={{ pathLength: 0 }}
                      animate={{ pathLength: 1 }}
                      transition={{ duration: 1.5, delay: 0.5 }}
                    />
                  </svg>
                </div>
                <div className="flex justify-between mt-3 text-xs text-muted-foreground">
                  {chartData.map((data, i) => (
                    <span key={i} className={selectedDay === i ? "text-[#00CFFF] font-bold" : ""}>{data.day}</span>
                  ))}
                </div>
              </div>

              {/* Platform Breakdown Grid */}
              <div className="grid grid-cols-5 gap-3">
                {[
                  { platform: "Spotify", color: "#1DB954", discovered: 1847, matched: 1293, icon: Music },
                  { platform: "TikTok", color: "#00F2EA", discovered: 2134, matched: 1494, icon: Music },
                  { platform: "Instagram", color: "#E4405F", discovered: 1256, matched: 879, icon: Instagram },
                  { platform: "YouTube", color: "#FF0000", discovered: 987, matched: 691, icon: Youtube },
                  { platform: "Apple Music", color: "#FA57C1", matched: 823, discovered: 643, icon: Music }
                ].map((item, i) => (
                  <motion.div
                    key={item.platform}
                    className="p-3 rounded-lg bg-gray-50 dark:bg-card/40 border border-gray-200 dark:border-border/30 hover:border-[#00CFFF]/50 transition-all"
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    whileHover={{ scale: 1.05 }}
                    transition={{ delay: i * 0.1 }}
                  >
                    <div className="flex items-center gap-2 mb-2">
                      <div 
                        className="p-1.5 rounded"
                        style={{ backgroundColor: `${item.color}20` }}
                      >
                        <item.icon className="h-3 w-3" style={{ color: item.color }} />
                      </div>
                      <div className="text-xs font-medium text-foreground truncate">{item.platform}</div>
                    </div>
                    <div className="space-y-1">
                      <div className="flex justify-between text-xs">
                        <span className="text-muted-foreground">Discovered</span>
                        <span className="font-bold" style={{ color: item.color }}>{formatNumber(item.discovered)}</span>
                      </div>
                      <div className="flex justify-between text-xs">
                        <span className="text-muted-foreground">Matched</span>
                        <span className="text-[#FF00FF]">{formatNumber(item.matched)}</span>
                      </div>
                      <div className="mt-2 h-1 bg-gray-200 dark:bg-card/50 rounded-full overflow-hidden">
                        <motion.div
                          className="h-full rounded-full"
                          style={{ backgroundColor: item.color }}
                          initial={{ width: 0 }}
                          animate={{ width: `${(item.matched / item.discovered) * 100}%` }}
                          transition={{ delay: i * 0.1 + 0.5, duration: 0.8 }}
                        />
                      </div>
                      <div className="text-xs text-center text-muted-foreground">
                        {Math.round((item.matched / item.discovered) * 100)}% match rate
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>

              {/* Hourly Velocity Heatmap */}
              <div className="p-4 rounded-lg bg-gray-50 dark:bg-card/40 border border-gray-200 dark:border-border/30">
                <div className="flex items-center justify-between mb-3">
                  <div className="text-xs uppercase tracking-wider text-muted-foreground">Hourly Discovery Velocity (Today)</div>
                  <div className="flex items-center gap-3 text-xs">
                    <div className="flex items-center gap-1">
                      <div className="w-3 h-3 rounded" style={{ backgroundColor: 'rgba(0, 207, 255, 0.2)' }} />
                      <span className="text-muted-foreground">Low</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <div className="w-3 h-3 rounded" style={{ backgroundColor: 'rgba(0, 207, 255, 0.6)' }} />
                      <span className="text-muted-foreground">Medium</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <div className="w-3 h-3 rounded bg-[#00CFFF]" />
                      <span className="text-muted-foreground">High</span>
                    </div>
                  </div>
                </div>
                
                <div className="grid grid-cols-12 gap-2">
                  {[
                    12, 8, 15, 24, 38, 52, 67, 89, 95, 78, 84, 92, // 12am-11am
                    88, 82, 75, 69, 73, 81, 87, 94, 98, 91, 76, 58  // 12pm-11pm
                  ].map((intensity, i) => (
                    <motion.div
                      key={i}
                      className="aspect-square rounded cursor-pointer relative group"
                      style={{ 
                        backgroundColor: `rgba(0, 207, 255, ${intensity / 100})` 
                      }}
                      initial={{ opacity: 0, scale: 0 }}
                      animate={{ opacity: 1, scale: 1 }}
                      whileHover={{ scale: 1.2, zIndex: 10 }}
                      transition={{ delay: i * 0.02 }}
                    >
                      {/* Hover tooltip */}
                      <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none">
                        <div className="bg-gray-900 dark:bg-white text-white dark:text-gray-900 px-2 py-1 rounded text-xs whitespace-nowrap shadow-lg">
                          <div className="font-bold">{i % 12 || 12}{i < 12 ? 'am' : 'pm'}</div>
                          <div className="text-[#00CFFF]">{Math.round(intensity * 8.5)} fans</div>
                          <div className="absolute top-full left-1/2 -translate-x-1/2 -mt-1 w-1.5 h-1.5 bg-gray-900 dark:bg-white rotate-45" />
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </div>
                
                <div className="grid grid-cols-12 gap-2 mt-2 text-xs text-muted-foreground text-center">
                  {['12a', '1a', '2a', '3a', '4a', '5a', '6a', '7a', '8a', '9a', '10a', '11a'].map((hour, i) => (
                    <div key={i}>{i % 3 === 0 ? hour : ''}</div>
                  ))}
                </div>
                <div className="grid grid-cols-12 gap-2 mt-1 text-xs text-muted-foreground text-center">
                  {['12p', '1p', '2p', '3p', '4p', '5p', '6p', '7p', '8p', '9p', '10p', '11p'].map((hour, i) => (
                    <div key={i}>{i % 3 === 0 ? hour : ''}</div>
                  ))}
                </div>
              </div>

              {/* Conversion Funnel */}
              <div className="grid grid-cols-4 gap-3">
                {[
                  { label: "Total Discovered", value: 8690, color: "#00CFFF", width: 100 },
                  { label: "Identity Matched", value: 6703, color: "#FF00FF", width: 77 },
                  { label: "High Affinity (80+)", value: 4825, color: "#8B5CF6", width: 55 },
                  { label: "Superfans (5 Platforms)", value: 2140, color: "#00FF00", width: 25 }
                ].map((stage, i) => (
                  <motion.div
                    key={stage.label}
                    className="p-3 rounded-lg bg-gray-50 dark:bg-card/40 border border-gray-200 dark:border-border/30"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: i * 0.1 }}
                  >
                    <div className="text-xs text-muted-foreground mb-2 uppercase tracking-wider">{stage.label}</div>
                    <div className="text-2xl font-bold mb-2" style={{ color: stage.color }}>
                      {formatNumber(stage.value)}
                    </div>
                    <div className="h-2 bg-gray-200 dark:bg-card/50 rounded-full overflow-hidden">
                      <motion.div
                        className="h-full rounded-full"
                        style={{ backgroundColor: stage.color }}
                        initial={{ width: 0 }}
                        animate={{ width: `${stage.width}%` }}
                        transition={{ delay: i * 0.1 + 0.5, duration: 0.8 }}
                      />
                    </div>
                    <div className="text-xs text-muted-foreground mt-1">
                      {i > 0 && `${Math.round((stage.value / 8690) * 100)}% of total`}
                    </div>
                  </motion.div>
                ))}
              </div>

              {/* Forecast indicator */}
              <div className="flex items-center justify-between p-3 rounded-lg bg-gradient-to-r from-[#00CFFF]/10 to-[#FF00FF]/10 border border-[#00CFFF]/30">
                <div className="flex items-center gap-2 text-xs">
                  <TrendingUp className="h-4 w-4 text-[#00CFFF]" />
                  <span className="text-muted-foreground">7-day forecast:</span>
                  <span className="text-foreground font-bold">+23% growth trajectory</span>
                </div>
                <div className="text-xs text-[#00CFFF]">
                  Projected: <span className="font-bold">850+ fans/day</span>
                </div>
              </div>
            </motion.div>
          )}

          {/* Network Graph View */}
          {activeView === 'network' && (
            <motion.div
              key="network"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 20 }}
              className="h-64 relative"
            >
              <svg className="w-full h-full">
                {/* Draw edges first */}
                {networkEdges.map((edge, i) => {
                  const fromNode = networkNodes.find(n => n.id === edge.from);
                  const toNode = networkNodes.find(n => n.id === edge.to);
                  if (!fromNode || !toNode) return null;
                  
                  return (
                    <motion.line
                      key={i}
                      x1={`${fromNode.x}%`}
                      y1={`${fromNode.y}%`}
                      x2={`${toNode.x}%`}
                      y2={`${toNode.y}%`}
                      stroke={hoveredNode === edge.from || hoveredNode === edge.to ? "#00CFFF" : "rgba(128, 128, 128, 0.2)"}
                      strokeWidth={hoveredNode === edge.from || hoveredNode === edge.to ? edge.strength / 15 : edge.strength / 20}
                      initial={{ pathLength: 0, opacity: 0 }}
                      animate={{ pathLength: 1, opacity: 1 }}
                      transition={{ duration: 1, delay: i * 0.1 }}
                    />
                  );
                })}

                {/* Draw nodes */}
                {networkNodes.map((node, i) => (
                  <g key={node.id}>
                    <motion.circle
                      cx={`${node.x}%`}
                      cy={`${node.y}%`}
                      r={hoveredNode === node.id ? node.size * 1.2 : node.size}
                      fill={node.color}
                      opacity={0.2}
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      transition={{ delay: i * 0.1, duration: 0.5 }}
                      onMouseEnter={() => setHoveredNode(node.id)}
                      onMouseLeave={() => setHoveredNode(null)}
                      className="cursor-pointer"
                    />
                    <motion.circle
                      cx={`${node.x}%`}
                      cy={`${node.y}%`}
                      r={hoveredNode === node.id ? node.size * 0.6 : node.size * 0.5}
                      fill={node.color}
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      transition={{ delay: i * 0.1 + 0.2, duration: 0.5 }}
                      onMouseEnter={() => setHoveredNode(node.id)}
                      onMouseLeave={() => setHoveredNode(null)}
                      className="cursor-pointer"
                    />
                    {hoveredNode === node.id && (
                      <motion.text
                        x={`${node.x}%`}
                        y={`${node.y + 15}%`}
                        textAnchor="middle"
                        className="text-xs font-bold fill-current text-foreground"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                      >
                        {formatNumber(node.fans)} fans
                      </motion.text>
                    )}
                  </g>
                ))}
              </svg>
              
              <div className="absolute bottom-0 left-0 right-0 text-center text-xs text-muted-foreground">
                Hover over nodes to see cross-platform fan overlap • Larger nodes = more fans
              </div>
            </motion.div>
          )}

          {/* Geographic Bubble Map View */}
          {activeView === 'geo' && (
            <motion.div
              key="geo"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 20 }}
              className="space-y-4"
            >
              {/* Simple bubble map visualization */}
              <div className="grid grid-cols-3 gap-4">
                {geoData.map((location, i) => (
                  <motion.div
                    key={location.city}
                    className="p-4 rounded-lg bg-gray-50 dark:bg-card/40 border border-gray-200 dark:border-border/30 hover:border-[#00CFFF]/50 transition-all cursor-pointer"
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    whileHover={{ scale: 1.05 }}
                    transition={{ delay: i * 0.1 }}
                  >
                    <div className="flex items-center gap-3 mb-3">
                      <motion.div
                        className="rounded-full bg-gradient-to-br from-[#00CFFF] to-[#FF00FF]"
                        style={{ 
                          width: `${(location.fans / 12400) * 40 + 20}px`,
                          height: `${(location.fans / 12400) * 40 + 20}px`
                        }}
                        animate={{ scale: [1, 1.1, 1] }}
                        transition={{ duration: 2, repeat: Infinity, delay: i * 0.2 }}
                      />
                      <div className="flex-1">
                        <div className="text-sm font-bold text-foreground">{location.city}</div>
                        <div className="text-xs text-muted-foreground flex items-center gap-1">
                          <MapPin className="h-3 w-3" />
                          {location.lat.toFixed(1)}°, {location.lng.toFixed(1)}°
                        </div>
                      </div>
                    </div>
                    <div className="space-y-1 text-xs">
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Superfans</span>
                        <span className="font-bold text-[#00CFFF]">{formatNumber(location.fans)}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Growth</span>
                        <span className="font-bold text-[#FF00FF]">+{location.growth}%</span>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Two Column Layout: Superfans Table + Real-time Feed */}
      <div className="grid grid-cols-2 gap-6">
        {/* Expandable Superfans Table */}
        <div className="p-6 rounded-lg bg-white dark:bg-card/20 border border-gray-200 dark:border-border/30 shadow-sm dark:shadow-none">
          <div className="flex items-center justify-between mb-4">
            <h4 className="uppercase tracking-wide text-sm text-muted-foreground">Top Superfans</h4>
            <motion.div 
              className="text-xs text-[#00CFFF]"
              animate={{ opacity: [1, 0.5, 1] }}
              transition={{ duration: 2, repeat: Infinity }}
            >
              98% Match Confidence
            </motion.div>
          </div>
          <div className="space-y-3">
            {topFans.map((fan, index) => (
              <motion.div
                key={fan.name}
                className="rounded-lg bg-gray-50 dark:bg-card/30 border border-gray-200 dark:border-border/20 hover:border-[#00CFFF]/50 transition-all cursor-pointer overflow-hidden"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.1 }}
                whileHover={{ x: 4 }}
                onClick={() => setExpandedFan(expandedFan === fan.name ? null : fan.name)}
              >
                <div className="flex items-center justify-between p-3">
                  <div className="flex items-center gap-3 flex-1">
                    <motion.div 
                      className="w-8 h-8 rounded-full bg-gradient-to-br from-[#00CFFF] to-[#FF00FF] flex items-center justify-center text-xs font-bold text-white"
                      whileHover={{ scale: 1.1, rotate: 5 }}
                    >
                      {fan.name.split(' ').map(n => n[0]).join('')}
                    </motion.div>
                    <div className="flex-1 min-w-0">
                      <div className="text-sm font-medium text-foreground">{fan.name}</div>
                      <div className="flex items-center gap-2 text-xs text-muted-foreground truncate">
                        <MapPin className="h-3 w-3 flex-shrink-0" />
                        {fan.location}
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-3 text-xs flex-shrink-0">
                    <div className="text-center">
                      <div className="text-muted-foreground mb-1">Linked</div>
                      <motion.div 
                        className="font-bold text-[#00CFFF]"
                        whileHover={{ scale: 1.2 }}
                      >
                        {fan.platforms}/5
                      </motion.div>
                    </div>
                    <div className="text-center">
                      <div className="text-muted-foreground mb-1">Score</div>
                      <motion.div 
                        className="font-bold text-[#FF00FF]"
                        whileHover={{ scale: 1.2 }}
                      >
                        {fan.engagement}
                      </motion.div>
                    </div>
                  </div>
                </div>

                {/* Expanded Details */}
                {expandedFan === fan.name && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: "auto", opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    className="px-3 pb-3 pt-0 border-t border-gray-200 dark:border-border/20"
                  >
                    <div className="text-xs text-muted-foreground mt-3 flex items-center gap-2">
                      <div className="w-1 h-1 rounded-full bg-[#00CFFF] animate-pulse flex-shrink-0" />
                      <span className="truncate">{fan.details}</span>
                    </div>
                  </motion.div>
                )}
              </motion.div>
            ))}
          </div>
        </div>

        {/* Real-time Discovery Feed */}
        <div className="p-6 rounded-lg bg-white dark:bg-card/20 border border-gray-200 dark:border-border/30 shadow-sm dark:shadow-none">
          <div className="flex items-center justify-between mb-4">
            <h4 className="uppercase tracking-wide text-sm text-muted-foreground flex items-center gap-2">
              <Zap className="h-4 w-4 text-[#00CFFF]" />
              Live Discovery Feed
            </h4>
            <motion.div
              className="w-2 h-2 rounded-full bg-[#00FF00]"
              animate={{ scale: [1, 1.3, 1], opacity: [1, 0.5, 1] }}
              transition={{ duration: 2, repeat: Infinity }}
            />
          </div>
          
          <div className="space-y-2">
            <AnimatePresence mode="popLayout">
              {realtimeUpdates.length === 0 ? (
                <div className="text-xs text-muted-foreground text-center py-8">
                  Waiting for new fan matches...
                </div>
              ) : (
                realtimeUpdates.map((update) => (
                  <motion.div
                    key={update.id}
                    initial={{ opacity: 0, x: -20, height: 0 }}
                    animate={{ opacity: 1, x: 0, height: "auto" }}
                    exit={{ opacity: 0, x: 20, height: 0 }}
                    className="p-3 rounded-lg bg-gradient-to-r from-[#00CFFF]/10 to-[#FF00FF]/10 border border-[#00CFFF]/30"
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <div className="w-6 h-6 rounded-full bg-gradient-to-br from-[#00CFFF] to-[#FF00FF] flex items-center justify-center text-xs font-bold text-white">
                          {update.name.split(' ').map((n: string) => n[0]).join('')}
                        </div>
                        <div>
                          <div className="text-xs font-medium text-foreground">{update.name}</div>
                          <div className="text-xs text-muted-foreground">{update.platforms}</div>
                        </div>
                      </div>
                      <div className="text-xs">
                        <span className="text-muted-foreground">Affinity: </span>
                        <span className="font-bold text-[#FF00FF]">{update.affinity}</span>
                      </div>
                    </div>
                  </motion.div>
                ))
              )}
            </AnimatePresence>
          </div>
          
          {realtimeUpdates.length > 0 && (
            <div className="mt-4 pt-4 border-t border-gray-200 dark:border-border/20 text-center">
              <div className="text-xs text-muted-foreground">
                <span className="font-bold text-[#00CFFF]">{realtimeUpdates.length * 3}</span> new matches in the last minute
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}