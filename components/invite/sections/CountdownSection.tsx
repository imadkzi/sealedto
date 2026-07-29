"use client";

import { useState, useEffect } from "react";
import { AnimatePresence, motion } from "framer-motion";
import {
  SectionSpacing,
  SectionTitle,
  AnimatedReveal,
  Divider,
} from "../core";
import { useReducedMotion, useStagger } from "../hooks";
import type { Invitation } from "../types";
import styles from "./sections.module.scss";

interface Props {
  invitation: Invitation;
}

function calcUnits(target: Date) {
  const diff = target.getTime() - Date.now();
  if (diff <= 0) return { days: 0, hours: 0, minutes: 0, seconds: 0 };
  return {
    days: Math.floor(diff / 86400000),
    hours: Math.floor((diff % 86400000) / 3600000),
    minutes: Math.floor((diff % 3600000) / 60000),
    seconds: Math.floor((diff % 60000) / 1000),
  };
}

const EMPTY = { days: 0, hours: 0, minutes: 0, seconds: 0 };

export function CountdownSection({ invitation }: Props) {
  // Start empty so SSR and first client paint match; tick after mount.
  const [units, setUnits] = useState(EMPTY);
  const reduced = useReducedMotion();
  const { container, item } = useStagger({ variant: "tilt", stagger: 0.12 });

  useEffect(() => {
    const initialTick = window.setTimeout(
      () => setUnits(calcUnits(invitation.weddingDate)),
      0,
    );
    const id = setInterval(() => setUnits(calcUnits(invitation.weddingDate)), 1000);
    return () => {
      window.clearTimeout(initialTick);
      clearInterval(id);
    };
  }, [invitation.weddingDate]);

  const weddingDate = new Intl.DateTimeFormat("en-GB", {
    weekday: "long",
    day: "numeric",
    month: "long",
    year: "numeric",
  }).format(invitation.weddingDate);

  return (
    <SectionSpacing id="countdown" tone="stone">
      <SectionTitle>Countdown</SectionTitle>
      <Divider variant="dots" />
      <AnimatedReveal>
        <motion.div
          className={styles.countdown}
          variants={container}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
        >
          {(["days", "hours", "minutes", "seconds"] as const).map((key) => (
            <motion.div key={key} className={styles.countdownUnit} variants={item}>
              <span className={styles.countdownRoll}>
                <AnimatePresence initial={false} mode="popLayout">
                  <motion.span
                    key={units[key]}
                    className={styles.countdownNumber}
                    initial={reduced ? { opacity: 0 } : { y: "70%", opacity: 0 }}
                    animate={{ y: "0%", opacity: 1 }}
                    exit={reduced ? { opacity: 0 } : { y: "-70%", opacity: 0 }}
                    transition={{ duration: 0.45, ease: [0.16, 1, 0.3, 1] }}
                  >
                    {units[key]}
                  </motion.span>
                </AnimatePresence>
              </span>
              <span className={styles.countdownLabel}>{key}</span>
            </motion.div>
          ))}
        </motion.div>
      </AnimatedReveal>
      <AnimatedReveal delay={0.2}>
        <p className={styles.countdownDate}>{weddingDate}</p>
      </AnimatedReveal>
    </SectionSpacing>
  );
}
