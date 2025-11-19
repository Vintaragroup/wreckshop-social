import { Card, CardContent } from "./ui/card";
import { Users, Send, BarChart3, MapPin, Zap, Radio } from "lucide-react";
import { motion, useInView, useMotionValue, useSpring, useTransform } from "motion/react";
import { useRef, useState } from "react";

const features = [
  {
    icon: Users,
    title: "Audience Discovery",
    description: "Connect platforms, analyze listening patterns, and discover your ideal fans across Spotify, Instagram, and more.",
    gradient: "from-primary to-primary/50",
    accentColor: "#00CFFF",
    href: "/features/discovery-engine"
  },
  {
    icon: Send,
    title: "Campaign Orchestration",
    description: "Launch coordinated multi-channel campaigns across email, SMS, and push notifications with intelligent automation.",
    gradient: "from-secondary to-secondary/50",
    accentColor: "#FF00FF",
    href: "/features/campaign-orchestration"
  },
  {
    icon: BarChart3,
    title: "Analytics Dashboard",
    description: "Track engagement, measure ROI, and understand fan behavior with real-time analytics and actionable insights.",
    gradient: "from-primary to-secondary",
    accentColor: "#00CFFF",
    href: "/features/analytics-dashboard"
  },
  {
    icon: MapPin,
    title: "Geofencing & Segmentation",
    description: "Target fans by location, behavior, and music taste. Create hyper-specific segments for maximum impact.",
    gradient: "from-secondary to-primary",
    accentColor: "#FF00FF",
    href: "/features/geofencing-segmentation"
  }
];

export function Features() {
  const sectionRef = useRef(null);
  const isInView = useInView(sectionRef, { once: true, margin: "-100px" });

  return (
    <section ref={sectionRef} className="py-24 relative overflow-hidden">
      {/* Animated gradient orbs with parallax */}
      <motion.div 
        className="absolute top-1/4 left-1/4 w-96 h-96 bg-primary/5 rounded-full blur-3xl"
        animate={{
          scale: [1, 1.3, 1],
          x: [0, 30, 0],
          y: [0, 20, 0],
        }}
        transition={{ duration: 20, repeat: Infinity, ease: "easeInOut" }}
      />
      <motion.div 
        className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-secondary/5 rounded-full blur-3xl"
        animate={{
          scale: [1.3, 1, 1.3],
          x: [0, -30, 0],
          y: [0, -20, 0],
        }}
        transition={{ duration: 25, repeat: Infinity, ease: "easeInOut" }}
      />

      {/* Floating decorative icons */}
      {[
        { Icon: Zap, x: "15%", y: "20%", delay: 0, duration: 15 },
        { Icon: Radio, x: "85%", y: "30%", delay: 2, duration: 18 },
        { Icon: Zap, x: "10%", y: "80%", delay: 4, duration: 20 },
      ].map((item, i) => (
        <motion.div
          key={i}
          className="absolute opacity-5"
          style={{ left: item.x, top: item.y }}
          animate={{
            y: [0, -20, 0],
            rotate: [0, 180, 360],
            scale: [1, 1.2, 1],
          }}
          transition={{
            duration: item.duration,
            repeat: Infinity,
            delay: item.delay,
            ease: "easeInOut"
          }}
        >
          <item.Icon className="w-16 h-16 text-primary" strokeWidth={1} />
        </motion.div>
      ))}
      
      <div className="container mx-auto px-4 relative z-10">
        {/* Section header with staggered animation */}
        <motion.div 
          className="text-center max-w-3xl mx-auto mb-16 space-y-4"
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={isInView ? { opacity: 1, scale: 1 } : {}}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            <span className="inline-block px-4 py-2 rounded-full bg-gradient-to-r from-primary/20 to-secondary/20 border border-primary/30 backdrop-blur-sm text-sm uppercase tracking-wider">
              Platform Capabilities
            </span>
          </motion.div>
          
          <h2 className="text-4xl md:text-6xl uppercase tracking-tight">
            <motion.span 
              className="block"
              initial={{ opacity: 0, x: -20 }}
              animate={isInView ? { opacity: 1, x: 0 } : {}}
              transition={{ duration: 0.6, delay: 0.3 }}
            >
              POWERFUL FEATURES
            </motion.span>
            <motion.span 
              className="block bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent"
              initial={{ opacity: 0, x: 20 }}
              animate={isInView ? { opacity: 1, x: 0 } : {}}
              transition={{ duration: 0.6, delay: 0.4 }}
            >
              FOR MUSIC MARKETING
            </motion.span>
          </h2>
          <motion.p 
            className="text-muted-foreground"
            initial={{ opacity: 0 }}
            animate={isInView ? { opacity: 1 } : {}}
            transition={{ duration: 0.6, delay: 0.5 }}
          >
            Everything you need to discover, engage, and grow your music audience
          </motion.p>
        </motion.div>

        {/* Feature grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 max-w-7xl mx-auto">
          {features.map((feature, index) => (
            <FeatureCard key={index} feature={feature} index={index} isInView={isInView} />
          ))}
        </div>
      </div>
    </section>
  );
}

function FeatureCard({ 
  feature, 
  index, 
  isInView 
}: { 
  feature: typeof features[0]; 
  index: number;
  isInView: boolean;
}) {
  const cardRef = useRef<HTMLDivElement>(null);
  const [isHovered, setIsHovered] = useState(false);
  
  // Mouse position for 3D tilt
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);
  
  const smoothMouseX = useSpring(mouseX, { damping: 20, stiffness: 150 });
  const smoothMouseY = useSpring(mouseY, { damping: 20, stiffness: 150 });
  
  // 3D rotation values
  const rotateX = useTransform(smoothMouseY, [-0.5, 0.5], [8, -8]);
  const rotateY = useTransform(smoothMouseX, [-0.5, 0.5], [-8, 8]);
  
  // Magnetic effect - card moves toward cursor
  const magneticX = useTransform(smoothMouseX, [-0.5, 0.5], [-10, 10]);
  const magneticY = useTransform(smoothMouseY, [-0.5, 0.5], [-10, 10]);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!cardRef.current) return;
    
    const rect = cardRef.current.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;
    
    const x = (e.clientX - centerX) / (rect.width / 2);
    const y = (e.clientY - centerY) / (rect.height / 2);
    
    mouseX.set(x);
    mouseY.set(y);
  };

  const handleMouseLeave = () => {
    mouseX.set(0);
    mouseY.set(0);
    setIsHovered(false);
  };

  const CardWrapper = feature.href ? 'a' : 'div';
  const wrapperProps = feature.href ? { href: feature.href } : {};

  return (
    <motion.div
      ref={cardRef}
      initial={{ opacity: 0, y: 50, z: -100 }}
      animate={isInView ? { opacity: 1, y: 0, z: 0 } : {}}
      transition={{ 
        duration: 0.6, 
        delay: index * 0.15,
        ease: [0.22, 1, 0.36, 1] // Custom easing for smooth entrance
      }}
      style={{
        rotateX,
        rotateY,
        x: magneticX,
        y: magneticY,
        transformStyle: "preserve-3d",
        perspective: "1000px",
      }}
      onMouseMove={handleMouseMove}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={handleMouseLeave}
    >
      <CardWrapper {...wrapperProps} className={feature.href ? "block cursor-pointer" : ""}>
        <Card 
          className="bg-card/50 backdrop-blur-sm border-border/50 hover:border-primary/50 transition-all duration-500 group h-full relative overflow-hidden"
          style={{
            transformStyle: "preserve-3d",
          }}
        >
          {/* Animated gradient border */}
          <motion.div
            className="absolute inset-0 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-500"
            style={{
              background: `linear-gradient(135deg, ${feature.accentColor}20, transparent, ${feature.accentColor}20)`,
              backgroundSize: "200% 200%",
            }}
            animate={isHovered ? {
              backgroundPosition: ["0% 0%", "100% 100%", "0% 0%"],
            } : {}}
            transition={{ duration: 3, repeat: Infinity }}
          />

          {/* Shimmer effect */}
          <motion.div
            className="absolute inset-0 bg-gradient-to-r from-transparent via-primary/20 to-transparent"
            initial={{ x: '-100%' }}
            animate={isHovered ? { x: '100%' } : { x: '-100%' }}
            transition={{ duration: 1, ease: "easeInOut" }}
          />

          {/* Gradient glow on hover */}
          <motion.div
            className={`absolute inset-0 bg-gradient-to-br ${feature.gradient} opacity-0 blur-2xl transition-opacity duration-500`}
            animate={isHovered ? { opacity: 0.3 } : { opacity: 0 }}
          />

          {/* Card content with depth */}
          <CardContent className="p-6 space-y-4 relative z-10" style={{ transform: "translateZ(20px)" }}>
            {/* Floating icon container */}
            <div className="relative h-16 mb-2">
              {/* Icon background glow */}
              <motion.div 
                className={`absolute top-0 left-0 w-12 h-12 rounded-lg bg-gradient-to-br ${feature.gradient} opacity-20 blur-md`}
                animate={isHovered ? {
                  scale: [1, 1.3, 1],
                  opacity: [0.2, 0.4, 0.2],
                } : {}}
                transition={{ duration: 2, repeat: Infinity }}
              />
              
              {/* Icon background */}
              <motion.div 
                className={`absolute top-0 left-0 inline-flex p-3 rounded-lg bg-gradient-to-br ${feature.gradient} opacity-10`}
                animate={isHovered ? { scale: 1.1, opacity: 0.15 } : { scale: 1, opacity: 0.1 }}
                transition={{ type: "spring", stiffness: 300 }}
                style={{ transform: "translateZ(30px)" }}
              />
              
              {/* Floating icon with pulsing animation */}
              <motion.div
                className="absolute top-3 left-3"
                animate={isHovered ? { 
                  y: [-2, -8, -2],
                  scale: [1, 1.15, 1],
                } : {
                  y: [0, -5, 0],
                }}
                transition={isHovered ? { 
                  duration: 1.5,
                  repeat: Infinity,
                  ease: "easeInOut"
                } : {
                  duration: 3,
                  repeat: Infinity,
                  ease: "easeInOut"
                }}
                style={{ transform: "translateZ(40px)" }}
              >
                <feature.icon 
                  className={`h-6 w-6 bg-gradient-to-br ${feature.gradient} bg-clip-text`}
                  style={{
                    WebkitTextFillColor: 'transparent',
                    filter: `drop-shadow(0 0 12px ${feature.accentColor}80)`,
                  }} 
                />
              </motion.div>

              {/* Orbiting particles around icon */}
              {isHovered && (
                <>
                  {[...Array(3)].map((_, i) => (
                    <motion.div
                      key={i}
                      className="absolute w-1 h-1 rounded-full"
                      style={{
                        background: feature.accentColor,
                        left: "24px",
                        top: "24px",
                      }}
                      animate={{
                        x: [0, Math.cos((i * 120 * Math.PI) / 180) * 30],
                        y: [0, Math.sin((i * 120 * Math.PI) / 180) * 30],
                        opacity: [0, 1, 0],
                        scale: [0, 1.5, 0],
                      }}
                      transition={{
                        duration: 2,
                        repeat: Infinity,
                        delay: i * 0.3,
                        ease: "easeOut"
                      }}
                    />
                  ))}
                </>
              )}
            </div>

            {/* Content with depth */}
            <motion.div 
              className="space-y-2"
              style={{ transform: "translateZ(25px)" }}
            >
              <h3 className="uppercase tracking-wide">
                {feature.title}
              </h3>
              <p className="text-sm text-muted-foreground leading-relaxed">
                {feature.description}
              </p>
            </motion.div>

            {/* Hover indicator arrow */}
            <motion.div
              className="flex items-center text-xs uppercase tracking-wider text-primary/70 pt-2"
              initial={{ opacity: 0, x: -10 }}
              animate={isHovered ? { opacity: 1, x: 0 } : { opacity: 0, x: -10 }}
              transition={{ duration: 0.3 }}
              style={{ transform: "translateZ(30px)" }}
            >
              <span>Explore</span>
              <motion.span
                className="ml-1"
                animate={isHovered ? { x: [0, 4, 0] } : {}}
                transition={{ duration: 1, repeat: Infinity }}
              >
                →
              </motion.span>
            </motion.div>
          </CardContent>

          {/* Corner accent */}
          <motion.div
            className="absolute top-0 right-0 w-20 h-20 opacity-0 group-hover:opacity-100"
            style={{
              background: `radial-gradient(circle at top right, ${feature.accentColor}30, transparent)`,
            }}
            animate={isHovered ? { scale: [1, 1.5, 1] } : {}}
            transition={{ duration: 2, repeat: Infinity }}
          />
        </Card>
      </CardWrapper>
    </motion.div>
  );
}