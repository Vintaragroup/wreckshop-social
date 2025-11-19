import { Card, CardContent } from "../ui/card";
import { motion } from "motion/react";
import { useState } from "react";

export function PlatformHeatmapMockup() {
  const [selectedPlatform, setSelectedPlatform] = useState<string | null>(null);

  const platforms = ["Spotify", "Apple Music", "TikTok", "Instagram", "YouTube"];
  const weeks = ["Week 1", "Week 2", "Week 3", "Week 4"];

  // Simulated heat values (0-100)
  const heatData: Record<string, number[]> = {
    "Spotify": [45, 62, 78, 85],
    "Apple Music": [38, 41, 52, 58],
    "TikTok": [72, 88, 95, 92],
    "Instagram": [55, 68, 74, 79],
    "YouTube": [42, 48, 55, 61]
  };

  const getHeatColor = (value: number) => {
    if (value >= 80) return "from-secondary/60 to-secondary/90";
    if (value >= 60) return "from-primary/60 to-primary/90";
    if (value >= 40) return "from-primary/40 to-primary/60";
    return "from-muted/40 to-muted/60";
  };

  const getTextColor = (value: number) => {
    return value >= 60 ? "text-white" : "text-foreground";
  };

  return (
    <Card className="bg-card/50 backdrop-blur-sm border-primary/30 overflow-hidden">
      <CardContent className="p-6 space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-xl uppercase tracking-wide mb-1">Platform Heatmap</h3>
            <p className="text-sm text-muted-foreground">
              Engagement intensity across platforms over time
            </p>
          </div>
          <div className="px-3 py-1 rounded-full bg-primary/10 border border-primary/30 text-xs uppercase tracking-wider">
            Interactive
          </div>
        </div>

        <div className="overflow-x-auto">
          <div className="min-w-[500px]">
            {/* Header */}
            <div className="grid grid-cols-5 gap-2 mb-2">
              <div className="text-xs uppercase tracking-wider text-muted-foreground"></div>
              {weeks.map((week) => (
                <div key={week} className="text-xs uppercase tracking-wider text-center text-muted-foreground">
                  {week}
                </div>
              ))}
            </div>

            {/* Heat cells */}
            {platforms.map((platform) => (
              <div key={platform} className="grid grid-cols-5 gap-2 mb-2">
                <div className="text-sm flex items-center">
                  <span className={selectedPlatform === platform ? "text-primary" : ""}>
                    {platform}
                  </span>
                </div>
                {heatData[platform].map((value, weekIndex) => (
                  <motion.div
                    key={weekIndex}
                    className={`relative h-12 rounded-lg bg-gradient-to-br ${getHeatColor(value)} cursor-pointer overflow-hidden`}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onMouseEnter={() => setSelectedPlatform(platform)}
                    onMouseLeave={() => setSelectedPlatform(null)}
                  >
                    <motion.div
                      className="absolute inset-0 bg-white/20"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: selectedPlatform === platform ? 1 : 0 }}
                      transition={{ duration: 0.2 }}
                    />
                    <div className={`flex items-center justify-center h-full text-xs ${getTextColor(value)}`}>
                      {value}%
                    </div>
                  </motion.div>
                ))}
              </div>
            ))}
          </div>
        </div>

        {selectedPlatform && (
          <motion.div
            className="p-4 rounded-lg bg-primary/5 border border-primary/20"
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
          >
            <p className="text-sm">
              <span className="text-primary">{selectedPlatform}</span> shows{" "}
              {heatData[selectedPlatform][3] > heatData[selectedPlatform][0] ? (
                <span className="text-secondary">strong growth</span>
              ) : (
                <span>steady performance</span>
              )}{" "}
              with {heatData[selectedPlatform][3]}% engagement in Week 4
            </p>
          </motion.div>
        )}

        <div className="flex items-center justify-between text-xs text-muted-foreground pt-2 border-t border-border/30">
          <span>Click any cell to see details</span>
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded bg-gradient-to-br from-muted/40 to-muted/60"></div>
              <span>Low</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded bg-gradient-to-br from-primary/60 to-primary/90"></div>
              <span>Medium</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded bg-gradient-to-br from-secondary/60 to-secondary/90"></div>
              <span>High</span>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
