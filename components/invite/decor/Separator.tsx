"use client";

import { useRef } from "react";
import { motion, useInView, type Variants } from "framer-motion";
import { useReducedMotion } from "../hooks";
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
  align?: "center" | "left";
}

/** Strokes ink themselves in; dots and glyphs pop after the rules land. */
const draw: Variants = {
  hidden: { pathLength: 0, opacity: 0 },
  visible: {
    pathLength: 1,
    opacity: 1,
    transition: {
      pathLength: { duration: 0.8, ease: [0.16, 1, 0.3, 1] },
      opacity: { duration: 0.25 },
    },
  },
};

const pop: Variants = {
  hidden: { scale: 0, opacity: 0 },
  visible: {
    scale: 1,
    opacity: 1,
    transition: { duration: 0.45, ease: [0.34, 1.4, 0.64, 1] },
  },
};

const glyphs: Record<SeparatorVariant, React.ReactNode> = {
  line: <motion.path d="M0 8 H120" variants={draw} />,

  diamond: (
    <>
      <motion.path d="M0 8 H50" variants={draw} />
      <motion.path d="M60 3 L65 8 L60 13 L55 8 Z" variants={pop} />
      <motion.path d="M70 8 H120" variants={draw} />
    </>
  ),

  dots: (
    <>
      <motion.path d="M0 8 H46" variants={draw} />
      <motion.circle cx="54" cy="8" r="1.4" variants={pop} />
      <motion.circle cx="60" cy="8" r="1.4" variants={pop} />
      <motion.circle cx="66" cy="8" r="1.4" variants={pop} />
      <motion.path d="M74 8 H120" variants={draw} />
    </>
  ),

  leaf: (
    <>
      <motion.path d="M0 8 H48" variants={draw} />
      <motion.path
        d="M60 2 C 66 5, 66 11, 60 14 C 54 11, 54 5, 60 2 Z"
        variants={draw}
      />
      <motion.path d="M60 2 V14" variants={draw} />
      <motion.path d="M72 8 H120" variants={draw} />
    </>
  ),

  wave: (
    <motion.path d="M0 8 Q 15 1, 30 8 T 60 8 T 90 8 T 120 8" variants={draw} />
  ),

  ornament: (
    <>
      <motion.path d="M0 8 H40" variants={draw} />
      <motion.path d="M40 8 Q 50 0, 60 8 Q 70 16, 80 8" variants={draw} />
      <motion.path d="M80 8 H120" variants={draw} />
      <motion.circle cx="60" cy="8" r="1.2" variants={pop} />
    </>
  ),
};

export function Separator({
  variant = "line",
  width = 120,
  className,
  align = "center",
}: Props) {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: "-60px 0px" });
  const reduced = useReducedMotion();

  return (
    <div
      ref={ref}
      className={`${styles.separator} ${align === "left" ? styles.separatorLeft : ""} ${className ?? ""}`}
    >
      <motion.svg
        width={width}
        height="16"
        viewBox="0 0 120 16"
        fill="none"
        stroke="currentColor"
        strokeWidth="0.8"
        strokeLinecap="round"
        aria-hidden
        initial={reduced ? "visible" : "hidden"}
        animate={reduced || inView ? "visible" : "hidden"}
        variants={{
          hidden: {},
          visible: { transition: { staggerChildren: 0.08 } },
        }}
      >
        {glyphs[variant]}
      </motion.svg>
    </div>
  );
}
