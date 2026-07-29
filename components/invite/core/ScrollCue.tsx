"use client";

import { motion, useScroll, useTransform } from "framer-motion";
import { useReducedMotion } from "../hooks";
import styles from "./ScrollCue.module.scss";

interface Props {
  label?: string;
  /** Delay before the cue appears, in seconds. Lets the hero settle first. */
  delay?: number;
}

export function ScrollCue({ label = "Scroll", delay = 1.4 }: Props) {
  const reduced = useReducedMotion();
  const { scrollY } = useScroll();

  // Fade the cue out as soon as the guest starts scrolling.
  const opacity = useTransform(scrollY, [0, 140], [1, 0]);

  return (
    <motion.div
      className={styles.cue}
      style={{ opacity }}
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay, duration: 0.8, ease: [0.25, 0.1, 0.25, 1] }}
    >
      <span className={styles.label}>{label}</span>
      <span className={styles.track}>
        <motion.span
          className={styles.dot}
          animate={reduced ? undefined : { y: [0, 26, 26], opacity: [0, 1, 0] }}
          transition={
            reduced
              ? undefined
              : { duration: 2.2, repeat: Infinity, ease: "easeInOut" }
          }
        />
      </span>
    </motion.div>
  );
}
