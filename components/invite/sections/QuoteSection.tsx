"use client";

import { SectionSpacing, AnimatedReveal, SplitText } from "../core";
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
        <p className={styles.quoteText}>
          <SplitText text={`\u201C${q.text}\u201D`} by="word" stagger={0.05} />
        </p>
        {q.attribution && (
          <AnimatedReveal variant="drift" delay={0.15}>
            <p className={styles.quoteAttrib}>&mdash; {q.attribution}</p>
          </AnimatedReveal>
        )}
      </div>
    </SectionSpacing>
  );
}
