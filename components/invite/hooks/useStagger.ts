"use client";

import type { Variants } from "framer-motion";
import { useReducedMotion } from "./useReducedMotion";
import { revealVariants, type RevealVariant } from "./useReveal";

interface UseStaggerOptions {
  variant?: RevealVariant;
  stagger?: number;
  y?: number;
  blur?: number;
  duration?: number;
  /** Run the sequence back to front. */
  reverse?: boolean;
}

export function useStagger(opts: UseStaggerOptions = {}): {
  container: Variants;
  item: Variants;
} {
  const {
    variant = "rise",
    stagger = 0.1,
    y = 20,
    blur = 4,
    duration,
    reverse = false,
  } = opts;
  const reduced = useReducedMotion();
  const spec = revealVariants(variant, y, blur);

  const container: Variants = {
    hidden: {},
    visible: {
      transition: {
        staggerChildren: reduced ? 0 : stagger,
        staggerDirection: reverse ? -1 : 1,
      },
    },
  };

  const item: Variants = {
    hidden: reduced ? { opacity: 0 } : spec.hidden,
    visible: {
      ...(reduced ? { opacity: 1 } : spec.visible),
      transition: {
        duration: reduced ? 0.2 : (duration ?? spec.duration),
        ease: spec.ease,
      },
    },
  };

  return { container, item };
}
