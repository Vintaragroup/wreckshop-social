import { Button } from "./ui/button";
import { Card, CardContent, CardHeader } from "./ui/card";
import { Check, ArrowRight, Sparkles, Zap, Crown } from "lucide-react";
import { motion, useInView, useMotionValue, useSpring, useTransform } from "motion/react";
import { useRef, useState } from "react";

const plans = [
  {
    name: "Artist",
    description: "For independent artists and small teams",
    price: "$49",
    period: "/month",
    features: [
      "Up to 10,000 contacts",
      "Audience discovery tools",
      "Email & SMS campaigns",
      "Basic analytics",
      "1 connected platform"
    ],
    cta: "Start Free Trial",
    highlighted: false,
    icon: Sparkles,
    gradient: "from-primary/30 to-primary/10",
    color: "#00CFFF"
  },
  {
    name: "Label",
    description: "For record labels and management companies",
    price: "$299",
    period: "/month",
    features: [
      "Unlimited contacts",
      "Multi-artist management",
      "Advanced segmentation",
      "Geofencing & location targeting",
      "Real-time analytics",
      "Unlimited platform connections",
      "Priority support"
    ],
    cta: "Start Free Trial",
    highlighted: true,
    icon: Crown,
    gradient: "from-secondary/30 to-secondary/10",
    color: "#FF00FF"
  },
  {
    name: "Enterprise",
    description: "Custom solutions for large organizations",
    price: "Custom",
    period: "",
    features: [
      "Everything in Label",
      "Custom integrations",
      "Dedicated account manager",
      "White-label options",
      "SLA guarantees",
      "Custom reporting"
    ],
    cta: "Contact Sales",
    highlighted: false,
    icon: Zap,
    gradient: "from-primary/20 to-secondary/20",
    color: "#00CFFF"
  }
];

export function Pricing() {
  const sectionRef = useRef(null);
  const isInView = useInView(sectionRef, { once: true, margin: "-100px" });

  return (
    <section ref={sectionRef} className="py-24 relative overflow-hidden">
      {/* Animated background gradient */}
      <motion.div 
        className="absolute inset-0 bg-gradient-to-b from-transparent via-secondary/5 to-transparent"
        animate={{
          backgroundPosition: ["0% 0%", "100% 100%", "0% 0%"],
        }}
        transition={{ duration: 25, repeat: Infinity, ease: "linear" }}
        style={{ backgroundSize: "200% 200%" }}
      />

      {/* Floating price tags */}
      {[
        { x: "5%", y: "10%", delay: 0, rotation: -15 },
        { x: "90%", y: "15%", delay: 1.5, rotation: 15 },
        { x: "10%", y: "85%", delay: 3, rotation: 10 },
        { x: "85%", y: "80%", delay: 2, rotation: -10 },
      ].map((tag, i) => (
        <motion.div
          key={i}
          className="absolute text-6xl opacity-5"
          style={{
            left: tag.x,
            top: tag.y,
            rotate: tag.rotation,
          }}
          animate={{
            y: [0, -20, 0],
            rotate: [tag.rotation, tag.rotation + 10, tag.rotation],
          }}
          transition={{
            duration: 6,
            repeat: Infinity,
            delay: tag.delay,
            ease: "easeInOut"
          }}
        >
          $
        </motion.div>
      ))}

      {/* Radial gradient orbs */}
      <motion.div
        className="absolute top-1/4 left-1/3 w-96 h-96 bg-primary/10 rounded-full blur-3xl"
        animate={{
          scale: [1, 1.3, 1],
          x: [0, 50, 0],
        }}
        transition={{ duration: 20, repeat: Infinity, ease: "easeInOut" }}
      />
      <motion.div
        className="absolute bottom-1/4 right-1/3 w-96 h-96 bg-secondary/10 rounded-full blur-3xl"
        animate={{
          scale: [1.3, 1, 1.3],
          x: [0, -50, 0],
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
              Flexible Plans
            </span>
          </motion.div>

          <h2 className="text-4xl md:text-6xl uppercase tracking-tight">
            <motion.span 
              className="block"
              initial={{ opacity: 0, x: -20 }}
              animate={isInView ? { opacity: 1, x: 0 } : {}}
              transition={{ duration: 0.6, delay: 0.3 }}
            >
              PRICING
            </motion.span>
            <motion.span 
              className="block bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent"
              initial={{ opacity: 0, x: 20 }}
              animate={isInView ? { opacity: 1, x: 0 } : {}}
              transition={{ duration: 0.6, delay: 0.4 }}
            >
              THAT SCALES
            </motion.span>
          </h2>
          <motion.p 
            className="text-muted-foreground"
            initial={{ opacity: 0 }}
            animate={isInView ? { opacity: 1 } : {}}
            transition={{ duration: 0.6, delay: 0.5 }}
          >
            Choose the plan that fits your needs. All plans include 14-day free trial.
          </motion.p>
        </motion.div>

        {/* Pricing cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-7xl mx-auto">
          {plans.map((plan, index) => (
            <PricingCard key={index} plan={plan} index={index} isInView={isInView} />
          ))}
        </div>

        {/* Bottom CTA */}
        <motion.div 
          className="text-center mt-12"
          initial={{ opacity: 0 }}
          animate={isInView ? { opacity: 1 } : {}}
          transition={{ duration: 0.6, delay: 0.6 }}
        >
          <p className="text-muted-foreground">
            Need a custom solution? <button className="text-primary hover:underline">Contact our sales team</button>
          </p>
        </motion.div>
      </div>
    </section>
  );
}

function PricingCard({ 
  plan, 
  index, 
  isInView 
}: { 
  plan: typeof plans[0]; 
  index: number;
  isInView: boolean;
}) {
  const cardRef = useRef<HTMLDivElement>(null);
  const [isHovered, setIsHovered] = useState(false);

  // Mouse tracking for 3D effects
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
      initial={{ opacity: 0, y: 80, scale: 0.9 }}
      animate={isInView ? { opacity: 1, y: 0, scale: plan.highlighted ? 1.05 : 1 } : {}}
      transition={{ 
        duration: 0.7,
        delay: index * 0.15,
        ease: [0.22, 1, 0.36, 1]
      }}
      style={{
        rotateX: plan.highlighted ? 0 : rotateX,
        rotateY: plan.highlighted ? 0 : rotateY,
        transformStyle: "preserve-3d",
        perspective: "1000px",
      }}
      onMouseMove={handleMouseMove}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={handleMouseLeave}
    >
      <Card 
        className={`relative overflow-hidden transition-all duration-500 h-full group ${
          plan.highlighted 
            ? 'bg-gradient-to-br from-card to-card/50 border-primary shadow-2xl shadow-primary/20' 
            : 'bg-card/30 backdrop-blur-sm border-border/50 hover:border-primary/50'
        }`}
        style={{
          transformStyle: "preserve-3d",
        }}
      >
        {/* Animated top border for highlighted plan */}
        {plan.highlighted && (
          <motion.div 
            className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-primary via-secondary to-primary"
            animate={{
              backgroundPosition: ['0% 50%', '100% 50%', '0% 50%']
            }}
            transition={{
              duration: 3,
              repeat: Infinity,
              ease: "linear"
            }}
            style={{
              backgroundSize: '200% 100%'
            }}
          />
        )}

        {/* Pulsing glow for highlighted plan */}
        {plan.highlighted && (
          <motion.div
            className="absolute inset-0 bg-gradient-to-br from-primary/10 to-secondary/10 opacity-0"
            animate={{ opacity: [0, 0.3, 0] }}
            transition={{
              duration: 3,
              repeat: Infinity,
              ease: "easeInOut"
            }}
          />
        )}

        {/* Corner accent */}
        <motion.div
          className="absolute top-0 right-0 w-32 h-32 opacity-0 group-hover:opacity-100"
          style={{
            background: `radial-gradient(circle at top right, ${plan.color}20, transparent)`,
          }}
          animate={isHovered ? { scale: [1, 1.3, 1], rotate: [0, 90, 0] } : {}}
          transition={{ duration: 3, repeat: Infinity }}
        />

        {/* Shimmer effect */}
        <motion.div
          className="absolute inset-0 bg-gradient-to-r from-transparent via-primary/10 to-transparent"
          initial={{ x: '-100%' }}
          animate={isHovered ? { x: '100%' } : { x: '-100%' }}
          transition={{ duration: 1.2, ease: "easeInOut" }}
        />
        
        <CardHeader className="p-6 space-y-4 relative z-10" style={{ transform: "translateZ(30px)" }}>
          {/* Plan icon */}
          <motion.div
            className="relative w-fit"
            animate={isHovered ? {
              scale: [1, 1.1, 1],
              rotate: [0, 5, 0],
            } : {}}
            transition={{ duration: 2, repeat: Infinity }}
          >
            <motion.div
              className={`absolute inset-0 bg-gradient-to-br ${plan.gradient} blur-xl`}
              animate={{
                scale: [1, 1.4, 1],
                opacity: [0.3, 0.6, 0.3],
              }}
              transition={{ duration: 2, repeat: Infinity }}
            />
            <div className={`relative p-3 rounded-lg bg-gradient-to-br ${plan.gradient} backdrop-blur-sm border border-primary/20`}>
              <plan.icon 
                className="h-6 w-6 text-primary"
                style={{
                  filter: `drop-shadow(0 0 8px ${plan.color}80)`,
                }}
              />
            </div>
          </motion.div>

          {plan.highlighted && (
            <motion.div 
              className="inline-block self-start"
              animate={{ 
                scale: [1, 1.05, 1],
              }}
              transition={{
                duration: 2,
                repeat: Infinity,
                ease: "easeInOut"
              }}
            >
              <span className="px-3 py-1 rounded-full bg-gradient-to-r from-primary/20 to-secondary/20 border border-primary/30 text-xs uppercase tracking-wider text-primary">
                Most Popular
              </span>
            </motion.div>
          )}
          
          <div className="space-y-2">
            <h3 className="text-2xl uppercase tracking-wide">
              {plan.name}
            </h3>
            <p className="text-sm text-muted-foreground">
              {plan.description}
            </p>
          </div>

          {/* Price with depth */}
          <motion.div 
            className="flex items-baseline gap-1"
            style={{ transform: "translateZ(40px)" }}
          >
            <motion.span 
              className="text-4xl md:text-5xl bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent"
              animate={isHovered ? { scale: 1.05 } : {}}
              transition={{ type: "spring", stiffness: 300 }}
            >
              {plan.price}
            </motion.span>
            {plan.period && (
              <span className="text-muted-foreground">
                {plan.period}
              </span>
            )}
          </motion.div>

          {/* Floating particles around price */}
          {isHovered && plan.highlighted && (
            <>
              {[...Array(6)].map((_, i) => (
                <motion.div
                  key={i}
                  className="absolute w-1 h-1 rounded-full"
                  style={{
                    background: plan.color,
                    left: "50%",
                    top: "60%",
                  }}
                  animate={{
                    x: [0, (Math.cos((i * 60 * Math.PI) / 180) * 60)],
                    y: [0, (Math.sin((i * 60 * Math.PI) / 180) * 60)],
                    opacity: [0, 1, 0],
                    scale: [0, 1.5, 0],
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
        </CardHeader>

        <CardContent className="p-6 space-y-6 relative z-10" style={{ transform: "translateZ(25px)" }}>
          <ul className="space-y-3">
            {plan.features.map((feature, featureIndex) => (
              <motion.li 
                key={featureIndex} 
                className="flex items-start gap-3 group/item"
                initial={{ opacity: 0, x: -20 }}
                animate={isInView ? { opacity: 1, x: 0 } : {}}
                transition={{
                  duration: 0.4,
                  delay: index * 0.1 + featureIndex * 0.05
                }}
              >
                <motion.div 
                  className="mt-0.5 p-0.5 rounded-full bg-gradient-to-br from-primary to-secondary"
                  whileHover={{ 
                    scale: 1.2, 
                    rotate: 180,
                    boxShadow: `0 0 20px ${plan.color}80`,
                  }}
                  transition={{ type: "spring", stiffness: 300 }}
                >
                  <Check className="h-4 w-4 text-primary-foreground" />
                </motion.div>
                <span className="text-sm text-muted-foreground flex-1 group-hover/item:text-foreground transition-colors">
                  {feature}
                </span>
              </motion.li>
            ))}
          </ul>

          {/* CTA Button with depth */}
          <motion.div
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            style={{ transform: "translateZ(35px)" }}
          >
            <Button 
              className={`w-full group relative overflow-hidden ${
                plan.highlighted
                  ? 'bg-gradient-to-r from-primary to-secondary hover:opacity-90 text-primary-foreground'
                  : 'bg-card hover:bg-primary/10 border border-primary/50'
              }`}
              size="lg"
              asChild
            >
              <a href={plan.cta === "Contact Sales" ? "/contact" : "/sign-up"}>
                {/* Hover shimmer */}
                {plan.highlighted && (
                  <motion.div
                    className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent"
                    initial={{ x: '-100%' }}
                    whileHover={{ x: '100%' }}
                    transition={{ duration: 0.6 }}
                  />
                )}
                
                <span className="relative z-10 flex items-center justify-center">
                  {plan.cta}
                  <motion.div
                    animate={{ x: [0, 4, 0] }}
                    transition={{ duration: 1.5, repeat: Infinity }}
                  >
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </motion.div>
                </span>

                {/* Glow effect */}
                <motion.div
                  className="absolute inset-0 opacity-0 group-hover:opacity-100"
                  style={{
                    background: plan.highlighted 
                      ? 'radial-gradient(circle at center, rgba(255,255,255,0.2), transparent)' 
                      : `radial-gradient(circle at center, ${plan.color}20, transparent)`,
                  }}
                  transition={{ duration: 0.3 }}
                />
              </a>
            </Button>
          </motion.div>
        </CardContent>

        {/* Bottom glow line */}
        <motion.div
          className="absolute bottom-0 left-0 right-0 h-0.5 bg-gradient-to-r from-transparent via-primary to-transparent opacity-0 group-hover:opacity-100"
          transition={{ duration: 0.3 }}
        />

        {/* 3D depth indicator lines */}
        {!plan.highlighted && (
          <>
            <motion.div
              className="absolute top-1/4 left-0 w-full h-px bg-gradient-to-r from-transparent via-primary/10 to-transparent opacity-0"
              animate={isHovered ? { opacity: 1 } : { opacity: 0 }}
              transition={{ duration: 0.3 }}
            />
            <motion.div
              className="absolute top-1/2 left-0 w-full h-px bg-gradient-to-r from-transparent via-secondary/10 to-transparent opacity-0"
              animate={isHovered ? { opacity: 1 } : { opacity: 0 }}
              transition={{ duration: 0.3, delay: 0.1 }}
            />
            <motion.div
              className="absolute top-3/4 left-0 w-full h-px bg-gradient-to-r from-transparent via-primary/10 to-transparent opacity-0"
              animate={isHovered ? { opacity: 1 } : { opacity: 0 }}
              transition={{ duration: 0.3, delay: 0.2 }}
            />
          </>
        )}
      </Card>
    </motion.div>
  );
}