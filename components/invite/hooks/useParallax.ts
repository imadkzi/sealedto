"use client";

import { useRef } from "react";
import { useScroll, useTransform, type MotionValue } from "framer-motion";
import { useReducedMotion } from "./useReducedMotion";

interface UseParallaxOptions {
  speed?: number;
  offset?: [string, string];
}

export function useParallax(opts: UseParallaxOptions = {}): {
  ref: React.RefObject<HTMLDivElement | null>;
  y: MotionValue<number>;
} {
  const { speed = 0.15, offset } = opts;
  const ref = useRef<HTMLDivElement>(null);
  const reduced = useReducedMotion();

  const { scrollYProgress } = useScroll({
    target: ref,
    offset: (offset as ["start end", "end start"]) ?? ["start end", "end start"],
  });

  const y = useTransform(scrollYProgress, [0, 1], reduced ? [0, 0] : [-80 * speed, 80 * speed]);

  return { ref, y };
}
