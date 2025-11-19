import { Navigation } from "../components/Navigation";
import { Footer } from "../components/Footer";
import { Button } from "../components/ui/button";
import { Card, CardContent } from "../components/ui/card";
import { 
  BarChart3,
  TrendingUp,
  Target,
  MapPin,
  Users,
  Zap,
  ArrowRight,
  CheckCircle2,
  LineChart,
  Activity,
  Globe,
  Send
} from "lucide-react";
import { motion, useInView } from "motion/react";
import { useRef, useState } from "react";
import { PlatformHeatmapMockup } from "../components/mockups/PlatformHeatmapMockup";
import { AttributionTimelineMockup } from "../components/mockups/AttributionTimelineMockup";
import { GeoLeaderboardMockup } from "../components/mockups/GeoLeaderboardMockup";

const workflowSteps = [
  {
    number: "01",
    title: "Filter by Artist or Campaign",
    description: "Keep your view focused on what matters. Select a specific artist or campaign to see only relevant metrics and eliminate noise.",
    icon: Target
  },
  {
    number: "02",
    title: "Pin Your KPIs",
    description: "Choose the metrics that matter most—Saves, Texts Replied, Stream Velocity—and pin them to the top for instant visibility during daily standups.",
    icon: Activity
  },
  {
    number: "03",
    title: "Export & Share Insights",
    description: "Generate snapshots directly from the dashboard when pitching to partners, sponsors, or stakeholders. Prove ROI with data-backed visuals.",
    icon: TrendingUp
  }
];

const features = [
  {
    icon: BarChart3,
    title: "Platform Heatmap",
    description: "Color-coded grid showing Spotify, Apple Music, TikTok, and Instagram metrics over time. Spot which platform reacted to your campaign first and double down there.",
    color: "#00CFFF"
  },
  {
    icon: LineChart,
    title: "Attribution Timeline",
    description: "Overlay campaign launches with follower and sales spikes to prove causal lift. Perfect for justifying marketing budgets to stakeholders.",
    color: "#FF00FF"
  },
  {
    icon: Globe,
    title: "Geo Leaderboard",
    description: "Top cities and countries ranked by engagement. Guides tour routing, pop-up planning, and merch localization with precision.",
    color: "#00CFFF"
  },
  {
    icon: Users,
    title: "Creator / Curator Table",
    description: "See who playlisted, dueted, or mentioned the artist. Build a ready-made partnership pipeline and shout-out list instantly.",
    color: "#FF00FF"
  }
];

const useCases = [
  {
    title: "Budget Justification",
    persona: "Marketing Manager",
    challenge: "Need to prove campaign ROI to secure more marketing budget for upcoming releases.",
    solution: "Use the Attribution Timeline to overlay campaign launches with streaming and sales spikes. Export the visualization to show stakeholders the direct causal lift from your marketing spend.",
    results: ["40% budget increase approved", "Clear spend → growth attribution", "Stakeholder confidence restored"],
    color: "primary"
  },
  {
    title: "Tour Route Optimization",
    persona: "Artist Manager",
    challenge: "Planning a 15-city tour but unsure which markets will sell out fastest.",
    solution: "Check the Geo Leaderboard to identify top cities by engagement, then cross-reference with the Platform Heatmap to see where fans are most active. Book venues in high-engagement cities first.",
    results: ["12 of 15 shows sold out", "Optimal routing saved $30k", "Higher merch sales per city"],
    color: "secondary"
  }
];

export function AnalyticsDashboard() {
  const heroRef = useRef(null);
  const isHeroInView = useInView(heroRef, { once: true, margin: "-100px" });

  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      
      <main>
        {/* Hero Section */}
        <section ref={heroRef} className="relative pt-32 pb-24 overflow-hidden">
          <motion.div 
            className="absolute inset-0 bg-gradient-to-br from-primary/10 via-transparent to-secondary/10"
            animate={{
              backgroundPosition: ["0% 0%", "100% 100%", "0% 0%"],
            }}
            transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
            style={{ backgroundSize: "200% 200%" }}
          />

          {/* Floating chart elements */}
          {[BarChart3, LineChart, Activity, TrendingUp, Globe].map((Icon, i) => (
            <motion.div
              key={i}
              className="absolute opacity-5"
              style={{
                left: `${10 + i * 20}%`,
                top: `${20 + (i % 2) * 40}%`,
              }}
              animate={{
                y: [0, -20, 0],
                rotate: [0, 10, 0],
              }}
              transition={{
                duration: 6 + i,
                repeat: Infinity,
                delay: i * 0.4,
                ease: "easeInOut"
              }}
            >
              <Icon className="w-16 h-16" strokeWidth={1} />
            </motion.div>
          ))}

          <div className="container mx-auto px-4 relative z-10">
            <div className="max-w-4xl mx-auto text-center space-y-8">
              <motion.div
                initial={{ opacity: 0, scale: 0.8 }}
                animate={isHeroInView ? { opacity: 1, scale: 1 } : {}}
                transition={{ duration: 0.5 }}
              >
                <span className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-gradient-to-r from-primary/20 to-secondary/20 border border-primary/30 backdrop-blur-sm text-sm uppercase tracking-wider">
                  <BarChart3 className="w-4 h-4" />
                  Analytics Dashboard
                </span>
              </motion.div>

              <motion.h1 
                className="text-5xl md:text-7xl uppercase tracking-tight"
                initial={{ opacity: 0, y: 30 }}
                animate={isHeroInView ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.6, delay: 0.2 }}
              >
                <span className="block">PROVE YOUR</span>
                <span className="block bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
                  MARKETING IMPACT
                </span>
              </motion.h1>

              <motion.p 
                className="text-xl text-muted-foreground max-w-2xl mx-auto"
                initial={{ opacity: 0 }}
                animate={isHeroInView ? { opacity: 1 } : {}}
                transition={{ duration: 0.6, delay: 0.4 }}
              >
                Real-time analytics across Spotify, TikTok, Instagram, and more. Track campaign performance, 
                attribute growth to specific actions, and optimize your strategy with data-backed insights.
              </motion.p>

              <motion.div 
                className="flex flex-col sm:flex-row gap-4 justify-center pt-4"
                initial={{ opacity: 0, y: 20 }}
                animate={isHeroInView ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.6, delay: 0.6 }}
              >
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
                  <a href="/contact">
                    Book a Demo
                  </a>
                </Button>
              </motion.div>
            </div>
          </div>
        </section>

        {/* Workflow Section */}
        <WorkflowSection steps={workflowSteps} />

        {/* Interactive Mockups Section */}
        <MockupsSection />

        {/* Features Grid */}
        <FeaturesSection features={features} />

        {/* Use Cases */}
        <UseCasesSection useCases={useCases} />

        {/* Platform Benefits Table */}
        <PlatformBenefitsSection />

        {/* Related Tools Section */}
        <RelatedToolsSection />

        {/* CTA Section */}
        <CTASection />
      </main>
      
      <Footer />
    </div>
  );
}

function WorkflowSection({ steps }: any) {
  const sectionRef = useRef(null);
  const isInView = useInView(sectionRef, { once: true, margin: "-100px" });

  return (
    <section ref={sectionRef} className="py-32 relative overflow-hidden">
      {/* Simplified gradient - less intense */}
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-primary/3 to-transparent" />

      <div className="container mx-auto px-4 relative z-10">
        <motion.div
          className="text-center max-w-3xl mx-auto mb-20"
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
        >
          <h2 className="text-4xl md:text-6xl uppercase tracking-tight mb-6">
            How It Works
          </h2>
          <p className="text-lg text-muted-foreground">
            Three steps to data-driven decision making
          </p>
        </motion.div>

        <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
          {steps.map((step: any, index: number) => (
            <WorkflowCard key={index} step={step} index={index} isInView={isInView} />
          ))}
        </div>
      </div>
    </section>
  );
}

function WorkflowCard({ step, index, isInView }: any) {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <motion.div
      initial={{ opacity: 0, y: 50 }}
      animate={isInView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.5, delay: index * 0.2 }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <Card className="bg-card/30 backdrop-blur-sm border-border/50 hover:border-primary/50 transition-all duration-300 h-full relative overflow-hidden group">
        <motion.div
          className="absolute inset-0 bg-gradient-to-br from-primary/5 to-secondary/5 opacity-0 group-hover:opacity-100"
          transition={{ duration: 0.3 }}
        />
        
        <CardContent className="p-8 space-y-6 relative z-10">
          <motion.div
            animate={isHovered ? { scale: 1.1, rotate: 5 } : {}}
            transition={{ type: "spring", stiffness: 300 }}
          >
            <div className="text-6xl bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent opacity-30">
              {step.number}
            </div>
          </motion.div>
          
          <div className="space-y-4">
            <div className="w-fit p-3 rounded-lg bg-gradient-to-br from-primary/10 to-secondary/10">
              <step.icon className="w-6 h-6 text-primary" />
            </div>
            
            <h3 className="text-xl uppercase tracking-wide">
              {step.title}
            </h3>
            
            <p className="text-sm text-muted-foreground leading-relaxed">
              {step.description}
            </p>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
}

function MockupsSection() {
  const sectionRef = useRef(null);
  const isInView = useInView(sectionRef, { once: true, margin: "-100px" });

  return (
    <section ref={sectionRef} className="py-24 relative">
      <div className="container mx-auto px-4">
        <motion.div
          className="text-center max-w-3xl mx-auto mb-16"
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
        >
          <h2 className="text-4xl md:text-6xl uppercase tracking-tight mb-4">
            <span className="block bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
              SEE IT IN ACTION
            </span>
          </h2>
          <p className="text-lg text-muted-foreground">
            Interactive dashboard mockups showing real-time analytics
          </p>
        </motion.div>

        <div className="space-y-12 max-w-6xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            <PlatformHeatmapMockup />
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 50 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6, delay: 0.4 }}
          >
            <AttributionTimelineMockup />
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 50 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6, delay: 0.6 }}
          >
            <GeoLeaderboardMockup />
          </motion.div>
        </div>
      </div>
    </section>
  );
}

function FeaturesSection({ features }: any) {
  const sectionRef = useRef(null);
  const isInView = useInView(sectionRef, { once: true, margin: "-100px" });

  return (
    <section ref={sectionRef} className="py-32 relative overflow-hidden">
      {/* Simplified gradient - less intense */}
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-secondary/3 to-transparent" />

      <div className="container mx-auto px-4 relative z-10">
        <motion.div
          className="text-center max-w-3xl mx-auto mb-20"
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
        >
          <h2 className="text-4xl md:text-6xl uppercase tracking-tight mb-6">
            Key Widgets
          </h2>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-6xl mx-auto">
          {features.map((feature: any, index: number) => (
            <FeatureCard key={index} feature={feature} index={index} isInView={isInView} />
          ))}
        </div>
      </div>
    </section>
  );
}

function FeatureCard({ feature, index, isInView }: any) {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <motion.div
      initial={{ opacity: 0, y: 50 }}
      animate={isInView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.5, delay: index * 0.1 }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <Card className="bg-card/30 backdrop-blur-sm border-border/50 hover:border-primary/50 transition-all duration-300 h-full group relative overflow-hidden">
        <motion.div
          className="absolute inset-0 bg-gradient-to-br from-primary/5 to-secondary/5 opacity-0 group-hover:opacity-100"
          transition={{ duration: 0.3 }}
        />
        
        <CardContent className="p-6 space-y-4 relative z-10">
          <motion.div
            className="w-fit p-3 rounded-lg bg-gradient-to-br from-primary/10 to-secondary/10"
            animate={isHovered ? { scale: 1.1, rotate: 5 } : {}}
            transition={{ type: "spring", stiffness: 300 }}
          >
            <feature.icon 
              className="w-6 h-6 text-primary"
              style={{ filter: `drop-shadow(0 0 8px ${feature.color}80)` }}
            />
          </motion.div>
          
          <h3 className="text-xl uppercase tracking-wide">
            {feature.title}
          </h3>
          
          <p className="text-sm text-muted-foreground leading-relaxed">
            {feature.description}
          </p>
        </CardContent>
      </Card>
    </motion.div>
  );
}

function UseCasesSection({ useCases }: any) {
  const sectionRef = useRef(null);
  const isInView = useInView(sectionRef, { once: true, margin: "-100px" });

  return (
    <section ref={sectionRef} className="py-24 relative">
      <div className="container mx-auto px-4">
        <motion.div
          className="text-center max-w-3xl mx-auto mb-16"
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
        >
          <h2 className="text-4xl md:text-6xl uppercase tracking-tight mb-4">
            <span className="block bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
              USE CASES
            </span>
          </h2>
          <p className="text-lg text-muted-foreground">
            Real scenarios, measurable results
          </p>
        </motion.div>

        <div className="grid md:grid-cols-2 gap-8 max-w-6xl mx-auto">
          {useCases.map((useCase: any, index: number) => (
            <UseCaseCard key={index} useCase={useCase} index={index} isInView={isInView} />
          ))}
        </div>
      </div>
    </section>
  );
}

function UseCaseCard({ useCase, index, isInView }: any) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 50 }}
      animate={isInView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.6, delay: index * 0.2 }}
    >
      <Card className={`bg-card/30 backdrop-blur-sm border-${useCase.color}/30 h-full relative overflow-hidden group`}>
        <motion.div
          className={`absolute inset-0 bg-gradient-to-br from-${useCase.color}/5 to-${useCase.color}/10 opacity-0 group-hover:opacity-100`}
          transition={{ duration: 0.3 }}
        />
        
        <CardContent className="p-8 space-y-6 relative z-10">
          <div>
            <div className={`inline-block px-3 py-1 rounded-full bg-${useCase.color}/10 border border-${useCase.color}/30 text-sm uppercase tracking-wider text-${useCase.color} mb-4`}>
              {useCase.persona}
            </div>
            <h3 className="text-2xl uppercase tracking-wide mb-2">
              {useCase.title}
            </h3>
          </div>

          <div className="space-y-4 text-sm">
            <div>
              <div className="uppercase tracking-wider text-xs text-muted-foreground mb-2">Challenge</div>
              <p className="text-muted-foreground">{useCase.challenge}</p>
            </div>

            <div>
              <div className="uppercase tracking-wider text-xs text-muted-foreground mb-2">Solution</div>
              <p className="text-muted-foreground">{useCase.solution}</p>
            </div>

            <div>
              <div className="uppercase tracking-wider text-xs text-muted-foreground mb-2">Results</div>
              <ul className="space-y-2">
                {useCase.results.map((result: string, i: number) => (
                  <li key={i} className="flex items-center gap-2">
                    <CheckCircle2 className={`w-4 h-4 text-${useCase.color} flex-shrink-0`} />
                    <span>{result}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
}

function PlatformBenefitsSection() {
  const sectionRef = useRef(null);
  const isInView = useInView(sectionRef, { once: true, margin: "-100px" });

  const benefits = [
    {
      metric: "Campaign ROI",
      value: "Track spend vs. growth",
      icon: TrendingUp
    },
    {
      metric: "Cross-Platform Attribution",
      value: "Connect dots between channels",
      icon: Zap
    },
    {
      metric: "Stakeholder Reports",
      value: "Export-ready visualizations",
      icon: BarChart3
    },
    {
      metric: "Real-Time Updates",
      value: "Data refreshes every 15 minutes",
      icon: Activity
    }
  ];

  return (
    <section ref={sectionRef} className="py-24 relative overflow-hidden">
      <div className="container mx-auto px-4">
        <div className="max-w-5xl mx-auto">
          <motion.div
            className="text-center mb-12"
            initial={{ opacity: 0, y: 30 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6 }}
          >
            <h2 className="text-4xl md:text-5xl uppercase tracking-tight mb-4">
              <span className="bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
                Why Analytics Matter
              </span>
            </h2>
          </motion.div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {benefits.map((benefit, index) => (
              <motion.div
                key={index}
                className="text-center p-6 rounded-lg bg-card/20 backdrop-blur-sm border border-border/30 hover:border-primary/50 transition-all duration-300"
                initial={{ opacity: 0, scale: 0.8 }}
                animate={isInView ? { opacity: 1, scale: 1 } : {}}
                transition={{ duration: 0.4, delay: index * 0.1 }}
                whileHover={{ scale: 1.05, y: -5 }}
              >
                <benefit.icon className="w-8 h-8 text-primary mx-auto mb-3" />
                <div className="text-sm uppercase tracking-wide mb-1">{benefit.metric}</div>
                <div className="text-xs text-muted-foreground">{benefit.value}</div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

function RelatedToolsSection() {
  const sectionRef = useRef(null);
  const isInView = useInView(sectionRef, { once: true, margin: "-100px" });

  const tools = [
    {
      title: "Discovery Engine",
      description: "Find and analyze fans across platforms. Analytics show you what's working.",
      icon: Users,
      href: "/features/discovery-engine",
      badge: "Data Source"
    },
    {
      title: "Geofencing & Segmentation",
      description: "Use analytics insights to build location-based and behavioral segments.",
      icon: MapPin,
      href: "/features/geofencing-segmentation",
      badge: "Activation"
    },
    {
      title: "Campaign Orchestration",
      description: "Launch campaigns and track their performance in the Analytics Dashboard.",
      icon: Send,
      href: "/features/campaign-orchestration",
      badge: "Coming Soon"
    }
  ];

  return (
    <section ref={sectionRef} className="py-24 relative overflow-hidden">
      <motion.div 
        className="absolute inset-0 bg-gradient-to-b from-transparent via-primary/5 to-transparent"
      />

      <div className="container mx-auto px-4 relative z-10">
        <div className="max-w-6xl mx-auto">
          <motion.div
            className="text-center mb-12"
            initial={{ opacity: 0, y: 30 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6 }}
          >
            <span className="inline-block px-4 py-2 rounded-full bg-gradient-to-r from-primary/20 to-secondary/20 border border-primary/30 backdrop-blur-sm text-sm uppercase tracking-wider mb-4">
              Complete Workflow
            </span>
            <h2 className="text-4xl md:text-5xl uppercase tracking-tight mb-4">
              <span className="bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
                Tools That Work Together
              </span>
            </h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Analytics Dashboard is part of an integrated workflow. Discover fans, analyze performance, and activate with precision.
            </p>
          </motion.div>

          <div className="grid md:grid-cols-3 gap-6">
            {tools.map((tool, index) => {
              const ToolIcon = tool.icon;
              return (
                <motion.a
                  key={index}
                  href={tool.href}
                  className="block group"
                  initial={{ opacity: 0, y: 30 }}
                  animate={isInView ? { opacity: 1, y: 0 } : {}}
                  transition={{ duration: 0.4, delay: index * 0.1 }}
                  whileHover={{ y: -5 }}
                >
                  <Card className="bg-card/30 backdrop-blur-sm border-border/50 hover:border-primary/50 transition-all duration-300 h-full relative overflow-hidden">
                    <motion.div
                      className="absolute inset-0 bg-gradient-to-br from-primary/5 to-secondary/5 opacity-0 group-hover:opacity-100"
                      transition={{ duration: 0.3 }}
                    />
                    
                    <CardContent className="p-6 space-y-4 relative z-10">
                      <div className="flex items-start justify-between">
                        <div className="p-3 rounded-lg bg-gradient-to-br from-primary/10 to-secondary/10">
                          <ToolIcon className="w-6 h-6 text-primary" />
                        </div>
                        {tool.badge && (
                          <span className="text-xs px-2 py-1 rounded-full bg-primary/10 border border-primary/30 text-primary uppercase tracking-wider">
                            {tool.badge}
                          </span>
                        )}
                      </div>
                      
                      <div>
                        <h3 className="uppercase tracking-wide mb-2 group-hover:text-primary transition-colors">
                          {tool.title}
                        </h3>
                        <p className="text-sm text-muted-foreground leading-relaxed">
                          {tool.description}
                        </p>
                      </div>

                      <div className="flex items-center text-xs uppercase tracking-wider text-primary/70 pt-2">
                        <span>Explore</span>
                        <motion.span
                          className="ml-1"
                          animate={{ x: [0, 4, 0] }}
                          transition={{ duration: 1.5, repeat: Infinity }}
                        >
                          →
                        </motion.span>
                      </div>
                    </CardContent>
                  </Card>
                </motion.a>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}

function CTASection() {
  const sectionRef = useRef(null);
  const isInView = useInView(sectionRef, { once: true, margin: "-100px" });

  return (
    <section ref={sectionRef} className="py-24 relative overflow-hidden">
      <motion.div 
        className="absolute inset-0 bg-gradient-to-br from-primary/10 via-transparent to-secondary/10"
        animate={{
          backgroundPosition: ["0% 0%", "100% 100%", "0% 0%"],
        }}
        transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
        style={{ backgroundSize: "200% 200%" }}
      />

      <div className="container mx-auto px-4 relative z-10">
        <motion.div
          className="max-w-3xl mx-auto text-center space-y-8"
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
        >
          <h2 className="text-4xl md:text-6xl uppercase tracking-tight">
            <span className="block">START MAKING</span>
            <span className="block bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
              DATA-DRIVEN DECISIONS
            </span>
          </h2>

          <p className="text-xl text-muted-foreground">
            Stop guessing. Start proving. Track every campaign, attribute every spike, and optimize with confidence.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center pt-4">
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
              <a href="/contact">
                Schedule a Demo
              </a>
            </Button>
          </div>

          <p className="text-sm text-muted-foreground">
            14-day free trial • Real-time data • Export-ready reports
          </p>
        </motion.div>
      </div>
    </section>
  );
}