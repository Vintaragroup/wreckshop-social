import { Plug, Users, Rocket, TrendingUp, Zap } from "lucide-react";
import { motion, useInView, useMotionValue, useSpring, useTransform } from "motion/react";
import { useRef, useState } from "react";

const steps = [
  {
    number: "01",
    icon: Plug,
    title: "Connect Your Platforms",
    description: "Link Spotify, Instagram, and other services to aggregate your audience data in one place.",
    gradient: "from-primary/30 to-primary/10",
    color: "#00CFFF"
  },
  {
    number: "02",
    icon: Users,
    title: "Build Segments",
    description: "Create targeted audience groups based on listening habits, location, engagement, and preferences.",
    gradient: "from-secondary/30 to-secondary/10",
    color: "#FF00FF"
  },
  {
    number: "03",
    icon: Rocket,
    title: "Launch Campaigns",
    description: "Deploy multi-channel campaigns via email, SMS, and push with automated workflows.",
    gradient: "from-primary/30 to-secondary/30",
    color: "#00CFFF"
  },
  {
    number: "04",
    icon: TrendingUp,
    title: "Measure Impact",
    description: "Track performance in real-time and optimize your strategy with detailed analytics.",
    gradient: "from-secondary/30 to-primary/30",
    color: "#FF00FF"
  }
];

export function HowItWorks() {
  const sectionRef = useRef(null);
  const isInView = useInView(sectionRef, { once: true, margin: "-100px" });

  return (
    <section ref={sectionRef} className="py-24 relative overflow-hidden">
      {/* Animated background gradient */}
      <motion.div 
        className="absolute inset-0 bg-gradient-to-b from-transparent via-primary/5 to-transparent"
        animate={{
          backgroundPosition: ["0% 0%", "0% 100%", "0% 0%"],
        }}
        transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
        style={{ backgroundSize: "100% 200%" }}
      />

      {/* Floating network nodes */}
      {[
        { x: "10%", y: "15%", delay: 0, size: 8 },
        { x: "90%", y: "20%", delay: 1, size: 6 },
        { x: "15%", y: "80%", delay: 2, size: 10 },
        { x: "85%", y: "75%", delay: 1.5, size: 7 },
      ].map((node, i) => (
        <motion.div
          key={i}
          className="absolute rounded-full bg-primary/20 blur-sm"
          style={{
            left: node.x,
            top: node.y,
            width: node.size,
            height: node.size,
          }}
          animate={{
            scale: [1, 1.5, 1],
            opacity: [0.3, 0.6, 0.3],
          }}
          transition={{
            duration: 3,
            repeat: Infinity,
            delay: node.delay,
            ease: "easeInOut"
          }}
        />
      ))}

      <div className="container mx-auto px-4 relative z-10">
        {/* Section header */}
        <motion.div 
          className="text-center max-w-3xl mx-auto mb-20 space-y-4"
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
              Simple Process
            </span>
          </motion.div>

          <h2 className="text-4xl md:text-6xl uppercase tracking-tight">
            <motion.span 
              className="block"
              initial={{ opacity: 0, x: -20 }}
              animate={isInView ? { opacity: 1, x: 0 } : {}}
              transition={{ duration: 0.6, delay: 0.3 }}
            >
              HOW IT
            </motion.span>
            <motion.span 
              className="block bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent"
              initial={{ opacity: 0, x: 20 }}
              animate={isInView ? { opacity: 1, x: 0 } : {}}
              transition={{ duration: 0.6, delay: 0.4 }}
            >
              WORKS
            </motion.span>
          </h2>
          <motion.p 
            className="text-muted-foreground"
            initial={{ opacity: 0 }}
            animate={isInView ? { opacity: 1 } : {}}
            transition={{ duration: 0.6, delay: 0.5 }}
          >
            Four simple steps to transform your music marketing
          </motion.p>
        </motion.div>

        {/* Steps */}
        <div className="max-w-6xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 relative">
            {/* Animated connecting lines - desktop */}
            <svg 
              className="hidden lg:block absolute top-24 left-0 right-0 h-32 pointer-events-none"
              style={{ width: '100%' }}
            >
              <defs>
                <linearGradient id="lineGradient" x1="0%" y1="0%" x2="100%" y2="0%">
                  <stop offset="0%" stopColor="#00CFFF" stopOpacity="0.6" />
                  <stop offset="50%" stopColor="#FF00FF" stopOpacity="0.6" />
                  <stop offset="100%" stopColor="#00CFFF" stopOpacity="0.6" />
                </linearGradient>
                <path id="flowPath" d="M 12% 40 Q 30% 10, 38% 40 T 62% 40 Q 70% 10, 88% 40" />
              </defs>

              {/* Main flow line */}
              <motion.path
                d="M 12% 40 Q 30% 10, 38% 40 T 62% 40 Q 70% 10, 88% 40"
                stroke="url(#lineGradient)"
                strokeWidth="2"
                fill="none"
                initial={{ pathLength: 0, opacity: 0 }}
                animate={isInView ? { pathLength: 1, opacity: 0.4 } : {}}
                transition={{ duration: 2, delay: 0.5, ease: "easeInOut" }}
              />

              {/* Animated data packets moving along the line */}
              {isInView && [...Array(4)].map((_, i) => (
                <circle
                  key={i}
                  r="3"
                  fill={i % 2 === 0 ? "#00CFFF" : "#FF00FF"}
                >
                  <animateMotion
                    dur="3s"
                    repeatCount="indefinite"
                    begin={`${i * 0.7}s`}
                    path="M 12% 40 Q 30% 10, 38% 40 T 62% 40 Q 70% 10, 88% 40"
                  />
                  <animate
                    attributeName="opacity"
                    values="0;1;1;0"
                    dur="3s"
                    repeatCount="indefinite"
                    begin={`${i * 0.7}s`}
                  />
                </circle>
              ))}
            </svg>

            {/* Step cards with 3D rotation */}
            {steps.map((step, index) => (
              <StepCard key={index} step={step} index={index} isInView={isInView} />
            ))}
          </div>

          {/* Animated progress timeline - mobile */}
          <div className="lg:hidden mt-12 relative">
            <div className="absolute left-1/2 top-0 bottom-0 w-0.5 bg-gradient-to-b from-primary via-secondary to-primary opacity-20 -translate-x-1/2" />
            <motion.div
              className="absolute left-1/2 top-0 w-0.5 bg-gradient-to-b from-primary via-secondary to-primary -translate-x-1/2"
              initial={{ height: 0 }}
              animate={isInView ? { height: "100%" } : {}}
              transition={{ duration: 2, delay: 0.5 }}
            />
          </div>
        </div>
      </div>
    </section>
  );
}

function StepCard({ 
  step, 
  index, 
  isInView 
}: { 
  step: typeof steps[0]; 
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
      className="relative group"
      initial={{ opacity: 0, y: 80, rotateX: -15 }}
      animate={isInView ? { opacity: 1, y: 0, rotateX: 0 } : {}}
      transition={{ 
        duration: 0.7,
        delay: index * 0.2,
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
      {/* Step card container */}
      <div 
        className="text-center space-y-4 relative"
        style={{ transformStyle: "preserve-3d" }}
      >
        {/* Floating number badge with depth */}
        <div className="relative inline-block" style={{ transform: "translateZ(50px)" }}>
          {/* Pulsing glow */}
          <motion.div 
            className={`absolute inset-0 bg-gradient-to-br ${step.gradient} blur-2xl rounded-full`}
            animate={{
              scale: [1, 1.4, 1],
              opacity: [0.3, 0.6, 0.3]
            }}
            transition={{
              duration: 3,
              repeat: Infinity,
              delay: index * 0.3
            }}
          />
          
          {/* Number badge */}
          <motion.div 
            className="relative w-20 h-20 mx-auto rounded-full bg-gradient-to-br from-card to-card/50 backdrop-blur-sm border-2 border-primary/30 flex items-center justify-center group-hover:border-primary transition-all duration-500 shadow-lg"
            animate={isHovered ? { 
              scale: 1.15,
              boxShadow: `0 10px 40px ${step.color}40`,
            } : {}}
            transition={{ type: "spring", stiffness: 300 }}
            style={{
              boxShadow: `0 5px 20px ${step.color}20`,
            }}
          >
            <motion.span 
              className="text-2xl bg-gradient-to-br from-primary to-secondary bg-clip-text text-transparent"
              animate={isHovered ? { scale: 1.1 } : {}}
            >
              {step.number}
            </motion.span>

            {/* Orbiting ring */}
            <motion.div
              className="absolute inset-0 rounded-full border border-primary/20"
              animate={isHovered ? {
                rotate: 360,
                scale: [1, 1.2, 1],
              } : {}}
              transition={{
                rotate: { duration: 4, repeat: Infinity, ease: "linear" },
                scale: { duration: 2, repeat: Infinity },
              }}
            />
          </motion.div>

          {/* Connection nodes */}
          {isHovered && (
            <>
              {[...Array(6)].map((_, i) => (
                <motion.div
                  key={i}
                  className="absolute w-2 h-2 rounded-full"
                  style={{
                    background: step.color,
                    left: "50%",
                    top: "50%",
                    marginLeft: "-4px",
                    marginTop: "-4px",
                  }}
                  initial={{ scale: 0, opacity: 0 }}
                  animate={{
                    x: Math.cos((i * 60 * Math.PI) / 180) * 50,
                    y: Math.sin((i * 60 * Math.PI) / 180) * 50,
                    scale: [0, 1, 0],
                    opacity: [0, 1, 0],
                  }}
                  transition={{
                    duration: 2,
                    repeat: Infinity,
                    delay: i * 0.1,
                    ease: "easeOut"
                  }}
                />
              ))}
            </>
          )}
        </div>

        {/* Icon container with depth */}
        <div className="flex justify-center" style={{ transform: "translateZ(40px)" }}>
          {/* Icon glow background */}
          <motion.div
            className={`absolute w-16 h-16 rounded-lg bg-gradient-to-br ${step.gradient} blur-xl`}
            animate={isHovered ? {
              scale: [1, 1.3, 1],
              opacity: [0.4, 0.7, 0.4],
            } : {}}
            transition={{ duration: 2, repeat: Infinity }}
          />

          {/* Icon */}
          <motion.div 
            className={`relative p-4 rounded-lg bg-gradient-to-br ${step.gradient} backdrop-blur-sm border border-primary/20 group-hover:border-primary/50 transition-all duration-500`}
            animate={isHovered ? { 
              y: [-2, -10, -2],
              rotate: [0, 5, 0],
            } : {
              y: [0, -5, 0]
            }}
            transition={isHovered ? {
              duration: 2,
              repeat: Infinity,
              ease: "easeInOut"
            } : {
              duration: 3,
              repeat: Infinity,
              delay: index * 0.2,
              ease: "easeInOut"
            }}
            whileHover={{ 
              scale: 1.1,
              boxShadow: `0 10px 30px ${step.color}40`,
            }}
          >
            <step.icon 
              className="h-6 w-6 text-primary" 
              strokeWidth={2}
              style={{
                filter: `drop-shadow(0 0 8px ${step.color}80)`,
              }}
            />

            {/* Energy particles */}
            {isHovered && (
              <>
                {[...Array(4)].map((_, i) => (
                  <motion.div
                    key={i}
                    className="absolute w-1 h-1 rounded-full"
                    style={{
                      background: step.color,
                      left: "50%",
                      top: "50%",
                    }}
                    animate={{
                      x: [0, (Math.random() - 0.5) * 40],
                      y: [0, (Math.random() - 0.5) * 40],
                      opacity: [1, 0],
                      scale: [1, 0],
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
        </div>

        {/* Content with depth */}
        <motion.div 
          className="space-y-2 relative"
          style={{ transform: "translateZ(30px)" }}
        >
          {/* Title */}
          <h3 className="uppercase tracking-wide">
            {step.title}
          </h3>
          
          {/* Description */}
          <p className="text-sm text-muted-foreground leading-relaxed">
            {step.description}
          </p>

          {/* Progress indicator */}
          <motion.div
            className="pt-4 flex justify-center gap-1"
            initial={{ opacity: 0 }}
            animate={isInView ? { opacity: 0.5 } : {}}
            transition={{ delay: index * 0.2 + 0.5 }}
          >
            {[...Array(4)].map((_, i) => (
              <motion.div
                key={i}
                className="w-8 h-1 rounded-full bg-primary/20"
                animate={i === index ? {
                  backgroundColor: step.color,
                  opacity: [0.5, 1, 0.5],
                } : {}}
                transition={i === index ? {
                  duration: 2,
                  repeat: Infinity,
                  ease: "easeInOut"
                } : {}}
              />
            ))}
          </motion.div>
        </motion.div>

        {/* Bottom accent line */}
        <motion.div
          className="absolute bottom-0 left-1/2 -translate-x-1/2 h-0.5 bg-gradient-to-r from-transparent via-primary to-transparent"
          initial={{ width: 0 }}
          animate={isHovered ? { width: "80%" } : { width: 0 }}
          transition={{ duration: 0.3 }}
        />
      </div>
    </motion.div>
  );
}