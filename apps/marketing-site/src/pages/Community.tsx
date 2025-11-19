import { Navigation } from "../components/Navigation";
import { Footer } from "../components/Footer";
import { Button } from "../components/ui/button";
import { Card, CardContent } from "../components/ui/card";
import { Input } from "../components/ui/input";
import { 
  Users, 
  MessageSquare, 
  Sparkles, 
  Rocket,
  Bell,
  CheckCircle2
} from "lucide-react";
import { motion, useInView } from "motion/react";
import { useRef, useState } from "react";

export function Community() {
  const heroRef = useRef(null);
  const isHeroInView = useInView(heroRef, { once: true, margin: "-100px" });
  const [email, setEmail] = useState("");
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // TODO: Connect to email service
    setSubmitted(true);
    setEmail("");
  };

  const features = [
    {
      icon: MessageSquare,
      title: "Live Discussions",
      description: "Connect with other artists, labels, and promoters in real-time"
    },
    {
      icon: Sparkles,
      title: "Expert Tips",
      description: "Learn from successful campaigns and industry veterans"
    },
    {
      icon: Users,
      title: "Networking",
      description: "Build relationships with collaborators and partners"
    }
  ];

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

          {/* Floating particles */}
          {[...Array(8)].map((_, i) => (
            <motion.div
              key={i}
              className="absolute w-2 h-2 bg-primary/30 rounded-full"
              style={{
                left: `${10 + i * 12}%`,
                top: `${20 + (i % 3) * 25}%`,
              }}
              animate={{
                y: [0, -30, 0],
                opacity: [0.3, 0.8, 0.3],
              }}
              transition={{
                duration: 4 + i * 0.5,
                repeat: Infinity,
                delay: i * 0.3,
              }}
            />
          ))}

          <div className="container mx-auto px-4 relative z-10">
            <div className="max-w-4xl mx-auto text-center space-y-8">
              <motion.div
                initial={{ opacity: 0, scale: 0.8 }}
                animate={isHeroInView ? { opacity: 1, scale: 1 } : {}}
                transition={{ duration: 0.5 }}
              >
                <span className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-gradient-to-r from-primary/20 to-secondary/20 border border-primary/30 backdrop-blur-sm text-sm uppercase tracking-wider">
                  <Rocket className="w-4 h-4" />
                  Coming Soon
                </span>
              </motion.div>

              <motion.h1 
                className="text-5xl md:text-7xl uppercase tracking-tight"
                initial={{ opacity: 0, y: 30 }}
                animate={isHeroInView ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.6, delay: 0.2 }}
              >
                <span className="block">JOIN THE</span>
                <span className="block bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
                  WRECKSHOP COMMUNITY
                </span>
              </motion.h1>

              <motion.p 
                className="text-xl text-muted-foreground max-w-2xl mx-auto"
                initial={{ opacity: 0 }}
                animate={isHeroInView ? { opacity: 1 } : {}}
                transition={{ duration: 0.6, delay: 0.4 }}
              >
                Connect with thousands of artists, labels, and promoters. Share strategies, 
                learn from experts, and grow together. Our community platform is launching soon!
              </motion.p>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={isHeroInView ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.6, delay: 0.6 }}
                className="pt-8"
              >
                {!submitted ? (
                  <form onSubmit={handleSubmit} className="max-w-md mx-auto">
                    <Card className="bg-card/50 backdrop-blur-sm border-primary/30">
                      <CardContent className="p-6 space-y-4">
                        <div className="flex items-center gap-2 text-sm">
                          <Bell className="w-4 h-4 text-primary" />
                          <span className="uppercase tracking-wide">Get notified at launch</span>
                        </div>
                        <div className="flex gap-2">
                          <Input
                            type="email"
                            placeholder="Enter your email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                            className="bg-background/50"
                          />
                          <Button 
                            type="submit"
                            className="bg-gradient-to-r from-primary to-secondary hover:opacity-90 text-primary-foreground whitespace-nowrap"
                          >
                            Notify Me
                          </Button>
                        </div>
                        <p className="text-xs text-muted-foreground">
                          Be the first to know when we launch. No spam, unsubscribe anytime.
                        </p>
                      </CardContent>
                    </Card>
                  </form>
                ) : (
                  <motion.div
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="max-w-md mx-auto"
                  >
                    <Card className="bg-card/50 backdrop-blur-sm border-primary/30">
                      <CardContent className="p-8 text-center space-y-4">
                        <div className="flex justify-center">
                          <div className="w-16 h-16 rounded-full bg-primary/20 flex items-center justify-center">
                            <CheckCircle2 className="w-8 h-8 text-primary" />
                          </div>
                        </div>
                        <h3 className="text-xl uppercase tracking-wide">You're On The List!</h3>
                        <p className="text-sm text-muted-foreground">
                          We'll send you an email as soon as the community launches.
                        </p>
                      </CardContent>
                    </Card>
                  </motion.div>
                )}
              </motion.div>
            </div>
          </div>
        </section>

        {/* Features Preview */}
        <FeaturesSection features={features} />

        {/* What to Expect */}
        <ExpectSection />
      </main>
      
      <Footer />
    </div>
  );
}

function FeaturesSection({ features }: any) {
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
          <h2 className="text-4xl md:text-5xl uppercase tracking-tight mb-4">
            <span className="bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
              What's Coming
            </span>
          </h2>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-5xl mx-auto">
          {features.map((feature: any, index: number) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 50 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.5, delay: index * 0.1 }}
            >
              <Card className="bg-card/30 backdrop-blur-sm border-border/50 hover:border-primary/50 transition-all duration-300 h-full">
                <CardContent className="p-6 space-y-4 text-center">
                  <div className="flex justify-center">
                    <div className="w-fit p-3 rounded-lg bg-gradient-to-br from-primary/10 to-secondary/10">
                      <feature.icon className="w-6 h-6 text-primary" />
                    </div>
                  </div>
                  <h3 className="text-xl uppercase tracking-wide">
                    {feature.title}
                  </h3>
                  <p className="text-sm text-muted-foreground">
                    {feature.description}
                  </p>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

function ExpectSection() {
  const sectionRef = useRef(null);
  const isInView = useInView(sectionRef, { once: true, margin: "-100px" });

  const items = [
    "Connect with verified music industry professionals",
    "Share campaign strategies and success stories",
    "Get feedback on your marketing approach",
    "Find collaborators and business partners",
    "Access exclusive webinars and workshops",
    "Early access to new platform features"
  ];

  return (
    <section ref={sectionRef} className="py-24 relative overflow-hidden">
      <motion.div 
        className="absolute inset-0 bg-gradient-to-b from-transparent via-primary/5 to-transparent"
      />

      <div className="container mx-auto px-4 relative z-10">
        <div className="max-w-3xl mx-auto">
          <motion.div
            className="text-center mb-12"
            initial={{ opacity: 0, y: 30 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6 }}
          >
            <h2 className="text-4xl md:text-5xl uppercase tracking-tight mb-4">
              <span className="block">What to</span>
              <span className="block bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
                Expect
              </span>
            </h2>
          </motion.div>

          <div className="space-y-4">
            {items.map((item: string, index: number) => (
              <motion.div
                key={index}
                className="flex items-center gap-3 p-4 rounded-lg bg-card/20 backdrop-blur-sm border border-border/30"
                initial={{ opacity: 0, x: -20 }}
                animate={isInView ? { opacity: 1, x: 0 } : {}}
                transition={{ duration: 0.4, delay: index * 0.1 }}
              >
                <CheckCircle2 className="w-5 h-5 text-primary flex-shrink-0" />
                <span className="text-sm">{item}</span>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
