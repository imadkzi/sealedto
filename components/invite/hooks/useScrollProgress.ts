"use client";

import { useScroll, type MotionValue } from "framer-motion";

export function useScrollProgress(): MotionValue<number> {
  const { scrollYProgress } = useScroll();
  return scrollYProgress;
}
