"use client";

import { SectionSpacing, AnimatedReveal } from "../core";
import type { Invitation } from "../types";
import styles from "./sections.module.scss";

interface Props {
  invitation: Invitation;
}

export function QuoteSection({ invitation }: Props) {
  const q = invitation.quote ?? invitation.quranVerse;
  if (!q) return null;

  return (
    <SectionSpacing id="quote">
      <div className={styles.quote}>
        <AnimatedReveal>
          <p className={styles.quoteText}>&ldquo;{q.text}&rdquo;</p>
        </AnimatedReveal>
        {q.attribution && (
          <AnimatedReveal delay={0.15}>
            <p className={styles.quoteAttrib}>&mdash; {q.attribution}</p>
          </AnimatedReveal>
        )}
      </div>
    </SectionSpacing>
  );
}
