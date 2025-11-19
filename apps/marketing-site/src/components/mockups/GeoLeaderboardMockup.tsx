import { Card, CardContent } from "../ui/card";
import { motion } from "motion/react";
import { useState } from "react";
import { MapPin, TrendingUp, Users } from "lucide-react";

export function GeoLeaderboardMockup() {
  const [selectedCity, setSelectedCity] = useState<number | null>(null);

  const cities = [
    { 
      name: "Los Angeles", 
      country: "USA", 
      engagement: 9250,
      growth: 24,
      fans: 12400,
      topPlatform: "Instagram"
    },
    { 
      name: "New York", 
      country: "USA", 
      engagement: 8840,
      growth: 18,
      fans: 11200,
      topPlatform: "Spotify"
    },
    { 
      name: "London", 
      country: "UK", 
      engagement: 7520,
      growth: 32,
      fans: 9800,
      topPlatform: "TikTok"
    },
    { 
      name: "Toronto", 
      country: "Canada", 
      engagement: 6100,
      growth: 15,
      fans: 7600,
      topPlatform: "Spotify"
    },
    { 
      name: "Berlin", 
      country: "Germany", 
      engagement: 5850,
      growth: 28,
      fans: 7200,
      topPlatform: "Instagram"
    },
  ];

  const maxEngagement = Math.max(...cities.map(c => c.engagement));

  const getBarWidth = (engagement: number) => {
    return (engagement / maxEngagement) * 100;
  };

  const getGrowthColor = (growth: number) => {
    if (growth >= 25) return "text-secondary";
    if (growth >= 15) return "text-primary";
    return "text-muted-foreground";
  };

  return (
    <Card className="bg-card/50 backdrop-blur-sm border-primary/30 overflow-hidden">
      <CardContent className="p-6 space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-xl uppercase tracking-wide mb-1">Geo Leaderboard</h3>
            <p className="text-sm text-muted-foreground">
              Top cities ranked by total engagement
            </p>
          </div>
          <div className="px-3 py-1 rounded-full bg-primary/10 border border-primary/30 text-xs uppercase tracking-wider">
            Interactive
          </div>
        </div>

        <div className="space-y-3">
          {cities.map((city, index) => (
            <motion.div
              key={index}
              className={`relative p-4 rounded-lg border transition-all duration-300 cursor-pointer ${
                selectedCity === index 
                  ? 'bg-primary/10 border-primary/50' 
                  : 'bg-card/20 border-border/30 hover:border-primary/30'
              }`}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.1 }}
              onClick={() => setSelectedCity(selectedCity === index ? null : index)}
              whileHover={{ scale: 1.02 }}
            >
              {/* Rank badge */}
              <div className="absolute -left-3 -top-3 w-8 h-8 rounded-full bg-gradient-to-br from-primary to-secondary flex items-center justify-center text-sm text-white shadow-lg">
                {index + 1}
              </div>

              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-3">
                  <MapPin className="w-5 h-5 text-primary" />
                  <div>
                    <div className="font-medium">{city.name}</div>
                    <div className="text-xs text-muted-foreground">{city.country}</div>
                  </div>
                </div>

                <div className="flex items-center gap-4 text-sm">
                  <div className="text-right">
                    <div className="text-muted-foreground text-xs">Engagement</div>
                    <div className="font-medium">{city.engagement.toLocaleString()}</div>
                  </div>
                  <div className={`flex items-center gap-1 ${getGrowthColor(city.growth)}`}>
                    <TrendingUp className="w-4 h-4" />
                    <span>+{city.growth}%</span>
                  </div>
                </div>
              </div>

              {/* Engagement bar */}
              <div className="relative h-2 bg-muted/20 rounded-full overflow-hidden">
                <motion.div
                  className="absolute left-0 top-0 h-full bg-gradient-to-r from-primary to-secondary rounded-full"
                  initial={{ width: 0 }}
                  animate={{ width: `${getBarWidth(city.engagement)}%` }}
                  transition={{ duration: 1, delay: 0.2 + index * 0.1, ease: "easeOut" }}
                />
              </div>

              {/* Expanded details */}
              <motion.div
                initial={false}
                animate={{ 
                  height: selectedCity === index ? "auto" : 0,
                  opacity: selectedCity === index ? 1 : 0
                }}
                transition={{ duration: 0.3 }}
                className="overflow-hidden"
              >
                <div className="grid grid-cols-2 gap-4 mt-4 pt-4 border-t border-border/30">
                  <div className="flex items-center gap-2">
                    <Users className="w-4 h-4 text-primary" />
                    <div>
                      <div className="text-xs text-muted-foreground">Total Fans</div>
                      <div className="text-sm">{city.fans.toLocaleString()}</div>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Zap className="w-4 h-4 text-secondary" />
                    <div>
                      <div className="text-xs text-muted-foreground">Top Platform</div>
                      <div className="text-sm">{city.topPlatform}</div>
                    </div>
                  </div>
                </div>

                <div className="mt-3 p-3 rounded-lg bg-primary/5 border border-primary/20">
                  <p className="text-xs text-muted-foreground">
                    💡 <span className="text-primary">Tour Opportunity:</span> {city.name} has {city.fans.toLocaleString()} engaged fans
                    {city.growth >= 20 && " and is experiencing rapid growth"}. 
                    {city.topPlatform === "TikTok" && " Strong TikTok presence suggests younger demographic."}
                    {city.topPlatform === "Spotify" && " High Spotify engagement ideal for pre-show streaming campaigns."}
                    {city.topPlatform === "Instagram" && " Visual content performs well here."}
                  </p>
                </div>
              </motion.div>
            </motion.div>
          ))}
        </div>

        <div className="flex items-center justify-between text-xs text-muted-foreground pt-2 border-t border-border/30">
          <span>Click any city to see detailed breakdown</span>
          <div className="flex items-center gap-2">
            <span>{cities.reduce((sum, city) => sum + city.fans, 0).toLocaleString()} total fans</span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

function Zap({ className }: { className?: string }) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
    >
      <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2" />
    </svg>
  );
}
