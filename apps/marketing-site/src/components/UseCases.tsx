import { Card, CardContent } from "./ui/card";
import { ImageWithFallback } from "./figma/ImageWithFallback";
import { Mic2, Building2, Calendar, TrendingUp, Sparkles } from "lucide-react";
import { motion, useInView, useMotionValue, useSpring, useTransform } from "motion/react";
import { useRef, useState } from "react";

const useCases = [
  {
    icon: Mic2,
    title: "Artists",
    description: "Independent artists use Wreckshop to discover superfans, launch album campaigns, and sell out shows in targeted markets.",
    image: "https://images.unsplash.com/photo-1595422656650-d70f51f4a814?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxhcnRpc3QlMjBwZXJmb3JtaW5nJTIwc3RhZ2V8ZW58MXx8fHwxNzYzNDA0MTI5fDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
    stat: "3x higher show attendance",
    gradient: "from-primary/30 to-primary/10",
    color: "#00CFFF"
  },
  {
    icon: Building2,
    title: "Labels",
    description: "Record labels leverage enterprise-grade tools to manage multiple artists, coordinate releases, and maximize catalog impact.",
    image: "https://images.unsplash.com/photo-1637759898746-283c2d6c24c5?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxtdXNpYyUyMHByb2R1Y2VyJTIwc3R1ZGlvfGVufDF8fHx8MTc2MzMxMzM5MHww&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
    stat: "40% increase in streaming",
    gradient: "from-secondary/30 to-secondary/10",
    color: "#FF00FF"
  },
  {
    icon: Calendar,
    title: "Promoters",
    description: "Event promoters use geofencing and real-time segmentation to fill venues and drive ticket sales in specific regions.",
    image: "https://images.unsplash.com/photo-1756978303719-57095d8bd250?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxjb25jZXJ0JTIwY3Jvd2QlMjBtdXNpYyUyMGZlc3RpdmFsfGVufDF8fHx8MTc2MzQwNDEyOXww&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
    stat: "85% sellout rate",
    gradient: "from-primary/20 to-secondary/20",
    color: "#00CFFF"
  }
];

export function UseCases() {
  const sectionRef = useRef(null);
  const isInView = useInView(sectionRef, { once: true, margin: "-100px" });

  return (
    <section ref={sectionRef} className="py-24 relative overflow-hidden">
      {/* Animated background */}
      <motion.div 
        className="absolute inset-0 bg-gradient-to-b from-transparent via-secondary/5 to-transparent"
        animate={{
          backgroundPosition: ["0% 0%", "100% 100%", "0% 0%"],
        }}
        transition={{ duration: 30, repeat: Infinity, ease: "linear" }}
        style={{ backgroundSize: "200% 200%" }}
      />

      {/* Floating music notes */}
      {[
        { x: "10%", y: "20%", delay: 0, rotation: -15 },
        { x: "85%", y: "25%", delay: 2, rotation: 15 },
        { x: "15%", y: "75%", delay: 1, rotation: 10 },
      ].map((note, i) => (
        <motion.div
          key={i}
          className="absolute text-6xl opacity-5"
          style={{ left: note.x, top: note.y, rotate: note.rotation }}
          animate={{
            y: [0, -20, 0],
            rotate: [note.rotation, note.rotation + 15, note.rotation],
            scale: [1, 1.1, 1],
          }}
          transition={{
            duration: 8,
            repeat: Infinity,
            delay: note.delay,
            ease: "easeInOut"
          }}
        >
          ♪
        </motion.div>
      ))}

      {/* Radial gradient orbs */}
      <motion.div
        className="absolute top-1/3 left-1/4 w-96 h-96 bg-primary/8 rounded-full blur-3xl"
        animate={{
          scale: [1, 1.3, 1],
          x: [0, 40, 0],
        }}
        transition={{ duration: 20, repeat: Infinity, ease: "easeInOut" }}
      />
      <motion.div
        className="absolute bottom-1/3 right-1/4 w-96 h-96 bg-secondary/8 rounded-full blur-3xl"
        animate={{
          scale: [1.3, 1, 1.3],
          x: [0, -40, 0],
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
            initial={{ opacity: 0, scale: 0.8 }}
            animate={isInView ? { opacity: 1, scale: 1 } : {}}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            <span className="inline-block px-4 py-2 rounded-full bg-gradient-to-r from-primary/20 to-secondary/20 border border-primary/30 backdrop-blur-sm text-sm uppercase tracking-wider">
              Use Cases
            </span>
          </motion.div>

          <h2 className="text-4xl md:text-6xl uppercase tracking-tight">
            <motion.span 
              className="block"
              initial={{ opacity: 0, x: -20 }}
              animate={isInView ? { opacity: 1, x: 0 } : {}}
              transition={{ duration: 0.6, delay: 0.3 }}
            >
              BUILT FOR
            </motion.span>
            <motion.span 
              className="block bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent"
              initial={{ opacity: 0, x: 20 }}
              animate={isInView ? { opacity: 1, x: 0 } : {}}
              transition={{ duration: 0.6, delay: 0.4 }}
            >
              THE INDUSTRY
            </motion.span>
          </h2>
          <motion.p 
            className="text-muted-foreground"
            initial={{ opacity: 0 }}
            animate={isInView ? { opacity: 1 } : {}}
            transition={{ duration: 0.6, delay: 0.5 }}
          >
            Trusted by artists, labels, and promoters worldwide
          </motion.p>
        </motion.div>

        {/* Use cases grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-7xl mx-auto">
          {useCases.map((useCase, index) => (
            <UseCaseCard key={index} useCase={useCase} index={index} isInView={isInView} />
          ))}
        </div>
      </div>
    </section>
  );
}

function UseCaseCard({ 
  useCase, 
  index, 
  isInView 
}: { 
  useCase: typeof useCases[0]; 
  index: number;
  isInView: boolean;
}) {
  const cardRef = useRef<HTMLDivElement>(null);
  const imageRef = useRef<HTMLDivElement>(null);
  const [isHovered, setIsHovered] = useState(false);

  // Mouse tracking for 3D rotation
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);
  
  const smoothMouseX = useSpring(mouseX, { damping: 20, stiffness: 150 });
  const smoothMouseY = useSpring(mouseY, { damping: 20, stiffness: 150 });
  
  const rotateX = useTransform(smoothMouseY, [-0.5, 0.5], [10, -10]);
  const rotateY = useTransform(smoothMouseX, [-0.5, 0.5], [-10, 10]);

  // Parallax for image
  const imageX = useTransform(smoothMouseX, [-0.5, 0.5], [-20, 20]);
  const imageY = useTransform(smoothMouseY, [-0.5, 0.5], [-20, 20]);

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
      <Card 
        className="bg-card/30 backdrop-blur-sm border-border/50 overflow-hidden group hover:border-primary/50 transition-all duration-500 h-full relative"
        style={{
          transformStyle: "preserve-3d",
        }}
      >
        {/* Shimmer effect */}
        <motion.div
          className="absolute inset-0 bg-gradient-to-r from-transparent via-primary/10 to-transparent z-20"
          initial={{ x: '-100%' }}
          animate={isHovered ? { x: '100%' } : { x: '-100%' }}
          transition={{ duration: 1.2, ease: "easeInOut" }}
        />

        {/* Corner accent */}
        <motion.div
          className="absolute top-0 right-0 w-32 h-32 opacity-0 group-hover:opacity-100 z-10"
          style={{
            background: `radial-gradient(circle at top right, ${useCase.color}30, transparent)`,
          }}
          animate={isHovered ? { scale: [1, 1.5, 1], rotate: [0, 90, 0] } : {}}
          transition={{ duration: 3, repeat: Infinity }}
        />

        {/* Image container with parallax depth */}
        <motion.div
          ref={imageRef}
          className="relative h-48 overflow-hidden"
          style={{
            transform: "translateZ(50px)",
          }}
        >
          {/* Parallax image */}
          <motion.div
            className="relative w-full h-full"
            style={{
              x: imageX,
              y: imageY,
              scale: isHovered ? 1.15 : 1,
            }}
            transition={{ duration: 0.5 }}
          >
            <ImageWithFallback 
              src={useCase.image} 
              alt={useCase.title}
              className="w-full h-full object-cover"
            />
          </motion.div>

          {/* Gradient overlay */}
          <div className="absolute inset-0 bg-gradient-to-t from-card via-card/50 to-transparent z-10" />
          
          {/* Dynamic spotlight that follows mouse */}
          <motion.div
            className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 z-10"
            style={{
              background: `radial-gradient(circle at ${(mouseX.get() + 1) * 50}% ${(mouseY.get() + 1) * 50}%, ${useCase.color}40, transparent 60%)`,
            }}
          />
          
          {/* Icon badge with depth */}
          <motion.div 
            className="absolute top-4 right-4 z-20"
            style={{ transform: "translateZ(60px)" }}
          >
            {/* Icon glow */}
            <motion.div
              className={`absolute inset-0 bg-gradient-to-br ${useCase.gradient} rounded-lg blur-xl`}
              animate={{
                scale: [1, 1.5, 1],
                opacity: [0.3, 0.6, 0.3],
              }}
              transition={{ duration: 2, repeat: Infinity }}
            />
            
            <motion.div 
              className={`relative p-3 rounded-lg bg-gradient-to-br ${useCase.gradient} backdrop-blur-sm border border-primary/30`}
              animate={isHovered ? { 
                scale: 1.2, 
                rotate: 15,
                boxShadow: `0 10px 30px ${useCase.color}50`,
              } : {}}
              transition={{ type: "spring", stiffness: 300 }}
            >
              <useCase.icon 
                className="h-5 w-5 text-primary"
                style={{
                  filter: `drop-shadow(0 0 8px ${useCase.color}80)`,
                }}
              />
            </motion.div>

            {/* Orbiting sparkles */}
            {isHovered && (
              <>
                {[...Array(3)].map((_, i) => (
                  <motion.div
                    key={i}
                    className="absolute"
                    style={{
                      left: "50%",
                      top: "50%",
                    }}
                    animate={{
                      x: Math.cos((i * 120 * Math.PI) / 180) * 35,
                      y: Math.sin((i * 120 * Math.PI) / 180) * 35,
                      opacity: [0, 1, 0],
                      scale: [0, 1.5, 0],
                    }}
                    transition={{
                      duration: 2,
                      repeat: Infinity,
                      delay: i * 0.2,
                      ease: "easeOut"
                    }}
                  >
                    <Sparkles 
                      className="w-3 h-3"
                      style={{ color: useCase.color }}
                    />
                  </motion.div>
                ))}
              </>
            )}
          </motion.div>

          {/* Stat badge with depth and animation */}
          <motion.div 
            className="absolute bottom-4 left-4 z-20 group/stat"
            style={{ transform: "translateZ(55px)" }}
            initial={{ x: -50, opacity: 0 }}
            animate={isInView ? { x: 0, opacity: 1 } : {}}
            transition={{ duration: 0.5, delay: index * 0.2 + 0.3 }}
            whileHover={{ scale: 1.1, x: 5 }}
          >
            {/* Stat glow */}
            <motion.div
              className="absolute inset-0 bg-gradient-to-r from-primary to-secondary rounded-full blur-md"
              animate={{
                scale: [1, 1.3, 1],
                opacity: [0.5, 0.8, 0.5],
              }}
              transition={{ duration: 2, repeat: Infinity }}
            />
            
            <div className="relative px-4 py-2 rounded-full bg-gradient-to-r from-primary/95 to-secondary/95 backdrop-blur-sm flex items-center gap-2">
              <TrendingUp className="w-4 h-4 text-primary-foreground" />
              <span className="text-sm text-primary-foreground uppercase tracking-wide">
                {useCase.stat}
              </span>
            </div>

            {/* Rising particles */}
            {isHovered && (
              <>
                {[...Array(3)].map((_, i) => (
                  <motion.div
                    key={i}
                    className="absolute w-1 h-1 rounded-full"
                    style={{
                      background: useCase.color,
                      left: `${30 + i * 20}%`,
                      bottom: "0",
                    }}
                    animate={{
                      y: [0, -30, -60],
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
          </motion.div>

          {/* Image frame lines for depth */}
          {isHovered && (
            <>
              <motion.div
                className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-primary/50 to-transparent z-10"
                initial={{ scaleX: 0 }}
                animate={{ scaleX: 1 }}
                transition={{ duration: 0.5 }}
              />
              <motion.div
                className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-secondary/50 to-transparent z-10"
                initial={{ scaleX: 0 }}
                animate={{ scaleX: 1 }}
                transition={{ duration: 0.5, delay: 0.1 }}
              />
            </>
          )}
        </motion.div>
        
        {/* Content with depth */}
        <CardContent className="p-6 space-y-3 relative z-10" style={{ transform: "translateZ(40px)" }}>
          <motion.h3 
            className="text-2xl uppercase tracking-wide"
            animate={isHovered ? { x: [0, 2, 0] } : {}}
            transition={{ duration: 2, repeat: Infinity }}
          >
            {useCase.title}
          </motion.h3>
          <p className="text-sm text-muted-foreground leading-relaxed">
            {useCase.description}
          </p>

          {/* Interactive hover line */}
          <motion.div
            className="flex items-center gap-2 text-xs uppercase tracking-wider text-primary/70 pt-2"
            initial={{ opacity: 0, x: -10 }}
            animate={isHovered ? { opacity: 1, x: 0 } : { opacity: 0, x: -10 }}
            transition={{ duration: 0.3 }}
          >
            <a 
              href={`/${useCase.title.toLowerCase()}`}
              className="flex items-center gap-2 hover:text-primary transition-colors"
            >
              <span>Learn more</span>
              <motion.span
                animate={isHovered ? { x: [0, 4, 0] } : {}}
                transition={{ duration: 1, repeat: Infinity }}
              >
                →
              </motion.span>
            </a>
          </motion.div>
        </CardContent>

        {/* Bottom glow line */}
        <motion.div
          className="absolute bottom-0 left-0 right-0 h-0.5 bg-gradient-to-r from-transparent via-primary to-transparent opacity-0 group-hover:opacity-100"
          transition={{ duration: 0.3 }}
        />

        {/* 3D depth grid lines */}
        {isHovered && (
          <>
            <motion.div
              className="absolute left-0 top-1/3 right-0 h-px bg-gradient-to-r from-transparent via-primary/10 to-transparent"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.3 }}
            />
            <motion.div
              className="absolute left-0 top-2/3 right-0 h-px bg-gradient-to-r from-transparent via-secondary/10 to-transparent"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.3, delay: 0.1 }}
            />
          </>
        )}
      </Card>
    </motion.div>
  );
}