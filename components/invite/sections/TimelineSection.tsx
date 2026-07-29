"use client";

import { motion } from "framer-motion";
import { SectionSpacing, SectionTitle, Divider } from "../core";
import { useStagger } from "../hooks";
import type { Invitation } from "../types";
import styles from "./sections.module.scss";

interface Props {
  invitation: Invitation;
}

export function TimelineSection({ invitation }: Props) {
  const { container, item } = useStagger({ variant: "drift", stagger: 0.12 });
  if (invitation.mode === "save_the_date" || !invitation.schedule?.length) {
    return null;
  }

  return (
    <SectionSpacing id="timeline">
      <SectionTitle>The Day</SectionTitle>
      <Divider variant="dots" />
      <motion.div
        className={styles.timeline}
        variants={container}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true }}
      >
        {invitation.schedule.map((entry, i) => (
          <motion.div key={i} className={styles.timelineItem} variants={item}>
            <span className={styles.timelineTime}>{entry.time}</span>
            <div>
              <div className={styles.timelineLabel}>{entry.label}</div>
              {entry.description && (
                <div className={styles.timelineDesc}>{entry.description}</div>
              )}
            </div>
          </motion.div>
        ))}
      </motion.div>
    </SectionSpacing>
  );
}
