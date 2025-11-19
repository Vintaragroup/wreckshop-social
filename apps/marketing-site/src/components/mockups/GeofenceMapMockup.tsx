import { Card, CardContent } from "../ui/card";
import { motion } from "motion/react";
import { useState } from "react";
import { MapPin, Plus, Minus } from "lucide-react";
import { Button } from "../ui/button";

export function GeofenceMapMockup() {
  const [radius, setRadius] = useState(25);
  const [selectedCity, setSelectedCity] = useState("Austin");
  const [hoveredVenue, setHoveredVenue] = useState<number | null>(null);

  const cities = [
    { name: "Austin", lat: 30.27, lng: -97.74, fans: 2400 },
    { name: "Dallas", lat: 32.78, lng: -96.80, fans: 1850 },
    { name: "Houston", lat: 29.76, lng: -95.37, fans: 3200 }
  ];

  const venues = [
    { name: "Moody Center", x: 52, y: 48, capacity: 15000, type: "Arena" },
    { name: "Stubb's BBQ", x: 54, y: 51, capacity: 2200, type: "Venue" },
    { name: "ACL Live", x: 49, y: 50, capacity: 2750, type: "Theater" }
  ];

  const currentCity = cities.find(c => c.name === selectedCity);
  const estimatedReach = Math.round(currentCity!.fans * (radius / 50));

  return (
    <Card className="bg-card/50 backdrop-blur-sm border-primary/30 overflow-hidden">
      <CardContent className="p-6 space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-xl uppercase tracking-wide mb-1">Geofence Map Tool</h3>
            <p className="text-sm text-muted-foreground">
              Drop pins and set radius to target local fans
            </p>
          </div>
          <div className="px-3 py-1 rounded-full bg-primary/10 border border-primary/30 text-xs uppercase tracking-wider">
            Interactive
          </div>
        </div>

        <div className="grid md:grid-cols-3 gap-4">
          {/* Map visualization */}
          <div className="md:col-span-2">
            <div className="relative h-96 rounded-lg bg-gradient-to-br from-muted/30 to-muted/10 overflow-hidden border border-border/30">
              {/* Simplified map grid */}
              <svg className="absolute inset-0 w-full h-full opacity-10">
                <defs>
                  <pattern id="grid" width="40" height="40" patternUnits="userSpaceOnUse">
                    <path d="M 40 0 L 0 0 0 40" fill="none" stroke="currentColor" strokeWidth="1"/>
                  </pattern>
                </defs>
                <rect width="100%" height="100%" fill="url(#grid)" />
              </svg>

              {/* City markers */}
              {cities.map((city, index) => {
                const x = 30 + index * 25;
                const y = 40 + (index % 2) * 20;
                const isSelected = city.name === selectedCity;

                return (
                  <motion.div
                    key={city.name}
                    className={`absolute cursor-pointer`}
                    style={{ left: `${x}%`, top: `${y}%`, transform: 'translate(-50%, -50%)' }}
                    onClick={() => setSelectedCity(city.name)}
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    {isSelected && (
                      <motion.div
                        className="absolute inset-0 rounded-full bg-primary/20"
                        style={{
                          width: `${radius * 4}px`,
                          height: `${radius * 4}px`,
                          transform: 'translate(-50%, -50%)',
                          left: '50%',
                          top: '50%'
                        }}
                        initial={{ scale: 0, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        transition={{ duration: 0.5 }}
                      >
                        <motion.div
                          className="absolute inset-0 rounded-full border-2 border-primary"
                          animate={{
                            scale: [1, 1.1, 1],
                            opacity: [0.5, 0.2, 0.5]
                          }}
                          transition={{
                            duration: 2,
                            repeat: Infinity,
                            ease: "easeInOut"
                          }}
                        />
                      </motion.div>
                    )}

                    <div className={`relative z-10 p-2 rounded-full transition-all ${
                      isSelected 
                        ? 'bg-primary text-primary-foreground shadow-lg' 
                        : 'bg-card border-2 border-border hover:border-primary'
                    }`}>
                      <MapPin className="w-5 h-5" />
                    </div>

                    {!isSelected && (
                      <div className="absolute top-full mt-2 left-1/2 -translate-x-1/2 whitespace-nowrap text-xs bg-card/90 backdrop-blur-sm px-2 py-1 rounded border border-border/30">
                        {city.name}
                      </div>
                    )}
                  </motion.div>
                );
              })}

              {/* Venues (only show for selected city) */}
              {selectedCity === "Austin" && venues.map((venue, index) => (
                <motion.div
                  key={index}
                  className="absolute cursor-pointer group"
                  style={{ left: `${venue.x}%`, top: `${venue.y}%`, transform: 'translate(-50%, -50%)' }}
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ delay: 0.3 + index * 0.1 }}
                  onMouseEnter={() => setHoveredVenue(index)}
                  onMouseLeave={() => setHoveredVenue(null)}
                >
                  <div className="w-3 h-3 rounded-full bg-secondary border-2 border-background shadow-lg" />
                  
                  {hoveredVenue === index && (
                    <motion.div
                      className="absolute top-full mt-2 left-1/2 -translate-x-1/2 p-2 rounded-lg bg-card/95 backdrop-blur-sm border border-secondary/30 shadow-xl whitespace-nowrap z-20"
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                    >
                      <div className="text-xs text-secondary uppercase tracking-wider">{venue.type}</div>
                      <div className="text-sm font-medium">{venue.name}</div>
                      <div className="text-xs text-muted-foreground">{venue.capacity.toLocaleString()} capacity</div>
                    </motion.div>
                  )}
                </motion.div>
              ))}

              {/* Center marker for selected city */}
              {currentCity && (
                <motion.div
                  className="absolute"
                  style={{ left: `${52}%`, top: `${48}%`, transform: 'translate(-50%, -50%)' }}
                  initial={{ scale: 0, rotate: -180 }}
                  animate={{ scale: 1, rotate: 0 }}
                  transition={{ type: "spring", stiffness: 200 }}
                >
                  <div className="relative">
                    <div className="absolute inset-0 bg-primary/30 rounded-full blur-xl" style={{ width: 60, height: 60, transform: 'translate(-50%, -50%)', left: '50%', top: '50%' }} />
                    <MapPin className="w-8 h-8 text-primary relative" />
                    <div className="absolute top-full mt-2 left-1/2 -translate-x-1/2 bg-primary text-primary-foreground px-3 py-1 rounded-lg text-sm font-medium whitespace-nowrap">
                      {selectedCity}
                    </div>
                  </div>
                </motion.div>
              )}
            </div>
          </div>

          {/* Controls */}
          <div className="space-y-4">
            <div className="p-4 rounded-lg bg-card/30 border border-border/30 space-y-4">
              <div>
                <label className="text-sm uppercase tracking-wider text-muted-foreground mb-2 block">
                  City
                </label>
                <div className="space-y-2">
                  {cities.map((city) => (
                    <button
                      key={city.name}
                      onClick={() => setSelectedCity(city.name)}
                      className={`w-full text-left px-3 py-2 rounded-lg text-sm transition-all ${
                        selectedCity === city.name
                          ? 'bg-primary/20 border-primary/50 text-primary'
                          : 'bg-muted/10 border-border/30 hover:border-primary/30'
                      } border`}
                    >
                      {city.name}
                      <div className="text-xs text-muted-foreground">{city.fans.toLocaleString()} fans</div>
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="text-sm uppercase tracking-wider text-muted-foreground mb-2 block">
                  Radius: {radius} miles
                </label>
                <div className="flex items-center gap-2 mb-2">
                  <Button
                    size="sm"
                    variant="outline"
                    className="h-8 w-8 p-0"
                    onClick={() => setRadius(Math.max(5, radius - 5))}
                  >
                    <Minus className="w-4 h-4" />
                  </Button>
                  <div className="flex-1 h-2 bg-muted/20 rounded-full overflow-hidden">
                    <motion.div
                      className="h-full bg-gradient-to-r from-primary to-secondary"
                      initial={{ width: 0 }}
                      animate={{ width: `${(radius / 50) * 100}%` }}
                      transition={{ duration: 0.3 }}
                    />
                  </div>
                  <Button
                    size="sm"
                    variant="outline"
                    className="h-8 w-8 p-0"
                    onClick={() => setRadius(Math.min(50, radius + 5))}
                  >
                    <Plus className="w-4 h-4" />
                  </Button>
                </div>
                <div className="text-xs text-muted-foreground">Drag to adjust</div>
              </div>

              <div className="pt-4 border-t border-border/30">
                <div className="text-sm uppercase tracking-wider text-muted-foreground mb-2">
                  Estimated Reach
                </div>
                <motion.div
                  className="text-3xl bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent"
                  key={estimatedReach}
                  initial={{ scale: 1.2, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  transition={{ type: "spring" }}
                >
                  {estimatedReach.toLocaleString()}
                </motion.div>
                <div className="text-xs text-muted-foreground">fans within radius</div>
              </div>
            </div>

            <div className="p-3 rounded-lg bg-primary/5 border border-primary/20 text-xs text-muted-foreground">
              💡 Tip: Smaller radius = higher engagement. Start with 10-15 miles for venue-specific promotions.
            </div>
          </div>
        </div>

        <div className="flex items-center justify-between text-xs text-muted-foreground pt-2 border-t border-border/30">
          <span>Select city and adjust radius to see reachable audience</span>
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-1">
              <div className="w-3 h-3 rounded-full bg-primary"></div>
              <span>Cities</span>
            </div>
            <div className="flex items-center gap-1">
              <div className="w-3 h-3 rounded-full bg-secondary"></div>
              <span>Venues</span>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
