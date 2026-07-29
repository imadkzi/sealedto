import type { Invite } from "./invites";
import { DEFAULT_INTRO_LINE } from "./inviteDefaults";
import type { Guest } from "./guests";
import type { Invitation, InvitationScheduleItem } from "@/components/invite/types";

function buildSchedule(invite: Invite): InvitationScheduleItem[] | undefined {
  if (invite.schedule_items?.length) {
    return invite.schedule_items
      .filter((item) => item.time?.trim() && item.label?.trim())
      .map((item) => ({
        time: item.time.trim(),
        label: item.label.trim(),
        description: item.description?.trim() || undefined,
      }));
  }

  const items: InvitationScheduleItem[] = [];
  if (invite.ceremony_time) {
    items.push({ time: invite.ceremony_time, label: "Ceremony" });
  }
  if (invite.reception_time) {
    items.push({ time: invite.reception_time, label: "Reception" });
  }
  return items.length ? items : undefined;
}

/**
 * Map a DB Invite row (+optional guest) into the rich Invitation model.
 * Sections without data stay undefined → components no-op.
 */
export function toInvitation(invite: Invite, guest?: Guest | null): Invitation {
  return {
    id: invite.id,
    slug: invite.slug,
    templateId: invite.template_id,
    variantId: invite.variant_id ?? "classic",
    colourThemeId: invite.colour_theme_id ?? "ivory",
    mode: invite.invite_mode ?? "wedding",

    bride: { name: invite.partner_one },
    groom: { name: invite.partner_two },

    weddingDate: invite.event_at instanceof Date ? invite.event_at : new Date(invite.event_at),
    ceremonyTime: invite.ceremony_time ?? undefined,
    receptionTime: invite.reception_time ?? undefined,

    venue: {
      name: invite.venue_name,
      address: invite.venue_address ?? undefined,
      coordinates:
        invite.venue_lat != null && invite.venue_lng != null
          ? { lat: invite.venue_lat, lng: invite.venue_lng }
          : undefined,
    },

    rsvpEnabled: invite.invite_mode !== "save_the_date",
    rsvpDeadline: invite.rsvp_deadline
      ? invite.rsvp_deadline instanceof Date
        ? invite.rsvp_deadline
        : new Date(invite.rsvp_deadline)
      : undefined,

    message: invite.message ?? undefined,
    story: invite.message ?? undefined,
    introLine: invite.intro_line || DEFAULT_INTRO_LINE,
    dressCode: invite.dress_code ?? undefined,
    registryUrl: invite.registry_url ?? undefined,
    accommodationNote: invite.accommodation_note ?? undefined,
    schedule: buildSchedule(invite),

    heroImage: invite.hero_image ?? undefined,
    gallery: invite.gallery_images ?? undefined,

    palette: {
      background: "#F8F5F1",
      surface: "#FFFFFF",
      ink: "#222222",
      muted: "#777777",
      accent: invite.accent_color,
    },

    accentColor: invite.accent_color,

    guestName: guest?.is_curated ? guest.display_name : undefined,
    isCuratedGuest: Boolean(guest?.is_curated),
  };
}

/** Legacy template ids → editorial */
const LEGACY_MAP: Record<string, string> = {
  default: "editorial",
  envelope: "editorial",
  floral: "editorial",
  minimal: "editorial",
  veil: "editorial",
  linen: "editorial",
  arch: "editorial",
};

export function normalizeTemplateId(id: string): string {
  return LEGACY_MAP[id] ?? id;
}
