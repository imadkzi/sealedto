"use client";

import { useRef } from "react";
import { useInView, type Variant } from "framer-motion";
import { useReducedMotion } from "./useReducedMotion";

interface UseRevealOptions {
  y?: number;
  blur?: number;
  duration?: number;
  delay?: number;
  once?: boolean;
}

export function useReveal(opts: UseRevealOptions = {}) {
  const { y = 30, blur = 4, duration = 0.8, delay = 0, once = true } = opts;
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once, margin: "-60px 0px" });
  const reduced = useReducedMotion();

  const hidden: Variant = reduced
    ? { opacity: 0 }
    : { opacity: 0, y, filter: `blur(${blur}px)` };

  const visible: Variant = reduced
    ? { opacity: 1 }
    : { opacity: 1, y: 0, filter: "blur(0px)" };

  return {
    ref,
    animate: isInView ? "visible" : "hidden",
    initial: "hidden",
    variants: { hidden, visible },
    transition: { duration: reduced ? 0.3 : duration, delay, ease: [0.25, 0.1, 0.25, 1] as [number, number, number, number] },
  };
}
