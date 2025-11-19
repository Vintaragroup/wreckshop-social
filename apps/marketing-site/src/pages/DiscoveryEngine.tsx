import { Navigation } from "../components/Navigation";
import { Footer } from "../components/Footer";
import { Button } from "../components/ui/button";
import { Card, CardContent } from "../components/ui/card";
import { Badge } from "../components/ui/badge";
import { 
  Zap, 
  ArrowRight, 
  Database, 
  GitMerge, 
  Target, 
  Rocket,
  CheckCircle2,
  TrendingUp,
  Users,
  Music,
  Instagram,
  Youtube,
  Send
} from "lucide-react";
import { useRef } from "react";
import { motion, useInView } from "motion/react";
import { ImageWithFallback } from "../components/figma/ImageWithFallback";
import { DiscoveryDashboard } from "../components/mockups/DiscoveryDashboard";
import { IntegrationHub } from "../components/mockups/IntegrationHub";
import { JourneyBuilder } from "../components/mockups/JourneyBuilder";

const platforms = [
  {
    name: "Spotify",
    icon: Music,
    color: "#1DB954",
    benefit: "Track saves, playlist adds, repeat listeners, and curator relationships in real-time",
    metrics: ["Saves", "Playlists", "Repeats", "Curators"]
  },
  {
    name: "Apple Music",
    icon: Music,
    color: "#FA57C1",
    benefit: "Monitor pre-adds, library additions, and regional performance data",
    metrics: ["Pre-adds", "Libraries", "Regions"]
  },
  {
    name: "TikTok",
    icon: Music,
    color: "#00F2EA",
    benefit: "Detect trending sounds and identify emerging creators before viral peaks",
    metrics: ["Sound Uses", "Creators", "Trends"]
  },
  {
    name: "Instagram",
    icon: Instagram,
    color: "#E4405F",
    benefit: "Measure reel engagement, story interactions, and DM activity patterns",
    metrics: ["Reels", "Stories", "DMs"]
  },
  {
    name: "YouTube",
    icon: Youtube,
    color: "#FF0000",
    benefit: "Analyze watch-time heatmaps and geographic viewer distribution",
    metrics: ["Watch Time", "Geography", "Subscribers"]
  }
];

const workflowSteps = [
  {
    number: "01",
    title: "Connect & Sync",
    description: "Link Spotify, Apple Music, TikTok, Instagram, and YouTube with one-click OAuth. Automatic token refresh keeps data flowing 24/7.",
    icon: Zap,
    color: "from-[#00CFFF] to-[#8B5CF6]"
  },
  {
    number: "02",
    title: "Unify & Resolve",
    description: "Our identity graph merges scattered platform handles into single fan profiles. One person across five platforms becomes one actionable record.",
    icon: GitMerge,
    color: "from-[#8B5CF6] to-[#FF00FF]"
  },
  {
    number: "03",
    title: "Discover & Activate",
    description: "Filter by engagement, location, or affinity score. Export segments directly into Journeys for instant multi-channel campaigns.",
    icon: Rocket,
    color: "from-[#FF00FF] to-[#00CFFF]"
  }
];

const useCases = [
  {
    title: "Fan Discovery & Engagement",
    persona: "Artists & Teams",
    scenario: "Filter for fans who 'Saved on Spotify + Engaged on TikTok' this week",
    action: "Send exclusive content via email or activate targeted campaigns through Journeys",
    outcome: "Turn casual listeners into superfans with precision engagement",
    metrics: [" 3.2x conversion rate", "47% response rate", "2,100+ contacts/month"]
  },
  {
    title: "Smart Local Targeting",
    persona: "Promoters & Managers",
    scenario: "Identify fans who engaged on YouTube AND live within 50 miles of your next show",
    action: "Auto-sync segments into Journey campaigns with presale codes and VIP offers",
    outcome: "Fill venues with verified superfans who already love your music",
    metrics: ["89% attendance rate", "12min setup time", "$18K avg revenue lift"]
  }
];

export function DiscoveryEngine() {
  const heroRef = useRef(null);
  const workflowRef = useRef(null);
  const platformsRef = useRef(null);
  const useCasesRef = useRef(null);

  const isHeroInView = useInView(heroRef, { once: true, amount: 0.3 });
  const isWorkflowInView = useInView(workflowRef, { once: true, amount: 0.2 });
  const isPlatformsInView = useInView(platformsRef, { once: true, amount: 0.2 });
  const isUseCasesInView = useInView(useCasesRef, { once: true, amount: 0.2 });

  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      
      <main className="py-32">
        {/* Hero Section */}
        <section ref={heroRef} className="container mx-auto px-4 mb-32 relative">
          {/* Simplified gradient - less intense */}
          <div className="absolute inset-0 -z-10 bg-gradient-to-br from-primary/5 via-transparent to-transparent" />

          <div className="max-w-7xl mx-auto">
            <motion.div 
              className="text-center max-w-4xl mx-auto mb-20 space-y-6"
              initial={{ opacity: 0, y: 30 }}
              animate={isHeroInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.8 }}
            >
              <Badge className="bg-gradient-to-r from-[#00CFFF]/20 to-[#FF00FF]/20 border-[#00CFFF]/50 text-[#00CFFF] uppercase tracking-wider">
                <Zap className="h-3 w-3 mr-2" />
                Discovery Engine
              </Badge>
              
              <h1 className="text-5xl md:text-7xl lg:text-8xl uppercase tracking-tight">
                <span className="block">THE CROSS-PLATFORM</span>
                <span className="block bg-gradient-to-r from-[#00CFFF] via-[#8B5CF6] to-[#FF00FF] bg-clip-text text-transparent">
                  DISCOVERY ENGINE
                </span>
              </h1>
              
              <p className="text-xl md:text-2xl text-muted-foreground leading-relaxed max-w-3xl mx-auto">
                Merge Spotify, TikTok, Instagram, YouTube, and Apple Music into one unified fan identity graph. 
                Discover superfans, scout collaborators, and activate audiences with precision.
              </p>

              <div className="flex flex-col sm:flex-row gap-4 justify-center pt-6">
                <Button 
                  size="lg"
                  className="bg-gradient-to-r from-primary to-secondary hover:opacity-90 text-primary-foreground group"
                  asChild
                >
                  <a href="/sign-up">
                    Start Discovering Now
                    <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
                  </a>
                </Button>
                <Button 
                  size="lg"
                  variant="outline"
                  className="border-primary/50 hover:bg-primary/10"
                  asChild
                >
                  <a href="/contact">
                    Schedule Demo
                  </a>
                </Button>
              </div>
            </motion.div>

            {/* Platform Dashboard Screenshot */}
            <motion.div
              className="relative max-w-6xl mx-auto"
              initial={{ opacity: 0, y: 50, rotateX: 20 }}
              animate={isHeroInView ? { opacity: 1, y: 0, rotateX: 0 } : {}}
              transition={{ duration: 1, delay: 0.3 }}
              style={{ perspective: "1000px" }}
            >
              <div className="absolute inset-0 bg-gradient-to-r from-[#00CFFF]/20 to-[#FF00FF]/20 blur-3xl rounded-full" />
              <div className="relative rounded-xl overflow-hidden border border-border/50 shadow-2xl bg-card">
                {/* Dashboard Mockup */}
                <DiscoveryDashboard />
              </div>
              
              {/* Floating Stats */}
              <motion.div
                className="absolute -right-4 top-1/4 bg-card/90 backdrop-blur-sm border border-[#00CFFF]/50 rounded-lg p-4 shadow-xl"
                initial={{ opacity: 0, x: 50 }}
                animate={isHeroInView ? { opacity: 1, x: 0 } : {}}
                transition={{ duration: 0.8, delay: 0.6 }}
              >
                <div className="flex items-center gap-3">
                  <div className="p-2 rounded-lg bg-[#00CFFF]/20">
                    <TrendingUp className="h-5 w-5 text-[#00CFFF]" />
                  </div>
                  <div>
                    <div className="text-2xl font-bold">12.4K</div>
                    <div className="text-xs text-muted-foreground uppercase">New Fans Found</div>
                  </div>
                </div>
              </motion.div>

              <motion.div
                className="absolute -left-4 bottom-1/4 bg-card/90 backdrop-blur-sm border border-[#FF00FF]/50 rounded-lg p-4 shadow-xl"
                initial={{ opacity: 0, x: -50 }}
                animate={isHeroInView ? { opacity: 1, x: 0 } : {}}
                transition={{ duration: 0.8, delay: 0.8 }}
              >
                <div className="flex items-center gap-3">
                  <div className="p-2 rounded-lg bg-[#FF00FF]/20">
                    <Users className="h-5 w-5 text-[#FF00FF]" />
                  </div>
                  <div>
                    <div className="text-2xl font-bold">98%</div>
                    <div className="text-xs text-muted-foreground uppercase">Match Accuracy</div>
                  </div>
                </div>
              </motion.div>
            </motion.div>
          </div>
        </section>

        {/* How It Works - 5 Step Workflow */}
        <section ref={workflowRef} className="container mx-auto px-4 mb-32">
          <div className="max-w-7xl mx-auto">
            <motion.div
              className="text-center mb-16"
              initial={{ opacity: 0, y: 20 }}
              animate={isWorkflowInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.6 }}
            >
              <h2 className="text-4xl md:text-6xl uppercase tracking-tight mb-6">
                How The <span className="bg-gradient-to-r from-[#00CFFF] to-[#FF00FF] bg-clip-text text-transparent">Engine Works</span>
              </h2>
              <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
                Five powerful steps that transform scattered platform data into unified fan intelligence
              </p>
            </motion.div>

            <div className="space-y-8">
              {workflowSteps.map((step, index) => (
                <motion.div
                  key={step.number}
                  initial={{ opacity: 0, x: index % 2 === 0 ? -50 : 50 }}
                  animate={isWorkflowInView ? { opacity: 1, x: 0 } : {}}
                  transition={{ duration: 0.6, delay: index * 0.1 }}
                >
                  <Card className="bg-card/30 backdrop-blur-sm border-border/50 hover:border-primary/50 transition-all duration-300 overflow-hidden group">
                    <CardContent className="p-8">
                      <div className="flex flex-col md:flex-row items-start gap-6">
                        {/* Number & Icon */}
                        <div className="flex items-center gap-4 md:flex-col md:items-center md:min-w-[120px]">
                          <div className={`text-6xl md:text-7xl font-bold bg-gradient-to-br ${step.color} bg-clip-text text-transparent opacity-20 group-hover:opacity-40 transition-opacity`}>
                            {step.number}
                          </div>
                          <div className={`p-4 rounded-xl bg-gradient-to-br ${step.color} group-hover:scale-110 transition-transform`}>
                            <step.icon className="h-8 w-8 text-[#1E1E1E]" />
                          </div>
                        </div>

                        {/* Content */}
                        <div className="flex-1 space-y-3">
                          <h3 className="text-3xl uppercase tracking-wide group-hover:text-[#00CFFF] transition-colors">
                            {step.title}
                          </h3>
                          <p className="text-lg text-muted-foreground leading-relaxed">
                            {step.description}
                          </p>
                        </div>

                        {/* Arrow connector (except last) */}
                        {index < workflowSteps.length - 1 && (
                          <div className="hidden md:block">
                            <ArrowRight className="h-6 w-6 text-muted-foreground/30" />
                          </div>
                        )}
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </div>

            {/* Integrations Screenshot */}
            <motion.div
              className="mt-16 relative"
              initial={{ opacity: 0, y: 30 }}
              animate={isWorkflowInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.8, delay: 0.6 }}
            >
              <div className="rounded-xl overflow-hidden border border-border/50 shadow-2xl bg-card">
                <div className="aspect-[16/9] relative">
                  <IntegrationHub />
                </div>
              </div>
            </motion.div>
          </div>
        </section>

        {/* Platform-Specific Value */}
        <section ref={platformsRef} className="container mx-auto px-4 mb-32">
          <div className="max-w-7xl mx-auto">
            <motion.div
              className="text-center mb-16"
              initial={{ opacity: 0, y: 20 }}
              animate={isPlatformsInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.6 }}
            >
              <h2 className="text-4xl md:text-6xl uppercase tracking-tight mb-6">
                Platform-Specific <span className="bg-gradient-to-r from-[#00CFFF] to-[#FF00FF] bg-clip-text text-transparent">Intelligence</span>
              </h2>
              <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
                Each platform reveals unique insights. See what matters most from every channel.
              </p>
            </motion.div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {platforms.map((platform, index) => (
                <motion.div
                  key={platform.name}
                  initial={{ opacity: 0, y: 30 }}
                  animate={isPlatformsInView ? { opacity: 1, y: 0 } : {}}
                  transition={{ duration: 0.6, delay: index * 0.1 }}
                >
                  <Card className="bg-card/30 backdrop-blur-sm border-border/50 hover:border-primary/50 transition-all duration-300 h-full group">
                    <CardContent className="p-6 space-y-4">
                      {/* Platform Header */}
                      <div className="flex items-center gap-3">
                        <div 
                          className="p-3 rounded-lg"
                          style={{ backgroundColor: `${platform.color}20` }}
                        >
                          <platform.icon 
                            className="h-6 w-6" 
                            style={{ color: platform.color }}
                          />
                        </div>
                        <h3 className="text-2xl uppercase tracking-wide group-hover:text-[#00CFFF] transition-colors">
                          {platform.name}
                        </h3>
                      </div>

                      {/* Single Benefit */}
                      <p className="text-sm text-muted-foreground leading-relaxed">
                        {platform.benefit}
                      </p>

                      {/* Key Metrics */}
                      <div className="pt-2">
                        <div className="flex flex-wrap gap-2">
                          {platform.metrics.map((metric) => (
                            <Badge 
                              key={metric}
                              variant="outline"
                              className="border-border/50 text-xs"
                            >
                              {metric}
                            </Badge>
                          ))}
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* Real-World Use Cases */}
        <section ref={useCasesRef} className="container mx-auto px-4 mb-32">
          <div className="max-w-7xl mx-auto">
            <motion.div
              className="text-center mb-16"
              initial={{ opacity: 0, y: 20 }}
              animate={isUseCasesInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.6 }}
            >
              <h2 className="text-4xl md:text-6xl uppercase tracking-tight mb-6">
                Real-World <span className="bg-gradient-to-r from-[#00CFFF] to-[#FF00FF] bg-clip-text text-transparent">Workflows</span>
              </h2>
              <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
                See how artists, producers, and A&R teams use Discovery Engine every day
              </p>
            </motion.div>

            <div className="space-y-6">
              {useCases.map((useCase, index) => (
                <motion.div
                  key={useCase.title}
                  initial={{ opacity: 0, y: 30 }}
                  animate={isUseCasesInView ? { opacity: 1, y: 0 } : {}}
                  transition={{ duration: 0.6, delay: index * 0.15 }}
                >
                  <Card className="bg-card/30 backdrop-blur-sm border-border/50 hover:border-primary/50 transition-all duration-300 group">
                    <CardContent className="p-8">
                      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                        {/* Left: Title & Persona */}
                        <div className="space-y-4">
                          <Badge className="bg-gradient-to-r from-[#00CFFF]/20 to-[#FF00FF]/20 border-[#00CFFF]/50 text-[#00CFFF] uppercase tracking-wider">
                            {useCase.persona}
                          </Badge>
                          <h3 className="text-3xl uppercase tracking-wide group-hover:text-[#00CFFF] transition-colors">
                            {useCase.title}
                          </h3>
                          
                          {/* Metrics */}
                          <div className="space-y-2 pt-4">
                            {useCase.metrics.map((metric) => (
                              <div key={metric} className="flex items-center gap-2">
                                <CheckCircle2 className="h-4 w-4 text-[#00CFFF]" />
                                <span className="text-sm">{metric}</span>
                              </div>
                            ))}
                          </div>
                        </div>

                        {/* Middle: Scenario & Action */}
                        <div className="space-y-4 lg:col-span-2">
                          <div className="space-y-2">
                            <div className="text-xs uppercase tracking-wider text-muted-foreground">
                              Scenario
                            </div>
                            <p className="text-lg leading-relaxed">
                              {useCase.scenario}
                            </p>
                          </div>

                          <div className="space-y-2">
                            <div className="text-xs uppercase tracking-wider text-muted-foreground">
                              Action
                            </div>
                            <p className="text-lg leading-relaxed text-[#00CFFF]">
                              {useCase.action}
                            </p>
                          </div>

                          <div className="space-y-2">
                            <div className="text-xs uppercase tracking-wider text-muted-foreground">
                              Outcome
                            </div>
                            <p className="text-lg leading-relaxed text-muted-foreground">
                              {useCase.outcome}
                            </p>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </div>

            {/* Journeys Screenshot */}
            <motion.div
              className="mt-16 relative"
              initial={{ opacity: 0, y: 30 }}
              animate={isUseCasesInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.8, delay: 0.5 }}
            >
              <div className="text-center mb-6">
                <Badge className="bg-gradient-to-r from-[#00CFFF]/20 to-[#FF00FF]/20 border-[#00CFFF]/50 text-[#00CFFF] uppercase tracking-wider">
                  Customer Journeys
                </Badge>
                <p className="text-sm text-muted-foreground mt-2">
                  Activate discovered audiences with multi-channel campaigns
                </p>
              </div>
              <div className="rounded-xl overflow-hidden border border-border/50 shadow-2xl bg-card">
                <div className="aspect-[16/9] relative">
                  <JourneyBuilder />
                </div>
              </div>
            </motion.div>
          </div>
        </section>

        {/* Identity Graph Visualization */}
        <section className="container mx-auto px-4 mb-32">
          <div className="max-w-5xl mx-auto">
            <Card className="bg-gradient-to-br from-card/80 to-card/40 backdrop-blur-sm border-[#00CFFF]/30 overflow-hidden">
              <CardContent className="p-12">
                <div className="text-center space-y-6">
                  <div className="inline-flex p-4 rounded-xl bg-gradient-to-br from-[#00CFFF]/20 to-[#FF00FF]/20 border border-[#00CFFF]/30">
                    <GitMerge className="h-12 w-12 text-[#00CFFF]" />
                  </div>
                  
                  <h2 className="text-4xl md:text-5xl uppercase tracking-tight">
                    The Identity <span className="bg-gradient-to-r from-[#00CFFF] to-[#FF00FF] bg-clip-text text-transparent">Graph</span>
                  </h2>
                  
                  <p className="text-xl text-muted-foreground leading-relaxed max-w-2xl mx-auto">
                    One fan. Five platforms. Infinite possibilities.
                  </p>

                  {/* Identity Merge Visualization */}
                  <div className="pt-8 pb-6">
                    <div className="flex flex-col md:flex-row items-center justify-center gap-6 md:gap-12">
                      {/* Platform Icons */}
                      <div className="flex flex-col gap-3">
                        <div className="flex items-center gap-3 px-4 py-2 rounded-lg bg-card/50 border border-[#1DB954]/30">
                          <Music className="h-5 w-5 text-[#1DB954]" />
                          <span className="text-sm">spotify_user_abc123</span>
                        </div>
                        <div className="flex items-center gap-3 px-4 py-2 rounded-lg bg-card/50 border border-[#00F2EA]/30">
                          <Music className="h-5 w-5 text-[#00F2EA]" />
                          <span className="text-sm">@tiktok_handle</span>
                        </div>
                        <div className="flex items-center gap-3 px-4 py-2 rounded-lg bg-card/50 border border-[#E4405F]/30">
                          <Instagram className="h-5 w-5 text-[#E4405F]" />
                          <span className="text-sm">@insta_username</span>
                        </div>
                        <div className="flex items-center gap-3 px-4 py-2 rounded-lg bg-card/50 border border-[#FF0000]/30">
                          <Youtube className="h-5 w-5 text-[#FF0000]" />
                          <span className="text-sm">YT_channel_xyz</span>
                        </div>
                        <div className="flex items-center gap-3 px-4 py-2 rounded-lg bg-card/50 border border-[#FA57C1]/30">
                          <Music className="h-5 w-5 text-[#FA57C1]" />
                          <span className="text-sm">apple_music_id_789</span>
                        </div>
                      </div>

                      {/* Arrow */}
                      <div className="rotate-90 md:rotate-0">
                        <ArrowRight className="h-8 w-8 text-[#00CFFF]" />
                      </div>

                      {/* Unified Profile */}
                      <div className="px-8 py-6 rounded-xl bg-gradient-to-br from-[#00CFFF]/20 to-[#FF00FF]/20 border-2 border-[#00CFFF]/50">
                        <div className="flex items-center gap-3 mb-4">
                          <div className="p-2 rounded-lg bg-[#00CFFF]/20">
                            <Users className="h-6 w-6 text-[#00CFFF]" />
                          </div>
                          <div>
                            <div className="text-lg font-bold">Sarah M.</div>
                            <div className="text-xs text-muted-foreground">Superfan ID: WSS_001234</div>
                          </div>
                        </div>
                        <div className="space-y-2 text-sm">
                          <div className="flex items-center gap-2">
                            <CheckCircle2 className="h-4 w-4 text-[#00CFFF]" />
                            <span>5 platforms linked</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <CheckCircle2 className="h-4 w-4 text-[#00CFFF]" />
                            <span>98% match confidence</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <CheckCircle2 className="h-4 w-4 text-[#00CFFF]" />
                            <span>Ready for campaigns</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  <p className="text-muted-foreground max-w-2xl mx-auto">
                    Our proprietary identity resolution merges scattered platform handles into a single, 
                    actionable fan profile. No more guessing. No more duplicates. Just clean, unified intelligence.
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>
        </section>

        {/* Final CTA */}
        <section className="container mx-auto px-4 mb-20">
          <div className="max-w-4xl mx-auto text-center space-y-8">
            <h2 className="text-4xl md:text-6xl uppercase tracking-tight">
              Ready To Discover <span className="bg-gradient-to-r from-[#00CFFF] to-[#FF00FF] bg-clip-text text-transparent">Your Audience?</span>
            </h2>
            
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Start merging your platform data today. See every fan, curator, and collaborator 
              in one unified view.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center pt-6">
              <Button 
                size="lg"
                className="bg-gradient-to-r from-primary to-secondary hover:opacity-90 text-primary-foreground group"
                asChild
              >
                <a href="/sign-up">
                  Start Free Trial
                  <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
                </a>
              </Button>
              <Button 
                size="lg"
                variant="outline"
                className="border-primary/50 hover:bg-primary/10"
                asChild
              >
                <a href="/#pricing">
                  See Pricing
                </a>
              </Button>
            </div>

            <p className="text-sm text-muted-foreground">
              14-day free trial • No credit card required • Connect all platforms in minutes
            </p>
          </div>
        </section>
      </main>
      
      <Footer />
    </div>
  );
}