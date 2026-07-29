"use client";

import { motion } from "framer-motion";
import { useParallax } from "../hooks";

interface Props {
  children: React.ReactNode;
  className?: string;
  speed?: number;
}

export function ParallaxContainer({ children, className, speed = 0.15 }: Props) {
  const { ref, y } = useParallax({ speed });

  return (
    <div ref={ref} className={className}>
      <motion.div style={{ y }}>{children}</motion.div>
    </div>
  );
}
