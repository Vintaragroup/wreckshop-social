import { Card, CardContent } from "../ui/card";
import { motion, AnimatePresence } from "motion/react";
import { useState } from "react";
import { Plus, X, Filter } from "lucide-react";
import { Button } from "../ui/button";

export function SegmentBuilderMockup() {
  const [filters, setFilters] = useState([
    { id: 1, category: "Behavior", condition: "Opened last SMS", operator: "in", value: "Last 7 days" },
    { id: 2, category: "Platform", condition: "TikTok likes", operator: ">", value: "5" }
  ]);

  const [audienceCount, setAudienceCount] = useState(1847);
  const [showAddFilter, setShowAddFilter] = useState(false);

  const filterCategories = [
    { name: "Behavior", options: ["Opened last SMS", "Clicked link", "Replied to message"] },
    { name: "Platform", options: ["Spotify saves", "TikTok likes", "Instagram comments"] },
    { name: "Commerce", options: ["Purchased merch", "Bought ticket", "Pre-saved album"] },
    { name: "Geography", options: ["City", "State", "Postal code"] }
  ];

  const addFilter = (category: string, condition: string) => {
    const newFilter = {
      id: Date.now(),
      category,
      condition,
      operator: ">",
      value: "1"
    };
    setFilters([...filters, newFilter]);
    setAudienceCount(Math.max(100, audienceCount - Math.floor(Math.random() * 300)));
    setShowAddFilter(false);
  };

  const removeFilter = (id: number) => {
    setFilters(filters.filter(f => f.id !== id));
    setAudienceCount(audienceCount + Math.floor(Math.random() * 400));
  };

  return (
    <Card className="bg-card/50 backdrop-blur-sm border-secondary/30 overflow-hidden">
      <CardContent className="p-6 space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-xl uppercase tracking-wide mb-1">Segment Builder</h3>
            <p className="text-sm text-muted-foreground">
              Stack filters to create surgical audience segments
            </p>
          </div>
          <div className="px-3 py-1 rounded-full bg-secondary/10 border border-secondary/30 text-xs uppercase tracking-wider">
            Interactive
          </div>
        </div>

        <div className="grid md:grid-cols-3 gap-6">
          {/* Filter builder */}
          <div className="md:col-span-2 space-y-3">
            <div className="flex items-center justify-between">
              <div className="text-sm uppercase tracking-wider text-muted-foreground flex items-center gap-2">
                <Filter className="w-4 h-4" />
                Active Filters ({filters.length})
              </div>
              <Button
                size="sm"
                variant="outline"
                className="h-8 text-xs"
                onClick={() => setShowAddFilter(!showAddFilter)}
              >
                <Plus className="w-3 h-3 mr-1" />
                Add Filter
              </Button>
            </div>

            <AnimatePresence mode="popLayout">
              {filters.map((filter, index) => (
                <motion.div
                  key={filter.id}
                  layout
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 20 }}
                  transition={{ duration: 0.3 }}
                  className="relative p-4 rounded-lg bg-card/40 border border-border/50 group hover:border-secondary/50 transition-all"
                >
                  <button
                    onClick={() => removeFilter(filter.id)}
                    className="absolute -top-2 -right-2 w-6 h-6 rounded-full bg-destructive/80 text-destructive-foreground flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity shadow-lg hover:bg-destructive"
                  >
                    <X className="w-3 h-3" />
                  </button>

                  <div className="flex items-center gap-2 text-sm">
                    {index > 0 && (
                      <span className="px-2 py-0.5 rounded bg-secondary/20 text-secondary text-xs uppercase tracking-wider">
                        AND
                      </span>
                    )}
                    <span className="px-2 py-0.5 rounded bg-primary/10 text-primary text-xs uppercase tracking-wider">
                      {filter.category}
                    </span>
                    <span className="text-muted-foreground">{filter.condition}</span>
                    <span className="text-secondary">{filter.operator}</span>
                    <span className="px-2 py-0.5 rounded bg-muted/20 font-medium">{filter.value}</span>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>

            {/* Add filter dropdown */}
            <AnimatePresence>
              {showAddFilter && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: "auto" }}
                  exit={{ opacity: 0, height: 0 }}
                  transition={{ duration: 0.3 }}
                  className="overflow-hidden"
                >
                  <div className="p-4 rounded-lg bg-card/60 border border-secondary/30 space-y-3">
                    <div className="text-sm uppercase tracking-wider text-muted-foreground">
                      Select Filter Type
                    </div>
                    <div className="grid grid-cols-2 gap-2">
                      {filterCategories.map((cat) => (
                        <div key={cat.name}>
                          <div className="text-xs uppercase tracking-wider text-muted-foreground mb-2">
                            {cat.name}
                          </div>
                          <div className="space-y-1">
                            {cat.options.map((option) => (
                              <button
                                key={option}
                                onClick={() => addFilter(cat.name, option)}
                                className="w-full text-left px-3 py-2 rounded-lg bg-muted/10 hover:bg-secondary/10 hover:border-secondary/30 border border-border/30 text-sm transition-all"
                              >
                                {option}
                              </button>
                            ))}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            {filters.length === 0 && (
              <div className="p-8 rounded-lg border-2 border-dashed border-border/50 text-center">
                <Filter className="w-8 h-8 mx-auto mb-3 text-muted-foreground/50" />
                <p className="text-sm text-muted-foreground">No filters added yet</p>
                <p className="text-xs text-muted-foreground mt-1">Click "Add Filter" to start building your segment</p>
              </div>
            )}
          </div>

          {/* Live preview */}
          <div className="space-y-4">
            <div className="p-4 rounded-lg bg-gradient-to-br from-secondary/10 to-primary/10 border border-secondary/30">
              <div className="text-sm uppercase tracking-wider text-muted-foreground mb-2">
                Audience Size
              </div>
              <motion.div
                className="text-4xl bg-gradient-to-r from-secondary to-primary bg-clip-text text-transparent mb-1"
                key={audienceCount}
                initial={{ scale: 1.2 }}
                animate={{ scale: 1 }}
                transition={{ type: "spring", stiffness: 200 }}
              >
                {audienceCount.toLocaleString()}
              </motion.div>
              <div className="text-xs text-muted-foreground">fans match criteria</div>
            </div>

            <div className="p-4 rounded-lg bg-card/30 border border-border/30 space-y-3">
              <div className="text-sm uppercase tracking-wider text-muted-foreground">
                Segment Preview
              </div>
              <div className="space-y-2 text-xs">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Avg. Engagement</span>
                  <span className="text-secondary">High</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Email Open Rate</span>
                  <span>42%</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">SMS Reply Rate</span>
                  <span>18%</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Top Platform</span>
                  <span>TikTok</span>
                </div>
              </div>
            </div>

            <div className="p-3 rounded-lg bg-primary/5 border border-primary/20 text-xs text-muted-foreground">
              💡 More filters = smaller, more engaged audience. Start broad, then refine.
            </div>

            <Button className="w-full bg-gradient-to-r from-secondary to-primary hover:opacity-90">
              Save Segment
            </Button>
          </div>
        </div>

        <div className="flex items-center justify-between text-xs text-muted-foreground pt-2 border-t border-border/30">
          <span>Filters combine with AND logic for precision targeting</span>
          <span className="text-secondary">{filters.length > 0 ? "Real-time count updates" : "Add filters to see audience size"}</span>
        </div>
      </CardContent>
    </Card>
  );
}
