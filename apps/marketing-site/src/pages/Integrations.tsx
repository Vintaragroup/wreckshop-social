import { Navigation } from "../components/Navigation";
import { Footer } from "../components/Footer";
import { Card, CardContent } from "../components/ui/card";
import { CheckCircle2, ArrowRight } from "lucide-react";
import { Button } from "../components/ui/button";

const platforms = [
  {
    name: "Spotify",
    category: "Streaming",
    description: "Connect your Spotify for Artists account to access listener demographics, playlist placements, and streaming analytics.",
    features: [
      "Listener location data",
      "Top songs & playlists",
      "Follower demographics",
      "Monthly listeners tracking"
    ],
    color: "from-[#1DB954] to-[#1DB954]/50"
  },
  {
    name: "Instagram",
    category: "Social Media",
    description: "Integrate Instagram Business accounts to discover your most engaged followers and create targeted campaigns.",
    features: [
      "Follower demographics",
      "Engagement metrics",
      "Story & post insights",
      "DM campaign automation"
    ],
    color: "from-[#E4405F] to-[#833AB4]"
  },
  {
    name: "Twitter / X",
    category: "Social Media",
    description: "Sync your Twitter account to understand your audience's interests and launch tweet campaigns.",
    features: [
      "Follower analysis",
      "Tweet performance",
      "Audience interests",
      "Auto-posting campaigns"
    ],
    color: "from-[#1DA1F2] to-[#1DA1F2]/50"
  },
  {
    name: "TikTok",
    category: "Social Media",
    description: "Connect TikTok for Business to leverage viral trends and target Gen Z music fans.",
    features: [
      "Video analytics",
      "Follower insights",
      "Trending sounds",
      "Campaign tracking"
    ],
    color: "from-[#00F2EA] to-[#FF0050]"
  },
  {
    name: "YouTube Music",
    category: "Streaming",
    description: "Access YouTube Analytics to understand your music video audience and streaming patterns.",
    features: [
      "Viewer demographics",
      "Watch time analytics",
      "Traffic sources",
      "Subscriber growth"
    ],
    color: "from-[#FF0000] to-[#CC0000]"
  },
  {
    name: "Apple Music",
    category: "Streaming",
    description: "Integrate Apple Music for Artists to track plays, Shazams, and radio spins.",
    features: [
      "Play analytics",
      "Shazam data",
      "Radio tracking",
      "Playlist placements"
    ],
    color: "from-[#FA243C] to-[#FA243C]/50"
  },
  {
    name: "Bandcamp",
    category: "Sales & Merch",
    description: "Connect Bandcamp to track sales, understand your buyers, and promote new releases.",
    features: [
      "Sales analytics",
      "Buyer demographics",
      "Revenue tracking",
      "Release campaigns"
    ],
    color: "from-[#1DA0C3] to-[#1DA0C3]/50"
  },
  {
    name: "Mailchimp",
    category: "Email Marketing",
    description: "Sync Mailchimp lists to create unified audience segments and track email campaign performance.",
    features: [
      "List synchronization",
      "Campaign analytics",
      "Segmentation",
      "A/B testing"
    ],
    color: "from-[#FFE01B] to-[#FFE01B]/50"
  },
  {
    name: "Twilio",
    category: "SMS & Voice",
    description: "Power SMS campaigns with Twilio integration for high-engagement text message marketing.",
    features: [
      "SMS campaigns",
      "Two-way messaging",
      "Delivery tracking",
      "Opt-in management"
    ],
    color: "from-[#F22F46] to-[#F22F46]/50"
  }
];

export function Integrations() {
  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      
      <main className="py-24">
        <div className="container mx-auto px-4">
          {/* Header */}
          <div className="text-center max-w-3xl mx-auto mb-20 space-y-6">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-card/50 border border-[#00CFFF]/30">
              <CheckCircle2 className="h-4 w-4 text-[#00CFFF]" />
              <span className="text-sm uppercase tracking-wider text-[#00CFFF]">
                Seamless Connections
              </span>
            </div>
            
            <h1 className="text-5xl md:text-7xl uppercase tracking-tight">
              <span className="block">PLATFORM</span>
              <span className="block bg-gradient-to-r from-[#00CFFF] to-[#FF00A8] bg-clip-text text-transparent">
                INTEGRATIONS
              </span>
            </h1>
            
            <p className="text-lg text-muted-foreground leading-relaxed">
              Connect all your music platforms in one place. Wreckshop Social integrates with the tools you already use 
              to give you a unified view of your audience.
            </p>
          </div>

          {/* Platforms Grid */}
          <div className="max-w-7xl mx-auto mb-24">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {platforms.map((platform, index) => (
                <Card 
                  key={index}
                  className="bg-card/30 backdrop-blur-sm border-border/50 hover:border-[#00CFFF]/50 transition-all duration-300 group"
                >
                  <CardContent className="p-6 space-y-4">
                    {/* Platform badge */}
                    <div className="flex items-center justify-between">
                      <div className={`px-3 py-1 rounded-full bg-gradient-to-r ${platform.color} inline-flex`}>
                        <span className="text-xs uppercase tracking-wider text-[#1E1E1E]">
                          {platform.name}
                        </span>
                      </div>
                      <span className="text-xs text-muted-foreground uppercase tracking-wide">
                        {platform.category}
                      </span>
                    </div>

                    {/* Description */}
                    <p className="text-sm text-muted-foreground leading-relaxed min-h-[60px]">
                      {platform.description}
                    </p>

                    {/* Features */}
                    <div className="space-y-2">
                      <h4 className="text-xs uppercase tracking-wide text-foreground/80">
                        Features:
                      </h4>
                      <ul className="space-y-1.5">
                        {platform.features.map((feature, featureIndex) => (
                          <li key={featureIndex} className="flex items-start gap-2">
                            <CheckCircle2 className="h-3.5 w-3.5 text-[#00CFFF] flex-shrink-0 mt-0.5" />
                            <span className="text-xs text-muted-foreground">
                              {feature}
                            </span>
                          </li>
                        ))}
                      </ul>
                    </div>

                    {/* Connect button */}
                    <Button 
                      variant="outline" 
                      size="sm" 
                      className="w-full border-[#00CFFF]/50 hover:bg-[#00CFFF]/10 group-hover:border-[#00CFFF]"
                    >
                      Connect {platform.name}
                    </Button>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>

          {/* Request Integration */}
          <div className="max-w-3xl mx-auto text-center space-y-6">
            <h2 className="text-3xl uppercase tracking-wide">
              Don't See Your Platform?
            </h2>
            <p className="text-muted-foreground">
              We're constantly adding new integrations. Let us know which platform you'd like to see next.
            </p>
            <Button 
              size="lg"
              variant="outline" 
              className="border-[#00CFFF]/50 hover:bg-[#00CFFF]/10"
            >
              Request Integration
            </Button>
          </div>
        </div>
      </main>
      
      <Footer />
    </div>
  );
}