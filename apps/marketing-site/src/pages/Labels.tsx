import { Navigation } from "../components/Navigation";
import { Footer } from "../components/Footer";
import { Button } from "../components/ui/button";
import { Card, CardContent } from "../components/ui/card";
import { ImageWithFallback } from "../components/figma/ImageWithFallback";
import { 
  Building2,
  Users,
  TrendingUp,
  Layers,
  BarChart3,
  Zap,
  Globe,
  Shield,
  Target,
  CheckCircle2,
  ArrowRight,
  Crown
} from "lucide-react";
import { motion, useInView } from "motion/react";
import { useRef, useState } from "react";

const features = [
  {
    icon: Layers,
    title: "Multi-Artist Management",
    description: "Manage campaigns for entire rosters from one platform. Coordinate releases, track performance, and maximize catalog impact across all artists.",
    color: "#FF00FF"
  },
  {
    icon: BarChart3,
    title: "Advanced Analytics",
    description: "Enterprise-grade reporting and insights. Track ROI, measure campaign effectiveness, and make data-driven decisions for your roster.",
    color: "#00CFFF"
  },
  {
    icon: Zap,
    title: "Automation at Scale",
    description: "Automate workflows for releases, tour announcements, and catalog promotions. Save time while maintaining personalization across your roster.",
    color: "#FF00FF"
  },
  {
    icon: Shield,
    title: "Priority Support",
    description: "Dedicated account manager and priority support. Get the help you need to maximize platform value for your label.",
    color: "#00CFFF"
  }
];

const benefits = [
  "Unlimited contacts across your roster",
  "Multi-artist dashboard & management",
  "Advanced segmentation & geofencing",
  "Priority support & account manager",
  "Custom workflows & automation",
  "White-label options available"
];

export function Labels() {
  const heroRef = useRef(null);
  const isHeroInView = useInView(heroRef, { once: true, margin: "-100px" });

  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      
      <main>
        {/* Hero Section */}
        <section ref={heroRef} className="relative pt-32 pb-24 overflow-hidden">
          {/* Animated background */}
          <motion.div 
            className="absolute inset-0 bg-gradient-to-br from-secondary/10 via-transparent to-primary/10"
            animate={{
              backgroundPosition: ["0% 0%", "100% 100%", "0% 0%"],
            }}
            transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
            style={{ backgroundSize: "200% 200%" }}
          />

          {/* Floating icons */}
          {[Crown, Building2, Globe, Layers, BarChart3].map((Icon, i) => (
            <motion.div
              key={i}
              className="absolute opacity-5"
              style={{
                left: `${15 + i * 18}%`,
                top: `${20 + (i % 2) * 40}%`,
              }}
              animate={{
                y: [0, -20, 0],
                rotate: [0, 15, 0],
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
                <span className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-gradient-to-r from-secondary/20 to-primary/20 border border-secondary/30 backdrop-blur-sm text-sm uppercase tracking-wider">
                  <Building2 className="w-4 h-4" />
                  For Record Labels
                </span>
              </motion.div>

              <motion.h1 
                className="text-5xl md:text-7xl uppercase tracking-tight"
                initial={{ opacity: 0, y: 30 }}
                animate={isHeroInView ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.6, delay: 0.2 }}
              >
                <span className="block">ENTERPRISE TOOLS FOR</span>
                <span className="block bg-gradient-to-r from-secondary to-primary bg-clip-text text-transparent">
                  MODERN LABELS
                </span>
              </motion.h1>

              <motion.p 
                className="text-xl text-muted-foreground max-w-2xl mx-auto"
                initial={{ opacity: 0 }}
                animate={isHeroInView ? { opacity: 1 } : {}}
                transition={{ duration: 0.6, delay: 0.4 }}
              >
                Manage your entire roster from one platform. Coordinate releases, target fans globally, 
                and maximize catalog impact with enterprise-grade marketing automation.
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
                  <a href="/contact">
                    Contact Sales
                    <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
                  </a>
                </Button>
                <Button 
                  size="lg"
                  variant="outline"
                  className="border-secondary/50 hover:bg-secondary/10"
                  asChild
                >
                  <a href="/sign-up">
                    Start Free Trial
                  </a>
                </Button>
              </motion.div>

              <motion.div
                className="flex items-center justify-center gap-8 text-sm text-muted-foreground pt-8"
                initial={{ opacity: 0 }}
                animate={isHeroInView ? { opacity: 1 } : {}}
                transition={{ duration: 0.6, delay: 0.8 }}
              >
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-secondary" />
                  <span>14-day free trial</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-secondary" />
                  <span>Priority onboarding</span>
                </div>
              </motion.div>
            </div>
          </div>
        </section>

        {/* Stats Section */}
        <StatsSection />

        {/* Features Grid */}
        <FeaturesSection features={features} />

        {/* Use Case Story */}
        <UseCaseStory />

        {/* Benefits Section */}
        <BenefitsSection benefits={benefits} />

        {/* Comparison Section */}
        <ComparisonSection />

        {/* CTA Section */}
        <CTASection />
      </main>
      
      <Footer />
    </div>
  );
}

function StatsSection() {
  const sectionRef = useRef(null);
  const isInView = useInView(sectionRef, { once: true, margin: "-100px" });

  const stats = [
    { value: "200+", label: "Record Labels", icon: Building2 },
    { value: "40%", label: "Streaming Increase", icon: TrendingUp },
    { value: "25M+", label: "Fans Reached", icon: Users },
    { value: "$299", label: "Per Month", icon: Crown }
  ];

  return (
    <section ref={sectionRef} className="py-16 relative">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 max-w-5xl mx-auto">
          {stats.map((stat, index) => (
            <StatCard key={index} stat={stat} index={index} isInView={isInView} />
          ))}
        </div>
      </div>
    </section>
  );
}

function StatCard({ stat, index, isInView }: any) {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <motion.div
      className="text-center space-y-2 p-4 rounded-lg bg-card/20 backdrop-blur-sm border border-border/30 hover:border-secondary/50 transition-all duration-300"
      initial={{ opacity: 0, scale: 0.5 }}
      animate={isInView ? { opacity: 1, scale: 1 } : {}}
      transition={{ duration: 0.5, delay: index * 0.1, type: "spring" }}
      whileHover={{ scale: 1.05, y: -5 }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <motion.div
        className="flex justify-center"
        animate={isHovered ? { y: [-2, -6, -2], rotate: [0, 5, 0] } : {}}
        transition={{ duration: 2, repeat: Infinity }}
      >
        <stat.icon className="w-6 h-6 text-secondary" />
      </motion.div>
      <div className="text-3xl bg-gradient-to-r from-secondary to-primary bg-clip-text text-transparent">
        {stat.value}
      </div>
      <div className="text-sm text-muted-foreground uppercase tracking-wide">
        {stat.label}
      </div>
    </motion.div>
  );
}

function FeaturesSection({ features }: any) {
  const sectionRef = useRef(null);
  const isInView = useInView(sectionRef, { once: true, margin: "-100px" });

  return (
    <section ref={sectionRef} className="py-24 relative overflow-hidden">
      <motion.div 
        className="absolute inset-0 bg-gradient-to-b from-transparent via-secondary/5 to-transparent"
      />

      <div className="container mx-auto px-4 relative z-10">
        <motion.div
          className="text-center max-w-3xl mx-auto mb-16"
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
        >
          <h2 className="text-4xl md:text-6xl uppercase tracking-tight mb-4">
            <span className="block">ENTERPRISE-GRADE</span>
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

function UseCaseStory() {
  const sectionRef = useRef(null);
  const isInView = useInView(sectionRef, { once: true, margin: "-100px" });

  return (
    <section ref={sectionRef} className="py-24 relative">
      <div className="container mx-auto px-4">
        <motion.div
          className="max-w-5xl mx-auto"
          initial={{ opacity: 0, y: 50 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8 }}
        >
          <Card className="overflow-hidden bg-gradient-to-br from-card/80 to-card/40 backdrop-blur-sm border-secondary/30">
            <div className="grid md:grid-cols-2 gap-0">
              <div className="relative h-64 md:h-auto">
                <ImageWithFallback
                  src="https://images.unsplash.com/photo-1637759898746-283c2d6c24c5?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxtdXNpYyUyMHByb2R1Y2VyJTIwc3R1ZGlvfGVufDF8fHx8MTc2MzMxMzM5MHww&ixlib=rb-4.1.0&q=80&w=1080"
                  alt="Music studio"
                  className="w-full h-full object-cover"
                />
              </div>
              
              <CardContent className="p-8 md:p-12 space-y-6">
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-secondary/10 border border-secondary/30">
                  <span className="text-sm uppercase tracking-wider text-secondary">Case Study</span>
                </div>
                
                <h3 className="text-3xl uppercase tracking-wide">
                  40% Streaming Growth
                </h3>
                
                <p className="text-muted-foreground leading-relaxed">
                  "Managing 15 artists was chaotic before Wreckshop. Now we can coordinate releases, 
                  target fans in specific markets, and track performance across our entire roster from one dashboard. 
                  We saw a 40% increase in streaming within 3 months."
                </p>
                
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-full bg-gradient-to-br from-secondary to-primary" />
                  <div>
                    <div className="uppercase tracking-wide">Marcus Chen</div>
                    <div className="text-sm text-muted-foreground">VP Marketing, Sunset Records</div>
                  </div>
                </div>
              </CardContent>
            </div>
          </Card>
        </motion.div>
      </div>
    </section>
  );
}

function BenefitsSection({ benefits }: any) {
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
                Label Plan Includes
              </span>
            </h2>
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

function ComparisonSection() {
  const sectionRef = useRef(null);
  const isInView = useInView(sectionRef, { once: true, margin: "-100px" });

  const comparison = [
    { feature: "Multi-artist management", artist: false, label: true },
    { feature: "Unlimited contacts", artist: false, label: true },
    { feature: "Priority support & account manager", artist: false, label: true },
    { feature: "White-label options", artist: false, label: true }
  ];

  return (
    <section ref={sectionRef} className="py-24 relative">
      <div className="container mx-auto px-4">
        <motion.div
          className="max-w-4xl mx-auto"
          initial={{ opacity: 0, y: 50 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8 }}
        >
          <div className="text-center mb-12">
            <h2 className="text-4xl md:text-5xl uppercase tracking-tight mb-4">
              <span className="bg-gradient-to-r from-secondary to-primary bg-clip-text text-transparent">
                Label vs Artist
              </span>
            </h2>
            <p className="text-muted-foreground">See what makes the Label plan enterprise-ready</p>
          </div>

          <Card className="bg-card/30 backdrop-blur-sm border-border/50 overflow-hidden">
            <CardContent className="p-0">
              <div className="grid grid-cols-3 gap-0 border-b border-border/50">
                <div className="p-4"></div>
                <div className="p-4 text-center border-x border-border/50">
                  <span className="text-sm uppercase tracking-wider text-muted-foreground">Artist</span>
                </div>
                <div className="p-4 text-center bg-secondary/5">
                  <span className="text-sm uppercase tracking-wider text-secondary">Label</span>
                </div>
              </div>
              
              {comparison.map((item, index) => (
                <motion.div
                  key={index}
                  className="grid grid-cols-3 gap-0 border-b border-border/50 last:border-0"
                  initial={{ opacity: 0, x: -20 }}
                  animate={isInView ? { opacity: 1, x: 0 } : {}}
                  transition={{ duration: 0.3, delay: index * 0.1 }}
                >
                  <div className="p-4 text-sm">{item.feature}</div>
                  <div className="p-4 text-center border-x border-border/50">
                    {item.artist ? (
                      <CheckCircle2 className="w-5 h-5 text-primary mx-auto" />
                    ) : (
                      <span className="text-muted-foreground">—</span>
                    )}
                  </div>
                  <div className="p-4 text-center bg-secondary/5">
                    <CheckCircle2 className="w-5 h-5 text-secondary mx-auto" />
                  </div>
                </motion.div>
              ))}
            </CardContent>
          </Card>
        </motion.div>
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
            <span className="block">READY TO SCALE</span>
            <span className="block bg-gradient-to-r from-secondary to-primary bg-clip-text text-transparent">
              YOUR LABEL?
            </span>
          </h2>

          <p className="text-xl text-muted-foreground">
            Join top record labels using Wreckshop Social to maximize artist success and catalog impact.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center pt-4">
            <Button 
              size="lg"
              className="bg-gradient-to-r from-secondary to-primary hover:opacity-90 text-primary-foreground group"
              asChild
            >
              <a href="/contact">
                Contact Sales
                <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
              </a>
            </Button>
            <Button 
              size="lg"
              variant="outline"
              className="border-secondary/50 hover:bg-secondary/10"
              asChild
            >
              <a href="/sign-up">
                Start Free Trial
              </a>
            </Button>
          </div>

          <p className="text-sm text-muted-foreground">
            14-day free trial • Priority onboarding • Dedicated account manager
          </p>
        </motion.div>
      </div>
    </section>
  );
}