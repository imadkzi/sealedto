interface Props {
  children: React.ReactNode;
  className?: string;
  id?: string;
  /** Tinted band used to break up long scrolls. */
  tone?: "base" | "stone";
}

export function SectionSpacing({ children, className, id, tone = "base" }: Props) {
  return (
    <section
      id={id}
      className={`relative px-[clamp(1.5rem,5vw,4rem)] py-[clamp(4rem,10vh,8rem)] ${className ?? ""}`}
      style={
        tone === "stone"
          ? {
              background:
                "color-mix(in srgb, var(--invite-ink) 4%, var(--invite-bg))",
            }
          : undefined
      }
    >
      <div className="relative z-[1]">{children}</div>
    </section>
  );
}
