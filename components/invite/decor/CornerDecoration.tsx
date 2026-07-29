import styles from "./decor.module.scss";

export type CornerVariant = "rule" | "bracket" | "floral";

interface Props {
  variant?: CornerVariant;
  size?: number;
  inset?: number;
  className?: string;
}

const glyphs: Record<CornerVariant, React.ReactNode> = {
  rule: <path d="M0 0 H44 M0 0 V44" />,

  bracket: (
    <>
      <path d="M0 14 V0 H14" />
      <path d="M0 26 V0 H26" opacity="0.4" />
    </>
  ),

  floral: (
    <>
      <path d="M0 0 H30 M0 0 V30" />
      <path d="M30 0 C 38 0, 44 6, 44 14" />
      <path d="M0 30 C 0 38, 6 44, 14 44" />
      <circle cx="44" cy="14" r="1.4" />
      <circle cx="14" cy="44" r="1.4" />
    </>
  ),
};

/** Renders the four framing corners of a section. */
export function CornerDecoration({
  variant = "rule",
  size = 44,
  inset = 24,
  className,
}: Props) {
  const corners = [
    { key: "tl", style: { top: inset, left: inset } },
    { key: "tr", style: { top: inset, right: inset, transform: "scaleX(-1)" } },
    { key: "bl", style: { bottom: inset, left: inset, transform: "scaleY(-1)" } },
    {
      key: "br",
      style: { bottom: inset, right: inset, transform: "scale(-1, -1)" },
    },
  ];

  return (
    <div aria-hidden className={`${styles.corners} ${className ?? ""}`}>
      {corners.map((c) => (
        <svg
          key={c.key}
          className={styles.corner}
          style={c.style}
          width={size}
          height={size}
          viewBox="0 0 44 44"
          fill="none"
          stroke="currentColor"
          strokeWidth="0.8"
          strokeLinecap="round"
        >
          {glyphs[variant]}
        </svg>
      ))}
    </div>
  );
}
