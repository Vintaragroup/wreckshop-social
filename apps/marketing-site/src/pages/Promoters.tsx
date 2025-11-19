import { Navigation } from "../components/Navigation";
import { Footer } from "../components/Footer";
import { Button } from "../components/ui/button";
import { Card, CardContent } from "../components/ui/card";
import { ImageWithFallback } from "../components/figma/ImageWithFallback";
import { 
  Calendar,
  Users,
  TrendingUp,
  MapPin,
  Target,
  Radio,
  Ticket,
  Bell,
  Zap,
  BarChart3,
  CheckCircle2,
  ArrowRight,
  Map
} from "lucide-react";
import { motion, useInView } from "motion/react";
import { useRef, useState } from "react";

const features = [
  {
    icon: MapPin,
    title: "Geofencing",
    description: "Create virtual boundaries around venues and target fans within specific geographic areas. Drive ticket sales in exact locations where it matters most.",
    color: "#00CFFF"
  },
  {
    icon: Bell,
    title: "Real-Time Notifications",
    description: "Send push notifications and SMS alerts to fans when tickets go on sale. Create urgency and drive immediate action with timely messaging.",
    color: "#FF00FF"
  },
  {
    icon: Ticket,
    title: "Sellout Automation",
    description: "Automated workflows for presales, early bird offers, and last-minute promotions. Maximize attendance and revenue on autopilot.",
    color: "#00CFFF"
  },
  {
    icon: BarChart3,
    title: "Attendance Analytics",
    description: "Track ticket sales, understand fan demographics, and optimize future events based on real data-driven insights.",
    color: "#FF00FF"
  }
];

const benefits = [
  "Geofencing & location targeting",
  "Real-time push & SMS notifications",
  "Multi-event campaign management",
  "Ticket sales tracking & analytics",
  "Automated presale workflows",
  "Integration with ticketing platforms"
];

export function Promoters() {
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
            className="absolute inset-0 bg-gradient-to-br from-primary/10 via-transparent to-secondary/10"
            animate={{
              backgroundPosition: ["0% 0%", "100% 100%", "0% 0%"],
            }}
            transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
            style={{ backgroundSize: "200% 200%" }}
          />

          {/* Floating location pins */}
          {[MapPin, Ticket, Calendar, Target, Map].map((Icon, i) => (
            <motion.div
              key={i}
              className="absolute opacity-5"
              style={{
                left: `${12 + i * 19}%`,
                top: `${15 + (i % 2) * 45}%`,
              }}
              animate={{
                y: [0, -25, 0],
                scale: [1, 1.1, 1],
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
                <span className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-gradient-to-r from-primary/20 to-secondary/20 border border-primary/30 backdrop-blur-sm text-sm uppercase tracking-wider">
                  <Calendar className="w-4 h-4" />
                  For Event Promoters
                </span>
              </motion.div>

              <motion.h1 
                className="text-5xl md:text-7xl uppercase tracking-tight"
                initial={{ opacity: 0, y: 30 }}
                animate={isHeroInView ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.6, delay: 0.2 }}
              >
                <span className="block">FILL VENUES.</span>
                <span className="block bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
                  SELL TICKETS.
                </span>
              </motion.h1>

              <motion.p 
                className="text-xl text-muted-foreground max-w-2xl mx-auto"
                initial={{ opacity: 0 }}
                animate={isHeroInView ? { opacity: 1 } : {}}
                transition={{ duration: 0.6, delay: 0.4 }}
              >
                Geofence venues, target music fans in specific cities, and drive ticket sales with 
                precision marketing. Built for event promoters who need to fill rooms.
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
                  <a href="/#pricing">
                    See Pricing
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
                  <CheckCircle2 className="w-4 h-4 text-primary" />
                  <span>14-day free trial</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-primary" />
                  <span>85% avg sellout rate</span>
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

        {/* How Geofencing Works */}
        <GeofencingSection />

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
    { value: "1,000+", label: "Event Promoters", icon: Calendar },
    { value: "85%", label: "Sellout Rate", icon: Ticket },
    { value: "15M+", label: "Tickets Sold", icon: Users },
    { value: "$299", label: "Per Month", icon: Zap }
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
      className="text-center space-y-2 p-4 rounded-lg bg-card/20 backdrop-blur-sm border border-border/30 hover:border-primary/50 transition-all duration-300"
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
        <stat.icon className="w-6 h-6 text-primary" />
      </motion.div>
      <div className="text-3xl bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
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
            <span className="block">PRECISION TOOLS FOR</span>
            <span className="block bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
              EVENT MARKETING
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
          <Card className="overflow-hidden bg-gradient-to-br from-card/80 to-card/40 backdrop-blur-sm border-primary/30">
            <div className="grid md:grid-cols-2 gap-0">
              <div className="relative h-64 md:h-auto">
                <ImageWithFallback
                  src="https://images.unsplash.com/photo-1756978303719-57095d8bd250?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxjb25jZXJ0JTIwY3Jvd2QlMjBtdXNpYyUyMGZlc3RpdmFsfGVufDF8fHx8MTc2MzQwNDEyOXww&ixlib=rb-4.1.0&q=80&w=1080"
                  alt="Concert crowd"
                  className="w-full h-full object-cover"
                />
              </div>
              
              <CardContent className="p-8 md:p-12 space-y-6">
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 border border-primary/30">
                  <span className="text-sm uppercase tracking-wider text-primary">Success Story</span>
                </div>
                
                <h3 className="text-3xl uppercase tracking-wide">
                  Sold Out in 48 Hours
                </h3>
                
                <p className="text-muted-foreground leading-relaxed">
                  "We promoted a 2,000-capacity show in Austin using geofencing around similar venues and clubs. 
                  Targeted fans who'd attended hip-hop shows in the past 6 months. The event sold out in 48 hours—our fastest sellout ever."
                </p>
                
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-full bg-gradient-to-br from-primary to-secondary" />
                  <div>
                    <div className="uppercase tracking-wide">Sarah Mitchell</div>
                    <div className="text-sm text-muted-foreground">Director, LiveNation Austin</div>
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
              <span className="bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
                Promoter Features
              </span>
            </h2>
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

function GeofencingSection() {
  const sectionRef = useRef(null);
  const isInView = useInView(sectionRef, { once: true, margin: "-100px" });

  return (
    <section ref={sectionRef} className="py-24 relative overflow-hidden">
      <motion.div 
        className="absolute inset-0 bg-gradient-to-b from-transparent via-secondary/5 to-transparent"
      />

      <div className="container mx-auto px-4 relative z-10">
        <motion.div
          className="max-w-4xl mx-auto text-center space-y-8"
          initial={{ opacity: 0, y: 50 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8 }}
        >
          <h2 className="text-4xl md:text-6xl uppercase tracking-tight">
            <span className="block">HOW</span>
            <span className="block bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
              GEOFENCING WORKS
            </span>
          </h2>

          <div className="grid md:grid-cols-3 gap-6 pt-8">
            {[
              {
                step: "01",
                title: "Draw Your Zone",
                description: "Create a virtual boundary around your venue, competing venues, or entire neighborhoods."
              },
              {
                step: "02",
                title: "Target Fans",
                description: "Reach fans who've been to similar shows or live within your geofenced area."
              },
              {
                step: "03",
                title: "Send Alerts",
                description: "Push notifications and SMS when tickets go on sale or last-minute deals are available."
              }
            ].map((item, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 30 }}
                animate={isInView ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.5, delay: index * 0.2 }}
              >
                <Card className="bg-card/30 backdrop-blur-sm border-border/50 h-full">
                  <CardContent className="p-6 space-y-4 text-center">
                    <div className="text-4xl bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
                      {item.step}
                    </div>
                    <h3 className="text-xl uppercase tracking-wide">
                      {item.title}
                    </h3>
                    <p className="text-sm text-muted-foreground">
                      {item.description}
                    </p>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
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
            <span className="block">START SELLING OUT</span>
            <span className="block bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
              YOUR SHOWS
            </span>
          </h2>

          <p className="text-xl text-muted-foreground">
            Join event promoters achieving an 85% average sellout rate with precision geofencing and fan targeting.
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
              <a href="/#pricing">
                See Pricing
              </a>
            </Button>
          </div>

          <p className="text-sm text-muted-foreground">
            14-day free trial • No credit card required • Cancel anytime
          </p>
        </motion.div>
      </div>
    </section>
  );
}