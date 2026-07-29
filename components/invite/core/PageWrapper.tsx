"use client";

interface Props {
  children: React.ReactNode;
  className?: string;
}

export function PageWrapper({ children, className }: Props) {
  return (
    <main
      className={`min-h-screen w-full overflow-x-hidden ${className ?? ""}`}
      style={{
        background: "var(--invite-bg)",
        color: "var(--invite-ink)",
        fontFamily: "var(--invite-font-body, var(--font-body)), sans-serif",
      }}
    >
      {children}
    </main>
  );
}
