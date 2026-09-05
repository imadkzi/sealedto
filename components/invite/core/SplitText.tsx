"use client";

import { useRef } from "react";
import { motion, useInView, type Variants } from "framer-motion";
import { useReducedMotion } from "../hooks";
import styles from "./SplitText.module.scss";

interface Props {
  text: string;
  /** Letters read as typeset stationery; words suit longer prose. */
  by?: "char" | "word";
  className?: string;
  delay?: number;
  stagger?: number;
  as?: "span" | "div";
}

const EASE: [number, number, number, number] = [0.16, 1, 0.3, 1];

export function SplitText({
  text,
  by = "word",
  className,
  delay = 0,
  stagger,
  as = "span",
}: Props) {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: "-60px 0px" });
  const reduced = useReducedMotion();

  const step = stagger ?? (by === "char" ? 0.035 : 0.07);

  const container: Variants = {
    hidden: {},
    visible: {
      transition: { delayChildren: delay, staggerChildren: reduced ? 0 : step },
    },
  };

  const piece: Variants = {
    hidden: reduced
      ? { opacity: 0 }
      : { opacity: 0, y: "0.5em", rotate: by === "char" ? -6 : -2 },
    visible: {
      opacity: 1,
      y: "0em",
      rotate: 0,
      transition: { duration: reduced ? 0.2 : 0.7, ease: EASE },
    },
  };

  const Tag = as === "div" ? motion.div : motion.span;
  const words = text.split(" ");

  return (
    <Tag
      ref={ref}
      className={`${styles.root} ${className ?? ""}`}
      variants={container}
      initial="hidden"
      animate={inView ? "visible" : "hidden"}
      aria-label={text}
    >
      {words.map((word, wi) => (
        <span key={`${word}-${wi}`} className={styles.word} aria-hidden>
          {by === "char" ? (
            Array.from(word).map((ch, ci) => (
              <motion.span
                key={`${ch}-${ci}`}
                className={styles.piece}
                variants={piece}
              >
                {ch}
              </motion.span>
            ))
          ) : (
            <motion.span className={styles.piece} variants={piece}>
              {word}
            </motion.span>
          )}
          {wi < words.length - 1 ? " " : null}
        </span>
      ))}
    </Tag>
  );
}
