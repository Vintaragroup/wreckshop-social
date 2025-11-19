import { Card, CardContent } from "../ui/card";
import { motion } from "motion/react";
import { useState } from "react";
import { TrendingUp, Mail, MessageSquare, Zap } from "lucide-react";

export function AttributionTimelineMockup() {
  const [hoveredEvent, setHoveredEvent] = useState<number | null>(null);

  const events = [
    { 
      week: 1, 
      type: "Email Campaign", 
      icon: Mail, 
      color: "#00CFFF",
      growth: 1200,
      description: "Launch announcement to 50k subscribers"
    },
    { 
      week: 2, 
      type: "SMS Blast", 
      icon: MessageSquare, 
      color: "#FF00FF",
      growth: 850,
      description: "Pre-save reminder to engaged fans"
    },
    { 
      week: 3, 
      type: "TikTok Push", 
      icon: Zap, 
      color: "#00CFFF",
      growth: 3400,
      description: "Influencer collaboration went viral"
    },
  ];

  // Baseline followers (simulated growth curve)
  const baselineData = [
    { week: 0, followers: 50000 },
    { week: 1, followers: 51200 },
    { week: 2, followers: 52050 },
    { week: 3, followers: 55450 },
    { week: 4, followers: 56200 },
  ];

  const maxFollowers = Math.max(...baselineData.map(d => d.followers));
  const minFollowers = Math.min(...baselineData.map(d => d.followers));

  const getYPosition = (followers: number) => {
    return ((maxFollowers - followers) / (maxFollowers - minFollowers)) * 100;
  };

  return (
    <Card className="bg-card/50 backdrop-blur-sm border-secondary/30 overflow-hidden">
      <CardContent className="p-6 space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-xl uppercase tracking-wide mb-1">Attribution Timeline</h3>
            <p className="text-sm text-muted-foreground">
              Campaign launches overlaid with follower growth
            </p>
          </div>
          <div className="px-3 py-1 rounded-full bg-secondary/10 border border-secondary/30 text-xs uppercase tracking-wider">
            Interactive
          </div>
        </div>

        <div className="relative h-64 bg-gradient-to-b from-muted/5 to-muted/20 rounded-lg p-4 overflow-hidden">
          {/* Y-axis labels */}
          <div className="absolute left-0 top-0 bottom-0 flex flex-col justify-between text-xs text-muted-foreground pr-2">
            <span>{(maxFollowers / 1000).toFixed(0)}k</span>
            <span>{((maxFollowers + minFollowers) / 2000).toFixed(0)}k</span>
            <span>{(minFollowers / 1000).toFixed(0)}k</span>
          </div>

          {/* Chart area */}
          <div className="ml-12 mr-4 h-full relative">
            {/* Growth line */}
            <svg className="absolute inset-0 w-full h-full">
              <defs>
                <linearGradient id="lineGradient" x1="0%" y1="0%" x2="100%" y2="0%">
                  <stop offset="0%" stopColor="#00CFFF" stopOpacity="0.8" />
                  <stop offset="100%" stopColor="#FF00FF" stopOpacity="0.8" />
                </linearGradient>
              </defs>
              <motion.path
                d={baselineData.map((point, i) => {
                  const x = (i / (baselineData.length - 1)) * 100;
                  const y = getYPosition(point.followers);
                  return `${i === 0 ? 'M' : 'L'} ${x}% ${y}%`;
                }).join(' ')}
                fill="none"
                stroke="url(#lineGradient)"
                strokeWidth="3"
                strokeLinecap="round"
                initial={{ pathLength: 0 }}
                animate={{ pathLength: 1 }}
                transition={{ duration: 2, ease: "easeInOut" }}
              />
            </svg>

            {/* Data points */}
            {baselineData.map((point, i) => (
              <motion.div
                key={i}
                className="absolute w-3 h-3 rounded-full bg-gradient-to-br from-primary to-secondary border-2 border-background"
                style={{
                  left: `${(i / (baselineData.length - 1)) * 100}%`,
                  top: `${getYPosition(point.followers)}%`,
                  transform: 'translate(-50%, -50%)'
                }}
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: i * 0.1, type: "spring" }}
              />
            ))}

            {/* Campaign events */}
            {events.map((event, i) => {
              const dataPoint = baselineData.find(d => d.week === event.week);
              if (!dataPoint) return null;

              return (
                <motion.div
                  key={i}
                  className="absolute"
                  style={{
                    left: `${(event.week / (baselineData.length - 1)) * 100}%`,
                    top: `${getYPosition(dataPoint.followers)}%`,
                    transform: 'translate(-50%, -100%) translateY(-20px)'
                  }}
                  initial={{ opacity: 0, y: -20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.5 + i * 0.2 }}
                  onMouseEnter={() => setHoveredEvent(i)}
                  onMouseLeave={() => setHoveredEvent(null)}
                >
                  <motion.div
                    className="flex flex-col items-center cursor-pointer"
                    whileHover={{ scale: 1.1 }}
                  >
                    <div 
                      className="w-10 h-10 rounded-full flex items-center justify-center shadow-lg"
                      style={{ 
                        backgroundColor: event.color + '20',
                        border: `2px solid ${event.color}`
                      }}
                    >
                      <event.icon className="w-5 h-5" style={{ color: event.color }} />
                    </div>
                    <div 
                      className="h-4 w-px"
                      style={{ backgroundColor: event.color + '40' }}
                    />
                  </motion.div>

                  {hoveredEvent === i && (
                    <motion.div
                      className="absolute top-full left-1/2 -translate-x-1/2 mt-2 p-3 rounded-lg bg-card/90 backdrop-blur-sm border shadow-lg whitespace-nowrap z-10"
                      style={{ borderColor: event.color + '40' }}
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.2 }}
                    >
                      <div className="text-xs uppercase tracking-wider mb-1" style={{ color: event.color }}>
                        {event.type}
                      </div>
                      <div className="text-sm mb-1">+{event.growth.toLocaleString()} followers</div>
                      <div className="text-xs text-muted-foreground max-w-[200px]">
                        {event.description}
                      </div>
                    </motion.div>
                  )}
                </motion.div>
              );
            })}

            {/* X-axis labels */}
            <div className="absolute -bottom-6 left-0 right-0 flex justify-between text-xs text-muted-foreground">
              {baselineData.map((point, i) => (
                <span key={i}>Week {point.week}</span>
              ))}
            </div>
          </div>
        </div>

        <div className="flex items-center justify-between text-xs text-muted-foreground pt-2 border-t border-border/30">
          <span>Hover over campaign icons for details</span>
          <div className="flex items-center gap-2">
            <TrendingUp className="w-4 h-4 text-secondary" />
            <span>+{((baselineData[baselineData.length - 1].followers - baselineData[0].followers) / baselineData[0].followers * 100).toFixed(1)}% growth</span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
