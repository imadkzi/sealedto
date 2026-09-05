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
      className={`relative px-[clamp(24px,5vw,64px)] py-[clamp(40px,6vh,76px)] ${className ?? ""}`}
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
