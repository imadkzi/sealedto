"use client";

import { motion } from "framer-motion";
import { useReveal, type RevealVariant } from "../hooks";

interface Props {
  children: React.ReactNode;
  className?: string;
  delay?: number;
  y?: number;
  variant?: RevealVariant;
}

export function AnimatedReveal({
  children,
  className,
  delay = 0,
  y,
  variant,
}: Props) {
  const { ref, ...motionProps } = useReveal({ delay, y, variant });

  return (
    <motion.div ref={ref} className={className} {...motionProps}>
      {children}
    </motion.div>
  );
}
