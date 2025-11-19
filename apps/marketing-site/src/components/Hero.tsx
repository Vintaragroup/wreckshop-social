import { Button } from "./ui/button";
import { ArrowRight, Music, Radio, Users, TrendingUp } from "lucide-react";
import { motion, useMotionValue, useSpring, useTransform } from "motion/react";
import { useEffect, useRef, useState } from "react";

export function Hero() {
  console.log('[Hero] Component rendering');
  const containerRef = useRef<HTMLDivElement>(null);
  const [scrollY, setScrollY] = useState(0);
  
  // Mouse position for 3D tilt effect
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);
  
  const smoothMouseX = useSpring(mouseX, { damping: 20, stiffness: 100 });
  const smoothMouseY = useSpring(mouseY, { damping: 20, stiffness: 100 });
  
  const rotateX = useTransform(smoothMouseY, [-0.5, 0.5], [5, -5]);
  const rotateY = useTransform(smoothMouseX, [-0.5, 0.5], [-5, 5]);

  useEffect(() => {
    const handleScroll = () => setScrollY(window.scrollY);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!containerRef.current) return;
    
    const rect = containerRef.current.getBoundingClientRect();
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
  };

  // Floating icon data
  const floatingIcons = [
    { Icon: Music, delay: 0, x: "10%", y: "20%", duration: 20 },
    { Icon: Radio, delay: 2, x: "85%", y: "15%", duration: 25 },
    { Icon: Users, delay: 4, x: "15%", y: "70%", duration: 22 },
    { Icon: TrendingUp, delay: 1, x: "80%", y: "65%", duration: 18 },
    { Icon: Music, delay: 3, x: "50%", y: "10%", duration: 24 },
    { Icon: Radio, delay: 5, x: "90%", y: "40%", duration: 21 },
  ];

  return (
    <section 
      ref={containerRef}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      className="relative min-h-[95vh] flex items-center justify-center overflow-hidden perspective-1000"
      style={{ perspective: "1000px" }}
    >
      {/* Layer 1: Deepest - Animated gradient orbs with parallax */}
      <motion.div 
        className="absolute inset-0 opacity-40"
        style={{ y: scrollY * 0.8 }}
      >
        <motion.div
          className="absolute top-1/4 left-1/4 w-96 h-96 bg-primary/30 rounded-full blur-3xl"
          animate={{
            scale: [1, 1.2, 1],
            x: [0, 50, 0],
            y: [0, 30, 0],
          }}
          transition={{ duration: 20, repeat: Infinity, ease: "easeInOut" }}
        />
        <motion.div
          className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-secondary/30 rounded-full blur-3xl"
          animate={{
            scale: [1.2, 1, 1.2],
            x: [0, -50, 0],
            y: [0, -30, 0],
          }}
          transition={{ duration: 25, repeat: Infinity, ease: "easeInOut" }}
        />
      </motion.div>

      {/* Layer 2: Grid pattern with strong parallax */}
      <motion.div 
        className="absolute inset-0 opacity-10" 
        style={{
          backgroundImage: `linear-gradient(rgba(0, 207, 255, 0.3) 1px, transparent 1px), linear-gradient(90deg, rgba(0, 207, 255, 0.3) 1px, transparent 1px)`,
          backgroundSize: '60px 60px',
          y: scrollY * 0.6
        }}
      />

      {/* Layer 3: Floating icons with depth */}
      {floatingIcons.map((item, index) => (
        <motion.div
          key={index}
          className="absolute"
          style={{
            left: item.x,
            top: item.y,
            y: scrollY * (0.2 + index * 0.05)
          }}
          initial={{ opacity: 0, scale: 0 }}
          animate={{ 
            opacity: [0.1, 0.3, 0.1],
            scale: [1, 1.2, 1],
            rotate: [0, 360],
          }}
          transition={{
            opacity: { duration: item.duration, repeat: Infinity, delay: item.delay },
            scale: { duration: item.duration, repeat: Infinity, delay: item.delay },
            rotate: { duration: item.duration * 2, repeat: Infinity, ease: "linear" }
          }}
        >
          <item.Icon className="w-8 h-8 text-primary" strokeWidth={1.5} />
        </motion.div>
      ))}

      {/* Layer 4: Animated waveform visualization */}
      <svg 
        className="absolute inset-0 w-full h-full opacity-5"
        style={{ transform: `translateY(${scrollY * 0.4}px)` }}
      >
        {[...Array(30)].map((_, i) => (
          <motion.rect
            key={i}
            x={`${(i * 100) / 30}%`}
            y="50%"
            width="2%"
            height="4"
            fill="url(#gradient)"
            animate={{
              height: [4, Math.random() * 200 + 50, 4],
              y: ["50%", `${50 - Math.random() * 20}%`, "50%"],
            }}
            transition={{
              duration: 2 + Math.random() * 2,
              repeat: Infinity,
              delay: i * 0.1,
              ease: "easeInOut",
            }}
          />
        ))}
        <defs>
          <linearGradient id="gradient" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#00CFFF" />
            <stop offset="100%" stopColor="#FF00FF" />
          </linearGradient>
        </defs>
      </svg>

      {/* Layer 5: Main content with 3D tilt */}
      <motion.div
        className="container relative z-10 mx-auto px-4 py-20"
        style={{
          rotateX,
          rotateY,
          transformStyle: "preserve-3d",
        }}
      >
        <div className="max-w-5xl mx-auto text-center space-y-8">
          {/* Glassmorphic card with depth */}
          <motion.div
            className="relative p-12 rounded-3xl backdrop-blur-md bg-gradient-to-br from-background/40 via-background/20 to-transparent border border-primary/20 shadow-2xl"
            style={{
              transformStyle: "preserve-3d",
              boxShadow: "0 20px 60px rgba(0, 207, 255, 0.2), 0 0 80px rgba(255, 0, 255, 0.1)"
            }}
            initial={{ opacity: 0, z: -100 }}
            animate={{ opacity: 1, z: 0 }}
            transition={{ duration: 1 }}
          >
            {/* Inner glow effect */}
            <div className="absolute inset-0 rounded-3xl bg-gradient-to-br from-primary/5 to-secondary/5 pointer-events-none" />
            
            {/* Badge - elevated layer */}
            <motion.div
              className="inline-block relative mb-6"
              style={{ z: 50, transformStyle: "preserve-3d" }}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
            >
              <motion.span 
                className="px-6 py-3 rounded-full bg-gradient-to-r from-primary/30 to-secondary/30 border border-primary/40 backdrop-blur-sm inline-block shadow-lg"
                animate={{
                  boxShadow: [
                    "0 0 20px rgba(0, 207, 255, 0.4), 0 0 40px rgba(255, 0, 255, 0.2)",
                    "0 0 40px rgba(255, 0, 255, 0.4), 0 0 60px rgba(0, 207, 255, 0.2)",
                    "0 0 20px rgba(0, 207, 255, 0.4), 0 0 40px rgba(255, 0, 255, 0.2)"
                  ]
                }}
                transition={{ duration: 4, repeat: Infinity }}
                style={{ transform: "translateZ(50px)" }}
              >
                <span className="bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent uppercase tracking-wider">
                  Next-Gen Music Marketing
                </span>
              </motion.span>
            </motion.div>

            {/* Main headline - multiple depth layers */}
            <motion.div
              className="relative"
              style={{ transformStyle: "preserve-3d" }}
            >
              <motion.h1
                className="text-5xl md:text-7xl lg:text-8xl uppercase tracking-tight relative"
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.4 }}
                style={{ transform: "translateZ(30px)" }}
              >
                <span className="block">UNLOCK YOUR</span>
                <motion.span 
                  className="block bg-gradient-to-r from-primary via-secondary to-primary bg-clip-text text-transparent"
                  animate={{
                    backgroundPosition: ["0% 50%", "100% 50%", "0% 50%"],
                  }}
                  transition={{ duration: 5, repeat: Infinity, ease: "linear" }}
                  style={{ backgroundSize: "200% auto" }}
                >
                  MUSIC AUDIENCE
                </motion.span>
              </motion.h1>

              {/* Depth shadow behind text */}
              <div 
                className="absolute inset-0 blur-2xl opacity-30 bg-gradient-to-r from-primary to-secondary"
                style={{ transform: "translateZ(-20px)" }}
              />
            </motion.div>

            {/* Subheadline */}
            <motion.p
              className="text-lg md:text-xl text-muted-foreground max-w-3xl mx-auto mt-6"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.6, delay: 0.6 }}
              style={{ transform: "translateZ(20px)" }}
            >
              Discover, Segment & Engage Fans — with Wreckshop Social. 
              The marketing automation platform built for artist teams, labels, and promoters.
            </motion.p>

            {/* CTAs - elevated */}
            <motion.div
              className="flex flex-col sm:flex-row gap-4 justify-center items-center pt-8"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.6, delay: 0.8 }}
              style={{ transform: "translateZ(40px)", transformStyle: "preserve-3d" }}
            >
              <motion.div 
                whileHover={{ scale: 1.05, z: 20 }}
                whileTap={{ scale: 0.95 }}
                style={{ transformStyle: "preserve-3d" }}
              >
                <Button 
                  size="lg" 
                  className="bg-gradient-to-r from-primary to-primary/80 hover:from-primary/90 hover:to-primary/70 text-primary-foreground px-8 py-6 shadow-xl shadow-primary/30 group"
                  asChild
                >
                  <a href="http://localhost:5176/signup">
                    <span className="relative z-10 flex items-center">
                      Get Started
                      <ArrowRight className="ml-2 h-5 w-5 transition-transform group-hover:translate-x-1" />
                    </span>
                  </a>
                </Button>
              </motion.div>
              <motion.div 
                whileHover={{ scale: 1.05, z: 20 }}
                whileTap={{ scale: 0.95 }}
                style={{ transformStyle: "preserve-3d" }}
              >
                <Button 
                  size="lg" 
                  variant="outline" 
                  className="border-2 border-primary/50 hover:bg-primary/10 hover:border-primary px-8 py-6 backdrop-blur-sm shadow-lg"
                  asChild
                >
                  <a href="/#how-it-works">
                    Learn More
                  </a>
                </Button>
              </motion.div>
            </motion.div>

            {/* Stats bar - front layer */}
            <motion.div
              className="grid grid-cols-3 gap-8 pt-12 max-w-3xl mx-auto"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 1 }}
              style={{ transform: "translateZ(25px)" }}
            >
              {[
                { value: "+42%", label: "Fan Engagement" },
                { value: "3x", label: "Campaign ROI" },
                { value: "10k+", label: "Artists" }
              ].map((stat, index) => (
                <motion.div
                  key={index}
                  className="space-y-2 p-4 rounded-xl backdrop-blur-sm bg-background/10 border border-primary/10"
                  whileHover={{ 
                    scale: 1.1, 
                    z: 30,
                    boxShadow: "0 10px 30px rgba(0, 207, 255, 0.3)"
                  }}
                  transition={{ type: "spring", stiffness: 300 }}
                  style={{ transformStyle: "preserve-3d" }}
                >
                  <div className="text-3xl md:text-4xl bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
                    {stat.value}
                  </div>
                  <div className="text-sm text-muted-foreground uppercase tracking-wide">
                    {stat.label}
                  </div>
                </motion.div>
              ))}
            </motion.div>
          </motion.div>
        </div>
      </motion.div>

      {/* Layer 6: Foreground particles */}
      <div className="absolute inset-0 pointer-events-none">
        {[...Array(15)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute w-1 h-1 bg-primary/40 rounded-full"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
            }}
            animate={{
              y: [-20, -100],
              opacity: [0, 1, 0],
              scale: [0, 1.5, 0],
            }}
            transition={{
              duration: 3 + Math.random() * 2,
              repeat: Infinity,
              delay: Math.random() * 5,
              ease: "easeOut",
            }}
          />
        ))}
      </div>

      {/* Bottom fade gradient */}
      <div className="absolute bottom-0 left-0 right-0 h-40 bg-gradient-to-t from-background via-background/50 to-transparent pointer-events-none z-20" />
    </section>
  );
}