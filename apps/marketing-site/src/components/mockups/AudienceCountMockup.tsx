import { Card, CardContent } from "../ui/card";
import { motion } from "motion/react";
import { useState } from "react";
import { Users, Clock, TrendingUp, MapPin } from "lucide-react";

export function AudienceCountMockup() {
  const [selectedTimeWindow, setSelectedTimeWindow] = useState(30);

  const timeWindows = [
    { days: 7, label: "7 days", count: 892, growth: 12 },
    { days: 30, label: "30 days", count: 2847, growth: 24 },
    { days: 90, label: "90 days", count: 5120, growth: 18 }
  ];

  const currentWindow = timeWindows.find(w => w.days === selectedTimeWindow)!;

  const segments = [
    { 
      name: "High-Value VIPs", 
      count: 234, 
      description: "Purchased merch + attended 2+ shows",
      color: "#FF00FF",
      engagementRate: 87
    },
    { 
      name: "Street Team", 
      count: 456, 
      description: "Shared content + replied to SMS",
      color: "#00CFFF",
      engagementRate: 76
    },
    { 
      name: "Tour Market: Austin", 
      count: 1248, 
      description: "Within 25mi + streamed new single",
      color: "#FF00FF",
      engagementRate: 64
    },
    { 
      name: "Pre-Save Fans", 
      count: 2104, 
      description: "Pre-saved album + opened email",
      color: "#00CFFF",
      engagementRate: 58
    }
  ];

  return (
    <Card className="bg-card/50 backdrop-blur-sm border-primary/30 overflow-hidden">
      <CardContent className="p-6 space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-xl uppercase tracking-wide mb-1">Audience Count & Time Windows</h3>
            <p className="text-sm text-muted-foreground">
              Watch segments grow and auto-prune with time-based filters
            </p>
          </div>
          <div className="px-3 py-1 rounded-full bg-primary/10 border border-primary/30 text-xs uppercase tracking-wider">
            Interactive
          </div>
        </div>

        <div className="grid md:grid-cols-3 gap-6">
          {/* Time window selector */}
          <div className="md:col-span-1 space-y-4">
            <div className="text-sm uppercase tracking-wider text-muted-foreground flex items-center gap-2">
              <Clock className="w-4 h-4" />
              Look-Back Window
            </div>

            <div className="space-y-2">
              {timeWindows.map((window) => (
                <motion.button
                  key={window.days}
                  onClick={() => setSelectedTimeWindow(window.days)}
                  className={`w-full text-left p-4 rounded-lg border transition-all ${
                    selectedTimeWindow === window.days
                      ? 'bg-primary/10 border-primary/50'
                      : 'bg-card/20 border-border/30 hover:border-primary/30'
                  }`}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-medium">{window.label}</span>
                    <div className={`flex items-center gap-1 text-xs ${
                      window.growth >= 20 ? 'text-secondary' : 'text-primary'
                    }`}>
                      <TrendingUp className="w-3 h-3" />
                      +{window.growth}%
                    </div>
                  </div>
                  <div className="text-2xl bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
                    {window.count.toLocaleString()}
                  </div>
                  <div className="text-xs text-muted-foreground">active fans</div>
                </motion.button>
              ))}
            </div>

            <div className="p-3 rounded-lg bg-secondary/5 border border-secondary/20 text-xs">
              <div className="text-secondary uppercase tracking-wider mb-1">How it works</div>
              <p className="text-muted-foreground">
                Segments automatically add/remove fans based on activity within the selected time window. 
                Keeps lists fresh without manual cleanup.
              </p>
            </div>
          </div>

          {/* Segment library */}
          <div className="md:col-span-2 space-y-3">
            <div className="flex items-center justify-between">
              <div className="text-sm uppercase tracking-wider text-muted-foreground flex items-center gap-2">
                <Users className="w-4 h-4" />
                Saved Segments
              </div>
              <div className="text-xs text-muted-foreground">
                {selectedTimeWindow}-day window applied
              </div>
            </div>

            <div className="space-y-3">
              {segments.map((segment, index) => {
                // Adjust count based on time window
                const adjustedCount = Math.round(
                  segment.count * (selectedTimeWindow === 7 ? 0.6 : selectedTimeWindow === 30 ? 1 : 1.4)
                );

                return (
                  <motion.div
                    key={index}
                    layout
                    className="p-4 rounded-lg bg-card/40 border border-border/50 hover:border-primary/50 transition-all group"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1 }}
                  >
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <div 
                            className="w-3 h-3 rounded-full"
                            style={{ backgroundColor: segment.color }}
                          />
                          <h4 className="font-medium">{segment.name}</h4>
                        </div>
                        <p className="text-xs text-muted-foreground">{segment.description}</p>
                      </div>
                      <motion.div
                        className="text-right"
                        key={adjustedCount}
                        initial={{ scale: 1.2 }}
                        animate={{ scale: 1 }}
                        transition={{ type: "spring", stiffness: 200 }}
                      >
                        <div className="text-2xl bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
                          {adjustedCount.toLocaleString()}
                        </div>
                        <div className="text-xs text-muted-foreground">fans</div>
                      </motion.div>
                    </div>

                    {/* Engagement bar */}
                    <div className="space-y-1">
                      <div className="flex items-center justify-between text-xs text-muted-foreground">
                        <span>Engagement Rate</span>
                        <span>{segment.engagementRate}%</span>
                      </div>
                      <div className="h-2 bg-muted/20 rounded-full overflow-hidden">
                        <motion.div
                          className="h-full rounded-full"
                          style={{ 
                            background: `linear-gradient(to right, ${segment.color}80, ${segment.color})`
                          }}
                          initial={{ width: 0 }}
                          animate={{ width: `${segment.engagementRate}%` }}
                          transition={{ duration: 1, delay: 0.2 + index * 0.1 }}
                        />
                      </div>
                    </div>

                    {/* Quick actions */}
                    <div className="flex gap-2 mt-3 pt-3 border-t border-border/30">
                      <button className="flex-1 px-3 py-1.5 rounded-lg bg-primary/10 hover:bg-primary/20 text-primary text-xs uppercase tracking-wider transition-all">
                        Send Campaign
                      </button>
                      <button className="flex-1 px-3 py-1.5 rounded-lg bg-muted/10 hover:bg-muted/20 text-xs uppercase tracking-wider transition-all">
                        Export
                      </button>
                    </div>
                  </motion.div>
                );
              })}
            </div>

            <div className="p-4 rounded-lg bg-gradient-to-r from-primary/5 to-secondary/5 border border-primary/20">
              <div className="flex items-start gap-3">
                <MapPin className="w-5 h-5 text-primary flex-shrink-0 mt-0.5" />
                <div className="text-sm">
                  <p className="mb-2">
                    <span className="text-primary">💡 Pro Tip:</span> Use 7-day windows for time-sensitive campaigns 
                    (tour announcements, ticket sales) and 90-day windows for long-term nurture sequences.
                  </p>
                  <p className="text-xs text-muted-foreground">
                    Segments with time windows automatically stay compliant by removing inactive contacts.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="flex items-center justify-between text-xs text-muted-foreground pt-2 border-t border-border/30">
          <span>Select time window to see how segment sizes change</span>
          <div className="flex items-center gap-2">
            <Users className="w-4 h-4 text-primary" />
            <span>{currentWindow.count.toLocaleString()} total active fans</span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
