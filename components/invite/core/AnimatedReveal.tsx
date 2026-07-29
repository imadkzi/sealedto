"use client";

import { motion } from "framer-motion";
import { useReveal } from "../hooks";

interface Props {
  children: React.ReactNode;
  className?: string;
  delay?: number;
  y?: number;
}

export function AnimatedReveal({ children, className, delay = 0, y }: Props) {
  const { ref, ...motionProps } = useReveal({ delay, y });

  return (
    <motion.div ref={ref} className={className} {...motionProps}>
      {children}
    </motion.div>
  );
}
