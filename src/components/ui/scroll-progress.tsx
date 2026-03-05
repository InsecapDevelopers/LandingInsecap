import { motion, useScroll, useSpring } from "motion/react";
import { cn } from "@/lib/utils";

interface ScrollProgressProps {
  className?: string;
}

export function ScrollProgress({ className }: ScrollProgressProps) {
  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, {
    stiffness: 200,
    damping: 50,
    restDelta: 0.001,
  });

  return (
    <motion.div
      className={cn(
        "absolute bottom-0 left-0 right-0 h-[3px] origin-left",
        className
      )}
      style={{ scaleX }}
    />
  );
}
