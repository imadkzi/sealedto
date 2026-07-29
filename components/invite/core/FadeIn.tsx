"use client";

import { motion } from "framer-motion";
import { useReveal } from "../hooks";

interface Props {
  children: React.ReactNode;
  className?: string;
  delay?: number;
}

export function FadeIn({ children, className, delay = 0 }: Props) {
  const { ref, ...motionProps } = useReveal({ y: 0, blur: 0, delay });

  return (
    <motion.div ref={ref} className={className} {...motionProps}>
      {children}
    </motion.div>
  );
}
