import type { InvitationFonts, VariantDefinition, EditorialVariantId } from "../../types";

export const editorialFonts: InvitationFonts = {
  display: "var(--font-editorial)",
  body: "var(--font-editorial)",
};

export const editorialVariants: VariantDefinition[] = [
  {
    id: "classic",
    name: "Classic",
    description: "Large centred typography. Hero image. Elegant whitespace. Luxury magazine feel.",
  },
  {
    id: "split",
    name: "Split",
    description: "Photography on one side, content on the other. Magazine-style alternating layouts.",
  },
  {
    id: "minimal",
    name: "Minimal",
    description: "Typography-first. Very little imagery. Feels like luxury printed stationery.",
  },
  {
    id: "gallery",
    name: "Gallery",
    description: "Photography-driven. Large immersive images. Minimal typography.",
  },
  {
    id: "fullscreen",
    name: "Fullscreen",
    description: "Each section occupies the viewport. Immersive scrolling. Large photography.",
  },
];

export const DEFAULT_VARIANT_ID: EditorialVariantId = "classic";
export const DEFAULT_COLOUR_THEME_ID = "ivory";
