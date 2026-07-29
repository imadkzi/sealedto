"use client";

import { AnimatedReveal } from "./AnimatedReveal";

interface Props {
  children: React.ReactNode;
  className?: string;
}

export function SectionTitle({ children, className }: Props) {
  return (
    <AnimatedReveal>
      <h2
        className={`text-[clamp(1.75rem,4.5vw,3rem)] font-light leading-[1.1] tracking-[-0.015em] text-center ${className ?? ""}`}
        style={{
          fontFamily:
            "var(--invite-font-display, var(--font-display)), sans-serif",
        }}
      >
        {children}
      </h2>
    </AnimatedReveal>
  );
}
