import { prisma } from "./db/prisma";
import {
  Prisma,
  type Invite as InviteRecord,
} from "@/lib/generated/prisma/client";
import { makeInviteSlug } from "./ids";
import {
  DEFAULT_INTRO_LINE,
  DEFAULT_TEMPLATE_ID,
  defaultEventLine,
} from "./inviteDefaults";
import { sanitizeIntroHtml } from "./introHtml";

export { DEFAULT_INTRO_LINE, DEFAULT_TEMPLATE_ID, defaultEventLine };
export {
  DEFAULT_EVENT_LINE,
  DEFAULT_SAVE_THE_DATE_EVENT_LINE,
  DEFAULT_STORY_TITLE,
} from "./inviteDefaults";

export type Invite = {
  id: string;
  user_id: string;
  slug: string;
  template_id: string;
  variant_id: string;
  colour_theme_id: string;
  partner_one: string;
  partner_two: string;
  event_at: Date;
  venue_name: string;
  venue_address: string | null;
  message: string | null;
  story_title: string | null;
  accent_color: string;
  intro_line: string;
  event_line: string;
  ceremony_time: string | null;
  reception_time: string | null;
  invite_mode: "wedding" | "save_the_date";
  schedule_items: Array<{
    time: string;
    label: string;
    description?: string;
  }> | null;
  dress_code: string | null;
  dress_code_groom: string | null;
  dress_code_bride: string | null;
  registry_url: string | null;
  accommodation_note: string | null;
  rsvp_deadline: Date | null;
  hero_image: string | null;
  gallery_images: Array<{ src: string; alt?: string }> | null;
  venue_lat: number | null;
  venue_lng: number | null;
  published: boolean;
  created_at: Date;
  updated_at: Date;
};

function parseScheduleItems(
  value: Prisma.JsonValue | null,
): Invite["schedule_items"] {
  if (!Array.isArray(value)) return null;
  const items = value.flatMap((item) => {
    if (!item || typeof item !== "object" || Array.isArray(item)) return [];
    const rec = item as Record<string, unknown>;
    if (typeof rec.time !== "string" || typeof rec.label !== "string") {
      return [];
    }
    return [
      {
        time: rec.time,
        label: rec.label,
        ...(typeof rec.description === "string"
          ? { description: rec.description }
          : {}),
      },
    ];
  });
  return items.length ? items : null;
}

function parseGalleryImages(
  value: Prisma.JsonValue | null,
): Invite["gallery_images"] {
  if (!Array.isArray(value)) return null;
  const items = value.flatMap((item) => {
    if (!item || typeof item !== "object" || Array.isArray(item)) return [];
    const rec = item as Record<string, unknown>;
    if (typeof rec.src !== "string") return [];
    return [
      {
        src: rec.src,
        ...(typeof rec.alt === "string" ? { alt: rec.alt } : {}),
      },
    ];
  });
  return items.length ? items : null;
}

function mapInvite(row: InviteRecord): Invite {
  return {
    id: row.id,
    user_id: row.userId,
    slug: row.slug,
    template_id: row.templateId,
    variant_id: row.variantId,
    colour_theme_id: row.colourThemeId,
    partner_one: row.partnerOne,
    partner_two: row.partnerTwo,
    event_at: row.eventAt,
    venue_name: row.venueName,
    venue_address: row.venueAddress,
    message: row.message,
    story_title: row.storyTitle,
    accent_color: row.accentColor,
    intro_line: row.introLine,
    event_line: row.eventLine,
    ceremony_time: row.ceremonyTime,
    reception_time: row.receptionTime,
    invite_mode: row.inviteMode,
    schedule_items: parseScheduleItems(row.scheduleItems),
    dress_code: row.dressCode,
    dress_code_groom: row.dressCodeGroom,
    dress_code_bride: row.dressCodeBride,
    registry_url: row.registryUrl,
    accommodation_note: row.accommodationNote,
    rsvp_deadline: row.rsvpDeadline,
    hero_image: row.heroImage,
    gallery_images: parseGalleryImages(row.galleryImages),
    venue_lat: row.venueLat,
    venue_lng: row.venueLng,
    published: row.published,
    created_at: row.createdAt,
    updated_at: row.updatedAt,
  };
}

function normalizeIntroLine(value?: string | null) {
  return sanitizeIntroHtml(value ?? "") || DEFAULT_INTRO_LINE;
}

function normalizeEventLine(
  value?: string | null,
  mode?: "wedding" | "save_the_date",
) {
  const trimmed = value?.trim();
  return trimmed || defaultEventLine(mode);
}

function normalizeStoryTitle(value?: string | null) {
  const trimmed = value?.trim();
  return trimmed || null;
}

export async function listInvitesForUser(userId: string) {
  const rows = await prisma.invite.findMany({
    where: { userId },
    orderBy: { updatedAt: "desc" },
  });
  return rows.map(mapInvite);
}

export async function getInviteByIdForUser(id: string, userId: string) {
  const row = await prisma.invite.findFirst({
    where: { id, userId },
  });
  return row ? mapInvite(row) : null;
}

export async function getPublishedInviteBySlug(slug: string) {
  const row = await prisma.invite.findFirst({
    where: { slug, published: true },
  });
  return row ? mapInvite(row) : null;
}

export async function getInviteById(id: string) {
  const row = await prisma.invite.findUnique({ where: { id } });
  return row ? mapInvite(row) : null;
}

export type CreateInviteInput = {
  userId: string;
  partnerOne: string;
  partnerTwo: string;
  eventAt: string;
  venueName: string;
  venueAddress?: string;
  message?: string;
  storyTitle?: string;
  accentColor?: string;
  variantId?: string;
  colourThemeId?: string;
  introLine?: string;
  eventLine?: string;
  inviteMode?: "wedding" | "save_the_date";
  scheduleItems?: Array<{
    time: string;
    label: string;
    description?: string;
  }>;
  venueLat?: number | null;
  venueLng?: number | null;
  dressCode?: string;
  dressCodeGroom?: string;
  dressCodeBride?: string;
  registryUrl?: string;
  accommodationNote?: string;
  rsvpDeadline?: string | null;
  heroImage?: string;
  galleryImages?: Array<{ src: string; alt?: string }>;
  published?: boolean;
};

export async function createInvite(input: CreateInviteInput) {
  const slug = makeInviteSlug(input.partnerOne, input.partnerTwo);
  const row = await prisma.invite.create({
    data: {
      userId: input.userId,
      slug,
      templateId: DEFAULT_TEMPLATE_ID,
      variantId: input.variantId ?? "classic",
      colourThemeId: input.colourThemeId ?? "ivory",
      partnerOne: input.partnerOne,
      partnerTwo: input.partnerTwo,
      eventAt: input.eventAt,
      venueName: input.venueName,
      venueAddress: input.venueAddress || null,
      message: input.message || null,
      storyTitle: normalizeStoryTitle(input.storyTitle),
      accentColor: input.accentColor ?? "#B79B7A",
      introLine: normalizeIntroLine(input.introLine),
      eventLine: normalizeEventLine(input.eventLine, input.inviteMode),
      inviteMode: input.inviteMode ?? "wedding",
      scheduleItems: input.scheduleItems?.length
        ? (input.scheduleItems as Prisma.InputJsonValue)
        : Prisma.JsonNull,
      dressCode: input.dressCode || null,
      dressCodeGroom: input.dressCodeGroom?.trim() || null,
      dressCodeBride: input.dressCodeBride?.trim() || null,
      registryUrl: input.registryUrl || null,
      accommodationNote: input.accommodationNote || null,
      rsvpDeadline: input.rsvpDeadline || null,
      heroImage: input.heroImage || null,
      galleryImages: input.galleryImages
        ? (input.galleryImages as Prisma.InputJsonValue)
        : Prisma.JsonNull,
      venueLat: input.venueLat ?? null,
      venueLng: input.venueLng ?? null,
      published: input.published ?? true,
    },
  });
  return mapInvite(row);
}

export type UpdateInviteInput = {
  partnerOne?: string;
  partnerTwo?: string;
  eventAt?: string;
  venueName?: string;
  venueAddress?: string | null;
  message?: string | null;
  storyTitle?: string | null;
  accentColor?: string;
  variantId?: string;
  colourThemeId?: string;
  introLine?: string;
  eventLine?: string;
  inviteMode?: "wedding" | "save_the_date";
  scheduleItems?: Array<{
    time: string;
    label: string;
    description?: string;
  }> | null;
  venueLat?: number | null;
  venueLng?: number | null;
  dressCode?: string | null;
  dressCodeGroom?: string | null;
  dressCodeBride?: string | null;
  registryUrl?: string | null;
  accommodationNote?: string | null;
  rsvpDeadline?: string | null;
  heroImage?: string | null;
  galleryImages?: Array<{ src: string; alt?: string }> | null;
  published?: boolean;
};

export async function updateInvite(
  id: string,
  userId: string,
  input: UpdateInviteInput,
) {
  const current = await prisma.invite.findFirst({
    where: { id, userId },
    select: { id: true },
  });
  if (!current) return null;

  const row = await prisma.invite.update({
    where: { id },
    data: {
      partnerOne: input.partnerOne,
      partnerTwo: input.partnerTwo,
      eventAt: input.eventAt,
      venueName: input.venueName,
      venueAddress: input.venueAddress,
      message: input.message,
      storyTitle:
        input.storyTitle === undefined
          ? undefined
          : normalizeStoryTitle(input.storyTitle),
      accentColor: input.accentColor,
      variantId: input.variantId,
      colourThemeId: input.colourThemeId,
      introLine:
        input.introLine === undefined
          ? undefined
          : normalizeIntroLine(input.introLine),
      eventLine:
        input.eventLine === undefined
          ? undefined
          : normalizeEventLine(input.eventLine, input.inviteMode),
      inviteMode: input.inviteMode,
      scheduleItems:
        input.scheduleItems === undefined
          ? undefined
          : input.scheduleItems?.length
            ? (input.scheduleItems as Prisma.InputJsonValue)
            : Prisma.JsonNull,
      dressCode:
        input.dressCode === undefined ? undefined : input.dressCode || null,
      dressCodeGroom:
        input.dressCodeGroom === undefined
          ? undefined
          : input.dressCodeGroom?.trim() || null,
      dressCodeBride:
        input.dressCodeBride === undefined
          ? undefined
          : input.dressCodeBride?.trim() || null,
      registryUrl:
        input.registryUrl === undefined ? undefined : input.registryUrl || null,
      accommodationNote:
        input.accommodationNote === undefined
          ? undefined
          : input.accommodationNote || null,
      rsvpDeadline:
        input.rsvpDeadline === undefined
          ? undefined
          : input.rsvpDeadline || null,
      heroImage: input.heroImage,
      galleryImages:
        input.galleryImages === undefined
          ? undefined
          : input.galleryImages
            ? (input.galleryImages as Prisma.InputJsonValue)
            : Prisma.JsonNull,
      venueLat: input.venueLat,
      venueLng: input.venueLng,
      published: input.published,
    },
  });
  return mapInvite(row);
}

export async function deleteInvite(id: string, userId: string) {
  const result = await prisma.invite.deleteMany({
    where: { id, userId },
  });
  return result.count > 0;
}
