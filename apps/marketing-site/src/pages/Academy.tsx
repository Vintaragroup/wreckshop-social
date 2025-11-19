import { Navigation } from "../components/Navigation";
import { Footer } from "../components/Footer";
import { Button } from "../components/ui/button";
import { Card, CardContent } from "../components/ui/card";
import { Input } from "../components/ui/input";
import { 
  GraduationCap, 
  Video, 
  BookOpen, 
  Award,
  Rocket,
  Bell,
  CheckCircle2,
  Target,
  TrendingUp,
  Users
} from "lucide-react";
import { motion, useInView } from "motion/react";
import { useRef, useState } from "react";

export function Academy() {
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
      icon: Video,
      title: "Video Courses",
      description: "Step-by-step tutorials on audience growth and marketing automation"
    },
    {
      icon: BookOpen,
      title: "Written Guides",
      description: "In-depth articles on campaign strategies and best practices"
    },
    {
      icon: Award,
      title: "Certifications",
      description: "Earn badges as you master music marketing fundamentals"
    }
  ];

  const topics = [
    {
      icon: Target,
      title: "Audience Targeting",
      description: "Learn to identify and segment your ideal fans"
    },
    {
      icon: TrendingUp,
      title: "Campaign Optimization",
      description: "Master data-driven strategies that increase ROI"
    },
    {
      icon: Users,
      title: "Fan Engagement",
      description: "Build lasting relationships with superfans"
    }
  ];

  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      
      <main>
        {/* Hero Section */}
        <section ref={heroRef} className="relative pt-32 pb-24 overflow-hidden">
          <motion.div 
            className="absolute inset-0 bg-gradient-to-br from-secondary/10 via-transparent to-primary/10"
            animate={{
              backgroundPosition: ["0% 0%", "100% 100%", "0% 0%"],
            }}
            transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
            style={{ backgroundSize: "200% 200%" }}
          />

          {/* Floating education icons */}
          {[GraduationCap, Video, BookOpen, Award].map((Icon, i) => (
            <motion.div
              key={i}
              className="absolute opacity-5"
              style={{
                left: `${15 + i * 22}%`,
                top: `${25 + (i % 2) * 35}%`,
              }}
              animate={{
                y: [0, -25, 0],
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
                <span className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-gradient-to-r from-secondary/20 to-primary/20 border border-secondary/30 backdrop-blur-sm text-sm uppercase tracking-wider">
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
                <span className="block">WRECKSHOP</span>
                <span className="block bg-gradient-to-r from-secondary to-primary bg-clip-text text-transparent">
                  ACADEMY
                </span>
              </motion.h1>

              <motion.p 
                className="text-xl text-muted-foreground max-w-2xl mx-auto"
                initial={{ opacity: 0 }}
                animate={isHeroInView ? { opacity: 1 } : {}}
                transition={{ duration: 0.6, delay: 0.4 }}
              >
                Master music marketing with expert-led courses, certifications, and proven strategies. 
                From beginner to advanced, level up your skills and grow your career.
              </motion.p>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={isHeroInView ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.6, delay: 0.6 }}
                className="pt-8"
              >
                {!submitted ? (
                  <form onSubmit={handleSubmit} className="max-w-md mx-auto">
                    <Card className="bg-card/50 backdrop-blur-sm border-secondary/30">
                      <CardContent className="p-6 space-y-4">
                        <div className="flex items-center gap-2 text-sm">
                          <Bell className="w-4 h-4 text-secondary" />
                          <span className="uppercase tracking-wide">Get Early Access</span>
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
                            className="bg-gradient-to-r from-secondary to-primary hover:opacity-90 text-primary-foreground whitespace-nowrap"
                          >
                            Join Waitlist
                          </Button>
                        </div>
                        <p className="text-xs text-muted-foreground">
                          Get notified when Academy launches. Plus exclusive founding member perks!
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
                    <Card className="bg-card/50 backdrop-blur-sm border-secondary/30">
                      <CardContent className="p-8 text-center space-y-4">
                        <div className="flex justify-center">
                          <div className="w-16 h-16 rounded-full bg-secondary/20 flex items-center justify-center">
                            <CheckCircle2 className="w-8 h-8 text-secondary" />
                          </div>
                        </div>
                        <h3 className="text-xl uppercase tracking-wide">You're On The Waitlist!</h3>
                        <p className="text-sm text-muted-foreground">
                          We'll email you with early access and founding member benefits.
                        </p>
                      </CardContent>
                    </Card>
                  </motion.div>
                )}
              </motion.div>
            </div>
          </div>
        </section>

        {/* Learning Formats */}
        <FeaturesSection features={features} />

        {/* Topics Preview */}
        <TopicsSection topics={topics} />

        {/* Benefits */}
        <BenefitsSection />
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
            <span className="bg-gradient-to-r from-secondary to-primary bg-clip-text text-transparent">
              How You'll Learn
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
              <Card className="bg-card/30 backdrop-blur-sm border-border/50 hover:border-secondary/50 transition-all duration-300 h-full">
                <CardContent className="p-6 space-y-4 text-center">
                  <div className="flex justify-center">
                    <div className="w-fit p-3 rounded-lg bg-gradient-to-br from-secondary/10 to-primary/10">
                      <feature.icon className="w-6 h-6 text-secondary" />
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

function TopicsSection({ topics }: any) {
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
          <h2 className="text-4xl md:text-5xl uppercase tracking-tight mb-4">
            <span className="block">What You'll</span>
            <span className="block bg-gradient-to-r from-secondary to-primary bg-clip-text text-transparent">
              Master
            </span>
          </h2>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-5xl mx-auto">
          {topics.map((topic: any, index: number) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 50 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.5, delay: index * 0.1 }}
            >
              <Card className="bg-card/30 backdrop-blur-sm border-border/50 h-full">
                <CardContent className="p-6 space-y-4">
                  <div className="w-fit p-3 rounded-lg bg-gradient-to-br from-secondary/10 to-primary/10">
                    <topic.icon className="w-6 h-6 text-secondary" />
                  </div>
                  <h3 className="text-xl uppercase tracking-wide">
                    {topic.title}
                  </h3>
                  <p className="text-sm text-muted-foreground">
                    {topic.description}
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

function BenefitsSection() {
  const sectionRef = useRef(null);
  const isInView = useInView(sectionRef, { once: true, margin: "-100px" });

  const benefits = [
    "Self-paced learning on your schedule",
    "Real-world case studies and examples",
    "Downloadable templates and resources",
    "Exclusive community access",
    "Monthly live Q&A sessions",
    "Industry expert instructors"
  ];

  return (
    <section ref={sectionRef} className="py-24 relative">
      <div className="container mx-auto px-4">
        <div className="max-w-3xl mx-auto">
          <motion.div
            className="text-center mb-12"
            initial={{ opacity: 0, y: 30 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6 }}
          >
            <h2 className="text-4xl md:text-5xl uppercase tracking-tight mb-4">
              <span className="bg-gradient-to-r from-secondary to-primary bg-clip-text text-transparent">
                Membership Benefits
              </span>
            </h2>
          </motion.div>

          <div className="grid md:grid-cols-2 gap-4">
            {benefits.map((benefit: string, index: number) => (
              <motion.div
                key={index}
                className="flex items-center gap-3 p-4 rounded-lg bg-card/20 backdrop-blur-sm border border-border/30"
                initial={{ opacity: 0, x: index % 2 === 0 ? -20 : 20 }}
                animate={isInView ? { opacity: 1, x: 0 } : {}}
                transition={{ duration: 0.4, delay: index * 0.1 }}
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
