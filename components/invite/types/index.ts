import type { ComponentType } from "react";

/* ── Invitation data model ── */

export interface InvitationPartner {
  name: string;
}

export interface InvitationVenue {
  name: string;
  address?: string;
  coordinates?: { lat: number; lng: number };
  mapLink?: string;
}

export interface InvitationScheduleItem {
  time: string;
  label: string;
  description?: string;
}

export interface InvitationGalleryImage {
  src: string;
  alt?: string;
}

export interface InvitationQuote {
  text: string;
  attribution?: string;
}

export interface InvitationCustomSection {
  id: string;
  title: string;
  body: string;
}

export interface InvitationFonts {
  display?: string;
  body?: string;
}

/* ── Colour tokens ── */

export interface ColourTokens {
  background: string;
  surface: string;
  ink: string;
  muted: string;
  accent: string;
  buttonBg: string;
  buttonText: string;
  border: string;
  line: string;
  decor: string;
  overlay: string;
  hover: string;
}

/** @deprecated Use ColourTokens. Kept for backward compat inside toInvitation. */
export interface InvitationPalette {
  background: string;
  surface: string;
  ink: string;
  muted: string;
  accent: string;
}

export interface Invitation {
  id: string;
  slug: string;
  templateId: string;
  variantId: string;
  colourThemeId: string;
  mode: "wedding" | "save_the_date";

  bride: InvitationPartner;
  groom: InvitationPartner;
  coupleDisplayName?: string;

  weddingDate: Date;

  venue: InvitationVenue;

  rsvpDeadline?: Date;
  rsvpEnabled: boolean;

  story?: string;
  gallery?: InvitationGalleryImage[];
  schedule?: InvitationScheduleItem[];
  dressCode?: string;

  palette: InvitationPalette;
  fonts?: InvitationFonts;
  accentColor: string;

  heroImage?: string;
  quote?: InvitationQuote;
  quranVerse?: InvitationQuote;

  backgroundMusic?: string;
  customSections?: InvitationCustomSection[];
  message?: string;
  /** Public eyebrow / intro copy. Defaults to “Together with their families”. */
  introLine?: string;
  /** Connector before the names, e.g. “the wedding of”. */
  eventLine?: string;
  registryUrl?: string;
  accommodationNote?: string;

  /** Present on curated personal links. */
  guestName?: string;
  isCuratedGuest?: boolean;
}

/* ── Theme ── */

export interface InviteTheme {
  id: string;
  tokens: ColourTokens;
  fonts?: InvitationFonts;
}

/* ── Section IDs ── */

export type SectionId =
  | "hero"
  | "story"
  | "countdown"
  | "venue"
  | "timeline"
  | "gallery"
  | "rsvp"
  | "quote"
  | "footer";

/* ── Variant + Colour Theme definitions ── */

export type EditorialVariantId =
  | "classic"
  | "split"
  | "minimal"
  | "gallery"
  | "fullscreen";

export interface VariantDefinition {
  id: EditorialVariantId;
  name: string;
  description: string;
}

export interface ColourThemeDefinition {
  id: string;
  name: string;
  tokens: ColourTokens;
}

/* ── Template definition ── */

export interface TemplateProps {
  invitation: Invitation;
  rsvp: RsvpSlot;
  variantId: EditorialVariantId;
}

export interface RsvpSlot {
  done: boolean;
  error: string | null;
  submitting: boolean;
  status: "yes" | "no" | "maybe";
  setStatus: (v: "yes" | "no" | "maybe") => void;
  name: string;
  setName: (v: string) => void;
  partySize: number;
  setPartySize: (v: number) => void;
  note: string;
  setNote: (v: string) => void;
  onSubmit: (e: React.FormEvent) => void;
  mode: "public" | "curated";
  guestName?: string;
  isCurated: boolean;
}

export interface TemplateDefinition {
  id: string;
  name: string;
  fonts?: InvitationFonts;
  variants: VariantDefinition[];
  colourThemes: ColourThemeDefinition[];
  defaultVariantId: EditorialVariantId;
  defaultColourThemeId: string;
  component: ComponentType<TemplateProps>;
  previewImage?: string;
}
