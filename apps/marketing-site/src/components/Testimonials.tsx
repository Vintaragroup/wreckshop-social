import { Card, CardContent } from "./ui/card";
import { Quote, Star, TrendingUp, Users, Zap } from "lucide-react";
import { motion, useInView, useMotionValue, useSpring, useTransform } from "motion/react";
import { useRef, useState } from "react";

export function Testimonials() {
  const sectionRef = useRef(null);
  const isInView = useInView(sectionRef, { once: true, margin: "-100px" });

  const stats = [
    { value: "10k+", label: "Active Artists", icon: Users, color: "#00CFFF" },
    { value: "50M+", label: "Fans Reached", icon: TrendingUp, color: "#FF00FF" },
    { value: "2.5M+", label: "Campaigns Sent", icon: Zap, color: "#00CFFF" },
    { value: "98%", label: "Satisfaction", icon: Star, color: "#FF00FF" }
  ];

  return (
    <section ref={sectionRef} className="py-24 relative overflow-hidden">
      {/* Animated background gradient orbs */}
      <motion.div 
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-primary/5 rounded-full blur-3xl"
        animate={{
          scale: [1, 1.2, 1],
          rotate: [0, 90, 0],
        }}
        transition={{ duration: 30, repeat: Infinity, ease: "linear" }}
      />
      <motion.div 
        className="absolute top-1/4 left-1/4 w-96 h-96 bg-secondary/5 rounded-full blur-3xl"
        animate={{
          scale: [1.2, 1, 1.2],
          x: [0, 50, 0],
          y: [0, 30, 0],
        }}
        transition={{ duration: 20, repeat: Infinity, ease: "easeInOut" }}
      />

      {/* Floating quote marks */}
      {[
        { x: "10%", y: "20%", delay: 0, rotation: -15 },
        { x: "85%", y: "15%", delay: 2, rotation: 15 },
        { x: "5%", y: "80%", delay: 1, rotation: 10 },
      ].map((quote, i) => (
        <motion.div
          key={i}
          className="absolute opacity-5"
          style={{ left: quote.x, top: quote.y, rotate: quote.rotation }}
          animate={{
            y: [0, -20, 0],
            rotate: [quote.rotation, quote.rotation + 10, quote.rotation],
            scale: [1, 1.1, 1],
          }}
          transition={{
            duration: 8,
            repeat: Infinity,
            delay: quote.delay,
            ease: "easeInOut"
          }}
        >
          <Quote className="w-16 h-16 text-primary" strokeWidth={1} />
        </motion.div>
      ))}
      
      <div className="container mx-auto px-4 relative z-10">
        <div className="max-w-5xl mx-auto">
          {/* Main testimonial card with 3D effects */}
          <TestimonialCard isInView={isInView} />

          {/* Stats grid */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mt-12">
            {stats.map((stat, index) => (
              <StatCard key={index} stat={stat} index={index} isInView={isInView} />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

function TestimonialCard({ isInView }: { isInView: boolean }) {
  const cardRef = useRef<HTMLDivElement>(null);
  const [isHovered, setIsHovered] = useState(false);

  // Mouse tracking for 3D rotation
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);
  
  const smoothMouseX = useSpring(mouseX, { damping: 20, stiffness: 150 });
  const smoothMouseY = useSpring(mouseY, { damping: 20, stiffness: 150 });
  
  const rotateX = useTransform(smoothMouseY, [-0.5, 0.5], [5, -5]);
  const rotateY = useTransform(smoothMouseX, [-0.5, 0.5], [-5, 5]);

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
      initial={{ opacity: 0, y: 60, rotateX: -10 }}
      animate={isInView ? { opacity: 1, y: 0, rotateX: 0 } : {}}
      transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
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
        className="bg-gradient-to-br from-card/80 to-card/40 backdrop-blur-sm border-border/50 hover:border-primary/30 transition-all duration-500 relative overflow-hidden group"
        style={{
          transformStyle: "preserve-3d",
        }}
      >
        {/* Animated border glow */}
        <motion.div
          className="absolute inset-0 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-500"
          style={{
            background: 'linear-gradient(135deg, #00CFFF20, transparent, #FF00FF20)',
            backgroundSize: "200% 200%",
          }}
          animate={isHovered ? {
            backgroundPosition: ["0% 0%", "100% 100%", "0% 0%"],
          } : {}}
          transition={{ duration: 4, repeat: Infinity }}
        />

        {/* Corner accent lights */}
        <motion.div
          className="absolute top-0 left-0 w-40 h-40 opacity-0 group-hover:opacity-100"
          style={{
            background: 'radial-gradient(circle at top left, #00CFFF30, transparent)',
          }}
          animate={isHovered ? { scale: [1, 1.5, 1], rotate: [0, 90, 0] } : {}}
          transition={{ duration: 3, repeat: Infinity }}
        />
        <motion.div
          className="absolute bottom-0 right-0 w-40 h-40 opacity-0 group-hover:opacity-100"
          style={{
            background: 'radial-gradient(circle at bottom right, #FF00FF30, transparent)',
          }}
          animate={isHovered ? { scale: [1, 1.5, 1], rotate: [0, -90, 0] } : {}}
          transition={{ duration: 3, repeat: Infinity, delay: 0.5 }}
        />

        {/* Shimmer effect */}
        <motion.div
          className="absolute inset-0 bg-gradient-to-r from-transparent via-primary/10 to-transparent"
          initial={{ x: '-100%' }}
          animate={isHovered ? { x: '100%' } : { x: '-100%' }}
          transition={{ duration: 1.5, ease: "easeInOut" }}
        />

        <CardContent className="p-8 md:p-12 space-y-8 relative z-10">
          {/* Quote icon with depth */}
          <motion.div 
            className="inline-flex p-4 rounded-full bg-gradient-to-br from-primary/20 to-secondary/20 relative"
            style={{ transform: "translateZ(50px)" }}
            animate={isHovered ? { 
              rotate: [0, 10, 0, -10, 0],
              scale: [1, 1.1, 1]
            } : {
              rotate: [0, 5, 0, -5, 0],
              scale: [1, 1.05, 1]
            }}
            transition={{ 
              duration: isHovered ? 3 : 5,
              repeat: Infinity,
              ease: "easeInOut"
            }}
          >
            {/* Pulsing glow */}
            <motion.div
              className="absolute inset-0 bg-gradient-to-br from-primary/30 to-secondary/30 rounded-full blur-xl"
              animate={{
                scale: [1, 1.5, 1],
                opacity: [0.3, 0.6, 0.3],
              }}
              transition={{ duration: 2, repeat: Infinity }}
            />
            
            <Quote className="h-8 w-8 text-primary relative z-10" />

            {/* Orbiting sparkles */}
            {isHovered && (
              <>
                {[...Array(4)].map((_, i) => (
                  <motion.div
                    key={i}
                    className="absolute w-1 h-1 rounded-full bg-primary"
                    style={{
                      left: "50%",
                      top: "50%",
                    }}
                    animate={{
                      x: Math.cos((i * 90 * Math.PI) / 180) * 40,
                      y: Math.sin((i * 90 * Math.PI) / 180) * 40,
                      opacity: [0, 1, 0],
                      scale: [0, 2, 0],
                    }}
                    transition={{
                      duration: 2,
                      repeat: Infinity,
                      delay: i * 0.2,
                      ease: "easeOut"
                    }}
                  />
                ))}
              </>
            )}
          </motion.div>

          {/* Testimonial text with depth */}
          <motion.blockquote 
            className="text-2xl md:text-3xl leading-relaxed relative"
            style={{ transform: "translateZ(30px)" }}
            initial={{ opacity: 0 }}
            animate={isInView ? { opacity: 1 } : {}}
            transition={{ duration: 0.8, delay: 0.2 }}
          >
            "Wreckshop Social completely transformed how we engage with our fanbase. 
            We went from guessing to <motion.span 
              className="bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent inline-block"
              animate={isHovered ? {
                backgroundPosition: ["0% 50%", "100% 50%", "0% 50%"],
              } : {}}
              transition={{ duration: 3, repeat: Infinity }}
              style={{
                backgroundSize: "200% 100%",
              }}
            >knowing exactly who to reach</motion.span> and when. 
            Our tour sold out in record time."

            {/* Floating emphasis particles */}
            {isHovered && (
              <>
                {[...Array(3)].map((_, i) => (
                  <motion.div
                    key={i}
                    className="absolute w-1 h-1 rounded-full"
                    style={{
                      background: i % 2 === 0 ? "#00CFFF" : "#FF00FF",
                      left: `${30 + i * 20}%`,
                      top: "50%",
                    }}
                    animate={{
                      y: [0, -30, 0],
                      opacity: [0, 1, 0],
                      scale: [0, 1.5, 0],
                    }}
                    transition={{
                      duration: 2,
                      repeat: Infinity,
                      delay: i * 0.4,
                      ease: "easeOut"
                    }}
                  />
                ))}
              </>
            )}
          </motion.blockquote>

          {/* Attribution with depth */}
          <motion.div 
            className="flex items-center gap-4 relative"
            style={{ transform: "translateZ(40px)" }}
            initial={{ opacity: 0, x: -20 }}
            animate={isInView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.6, delay: 0.4 }}
          >
            {/* Avatar with glow */}
            <div className="relative">
              <motion.div
                className="absolute inset-0 bg-gradient-to-br from-primary to-secondary rounded-full blur-md"
                animate={{
                  scale: [1, 1.3, 1],
                  opacity: [0.5, 0.8, 0.5],
                }}
                transition={{ duration: 2, repeat: Infinity }}
              />
              <motion.div 
                className="w-12 h-12 rounded-full bg-gradient-to-br from-primary to-secondary relative z-10"
                whileHover={{ scale: 1.15, rotate: 5 }}
                transition={{ type: "spring", stiffness: 300 }}
              />
            </div>
            
            <div>
              <motion.div 
                className="uppercase tracking-wide"
                animate={isHovered ? { x: [0, 2, 0] } : {}}
                transition={{ duration: 2, repeat: Infinity }}
              >
                Jordan Miles
              </motion.div>
              <div className="text-sm text-muted-foreground">
                Independent Artist • Los Angeles
              </div>
            </div>

            {/* Star rating */}
            <motion.div 
              className="ml-auto flex gap-1"
              initial={{ opacity: 0, scale: 0 }}
              animate={isInView ? { opacity: 1, scale: 1 } : {}}
              transition={{ duration: 0.5, delay: 0.6 }}
            >
              {[...Array(5)].map((_, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, scale: 0 }}
                  animate={isInView ? { opacity: 1, scale: 1 } : {}}
                  transition={{ 
                    duration: 0.3, 
                    delay: 0.7 + i * 0.1,
                    type: "spring",
                    stiffness: 200
                  }}
                  whileHover={{ 
                    scale: 1.3, 
                    rotate: 15,
                    filter: "drop-shadow(0 0 8px #00CFFF)",
                  }}
                >
                  <Star 
                    className="w-4 h-4 fill-primary text-primary"
                  />
                </motion.div>
              ))}
            </motion.div>
          </motion.div>
        </CardContent>

        {/* Bottom accent line */}
        <motion.div
          className="absolute bottom-0 left-0 right-0 h-0.5 bg-gradient-to-r from-transparent via-primary to-transparent opacity-0 group-hover:opacity-100"
          transition={{ duration: 0.3 }}
        />
      </Card>
    </motion.div>
  );
}

function StatCard({ 
  stat, 
  index, 
  isInView 
}: { 
  stat: typeof stats[0]; 
  index: number;
  isInView: boolean;
}) {
  const cardRef = useRef<HTMLDivElement>(null);
  const [isHovered, setIsHovered] = useState(false);

  // Mouse tracking
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);
  
  const smoothMouseX = useSpring(mouseX, { damping: 20, stiffness: 150 });
  const smoothMouseY = useSpring(mouseY, { damping: 20, stiffness: 150 });
  
  const rotateX = useTransform(smoothMouseY, [-0.5, 0.5], [10, -10]);
  const rotateY = useTransform(smoothMouseX, [-0.5, 0.5], [-10, 10]);

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
      className="text-center space-y-3 group relative p-6 rounded-lg bg-card/20 backdrop-blur-sm border border-border/30 hover:border-primary/50 transition-all duration-500"
      initial={{ opacity: 0, scale: 0.5, y: 30 }}
      animate={isInView ? { opacity: 1, scale: 1, y: 0 } : {}}
      transition={{ 
        duration: 0.6,
        delay: 0.6 + index * 0.1,
        type: "spring",
        stiffness: 200
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
      {/* Background glow */}
      <motion.div
        className="absolute inset-0 rounded-lg opacity-0 group-hover:opacity-100"
        style={{
          background: `radial-gradient(circle at center, ${stat.color}20, transparent)`,
        }}
        transition={{ duration: 0.3 }}
      />

      {/* Floating icon */}
      <motion.div
        className="flex justify-center mb-2"
        style={{ transform: "translateZ(30px)" }}
      >
        <motion.div
          className="p-2 rounded-lg bg-gradient-to-br from-primary/10 to-secondary/10"
          animate={isHovered ? {
            y: [-2, -6, -2],
            rotate: [0, 5, 0],
          } : {}}
          transition={{ duration: 2, repeat: Infinity }}
        >
          <stat.icon 
            className="w-5 h-5 text-primary"
            style={{
              filter: `drop-shadow(0 0 6px ${stat.color}80)`,
            }}
          />
        </motion.div>
      </motion.div>

      {/* Stat value */}
      <motion.div 
        className="text-3xl md:text-4xl bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent relative"
        style={{ 
          transform: "translateZ(40px)",
          backgroundSize: "200% 100%",
        }}
        animate={isHovered ? {
          backgroundPosition: ["0% 50%", "100% 50%", "0% 50%"],
          scale: 1.1,
        } : {}}
        transition={{ 
          backgroundPosition: { duration: 2, repeat: Infinity },
          scale: { duration: 0.3 }
        }}
      >
        {stat.value}

        {/* Sparkle effect */}
        {isHovered && (
          <>
            {[...Array(3)].map((_, i) => (
              <motion.div
                key={i}
                className="absolute w-1 h-1 rounded-full"
                style={{
                  background: stat.color,
                  left: `${20 + i * 30}%`,
                  top: "50%",
                }}
                animate={{
                  y: [0, -20, 0],
                  opacity: [0, 1, 0],
                  scale: [0, 1.5, 0],
                }}
                transition={{
                  duration: 1.5,
                  repeat: Infinity,
                  delay: i * 0.2,
                  ease: "easeOut"
                }}
              />
            ))}
          </>
        )}
      </motion.div>

      {/* Stat label */}
      <motion.div 
        className="text-sm text-muted-foreground uppercase tracking-wide"
        style={{ transform: "translateZ(25px)" }}
      >
        {stat.label}
      </motion.div>

      {/* Corner accent */}
      <motion.div
        className="absolute bottom-0 right-0 w-12 h-12 opacity-0 group-hover:opacity-100"
        style={{
          background: `radial-gradient(circle at bottom right, ${stat.color}30, transparent)`,
        }}
        animate={isHovered ? { scale: [1, 1.5, 1] } : {}}
        transition={{ duration: 2, repeat: Infinity }}
      />
    </motion.div>
  );
}

// Stats data needs to be outside component for type inference
const stats = [
  { value: "10k+", label: "Active Artists", icon: Users, color: "#00CFFF" },
  { value: "50M+", label: "Fans Reached", icon: TrendingUp, color: "#FF00FF" },
  { value: "2.5M+", label: "Campaigns Sent", icon: Zap, color: "#00CFFF" },
  { value: "98%", label: "Satisfaction", icon: Star, color: "#FF00FF" }
];
