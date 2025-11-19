import { Navigation } from "../components/Navigation";
import { Footer } from "../components/Footer";
import { Button } from "../components/ui/button";
import { Card, CardContent } from "../components/ui/card";
import { 
  Send,
  Zap,
  Target,
  Clock,
  ArrowRight,
  CheckCircle2,
  Mail,
  MessageSquare,
  Bell,
  Calendar,
  Users,
  BarChart3,
  MapPin
} from "lucide-react";
import { motion, useInView } from "motion/react";
import { useRef, useState } from "react";

const workflowSteps = [
  {
    number: "01",
    title: "Design Journey",
    description: "Build multi-step campaigns with visual workflow builder. Add triggers, conditions, delays, and A/B tests. Preview the entire customer journey before launch.",
    icon: Target
  },
  {
    number: "02",
    title: "Set Triggers & Timing",
    description: "Choose entry conditions: segment membership, user action, date/time, or API event. Add smart delays (wait 2 days, send Tuesday 10am PT) and conditional splits.",
    icon: Clock
  },
  {
    number: "03",
    title: "Launch & Optimize",
    description: "Deploy campaigns across email, SMS, and push. Real-time analytics show opens, clicks, conversions. Auto-optimize send times and content based on engagement.",
    icon: Zap
  }
];

const features = [
  {
    icon: Mail,
    title: "Multi-Channel Delivery",
    description: "Orchestrate campaigns across email, SMS, and push notifications from a single interface. Consistent messaging, unified tracking, and cross-channel attribution.",
    color: "#00CFFF"
  },
  {
    icon: Zap,
    title: "Smart Automation",
    description: "Trigger campaigns based on user behavior, segment changes, or calendar events. Add wait steps, A/B tests, and conditional logic for intelligent engagement.",
    color: "#FF00FF"
  },
  {
    icon: Clock,
    title: "Send-Time Optimization",
    description: "AI learns each fan's optimal engagement window. Automatically schedule messages for maximum open rates and conversions based on historical behavior.",
    color: "#00CFFF"
  },
  {
    icon: BarChart3,
    title: "Real-Time Analytics",
    description: "Track performance across all channels in one dashboard. See opens, clicks, conversions, and revenue attribution. Identify winning variants and optimize on the fly.",
    color: "#FF00FF"
  }
];

const useCases = [
  {
    title: "Album Release Campaign",
    persona: "Artist Manager",
    challenge: "Coordinate a multi-week album rollout across email, SMS, and push to maximize pre-saves and first-week streams.",
    solution: "Build a 4-week journey: Week 1 (teaser email + SMS), Week 2 (pre-save reminder to non-converters), Week 3 (countdown push notifications), Release Day (thank you + streaming links). Add A/B tests for subject lines.",
    results: ["18,000 pre-saves generated", "2.4M first-week streams", "62% email open rate", "$47K merch revenue"],
    color: "primary"
  },
  {
    title: "Tour Presale Automation",
    persona: "Promoter Team",
    challenge: "Sell out 12 tour dates across 3 markets with tiered presale access for VIP fans, email subscribers, and general audience.",
    solution: "Create segmented journey: VIP segment gets SMS 48hrs early with exclusive code, email list gets 24hr early access, then general push notification. Auto-pause campaigns when venue reaches 90% capacity.",
    results: ["11 of 12 venues sold out", "VIP segment: 94% conversion", "Average sellout: 8.2 days", "$340K gross revenue"],
    color: "secondary"
  }
];

const producerBenefits = [
  "Campaign templates across roster artists",
  "Compliance checks for CAN-SPAM, GDPR, TCPA",
  "Cross-artist performance benchmarking",
  "Shared content library and brand assets",
  "Multi-user approval workflows",
  "API access for custom integrations"
];

export function CampaignOrchestration() {
  const heroRef = useRef(null);
  const isHeroInView = useInView(heroRef, { once: true, margin: "-100px" });

  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      
      <main>
        {/* Hero Section */}
        <section ref={heroRef} className="relative pt-32 pb-32 overflow-hidden">
          {/* Simplified gradient - less intense */}
          <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-transparent" />

          {/* Removed floating icons for cleaner look */}

          <div className="container mx-auto px-4 relative z-10">
            <div className="max-w-4xl mx-auto text-center space-y-8">
              <motion.div
                initial={{ opacity: 0, scale: 0.8 }}
                animate={isHeroInView ? { opacity: 1, scale: 1 } : {}}
                transition={{ duration: 0.5 }}
              >
                <span className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-gradient-to-r from-primary/20 to-secondary/20 border border-primary/30 backdrop-blur-sm text-sm uppercase tracking-wider">
                  <Send className="w-4 h-4" />
                  Campaign Orchestration
                </span>
              </motion.div>

              <motion.h1 
                className="text-5xl md:text-7xl uppercase tracking-tight"
                initial={{ opacity: 0, y: 30 }}
                animate={isHeroInView ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.6, delay: 0.2 }}
              >
                <span className="block">AUTOMATE</span>
                <span className="block bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
                  MULTI-CHANNEL CAMPAIGNS
                </span>
              </motion.h1>

              <motion.p 
                className="text-xl text-muted-foreground max-w-2xl mx-auto"
                initial={{ opacity: 0 }}
                animate={isHeroInView ? { opacity: 1 } : {}}
                transition={{ duration: 0.6, delay: 0.4 }}
              >
                Launch coordinated campaigns across email, SMS, and push notifications with intelligent automation. 
                Build once, engage everywhere, track everything.
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

        {/* Producer Benefits */}
        <ProducerBenefitsSection benefits={producerBenefits} />

        {/* Related Tools */}
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
    <section ref={sectionRef} className="py-32 relative">
      {/* Removed background gradient */}

      <div className="container mx-auto px-4">
        <motion.div
          className="text-center max-w-3xl mx-auto mb-20"
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
        >
          <h2 className="text-4xl md:text-5xl uppercase tracking-tight mb-6">
            How It Works
          </h2>
          <p className="text-lg text-muted-foreground">
            Three steps to launch intelligent multi-channel campaigns
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
            Visual campaign builder with real-time performance tracking
          </p>
        </motion.div>

        <div className="space-y-12 max-w-6xl mx-auto">
          {/* Campaign Builder Mockup */}
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            <CampaignBuilderMockup />
          </motion.div>

          {/* Multi-Channel Flow Mockup */}
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6, delay: 0.4 }}
          >
            <MultiChannelFlowMockup />
          </motion.div>

          {/* Performance Dashboard Mockup */}
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6, delay: 0.6 }}
          >
            <PerformanceDashboardMockup />
          </motion.div>
        </div>
      </div>
    </section>
  );
}

// Simplified mockup components
function CampaignBuilderMockup() {
  return (
    <Card className="bg-card border-border/50 overflow-hidden">
      <CardContent className="p-8">
        <div className="flex items-center justify-between mb-6">
          <div>
            <div className="text-sm text-muted-foreground uppercase tracking-wider mb-2">Campaign Builder</div>
            <h3 className="text-2xl">Album Release Journey</h3>
          </div>
          <Button size="sm" className="bg-primary/20 hover:bg-primary/30 text-primary border border-primary/50">
            <Zap className="w-4 h-4 mr-2" />
            Activate
          </Button>
        </div>

        <div className="grid grid-cols-3 gap-4">
          {/* Step 1 */}
          <div className="bg-card/50 border border-primary/30 rounded-lg p-4 space-y-3">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center text-xs">1</div>
              <Mail className="w-4 h-4 text-primary" />
            </div>
            <div>
              <div className="text-sm mb-1">Teaser Email</div>
              <div className="text-xs text-muted-foreground">Day 1 • 9:00 AM</div>
            </div>
            <div className="text-xs bg-primary/10 px-2 py-1 rounded">12,450 contacts</div>
          </div>

          {/* Step 2 */}
          <div className="bg-card/50 border border-secondary/30 rounded-lg p-4 space-y-3">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-full bg-secondary/20 flex items-center justify-center text-xs">2</div>
              <MessageSquare className="w-4 h-4 text-secondary" />
            </div>
            <div>
              <div className="text-sm mb-1">Pre-Save SMS</div>
              <div className="text-xs text-muted-foreground">Day 3 • 2:00 PM</div>
            </div>
            <div className="text-xs bg-secondary/10 px-2 py-1 rounded">VIP segment only</div>
          </div>

          {/* Step 3 */}
          <div className="bg-card/50 border border-primary/30 rounded-lg p-4 space-y-3">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center text-xs">3</div>
              <Bell className="w-4 h-4 text-primary" />
            </div>
            <div>
              <div className="text-sm mb-1">Release Push</div>
              <div className="text-xs text-muted-foreground">Day 7 • 12:01 AM</div>
            </div>
            <div className="text-xs bg-primary/10 px-2 py-1 rounded">All contacts</div>
          </div>
        </div>

        <div className="mt-6 pt-6 border-t border-border/50 flex items-center justify-between text-sm">
          <div className="flex gap-6">
            <div>
              <div className="text-muted-foreground text-xs mb-1">Status</div>
              <div className="text-primary">● Active</div>
            </div>
            <div>
              <div className="text-muted-foreground text-xs mb-1">Total Sends</div>
              <div>37,350</div>
            </div>
            <div>
              <div className="text-muted-foreground text-xs mb-1">Conversion Rate</div>
              <div className="text-primary">24.8%</div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

function MultiChannelFlowMockup() {
  return (
    <Card className="bg-card border-border/50 overflow-hidden">
      <CardContent className="p-8">
        <div className="mb-6">
          <div className="text-sm text-muted-foreground uppercase tracking-wider mb-2">Multi-Channel Flow</div>
          <h3 className="text-2xl">Tour Presale Sequence</h3>
        </div>

        <div className="space-y-4">
          {/* Trigger */}
          <div className="flex items-center gap-4">
            <div className="w-32 text-xs text-muted-foreground uppercase">Trigger</div>
            <div className="flex-1 bg-card/50 border border-border/50 rounded-lg p-3 flex items-center gap-3">
              <Target className="w-5 h-5 text-primary" />
              <div>
                <div className="text-sm">Segment Entry</div>
                <div className="text-xs text-muted-foreground">VIP Fans - NYC Area</div>
              </div>
            </div>
          </div>

          {/* Step 1 */}
          <div className="flex items-center gap-4">
            <div className="w-32 text-xs text-muted-foreground uppercase">48 hrs early</div>
            <div className="flex-1 bg-card/50 border border-primary/30 rounded-lg p-3 flex items-center gap-3">
              <MessageSquare className="w-5 h-5 text-primary" />
              <div className="flex-1">
                <div className="text-sm">VIP SMS with Code</div>
                <div className="text-xs text-muted-foreground">"Get tickets now: CODE-VIP2024"</div>
              </div>
              <div className="text-xs text-primary">2,340 sent</div>
            </div>
          </div>

          {/* Delay */}
          <div className="flex items-center gap-4">
            <div className="w-32 text-xs text-muted-foreground uppercase">Wait 24h</div>
            <div className="flex-1 border-l-2 border-dashed border-border/30 pl-4 py-2">
              <Clock className="w-4 h-4 text-muted-foreground" />
            </div>
          </div>

          {/* Step 2 */}
          <div className="flex items-center gap-4">
            <div className="w-32 text-xs text-muted-foreground uppercase">24 hrs early</div>
            <div className="flex-1 bg-card/50 border border-secondary/30 rounded-lg p-3 flex items-center gap-3">
              <Mail className="w-5 h-5 text-secondary" />
              <div className="flex-1">
                <div className="text-sm">Email Subscribers</div>
                <div className="text-xs text-muted-foreground">Subject: "Early Access NYC Show"</div>
              </div>
              <div className="text-xs text-secondary">8,920 sent</div>
            </div>
          </div>

          {/* Final Step */}
          <div className="flex items-center gap-4">
            <div className="w-32 text-xs text-muted-foreground uppercase">General Sale</div>
            <div className="flex-1 bg-card/50 border border-primary/30 rounded-lg p-3 flex items-center gap-3">
              <Bell className="w-5 h-5 text-primary" />
              <div className="flex-1">
                <div className="text-sm">Push Notification</div>
                <div className="text-xs text-muted-foreground">"Tickets on sale now!"</div>
              </div>
              <div className="text-xs text-primary">15,680 sent</div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

function PerformanceDashboardMockup() {
  return (
    <Card className="bg-card border-border/50 overflow-hidden">
      <CardContent className="p-8">
        <div className="mb-6">
          <div className="text-sm text-muted-foreground uppercase tracking-wider mb-2">Campaign Performance</div>
          <h3 className="text-2xl">Last 30 Days</h3>
        </div>

        <div className="grid grid-cols-4 gap-4">
          <div className="bg-card/50 border border-border/50 rounded-lg p-4">
            <div className="flex items-center gap-2 mb-2">
              <Mail className="w-4 h-4 text-primary" />
              <div className="text-xs text-muted-foreground uppercase">Email</div>
            </div>
            <div className="text-3xl mb-1">47.2%</div>
            <div className="text-xs text-muted-foreground">Open Rate</div>
            <div className="text-xs text-primary mt-1">↑ 12% vs avg</div>
          </div>

          <div className="bg-card/50 border border-border/50 rounded-lg p-4">
            <div className="flex items-center gap-2 mb-2">
              <MessageSquare className="w-4 h-4 text-secondary" />
              <div className="text-xs text-muted-foreground uppercase">SMS</div>
            </div>
            <div className="text-3xl mb-1">89.4%</div>
            <div className="text-xs text-muted-foreground">Open Rate</div>
            <div className="text-xs text-secondary mt-1">↑ 4% vs avg</div>
          </div>

          <div className="bg-card/50 border border-border/50 rounded-lg p-4">
            <div className="flex items-center gap-2 mb-2">
              <Bell className="w-4 h-4 text-primary" />
              <div className="text-xs text-muted-foreground uppercase">Push</div>
            </div>
            <div className="text-3xl mb-1">34.8%</div>
            <div className="text-xs text-muted-foreground">Open Rate</div>
            <div className="text-xs text-primary mt-1">↑ 8% vs avg</div>
          </div>

          <div className="bg-card/50 border border-primary/30 rounded-lg p-4">
            <div className="flex items-center gap-2 mb-2">
              <Zap className="w-4 h-4 text-primary" />
              <div className="text-xs text-muted-foreground uppercase">Conversion</div>
            </div>
            <div className="text-3xl mb-1">18.7%</div>
            <div className="text-xs text-muted-foreground">Overall Rate</div>
            <div className="text-xs text-primary mt-1">↑ 23% vs avg</div>
          </div>
        </div>

        <div className="mt-6 pt-6 border-t border-border/50">
          <div className="grid grid-cols-3 gap-6 text-sm">
            <div>
              <div className="text-muted-foreground text-xs mb-1">Total Sends</div>
              <div className="text-xl">142,680</div>
            </div>
            <div>
              <div className="text-muted-foreground text-xs mb-1">Revenue Attributed</div>
              <div className="text-xl text-primary">$87,340</div>
            </div>
            <div>
              <div className="text-muted-foreground text-xs mb-1">Avg Revenue per Contact</div>
              <div className="text-xl">$0.61</div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

function FeaturesSection({ features }: any) {
  const sectionRef = useRef(null);
  const isInView = useInView(sectionRef, { once: true, margin: "-100px" });

  return (
    <section ref={sectionRef} className="py-32 relative">
      {/* Removed background gradient */}

      <div className="container mx-auto px-4">
        <motion.div
          className="text-center max-w-3xl mx-auto mb-20"
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
        >
          <h2 className="text-4xl md:text-5xl uppercase tracking-tight mb-6">
            Powerful Capabilities
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
            Real campaigns, measurable results
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
              <div className="grid grid-cols-2 gap-2">
                {useCase.results.map((result: string, i: number) => (
                  <div key={i} className={`flex items-center gap-2 p-2 rounded bg-${useCase.color}/5 border border-${useCase.color}/20`}>
                    <CheckCircle2 className={`w-4 h-4 text-${useCase.color} flex-shrink-0`} />
                    <span className="text-xs">{result}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
}

function ProducerBenefitsSection({ benefits }: any) {
  const sectionRef = useRef(null);
  const isInView = useInView(sectionRef, { once: true, margin: "-100px" });

  return (
    <section ref={sectionRef} className="py-24 relative overflow-hidden">
      <div className="container mx-auto px-4">
        <div className="max-w-4xl mx-auto">
          <motion.div
            className="text-center mb-12"
            initial={{ opacity: 0, y: 30 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6 }}
          >
            <h2 className="text-4xl md:text-5xl uppercase tracking-tight mb-4">
              <span className="bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
                Producer Superpowers
              </span>
            </h2>
            <p className="text-muted-foreground">
              Advanced controls for managers and label teams
            </p>
          </motion.div>

          <div className="grid md:grid-cols-2 gap-4">
            {benefits.map((benefit: string, index: number) => (
              <motion.div
                key={index}
                className="flex items-center gap-3 p-4 rounded-lg bg-card/20 backdrop-blur-sm border border-border/30 hover:border-primary/50 transition-all duration-300"
                initial={{ opacity: 0, x: index % 2 === 0 ? -20 : 20 }}
                animate={isInView ? { opacity: 1, x: 0 } : {}}
                transition={{ duration: 0.4, delay: index * 0.1 }}
                whileHover={{ scale: 1.02, x: 5 }}
              >
                <CheckCircle2 className="w-5 h-5 text-primary flex-shrink-0" />
                <span className="text-sm">{benefit}</span>
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
      description: "Find and build the right audiences to target with your campaigns.",
      icon: Users,
      href: "/features/discovery-engine",
      badge: "Data Source"
    },
    {
      title: "Geofencing & Segmentation",
      description: "Create precise audience segments to power your campaign targeting.",
      icon: MapPin,
      href: "/features/geofencing-segmentation",
      badge: "Targeting"
    },
    {
      title: "Analytics Dashboard",
      description: "Track campaign performance and measure ROI across all channels.",
      icon: BarChart3,
      href: "/features/analytics-dashboard",
      badge: "Measurement"
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
              Campaign Orchestration is powered by integrated discovery, segmentation, and analytics tools.
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
            <span className="block">READY TO AUTOMATE</span>
            <span className="block bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
              YOUR CAMPAIGNS?
            </span>
          </h2>

          <p className="text-xl text-muted-foreground">
            Launch intelligent multi-channel campaigns that engage fans at the perfect moment with the perfect message.
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
            14-day free trial • No credit card required • Multi-channel automation included
          </p>
        </motion.div>
      </div>
    </section>
  );
}