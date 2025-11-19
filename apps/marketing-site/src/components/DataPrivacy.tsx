import { Card, CardContent } from "./ui/card";
import { Shield, Lock, Eye, UserCheck, CheckCircle2 } from "lucide-react";
import { Button } from "./ui/button";
import { motion, useInView, useMotionValue, useSpring, useTransform } from "motion/react";
import { useRef, useState } from "react";

const principles = [
  {
    icon: Shield,
    title: "Transparent Data Use",
    description: "We only collect social profile data you explicitly authorize. Every connection requires your permission, and you control what data we access.",
    color: "#00CFFF",
    gradient: "from-primary/30 to-primary/10"
  },
  {
    icon: Lock,
    title: "Encrypted & Secure",
    description: "All fan data is encrypted in transit and at rest. We use bank-level security protocols and never sell your audience data to third parties.",
    color: "#FF00FF",
    gradient: "from-secondary/30 to-secondary/10"
  },
  {
    icon: Eye,
    title: "Fan Privacy First",
    description: "We anonymize and aggregate fan data for insights. Individual fan information is protected and only used to deliver your marketing campaigns.",
    color: "#00CFFF",
    gradient: "from-primary/20 to-secondary/20"
  },
  {
    icon: UserCheck,
    title: "GDPR & CCPA Compliant",
    description: "Full compliance with international privacy regulations. Fans can opt-out anytime, and we honor all data deletion requests within 30 days.",
    color: "#FF00FF",
    gradient: "from-secondary/20 to-primary/20"
  }
];

export function DataPrivacy() {
  const sectionRef = useRef(null);
  const isInView = useInView(sectionRef, { once: true, margin: "-100px" });

  return (
    <section ref={sectionRef} className="py-24 relative overflow-hidden">
      {/* Animated background gradient */}
      <motion.div 
        className="absolute inset-0 bg-gradient-to-b from-transparent via-primary/5 to-transparent"
        animate={{
          backgroundPosition: ["0% 0%", "100% 100%", "0% 0%"],
        }}
        transition={{ duration: 30, repeat: Infinity, ease: "linear" }}
        style={{ backgroundSize: "200% 200%" }}
      />

      {/* Floating shield icons */}
      {[
        { x: "8%", y: "15%", delay: 0, rotation: -20 },
        { x: "88%", y: "20%", delay: 1.5, rotation: 20 },
        { x: "12%", y: "75%", delay: 3, rotation: 15 },
      ].map((shield, i) => (
        <motion.div
          key={i}
          className="absolute opacity-5"
          style={{ left: shield.x, top: shield.y, rotate: shield.rotation }}
          animate={{
            y: [0, -15, 0],
            rotate: [shield.rotation, shield.rotation + 10, shield.rotation],
            scale: [1, 1.1, 1],
          }}
          transition={{
            duration: 7,
            repeat: Infinity,
            delay: shield.delay,
            ease: "easeInOut"
          }}
        >
          <Shield className="w-20 h-20 text-primary" strokeWidth={1} />
        </motion.div>
      ))}

      {/* Radial gradient orbs */}
      <motion.div
        className="absolute top-1/4 right-1/4 w-96 h-96 bg-primary/8 rounded-full blur-3xl"
        animate={{
          scale: [1, 1.3, 1],
          opacity: [0.3, 0.5, 0.3],
        }}
        transition={{ duration: 20, repeat: Infinity, ease: "easeInOut" }}
      />
      <motion.div
        className="absolute bottom-1/4 left-1/4 w-96 h-96 bg-secondary/8 rounded-full blur-3xl"
        animate={{
          scale: [1.3, 1, 1.3],
          opacity: [0.5, 0.3, 0.5],
        }}
        transition={{ duration: 25, repeat: Infinity, ease: "easeInOut" }}
      />

      <div className="container mx-auto px-4 relative z-10">
        {/* Section header */}
        <motion.div 
          className="text-center max-w-3xl mx-auto mb-16 space-y-4"
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
        >
          <motion.div 
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-card/50 border border-primary/30 backdrop-blur-sm relative"
            animate={{
              boxShadow: [
                "0 0 20px rgba(0, 207, 255, 0.2)",
                "0 0 30px rgba(0, 207, 255, 0.3)",
                "0 0 20px rgba(0, 207, 255, 0.2)"
              ]
            }}
            transition={{ duration: 2, repeat: Infinity }}
          >
            {/* Orbiting particles */}
            {isInView && (
              <>
                {[...Array(3)].map((_, i) => (
                  <motion.div
                    key={i}
                    className="absolute w-1 h-1 rounded-full bg-primary"
                    style={{
                      left: "50%",
                      top: "50%",
                    }}
                    animate={{
                      x: Math.cos((i * 120 * Math.PI) / 180) * 40,
                      y: Math.sin((i * 120 * Math.PI) / 180) * 40,
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
            
            <Shield className="h-4 w-4 text-primary" />
            <span className="text-sm uppercase tracking-wider text-primary">
              Privacy & Trust
            </span>
          </motion.div>
          
          <h2 className="text-4xl md:text-6xl uppercase tracking-tight">
            <motion.span 
              className="block"
              initial={{ opacity: 0, x: -20 }}
              animate={isInView ? { opacity: 1, x: 0 } : {}}
              transition={{ duration: 0.6, delay: 0.2 }}
            >
              YOUR DATA.
            </motion.span>
            <motion.span 
              className="block bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent"
              initial={{ opacity: 0, x: 20 }}
              animate={isInView ? { opacity: 1, x: 0 } : {}}
              transition={{ duration: 0.6, delay: 0.3 }}
            >
              YOUR CONTROL.
            </motion.span>
          </h2>
          
          <motion.p 
            className="text-lg text-muted-foreground leading-relaxed"
            initial={{ opacity: 0 }}
            animate={isInView ? { opacity: 1 } : {}}
            transition={{ duration: 0.6, delay: 0.4 }}
          >
            We connect with fans through social platforms, but we never compromise on privacy. 
            Here's how we handle your data and protect your audience.
          </motion.p>
        </motion.div>

        {/* Principles grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-6xl mx-auto mb-12">
          {principles.map((principle, index) => (
            <PrincipleCard key={index} principle={principle} index={index} isInView={isInView} />
          ))}
        </div>

        {/* Social connections explanation */}
        <ExplanationCard isInView={isInView} />

        {/* Trust badges */}
        <motion.div 
          className="mt-12 flex flex-wrap justify-center items-center gap-8 text-sm text-muted-foreground"
          initial={{ opacity: 0 }}
          animate={isInView ? { opacity: 1 } : {}}
          transition={{ duration: 0.6, delay: 0.6 }}
        >
          {[
            { icon: Shield, label: "SOC 2 Type II Certified", color: "#00CFFF" },
            { icon: Lock, label: "256-bit Encryption", color: "#FF00FF" },
            { icon: UserCheck, label: "GDPR Compliant", color: "#00CFFF" },
            { icon: Shield, label: "CCPA Compliant", color: "#FF00FF" }
          ].map((badge, index) => (
            <TrustBadge key={index} badge={badge} index={index} isInView={isInView} />
          ))}
        </motion.div>
      </div>
    </section>
  );
}

function PrincipleCard({ 
  principle, 
  index, 
  isInView 
}: { 
  principle: typeof principles[0]; 
  index: number;
  isInView: boolean;
}) {
  const cardRef = useRef<HTMLDivElement>(null);
  const [isHovered, setIsHovered] = useState(false);

  // Mouse tracking for 3D rotation
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);
  
  const smoothMouseX = useSpring(mouseX, { damping: 20, stiffness: 150 });
  const smoothMouseY = useSpring(mouseY, { damping: 20, stiffness: 150 });
  
  const rotateX = useTransform(smoothMouseY, [-0.5, 0.5], [8, -8]);
  const rotateY = useTransform(smoothMouseX, [-0.5, 0.5], [-8, 8]);

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

  return (
    <motion.div
      ref={cardRef}
      initial={{ opacity: 0, x: index % 2 === 0 ? -60 : 60, rotateY: index % 2 === 0 ? -15 : 15 }}
      animate={isInView ? { opacity: 1, x: 0, rotateY: 0 } : {}}
      transition={{ 
        duration: 0.7,
        delay: index * 0.15,
        ease: [0.22, 1, 0.36, 1]
      }}
      style={{
        rotateX,
        rotateY,
        transformStyle: "preserve-3d",
        perspective: "1000px",
      }}
      onMouseMove={handleMouseMove}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={handleMouseLeave}
    >
      <Card 
        className="bg-card/30 backdrop-blur-sm border-border/50 hover:border-primary/50 transition-all duration-500 h-full group relative overflow-hidden"
        style={{
          transformStyle: "preserve-3d",
        }}
      >
        {/* Shimmer effect */}
        <motion.div
          className="absolute inset-0 bg-gradient-to-r from-transparent via-primary/10 to-transparent"
          initial={{ x: '-100%' }}
          animate={isHovered ? { x: '100%' } : { x: '-100%' }}
          transition={{ duration: 1.2, ease: "easeInOut" }}
        />

        {/* Corner accent */}
        <motion.div
          className="absolute top-0 right-0 w-32 h-32 opacity-0 group-hover:opacity-100"
          style={{
            background: `radial-gradient(circle at top right, ${principle.color}20, transparent)`,
          }}
          animate={isHovered ? { scale: [1, 1.4, 1], rotate: [0, 90, 0] } : {}}
          transition={{ duration: 3, repeat: Infinity }}
        />

        {/* Bottom glow */}
        <motion.div
          className={`absolute bottom-0 left-0 right-0 h-0.5 bg-gradient-to-r from-transparent via-primary to-transparent opacity-0 group-hover:opacity-100`}
          transition={{ duration: 0.3 }}
        />
        
        <CardContent className="p-6 space-y-4 relative z-10">
          <div className="flex items-start gap-4">
            {/* Icon with depth */}
            <motion.div 
              className="relative"
              style={{ transform: "translateZ(40px)" }}
            >
              {/* Icon glow */}
              <motion.div
                className={`absolute inset-0 bg-gradient-to-br ${principle.gradient} rounded-lg blur-xl`}
                animate={{
                  scale: [1, 1.4, 1],
                  opacity: [0.3, 0.6, 0.3],
                }}
                transition={{ duration: 2, repeat: Infinity }}
              />
              
              <motion.div 
                className={`relative p-3 rounded-lg bg-gradient-to-br ${principle.gradient} backdrop-blur-sm border border-primary/30`}
                animate={isHovered ? { 
                  scale: 1.15, 
                  rotate: 10,
                  boxShadow: `0 10px 30px ${principle.color}40`,
                } : {}}
                transition={{ type: "spring", stiffness: 300 }}
              >
                <principle.icon 
                  className="h-6 w-6 text-primary"
                  style={{
                    filter: `drop-shadow(0 0 8px ${principle.color}80)`,
                  }}
                />
              </motion.div>

              {/* Check mark particles */}
              {isHovered && (
                <>
                  {[...Array(4)].map((_, i) => (
                    <motion.div
                      key={i}
                      className="absolute"
                      style={{
                        left: "50%",
                        top: "50%",
                      }}
                      animate={{
                        x: Math.cos((i * 90 * Math.PI) / 180) * 40,
                        y: Math.sin((i * 90 * Math.PI) / 180) * 40,
                        opacity: [0, 1, 0],
                        scale: [0, 1, 0],
                      }}
                      transition={{
                        duration: 1.5,
                        repeat: Infinity,
                        delay: i * 0.2,
                        ease: "easeOut"
                      }}
                    >
                      <CheckCircle2 
                        className="w-3 h-3"
                        style={{ color: principle.color }}
                      />
                    </motion.div>
                  ))}
                </>
              )}
            </motion.div>
            
            {/* Content with depth */}
            <div className="flex-1 space-y-2" style={{ transform: "translateZ(30px)" }}>
              <h3 className="uppercase tracking-wide">
                {principle.title}
              </h3>
              <p className="text-sm text-muted-foreground leading-relaxed">
                {principle.description}
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
}

function ExplanationCard({ isInView }: { isInView: boolean }) {
  const cardRef = useRef<HTMLDivElement>(null);
  const [isHovered, setIsHovered] = useState(false);

  // Mouse tracking
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);
  
  const smoothMouseX = useSpring(mouseX, { damping: 20, stiffness: 150 });
  const smoothMouseY = useSpring(mouseY, { damping: 20, stiffness: 150 });
  
  const rotateX = useTransform(smoothMouseY, [-0.5, 0.5], [3, -3]);
  const rotateY = useTransform(smoothMouseX, [-0.5, 0.5], [-3, 3]);

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

  return (
    <motion.div
      ref={cardRef}
      initial={{ opacity: 0, y: 60, scale: 0.95 }}
      animate={isInView ? { opacity: 1, y: 0, scale: 1 } : {}}
      transition={{ duration: 0.8, delay: 0.4, ease: [0.22, 1, 0.36, 1] }}
      style={{
        rotateX,
        rotateY,
        transformStyle: "preserve-3d",
        perspective: "1200px",
      }}
      onMouseMove={handleMouseMove}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={handleMouseLeave}
    >
      <Card 
        className="max-w-4xl mx-auto bg-gradient-to-br from-card/80 to-card/40 backdrop-blur-sm border-primary/30 relative overflow-hidden group"
        style={{
          transformStyle: "preserve-3d",
        }}
      >
        {/* Animated background gradient */}
        <motion.div
          className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500"
          style={{
            background: 'linear-gradient(45deg, transparent, rgba(0, 207, 255, 0.05), transparent, rgba(255, 0, 255, 0.05), transparent)',
            backgroundSize: '200% 200%'
          }}
          animate={isHovered ? {
            backgroundPosition: ['0% 0%', '100% 100%', '0% 0%']
          } : {}}
          transition={{
            duration: 4,
            repeat: Infinity,
          }}
        />

        {/* Corner lights */}
        <motion.div
          className="absolute top-0 left-0 w-40 h-40 opacity-0 group-hover:opacity-100"
          style={{
            background: 'radial-gradient(circle at top left, #00CFFF20, transparent)',
          }}
          animate={isHovered ? { scale: [1, 1.5, 1] } : {}}
          transition={{ duration: 2, repeat: Infinity }}
        />
        <motion.div
          className="absolute bottom-0 right-0 w-40 h-40 opacity-0 group-hover:opacity-100"
          style={{
            background: 'radial-gradient(circle at bottom right, #FF00FF20, transparent)',
          }}
          animate={isHovered ? { scale: [1, 1.5, 1] } : {}}
          transition={{ duration: 2, repeat: Infinity, delay: 0.5 }}
        />
        
        <CardContent className="p-8 space-y-6 relative z-10" style={{ transform: "translateZ(30px)" }}>
          <h3 className="text-2xl uppercase tracking-wide">
            How We Connect With Your Fans
          </h3>
          
          <div className="space-y-4 text-muted-foreground">
            <motion.p 
              className="leading-relaxed"
              style={{ transform: "translateZ(20px)" }}
            >
              <strong className="text-foreground">Social Platform Integration:</strong> When you connect Spotify, Instagram, Twitter, or other platforms, 
              we use OAuth authentication to securely access only the data you authorize—such as follower demographics, 
              engagement metrics, and listening patterns.
            </motion.p>
            
            <motion.p 
              className="leading-relaxed"
              style={{ transform: "translateZ(20px)" }}
            >
              <strong className="text-foreground">Audience Insights, Not Individual Tracking:</strong> We aggregate and anonymize fan data to create 
              audience segments. For example, "fans in Los Angeles who listen to hip-hop" rather than tracking individual users.
            </motion.p>
            
            <motion.p 
              className="leading-relaxed"
              style={{ transform: "translateZ(20px)" }}
            >
              <strong className="text-foreground">Permission-Based Marketing:</strong> All campaigns require explicit opt-in from fans. 
              We never send unsolicited messages. Fans can unsubscribe from email, SMS, or push notifications at any time.
            </motion.p>

            <motion.p 
              className="leading-relaxed"
              style={{ transform: "translateZ(20px)" }}
            >
              <strong className="text-foreground">Data Retention:</strong> We retain campaign data for 24 months for analytics purposes. 
              You can delete your account and all associated data at any time through your dashboard settings.
            </motion.p>
          </div>

          <div className="pt-4 flex flex-col sm:flex-row gap-4" style={{ transform: "translateZ(35px)" }}>
            <motion.div 
              whileHover={{ scale: 1.05, y: -2 }} 
              whileTap={{ scale: 0.98 }}
            >
              <Button 
                variant="outline" 
                className="border-primary/50 hover:bg-primary/10 w-full sm:w-auto group/btn relative overflow-hidden"
              >
                <motion.div
                  className="absolute inset-0 bg-gradient-to-r from-transparent via-primary/20 to-transparent"
                  initial={{ x: '-100%' }}
                  whileHover={{ x: '100%' }}
                  transition={{ duration: 0.6 }}
                />
                <span className="relative z-10">Read Full Privacy Policy</span>
              </Button>
            </motion.div>
            <motion.div 
              whileHover={{ scale: 1.05, y: -2 }} 
              whileTap={{ scale: 0.98 }}
            >
              <Button 
                variant="outline" 
                className="border-primary/50 hover:bg-primary/10 w-full sm:w-auto group/btn relative overflow-hidden"
              >
                <motion.div
                  className="absolute inset-0 bg-gradient-to-r from-transparent via-secondary/20 to-transparent"
                  initial={{ x: '-100%' }}
                  whileHover={{ x: '100%' }}
                  transition={{ duration: 0.6 }}
                />
                <span className="relative z-10">View Security Practices</span>
              </Button>
            </motion.div>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
}

function TrustBadge({ 
  badge, 
  index, 
  isInView 
}: { 
  badge: { icon: any; label: string; color: string }; 
  index: number;
  isInView: boolean;
}) {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <motion.div 
      className="flex items-center gap-2 px-4 py-2 rounded-lg bg-card/20 backdrop-blur-sm border border-border/30 hover:border-primary/50 transition-all duration-300 relative overflow-hidden group"
      initial={{ opacity: 0, y: 20 }}
      animate={isInView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.4, delay: 0.7 + index * 0.1 }}
      whileHover={{ scale: 1.05, y: -2 }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Glow effect */}
      <motion.div
        className="absolute inset-0 opacity-0 group-hover:opacity-100"
        style={{
          background: `radial-gradient(circle at center, ${badge.color}15, transparent)`,
        }}
        transition={{ duration: 0.3 }}
      />

      {/* Icon with glow */}
      <motion.div
        animate={isHovered ? {
          scale: [1, 1.2, 1],
          rotate: [0, 10, 0],
        } : {}}
        transition={{ duration: 0.5 }}
      >
        <badge.icon 
          className="h-5 w-5 text-primary relative z-10"
          style={{
            filter: isHovered ? `drop-shadow(0 0 8px ${badge.color}80)` : 'none',
          }}
        />
      </motion.div>
      
      <span className="relative z-10">{badge.label}</span>

      {/* Sparkle */}
      {isHovered && (
        <motion.div
          className="absolute top-2 right-2 w-1 h-1 rounded-full"
          style={{ background: badge.color }}
          animate={{
            opacity: [0, 1, 0],
            scale: [0, 2, 0],
          }}
          transition={{ duration: 1, repeat: Infinity }}
        />
      )}
    </motion.div>
  );
}
