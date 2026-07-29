"use client";

import { createContext, useContext, useMemo } from "react";
import type { InviteTheme, ColourTokens, InvitationFonts } from "../types";

const ThemeCtx = createContext<InviteTheme | null>(null);

export function useInviteTheme() {
  const ctx = useContext(ThemeCtx);
  if (!ctx) throw new Error("useInviteTheme must be inside InviteThemeProvider");
  return ctx;
}

function tokenVars(t: ColourTokens, fonts?: InvitationFonts): React.CSSProperties {
  return {
    "--invite-bg": t.background,
    "--invite-surface": t.surface,
    "--invite-ink": t.ink,
    "--invite-muted": t.muted,
    "--invite-accent": t.accent,
    "--invite-button-bg": t.buttonBg,
    "--invite-button-text": t.buttonText,
    "--invite-border": t.border,
    "--invite-line": t.line,
    "--invite-decor": t.decor,
    "--invite-overlay": t.overlay,
    "--invite-hover": t.hover,
    "--invite-font-display": fonts?.display ?? "var(--font-display)",
    "--invite-font-body": fonts?.body ?? "var(--font-body)",
  } as React.CSSProperties;
}

interface Props {
  theme: InviteTheme;
  children: React.ReactNode;
}

export function InviteThemeProvider({ theme, children }: Props) {
  const style = useMemo(
    () => tokenVars(theme.tokens, theme.fonts),
    [theme],
  );

  return (
    <ThemeCtx.Provider value={theme}>
      <div style={style}>{children}</div>
    </ThemeCtx.Provider>
  );
}
