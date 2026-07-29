"use client";

import { useRef } from "react";
import { useInView, type Variant } from "framer-motion";
import { useReducedMotion } from "./useReducedMotion";

/**
 * The motion vocabulary shared across the invite. Sections pick different
 * entrances so a long scroll never repeats the same gesture twice in a row.
 */
export type RevealVariant =
  | "rise"
  | "mask"
  | "scale"
  | "tilt"
  | "drift"
  | "unfold";

type Ease = [number, number, number, number];

const EASE_SOFT: Ease = [0.25, 0.1, 0.25, 1];
const EASE_EXPO: Ease = [0.16, 1, 0.3, 1];
const EASE_OVERSHOOT: Ease = [0.34, 1.2, 0.64, 1];

interface UseRevealOptions {
  variant?: RevealVariant;
  y?: number;
  blur?: number;
  duration?: number;
  delay?: number;
  once?: boolean;
}

export function revealVariants(
  variant: RevealVariant,
  y: number,
  blur: number,
): { hidden: Variant; visible: Variant; duration: number; ease: Ease } {
  switch (variant) {
    case "mask":
      return {
        hidden: { opacity: 0, clipPath: "inset(0% 0% 100% 0%)", y: y * 0.4 },
        visible: { opacity: 1, clipPath: "inset(0% 0% 0% 0%)", y: 0 },
        duration: 0.9,
        ease: EASE_EXPO,
      };
    case "scale":
      return {
        hidden: { opacity: 0, scale: 1.08, filter: `blur(${blur}px)` },
        visible: { opacity: 1, scale: 1, filter: "blur(0px)" },
        duration: 1,
        ease: EASE_EXPO,
      };
    case "tilt":
      return {
        hidden: { opacity: 0, y, rotate: -2 },
        visible: { opacity: 1, y: 0, rotate: 0 },
        duration: 0.7,
        ease: EASE_OVERSHOOT,
      };
    case "drift":
      return {
        hidden: { opacity: 0, x: -28, filter: `blur(${blur}px)` },
        visible: { opacity: 1, x: 0, filter: "blur(0px)" },
        duration: 0.75,
        ease: EASE_EXPO,
      };
    case "unfold":
      return {
        hidden: {
          opacity: 0,
          rotateX: -22,
          y: y * 0.5,
          transformPerspective: 900,
        },
        visible: { opacity: 1, rotateX: 0, y: 0, transformPerspective: 900 },
        duration: 0.8,
        ease: EASE_EXPO,
      };
    case "rise":
    default:
      return {
        hidden: { opacity: 0, y, filter: `blur(${blur}px)` },
        visible: { opacity: 1, y: 0, filter: "blur(0px)" },
        duration: 0.8,
        ease: EASE_SOFT,
      };
  }
}

export function useReveal(opts: UseRevealOptions = {}) {
  const {
    variant = "rise",
    y = 30,
    blur = 4,
    duration,
    delay = 0,
    once = true,
  } = opts;
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once, margin: "-60px 0px" });
  const reduced = useReducedMotion();

  const spec = revealVariants(variant, y, blur);

  const hidden: Variant = reduced ? { opacity: 0 } : spec.hidden;
  const visible: Variant = reduced ? { opacity: 1 } : spec.visible;

  return {
    ref,
    animate: isInView ? "visible" : "hidden",
    initial: "hidden",
    variants: { hidden, visible },
    transition: {
      duration: reduced ? 0.3 : (duration ?? spec.duration),
      delay,
      ease: spec.ease,
    },
  };
}
