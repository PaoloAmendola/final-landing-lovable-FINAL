import { motion } from "framer-motion";
import { useScrollAnimation } from "@/hooks/use-scroll-animation";
import { cn } from "@/lib/utils";

interface AnimatedSectionProps {
  children: React.ReactNode;
  className?: string;
  animation?: "fade" | "slide-up" | "slide-left" | "slide-right" | "scale" | "stagger";
  delay?: number;
  duration?: number;
}

const animationVariants = {
  fade: {
    hidden: { opacity: 0 },
    visible: { opacity: 1 }
  },
  "slide-up": {
    hidden: { opacity: 0, y: 60 },
    visible: { opacity: 1, y: 0 }
  },
  "slide-left": {
    hidden: { opacity: 0, x: 60 },
    visible: { opacity: 1, x: 0 }
  },
  "slide-right": {
    hidden: { opacity: 0, x: -60 },
    visible: { opacity: 1, x: 0 }
  },
  scale: {
    hidden: { opacity: 0, scale: 0.9 },
    visible: { opacity: 1, scale: 1 }
  },
  stagger: {
    hidden: { opacity: 0, y: 30 },
    visible: { opacity: 1, y: 0 }
  }
};

const AnimatedSection = ({ 
  children, 
  className, 
  animation = "slide-up",
  delay = 0,
  duration = 0.6
}: AnimatedSectionProps) => {
  const { ref, isInView } = useScrollAnimation();

  return (
    <motion.div
      ref={ref}
      initial="hidden"
      animate={isInView ? "visible" : "hidden"}
      variants={animationVariants[animation]}
      transition={{
        duration,
        delay,
        ease: [0.4, 0, 0.2, 1]
      }}
      className={cn(className)}
    >
      {children}
    </motion.div>
  );
};

export { AnimatedSection };