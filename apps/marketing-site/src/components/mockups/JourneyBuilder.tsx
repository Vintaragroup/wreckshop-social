import { Send, Mail, MessageSquare, Bell, Target, Users, Filter, ArrowRight, Play, Pause } from "lucide-react";
import { motion } from "motion/react";
import { useState, useEffect } from "react";

export function JourneyBuilder() {
  const [isPlaying, setIsPlaying] = useState(true);
  const [activeStep, setActiveStep] = useState(0);
  const [selectedChannel, setSelectedChannel] = useState<string | null>(null);

  // Simulate journey step progression
  useEffect(() => {
    if (!isPlaying) return;
    
    const interval = setInterval(() => {
      setActiveStep((prev) => (prev + 1) % 4);
    }, 2000);

    return () => clearInterval(interval);
  }, [isPlaying]);

  const journeySteps = [
    {
      type: "trigger",
      title: "Discovery Segment",
      description: "Fan saved on Spotify + Engaged on TikTok",
      icon: Target,
      color: "#00CFFF"
    },
    {
      type: "action",
      title: "Send Email",
      description: "Exclusive behind-the-scenes content",
      icon: Mail,
      color: "#8B5CF6"
    },
    {
      type: "delay",
      title: "Wait 24h",
      description: "If no open/click",
      icon: Filter,
      color: "#FF00FF"
    },
    {
      type: "action",
      title: "Push SMS",
      description: "Presale code for top 5-platform fans",
      icon: MessageSquare,
      color: "#00CFFF"
    }
  ];

  const stats = [
    { label: "Active Segments", value: "47", color: "#00CFFF" },
    { label: "Auto-Synced", value: "24hr", color: "#FF00FF" },
    { label: "Match Rate", value: "98%", color: "#00CFFF" },
    { label: "Fans Activated", value: "12.4K", color: "#FF00FF" }
  ];

  return (
    <div className="bg-gradient-to-br from-white to-gray-50 dark:from-[#1E1E1E] dark:to-[#0a0a0a] p-8 rounded-lg">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h3 className="text-2xl uppercase tracking-wide mb-1 text-foreground">Segment → Journey Activation</h3>
          <p className="text-sm text-muted-foreground">Turn Discovery Engine segments into automated campaigns</p>
        </div>
        <button className="px-4 py-2 rounded-lg bg-gradient-to-r from-[#00CFFF] to-[#FF00FF] text-white uppercase tracking-wider text-xs hover:opacity-90 transition-all">
          Build Journey
        </button>
      </div>

      {/* Stats Row - Discovery Specific */}
      <div className="grid grid-cols-4 gap-4 mb-8">
        {stats.map((stat, index) => (
          <motion.div
            key={stat.label}
            className="p-4 rounded-lg bg-white dark:bg-card/30 border border-gray-200 dark:border-border/30 shadow-sm dark:shadow-none"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
          >
            <div className="text-xs text-muted-foreground uppercase tracking-wider mb-2">
              {stat.label}
            </div>
            <div className="text-2xl font-bold text-foreground" style={{ color: stat.color }}>
              {stat.value}
            </div>
          </motion.div>
        ))}
      </div>

      {/* Journey Flow Visualization */}
      <div className="p-6 rounded-lg bg-white dark:bg-card/20 border border-gray-200 dark:border-border/30 mb-6 shadow-sm dark:shadow-none">
        <div className="flex items-center justify-between mb-6">
          <h4 className="uppercase tracking-wide text-sm text-muted-foreground">Example: Cross-Platform Superfan Journey</h4>
          <div className="flex gap-2">
            <div className="px-3 py-1 rounded bg-[#00FF00]/20 border border-[#00FF00]/50 text-xs uppercase tracking-wider text-[#00FF00]">
              Active
            </div>
            <div className="px-3 py-1 rounded bg-gray-100 dark:bg-card/50 border border-gray-300 dark:border-border/30 text-xs text-gray-700 dark:text-muted-foreground">
              2,847 fans enrolled
            </div>
          </div>
        </div>

        {/* Flow Steps */}
        <div className="relative">
          {/* Play/Pause Control */}
          <div className="absolute -top-12 right-0 z-10">
            <motion.button
              className="px-3 py-1 rounded bg-gradient-to-r from-[#00CFFF]/20 to-[#FF00FF]/20 border border-[#00CFFF]/50 text-[#00CFFF] text-xs uppercase tracking-wider hover:bg-[#00CFFF]/30 transition-all flex items-center gap-2"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setIsPlaying(!isPlaying)}
            >
              {isPlaying ? <Pause className="h-3 w-3" /> : <Play className="h-3 w-3" />}
              {isPlaying ? 'Pause' : 'Play'} Demo
            </motion.button>
          </div>

          <div className="flex items-center gap-4">
            {journeySteps.map((step, index) => (
              <div key={index} className="flex items-center flex-1">
                <motion.div
                  className="flex-1"
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ 
                    opacity: 1, 
                    scale: activeStep === index ? 1.05 : 1 
                  }}
                  transition={{ delay: index * 0.2 }}
                >
                  <motion.div 
                    className={`p-4 rounded-lg bg-gray-50 dark:bg-card/40 border transition-all group cursor-pointer ${
                      activeStep === index 
                        ? 'border-[#00CFFF] dark:border-[#00CFFF] shadow-lg' 
                        : 'border-gray-200 dark:border-border/30 hover:border-[#00CFFF]/50 dark:hover:border-primary/50'
                    }`}
                    onClick={() => setActiveStep(index)}
                  >
                    <div className="flex items-start gap-3">
                      <motion.div 
                        className="p-2 rounded-lg transition-transform group-hover:scale-110"
                        style={{ backgroundColor: `${step.color}20` }}
                        animate={activeStep === index ? { scale: [1, 1.1, 1] } : {}}
                        transition={{ duration: 0.5, repeat: activeStep === index ? Infinity : 0 }}
                      >
                        <step.icon className="h-5 w-5" style={{ color: step.color }} />
                      </motion.div>
                      <div className="flex-1 min-w-0">
                        <div className="text-xs uppercase tracking-wider text-muted-foreground mb-1">
                          {step.type}
                        </div>
                        <div className="text-sm font-medium text-foreground mb-1">{step.title}</div>
                        <div className="text-xs text-muted-foreground truncate">
                          {step.description}
                        </div>
                        {activeStep === index && (
                          <motion.div
                            initial={{ opacity: 0, height: 0 }}
                            animate={{ opacity: 1, height: 'auto' }}
                            className="mt-2 text-xs text-[#00CFFF]"
                          >
                            ⚡ Active Now
                          </motion.div>
                        )}
                      </div>
                    </div>
                  </motion.div>
                </motion.div>

                {/* Animated Arrow connector */}
                {index < journeySteps.length - 1 && (
                  <motion.div
                    className="px-2"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: index * 0.2 + 0.1 }}
                  >
                    <motion.div
                      animate={activeStep === index ? { x: [0, 5, 0] } : {}}
                      transition={{ duration: 0.8, repeat: activeStep === index ? Infinity : 0 }}
                    >
                      <ArrowRight 
                        className={`h-5 w-5 transition-colors ${
                          activeStep === index ? 'text-[#00CFFF]' : 'text-muted-foreground/30'
                        }`}
                      />
                    </motion.div>
                  </motion.div>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Channel Performance - Discovery Focused */}
      <div className="grid grid-cols-3 gap-4 mb-6">
        {[
          { name: "Email", icon: Mail, color: "#00CFFF", sent: "18.5K", rate: "72% open", metric: "Superfans" },
          { name: "SMS", icon: MessageSquare, color: "#FF00FF", sent: "12.3K", rate: "89% open", metric: "5-Platform Fans" },
          { name: "Push", icon: Bell, color: "#8B5CF6", sent: "14.4K", rate: "45% click", metric: "New Discoveries" }
        ].map((channel, index) => (
          <motion.div
            key={channel.name}
            className="p-4 rounded-lg bg-white dark:bg-card/30 border border-gray-200 dark:border-border/30 hover:border-[#00CFFF]/50 dark:hover:border-primary/50 transition-all shadow-sm dark:shadow-none"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
          >
            <div className="flex items-center gap-3 mb-4">
              <div 
                className="p-2 rounded-lg"
                style={{ backgroundColor: `${channel.color}20` }}
              >
                <channel.icon className="h-5 w-5" style={{ color: channel.color }} />
              </div>
              <div className="text-sm font-medium uppercase tracking-wider text-foreground">{channel.name}</div>
            </div>
            <div className="space-y-2 text-xs">
              <div className="flex justify-between">
                <span className="text-muted-foreground">Sent</span>
                <span className="font-medium text-foreground">{channel.sent}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Performance</span>
                <span style={{ color: channel.color }}>{channel.rate}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Segment</span>
                <span className="text-foreground text-xs">{channel.metric}</span>
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Discovery Engine Connection */}
      <div className="p-4 rounded-lg bg-gradient-to-r from-[#00CFFF]/10 to-[#FF00FF]/10 border border-[#00CFFF]/30">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Users className="h-5 w-5 text-[#00CFFF]" />
            <div>
              <div className="text-sm font-medium text-foreground">Powered by Discovery Engine Segments</div>
              <div className="text-xs text-muted-foreground">Real-time sync from Spotify, TikTok, Instagram, YouTube, Apple Music</div>
            </div>
          </div>
          <button className="px-3 py-1 rounded bg-white dark:bg-card/50 border border-gray-300 dark:border-border/30 text-xs uppercase tracking-wider text-gray-700 dark:text-muted-foreground hover:border-gray-400 dark:hover:border-border/50 transition-all">
            Manage Segments
          </button>
        </div>
      </div>
    </div>
  );
}