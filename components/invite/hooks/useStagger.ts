"use client";

import type { Variants } from "framer-motion";
import { useReducedMotion } from "./useReducedMotion";

interface UseStaggerOptions {
  stagger?: number;
  y?: number;
  duration?: number;
}

export function useStagger(opts: UseStaggerOptions = {}): {
  container: Variants;
  item: Variants;
} {
  const { stagger = 0.1, y = 20, duration = 0.6 } = opts;
  const reduced = useReducedMotion();

  const container: Variants = {
    hidden: {},
    visible: {
      transition: {
        staggerChildren: reduced ? 0 : stagger,
      },
    },
  };

  const item: Variants = {
    hidden: reduced ? { opacity: 0 } : { opacity: 0, y },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: reduced ? 0.2 : duration, ease: [0.25, 0.1, 0.25, 1] },
    },
  };

  return { container, item };
}
