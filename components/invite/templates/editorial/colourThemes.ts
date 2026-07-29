import type { ColourThemeDefinition, ColourTokens } from "../../types";

function theme(id: string, name: string, tokens: ColourTokens): ColourThemeDefinition {
  return { id, name, tokens };
}

export const ivory = theme("ivory", "Ivory", {
  background: "#F8F5F1",
  surface: "#FFFFFF",
  ink: "#222222",
  muted: "#777777",
  accent: "#B79B7A",
  buttonBg: "#B79B7A",
  buttonText: "#FFFFFF",
  border: "rgba(28, 23, 20, 0.10)",
  line: "rgba(28, 23, 20, 0.08)",
  decor: "#B79B7A",
  overlay: "rgba(248, 245, 241, 0.85)",
  hover: "rgba(183, 155, 122, 0.10)",
});

export const charcoal = theme("charcoal", "Charcoal", {
  background: "#1C1C1C",
  surface: "#2A2A2A",
  ink: "#F0EDE8",
  muted: "#A8A39E",
  accent: "#C9A96E",
  buttonBg: "#C9A96E",
  buttonText: "#1C1C1C",
  border: "rgba(240, 237, 232, 0.12)",
  line: "rgba(240, 237, 232, 0.1)",
  decor: "#C9A96E",
  overlay: "rgba(28, 28, 28, 0.88)",
  hover: "rgba(201, 169, 110, 0.14)",
});

export const sage = theme("sage", "Sage", {
  background: "#EFF2ED",
  surface: "#FAFBF9",
  ink: "#2C3027",
  muted: "#6B7265",
  accent: "#7D8B6F",
  buttonBg: "#7D8B6F",
  buttonText: "#FFFFFF",
  border: "rgba(44, 48, 39, 0.10)",
  line: "rgba(44, 48, 39, 0.08)",
  decor: "#7D8B6F",
  overlay: "rgba(239, 242, 237, 0.85)",
  hover: "rgba(125, 139, 111, 0.10)",
});

export const blush = theme("blush", "Blush", {
  background: "#FBF2F0",
  surface: "#FFFFFF",
  ink: "#3A2626",
  muted: "#8C7070",
  accent: "#C4857A",
  buttonBg: "#C4857A",
  buttonText: "#FFFFFF",
  border: "rgba(58, 38, 38, 0.10)",
  line: "rgba(58, 38, 38, 0.08)",
  decor: "#C4857A",
  overlay: "rgba(251, 242, 240, 0.85)",
  hover: "rgba(196, 133, 122, 0.10)",
});

export const navy = theme("navy", "Navy", {
  background: "#1A2030",
  surface: "#232A3A",
  ink: "#E8E4DF",
  muted: "#A3A4AD",
  accent: "#B8A06E",
  buttonBg: "#B8A06E",
  buttonText: "#12161F",
  border: "rgba(232, 228, 223, 0.12)",
  line: "rgba(232, 228, 223, 0.1)",
  decor: "#B8A06E",
  overlay: "rgba(26, 32, 48, 0.88)",
  hover: "rgba(184, 160, 110, 0.14)",
});

export const mocha = theme("mocha", "Mocha", {
  background: "#EDE4DA",
  surface: "#F8F3EE",
  ink: "#2E2420",
  muted: "#7A6C60",
  accent: "#8B6F4E",
  buttonBg: "#8B6F4E",
  buttonText: "#FFFFFF",
  border: "rgba(46, 36, 32, 0.10)",
  line: "rgba(46, 36, 32, 0.08)",
  decor: "#8B6F4E",
  overlay: "rgba(237, 228, 218, 0.85)",
  hover: "rgba(139, 111, 78, 0.10)",
});

export const black = theme("black", "Black", {
  background: "#0A0A0A",
  surface: "#171717",
  ink: "#EDEBE8",
  muted: "#A09E98",
  accent: "#D4C5A9",
  buttonBg: "#D4C5A9",
  buttonText: "#0A0A0A",
  border: "rgba(237, 235, 232, 0.12)",
  line: "rgba(237, 235, 232, 0.08)",
  decor: "#D4C5A9",
  overlay: "rgba(10, 10, 10, 0.90)",
  hover: "rgba(212, 197, 169, 0.12)",
});

export const editorialColourThemes: ColourThemeDefinition[] = [
  ivory,
  charcoal,
  sage,
  blush,
  navy,
  mocha,
  black,
];
