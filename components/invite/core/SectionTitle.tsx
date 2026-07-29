"use client";

import { AnimatedReveal } from "./AnimatedReveal";
import { SplitText } from "./SplitText";

interface Props {
  children: React.ReactNode;
  className?: string;
}

export function SectionTitle({ children, className }: Props) {
  const heading = (
    <h2
      className={`text-[clamp(1.75rem,4.5vw,3rem)] font-light leading-[1.1] tracking-[-0.015em] text-center ${className ?? ""}`}
      style={{
        fontFamily:
          "var(--invite-font-display, var(--font-display)), Georgia, serif",
      }}
    >
      {typeof children === "string" ? (
        <SplitText text={children} by="word" />
      ) : (
        children
      )}
    </h2>
  );

  // Split headings animate their own words; anything else still needs a reveal.
  return typeof children === "string" ? (
    heading
  ) : (
    <AnimatedReveal>{heading}</AnimatedReveal>
  );
}
