import { DEFAULT_INTRO_LINE } from "@/lib/inviteDefaults";
import type { Invitation } from "@/components/invite/types";
import type { GalleryImage } from "@/components/admin/GalleryField";
import type { ItineraryItem } from "@/components/admin/ItineraryField";

export const PREVIEW_DRAFT_KEY = "sealedto:invite-preview-draft";

export type InviteDraftValues = {
  partnerOne: string;
  partnerTwo: string;
  eventAt: string;
  venueName: string;
  venueAddress: string;
  message: string;
  introLine: string;
  inviteMode: "wedding" | "save_the_date";
  scheduleItems: ItineraryItem[];
  venueLat: number | null;
  venueLng: number | null;
  dressCode: string;
  registryUrl: string;
  accommodationNote: string;
  rsvpDeadline: string;
  variantId: string;
  colourThemeId: string;
  heroImage: string;
  galleryImages: GalleryImage[];
  published: boolean;
};

export function buildPreviewInvitation(draft: InviteDraftValues): Invitation {
  const weddingDate = draft.eventAt
    ? new Date(draft.eventAt)
    : new Date(Date.now() + 1000 * 60 * 60 * 24 * 90);

  const schedule = (draft.scheduleItems ?? [])
    .filter((item) => item.time.trim() && item.label.trim())
    .map((item) => ({
      time: item.time.trim(),
      label: item.label.trim(),
      description: item.description?.trim() || undefined,
    }));

  const partnerOne = draft.partnerOne.trim() || "Partner one";
  const partnerTwo = draft.partnerTwo.trim() || "Partner two";

  return {
    id: "preview",
    slug: "preview",
    templateId: "editorial",
    variantId: draft.variantId || "classic",
    colourThemeId: draft.colourThemeId || "ivory",
    mode: draft.inviteMode ?? "wedding",
    bride: { name: partnerOne },
    groom: { name: partnerTwo },
    weddingDate: Number.isNaN(weddingDate.getTime())
      ? new Date(Date.now() + 1000 * 60 * 60 * 24 * 90)
      : weddingDate,
    venue: {
      name: draft.venueName.trim() || "Venue",
      address: draft.venueAddress.trim() || undefined,
      coordinates:
        draft.venueLat != null && draft.venueLng != null
          ? { lat: draft.venueLat, lng: draft.venueLng }
          : undefined,
    },
    rsvpEnabled: draft.inviteMode !== "save_the_date",
    rsvpDeadline: draft.rsvpDeadline
      ? new Date(`${draft.rsvpDeadline}T12:00:00`)
      : undefined,
    message: draft.message.trim() || undefined,
    story: draft.message.trim() || undefined,
    introLine: draft.introLine.trim() || DEFAULT_INTRO_LINE,
    dressCode: draft.dressCode.trim() || undefined,
    registryUrl: draft.registryUrl.trim() || undefined,
    accommodationNote: draft.accommodationNote.trim() || undefined,
    schedule: schedule.length ? schedule : undefined,
    heroImage: draft.heroImage.trim() || undefined,
    gallery: draft.galleryImages.length ? draft.galleryImages : undefined,
    palette: {
      background: "#F8F5F1",
      surface: "#FFFFFF",
      ink: "#222222",
      muted: "#777777",
      accent: "#B79B7A",
    },
    accentColor: "#B79B7A",
  };
}
