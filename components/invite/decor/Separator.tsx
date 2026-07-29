"use client";

import { motion } from "framer-motion";
import { useReveal } from "../hooks";
import styles from "./decor.module.scss";

export type SeparatorVariant =
  | "line"
  | "diamond"
  | "dots"
  | "leaf"
  | "wave"
  | "ornament";

interface Props {
  variant?: SeparatorVariant;
  width?: number;
  className?: string;
}

const glyphs: Record<SeparatorVariant, React.ReactNode> = {
  line: <path d="M0 8 H120" />,

  diamond: (
    <>
      <path d="M0 8 H50" />
      <path d="M60 3 L65 8 L60 13 L55 8 Z" />
      <path d="M70 8 H120" />
    </>
  ),

  dots: (
    <>
      <path d="M0 8 H46" />
      <circle cx="54" cy="8" r="1.4" />
      <circle cx="60" cy="8" r="1.4" />
      <circle cx="66" cy="8" r="1.4" />
      <path d="M74 8 H120" />
    </>
  ),

  leaf: (
    <>
      <path d="M0 8 H48" />
      <path d="M60 2 C 66 5, 66 11, 60 14 C 54 11, 54 5, 60 2 Z" />
      <path d="M60 2 V14" />
      <path d="M72 8 H120" />
    </>
  ),

  wave: <path d="M0 8 Q 15 1, 30 8 T 60 8 T 90 8 T 120 8" />,

  ornament: (
    <>
      <path d="M0 8 H40" />
      <path d="M40 8 Q 50 0, 60 8 Q 70 16, 80 8" />
      <path d="M80 8 H120" />
      <circle cx="60" cy="8" r="1.2" />
    </>
  ),
};

export function Separator({ variant = "line", width = 120, className }: Props) {
  const { ref, ...motionProps } = useReveal({ y: 8, blur: 0, duration: 0.7 });

  return (
    <motion.div
      ref={ref}
      className={`${styles.separator} ${className ?? ""}`}
      {...motionProps}
    >
      <svg
        width={width}
        height="16"
        viewBox="0 0 120 16"
        fill="none"
        stroke="currentColor"
        strokeWidth="0.8"
        strokeLinecap="round"
        aria-hidden
      >
        {glyphs[variant]}
      </svg>
    </motion.div>
  );
}
