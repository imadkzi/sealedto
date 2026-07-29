"use client";

import { SectionSpacing, SectionTitle, AnimatedReveal, Divider } from "../core";
import type { Invitation } from "../types";
import styles from "./sections.module.scss";

interface Props {
  invitation: Invitation;
  layout?: "default" | "split";
}

export function StorySection({ invitation, layout = "default" }: Props) {
  if (!invitation.story && !invitation.message) return null;

  return (
    <SectionSpacing id="story">
      <div className={layout === "split" ? styles.storySplit : styles.story}>
        <div>
          <SectionTitle>Our Story</SectionTitle>
          <Divider variant="leaf" />
        </div>
        <AnimatedReveal delay={0.15}>
          <p className={styles.storyBody}>
            {invitation.story ?? invitation.message}
          </p>
        </AnimatedReveal>
      </div>
    </SectionSpacing>
  );
}
