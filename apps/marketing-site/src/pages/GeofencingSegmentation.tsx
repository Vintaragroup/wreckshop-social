import { Navigation } from "../components/Navigation";
import { Footer } from "../components/Footer";
import { Button } from "../components/ui/button";
import { Card, CardContent } from "../components/ui/card";
import { 
  MapPin,
  Target,
  Clock,
  Zap,
  ArrowRight,
  CheckCircle2,
  Map,
  Users,
  Filter,
  Globe,
  Calendar
} from "lucide-react";
import { motion, useInView } from "motion/react";
import { useRef, useState } from "react";
import { GeofenceMapMockup } from "../components/mockups/GeofenceMapMockup";
import { SegmentBuilderMockup } from "../components/mockups/SegmentBuilderMockup";
import { AudienceCountMockup } from "../components/mockups/AudienceCountMockup";

const workflowSteps = [
  {
    number: "01",
    title: "Layer Filters",
    description: "Combine behavior (opened last SMS), platform data (TikTok likes > 5), commerce (purchased merch), and geography. Every filter is additive for surgical precision.",
    icon: Filter
  },
  {
    number: "02",
    title: "Map + Radius Tools",
    description: "Drop pins for tour stops, set mile/km radius, and see estimated reachable audience instantly. Perfect for routing pop-ups or surprise shows.",
    icon: Map
  },
  {
    number: "03",
    title: "Activate Everywhere",
    description: "Save once, use everywhere. Deploy segments to Email/SMS campaigns, Capture Pages, ad platforms, or share with external promoters.",
    icon: Zap
  }
];

const features = [
  {
    icon: Filter,
    title: "Multi-Layer Filtering",
    description: "Stack unlimited filters combining behavior, platform engagement, purchase history, and location. Create hyper-targeted segments like 'Austin fans who streamed the new single twice last week.'",
    color: "#00CFFF"
  },
  {
    icon: Clock,
    title: "Time Windows",
    description: "Apply look-back windows (7/30/90 days) so segments stay fresh and self-pruning. Paired with Journeys, fans automatically move in and out based on recent activity.",
    color: "#FF00FF"
  },
  {
    icon: Users,
    title: "Segment Library",
    description: "Managers maintain shared segment definitions (High-Value VIPs, Street Team, Venue Lists). Everyone works off the same cohorts for consistent reporting and compliance.",
    color: "#00CFFF"
  },
  {
    icon: Globe,
    title: "Geo-Precision",
    description: "City-level, postal code, or custom radius targeting. Geofence specific venues, neighborhoods, or entire regions to reach fans exactly where they are.",
    color: "#FF00FF"
  }
];

const useCases = [
  {
    title: "Tour Market Activation",
    persona: "Tour Manager",
    challenge: "Need to fill a 2,000-capacity venue in Austin with only 3 weeks notice.",
    solution: "Create a segment: 'Fans within 50 miles of Austin + Engaged on Spotify last 30 days + Attended similar shows.' Send geofenced push notifications and early-bird ticket offers via SMS.",
    results: ["Venue sold out in 11 days", "72% open rate on SMS campaign", "Saved $15k on broad advertising"],
    color: "primary"
  },
  {
    title: "VIP Superfan Cultivation",
    persona: "Artist Manager",
    challenge: "Want to build a street team of highly engaged fans for upcoming album rollout.",
    solution: "Build a 'Superfan' segment: 'Opened last 3 emails + Purchased merch + Saved on Spotify + Commented on Instagram.' Add to shared segment library and auto-sync to exclusive Capture Page.",
    results: ["350 qualified superfans identified", "95% conversion to street team", "Organic social reach up 400%"],
    color: "secondary"
  }
];

const producerBenefits = [
  "Maintain shared segment library across roster",
  "Clone proven segments between artists",
  "Real-time audience count estimates",
  "Compliance auto-checks (GDPR, CCPA, CAN-SPAM)",
  "Export to Google/Meta ad platforms",
  "Time-decay filters keep lists fresh"
];

const relatedTools = [
  {
    title: "Journeys",
    description: "Automate fan engagement with personalized journeys based on behavior and preferences.",
    icon: Clock,
    color: "#FF00FF"
  },
  {
    title: "Capture Pages",
    description: "Create landing pages to capture leads and convert them into superfans.",
    icon: Zap,
    color: "#00CFFF"
  },
  {
    title: "Email/SMS Campaigns",
    description: "Send targeted messages to your audience using email and SMS.",
    icon: ArrowRight,
    color: "#FF00FF"
  }
];

export function GeofencingSegmentation() {
  const heroRef = useRef(null);
  const isHeroInView = useInView(heroRef, { once: true, margin: "-100px" });

  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      
      <main>
        {/* Hero Section */}
        <section ref={heroRef} className="relative pt-32 pb-24 overflow-hidden">
          {/* Map Grid Background */}
          <div 
            className="absolute inset-0 opacity-[0.15]" 
            style={{
              backgroundImage: `
                linear-gradient(to right, hsl(var(--border)) 1px, transparent 1px),
                linear-gradient(to bottom, hsl(var(--border)) 1px, transparent 1px)
              `,
              backgroundSize: '40px 40px'
            }}
          />
          
          {/* Radial gradient overlay for map effect */}
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,transparent_0%,hsl(var(--background))_100%)]" />
          
          <motion.div 
            className="absolute inset-0 bg-gradient-to-br from-secondary/10 via-transparent to-primary/10"
            animate={{
              backgroundPosition: ["0% 0%", "100% 100%", "0% 0%"],
            }}
            transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
            style={{ backgroundSize: "200% 200%" }}
          />

          {/* Floating map elements */}
          {[MapPin, Target, Map, Globe, Filter].map((Icon, i) => (
            <motion.div
              key={i}
              className="absolute opacity-5"
              style={{
                left: `${15 + i * 18}%`,
                top: `${20 + (i % 2) * 40}%`,
              }}
              animate={{
                y: [0, -25, 0],
                rotate: [0, 15, 0],
              }}
              transition={{
                duration: 7 + i,
                repeat: Infinity,
                delay: i * 0.3,
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
                <span className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-gradient-to-r from-secondary/20 to-primary/20 border border-secondary/30 backdrop-blur-sm text-sm uppercase tracking-wider">
                  <MapPin className="w-4 h-4" />
                  Geofencing & Segmentation
                </span>
              </motion.div>

              <motion.h1 
                className="text-5xl md:text-7xl uppercase tracking-tight"
                initial={{ opacity: 0, y: 30 }}
                animate={isHeroInView ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.6, delay: 0.2 }}
              >
                <span className="block">TARGET THE</span>
                <span className="block bg-gradient-to-r from-secondary to-primary bg-clip-text text-transparent">
                  RIGHT FANS
                </span>
              </motion.h1>

              <motion.p 
                className="text-xl text-muted-foreground max-w-2xl mx-auto"
                initial={{ opacity: 0 }}
                animate={isHeroInView ? { opacity: 1 } : {}}
                transition={{ duration: 0.6, delay: 0.4 }}
              >
                Build surgical audience segments combining location, behavior, platform engagement, and purchase history. 
                Activate anywhere with real-time precision.
              </motion.p>

              <motion.div 
                className="flex flex-col sm:flex-row gap-4 justify-center pt-4"
                initial={{ opacity: 0, y: 20 }}
                animate={isHeroInView ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.6, delay: 0.6 }}
              >
                <Button 
                  size="lg"
                  className="bg-gradient-to-r from-secondary to-primary hover:opacity-90 text-primary-foreground group"
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
                  className="border-secondary/50 hover:bg-secondary/10"
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
            How It Works
          </h2>
          <p className="text-lg text-muted-foreground">
            Three steps to precision audience targeting
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
      <Card className="bg-card/30 backdrop-blur-sm border-border/50 hover:border-secondary/50 transition-all duration-300 h-full relative overflow-hidden group">
        <motion.div
          className="absolute inset-0 bg-gradient-to-br from-secondary/5 to-primary/5 opacity-0 group-hover:opacity-100"
          transition={{ duration: 0.3 }}
        />
        
        <CardContent className="p-8 space-y-6 relative z-10">
          <motion.div
            animate={isHovered ? { scale: 1.1, rotate: 5 } : {}}
            transition={{ type: "spring", stiffness: 300 }}
          >
            <div className="text-6xl bg-gradient-to-r from-secondary to-primary bg-clip-text text-transparent opacity-30">
              {step.number}
            </div>
          </motion.div>
          
          <div className="space-y-4">
            <div className="w-fit p-3 rounded-lg bg-gradient-to-br from-secondary/10 to-primary/10">
              <step.icon className="w-6 h-6 text-secondary" />
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
            <span className="block bg-gradient-to-r from-secondary to-primary bg-clip-text text-transparent">
              SEE IT IN ACTION
            </span>
          </h2>
          <p className="text-lg text-muted-foreground">
            Interactive tools for building perfect audience segments
          </p>
        </motion.div>

        <div className="space-y-12 max-w-6xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            <GeofenceMapMockup />
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 50 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6, delay: 0.4 }}
          >
            <SegmentBuilderMockup />
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 50 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6, delay: 0.6 }}
          >
            <AudienceCountMockup />
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
    <section ref={sectionRef} className="py-24 relative overflow-hidden">
      <motion.div 
        className="absolute inset-0 bg-gradient-to-b from-transparent via-primary/5 to-transparent"
      />

      <div className="container mx-auto px-4 relative z-10">
        <motion.div
          className="text-center max-w-3xl mx-auto mb-16"
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
        >
          <h2 className="text-4xl md:text-6xl uppercase tracking-tight mb-4">
            <span className="block">POWERFUL</span>
            <span className="block bg-gradient-to-r from-secondary to-primary bg-clip-text text-transparent">
              CAPABILITIES
            </span>
          </h2>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-6xl mx-auto">
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
      <Card className="bg-card/30 backdrop-blur-sm border-border/50 hover:border-secondary/50 transition-all duration-300 h-full group relative overflow-hidden">
        <motion.div
          className="absolute inset-0 bg-gradient-to-br from-secondary/5 to-primary/5 opacity-0 group-hover:opacity-100"
          transition={{ duration: 0.3 }}
        />
        
        <CardContent className="p-6 space-y-4 relative z-10">
          <motion.div
            className="w-fit p-3 rounded-lg bg-gradient-to-br from-secondary/10 to-primary/10"
            animate={isHovered ? { scale: 1.1, rotate: 5 } : {}}
            transition={{ type: "spring", stiffness: 300 }}
          >
            <feature.icon 
              className="w-6 h-6 text-secondary"
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
            <span className="block bg-gradient-to-r from-secondary to-primary bg-clip-text text-transparent">
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
              <span className="bg-gradient-to-r from-secondary to-primary bg-clip-text text-transparent">
                Producer Superpowers
              </span>
            </h2>
            <p className="text-muted-foreground">
              Managers and producers get advanced controls
            </p>
          </motion.div>

          <div className="grid md:grid-cols-2 gap-4">
            {benefits.map((benefit: string, index: number) => (
              <motion.div
                key={index}
                className="flex items-center gap-3 p-4 rounded-lg bg-card/20 backdrop-blur-sm border border-border/30 hover:border-secondary/50 transition-all duration-300"
                initial={{ opacity: 0, x: index % 2 === 0 ? -20 : 20 }}
                animate={isInView ? { opacity: 1, x: 0 } : {}}
                transition={{ duration: 0.4, delay: index * 0.1 }}
                whileHover={{ scale: 1.02, x: 5 }}
              >
                <CheckCircle2 className="w-5 h-5 text-secondary flex-shrink-0" />
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
              <span className="bg-gradient-to-r from-secondary to-primary bg-clip-text text-transparent">
                Related Tools
              </span>
            </h2>
            <p className="text-muted-foreground">
              Enhance your marketing strategy with these tools
            </p>
          </motion.div>

          <div className="grid md:grid-cols-2 gap-4">
            {relatedTools.map((tool: any, index: number) => (
              <motion.div
                key={index}
                className="flex items-center gap-3 p-4 rounded-lg bg-card/20 backdrop-blur-sm border border-border/30 hover:border-secondary/50 transition-all duration-300"
                initial={{ opacity: 0, x: index % 2 === 0 ? -20 : 20 }}
                animate={isInView ? { opacity: 1, x: 0 } : {}}
                transition={{ duration: 0.4, delay: index * 0.1 }}
                whileHover={{ scale: 1.02, x: 5 }}
              >
                <tool.icon className={`w-5 h-5 text-${tool.color} flex-shrink-0`} />
                <span className="text-sm">{tool.title}</span>
                <p className="text-xs text-muted-foreground mt-1">{tool.description}</p>
              </motion.div>
            ))}
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
        className="absolute inset-0 bg-gradient-to-br from-secondary/10 via-transparent to-primary/10"
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
            <span className="block">READY TO BUILD</span>
            <span className="block bg-gradient-to-r from-secondary to-primary bg-clip-text text-transparent">
              PERFECT SEGMENTS?
            </span>
          </h2>

          <p className="text-xl text-muted-foreground">
            Stop spray-and-pray marketing. Target the right fans with surgical precision using geofencing and advanced segmentation.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center pt-4">
            <Button 
              size="lg"
              className="bg-gradient-to-r from-secondary to-primary hover:opacity-90 text-primary-foreground group"
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
              className="border-secondary/50 hover:bg-secondary/10"
              asChild
            >
              <a href="/contact">
                Schedule a Demo
              </a>
            </Button>
          </div>

          <p className="text-sm text-muted-foreground">
            14-day free trial • No credit card required • Instant audience estimates
          </p>
        </motion.div>
      </div>
    </section>
  );
}