"use client";

import { SectionSpacing, SectionTitle, AnimatedReveal, Divider } from "../core";
import type { Invitation } from "../types";
import styles from "./sections.module.scss";

interface Props {
  invitation: Invitation;
  layout?: "default" | "split" | "gallery";
}

export function StorySection({ invitation, layout = "default" }: Props) {
  if (!invitation.story && !invitation.message) return null;

  if (layout === "gallery") {
    return (
      <SectionSpacing id="story" tone="stone">
        <SectionTitle>Our Story</SectionTitle>
        <Divider variant="wave" />
        <div className={styles.storyGallery}>
          <AnimatedReveal variant="mask" delay={0.12}>
            <p className={styles.storyGalleryBody}>
              {invitation.story ?? invitation.message}
            </p>
          </AnimatedReveal>
        </div>
      </SectionSpacing>
    );
  }

  return (
    <SectionSpacing id="story">
      <div className={layout === "split" ? styles.storySplit : styles.story}>
        <div>
          <SectionTitle align={layout === "split" ? "left" : "center"}>
            Our Story
          </SectionTitle>
          <Divider
            variant="leaf"
            align={layout === "split" ? "left" : "center"}
          />
        </div>
        <AnimatedReveal variant="mask" delay={0.15}>
          <p className={styles.storyBody}>
            {invitation.story ?? invitation.message}
          </p>
        </AnimatedReveal>
      </div>
    </SectionSpacing>
  );
}
