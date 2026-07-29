import { query } from "./db/postgres";
import { makeInviteSlug } from "./ids";
import { DEFAULT_INTRO_LINE, DEFAULT_TEMPLATE_ID } from "./inviteDefaults";

export { DEFAULT_INTRO_LINE, DEFAULT_TEMPLATE_ID };

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
  accent_color: string;
  intro_line: string;
  ceremony_time: string | null;
  reception_time: string | null;
  invite_mode: "wedding" | "save_the_date";
  schedule_items: Array<{
    time: string;
    label: string;
    description?: string;
  }> | null;
  dress_code: string | null;
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

type InviteRow = Invite;

const COLUMNS = `id::text as id, user_id::text as user_id, slug, template_id,
  variant_id, colour_theme_id,
  partner_one, partner_two, event_at, venue_name, venue_address,
  message, accent_color, intro_line, ceremony_time, reception_time,
  invite_mode, schedule_items,
  dress_code, registry_url, accommodation_note, rsvp_deadline,
  hero_image, gallery_images, venue_lat, venue_lng,
  published, created_at, updated_at`;

function mapInvite(row: InviteRow): Invite {
  return row;
}

function normalizeIntroLine(value?: string | null) {
  const trimmed = value?.trim();
  return trimmed || DEFAULT_INTRO_LINE;
}

export async function listInvitesForUser(userId: string) {
  const rows = await query<InviteRow>(
    `select ${COLUMNS} from invites where user_id = $1 order by updated_at desc`,
    [userId],
  );
  return rows.map(mapInvite);
}

export async function getInviteByIdForUser(id: string, userId: string) {
  const rows = await query<InviteRow>(
    `select ${COLUMNS} from invites where id = $1 and user_id = $2 limit 1`,
    [id, userId],
  );
  return rows[0] ? mapInvite(rows[0]) : null;
}

export async function getPublishedInviteBySlug(slug: string) {
  const rows = await query<InviteRow>(
    `select ${COLUMNS} from invites where slug = $1 and published = true limit 1`,
    [slug],
  );
  return rows[0] ? mapInvite(rows[0]) : null;
}

export async function getInviteById(id: string) {
  const rows = await query<InviteRow>(
    `select ${COLUMNS} from invites where id = $1 limit 1`,
    [id],
  );
  return rows[0] ? mapInvite(rows[0]) : null;
}

export type CreateInviteInput = {
  userId: string;
  partnerOne: string;
  partnerTwo: string;
  eventAt: string;
  venueName: string;
  venueAddress?: string;
  message?: string;
  accentColor?: string;
  variantId?: string;
  colourThemeId?: string;
  introLine?: string;
  ceremonyTime?: string;
  receptionTime?: string;
  inviteMode?: "wedding" | "save_the_date";
  scheduleItems?: Array<{
    time: string;
    label: string;
    description?: string;
  }>;
  venueLat?: number | null;
  venueLng?: number | null;
  dressCode?: string;
  registryUrl?: string;
  accommodationNote?: string;
  rsvpDeadline?: string | null;
  heroImage?: string;
  galleryImages?: Array<{ src: string; alt?: string }>;
  published?: boolean;
};

export async function createInvite(input: CreateInviteInput) {
  const slug = makeInviteSlug(input.partnerOne, input.partnerTwo);
  const accent = input.accentColor ?? "#B79B7A";
  const published = input.published ?? true;
  const rows = await query<InviteRow>(
    `insert into invites (
       user_id, slug, template_id, variant_id, colour_theme_id,
       partner_one, partner_two, event_at,
       venue_name, venue_address, message, accent_color,
       intro_line, ceremony_time, reception_time, invite_mode, schedule_items,
       dress_code,
       registry_url, accommodation_note, rsvp_deadline,
       hero_image, gallery_images, venue_lat, venue_lng, published
     ) values ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12,$13,$14,$15,$16,$17,$18,$19,$20,$21,$22,$23,$24,$25,$26)
     returning ${COLUMNS}`,
    [
      input.userId,
      slug,
      DEFAULT_TEMPLATE_ID,
      input.variantId ?? "classic",
      input.colourThemeId ?? "ivory",
      input.partnerOne,
      input.partnerTwo,
      input.eventAt,
      input.venueName,
      input.venueAddress || null,
      input.message || null,
      accent,
      normalizeIntroLine(input.introLine),
      input.ceremonyTime || null,
      input.receptionTime || null,
      input.inviteMode ?? "wedding",
      input.scheduleItems?.length ? JSON.stringify(input.scheduleItems) : null,
      input.dressCode || null,
      input.registryUrl || null,
      input.accommodationNote || null,
      input.rsvpDeadline || null,
      input.heroImage || null,
      input.galleryImages ? JSON.stringify(input.galleryImages) : null,
      input.venueLat ?? null,
      input.venueLng ?? null,
      published,
    ],
  );
  return mapInvite(rows[0]);
}

export type UpdateInviteInput = {
  partnerOne?: string;
  partnerTwo?: string;
  eventAt?: string;
  venueName?: string;
  venueAddress?: string | null;
  message?: string | null;
  accentColor?: string;
  variantId?: string;
  colourThemeId?: string;
  introLine?: string;
  ceremonyTime?: string | null;
  receptionTime?: string | null;
  inviteMode?: "wedding" | "save_the_date";
  scheduleItems?: Array<{
    time: string;
    label: string;
    description?: string;
  }> | null;
  venueLat?: number | null;
  venueLng?: number | null;
  dressCode?: string | null;
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
  const current = await getInviteByIdForUser(id, userId);
  if (!current) return null;

  const rows = await query<InviteRow>(
    `update invites set
       partner_one = $3,
       partner_two = $4,
       event_at = $5,
       venue_name = $6,
       venue_address = $7,
       message = $8,
       accent_color = $9,
       variant_id = $10,
       colour_theme_id = $11,
       intro_line = $12,
       ceremony_time = $13,
       reception_time = $14,
       invite_mode = $15,
       schedule_items = $16,
       dress_code = $17,
       registry_url = $18,
       accommodation_note = $19,
       rsvp_deadline = $20,
       hero_image = $21,
       gallery_images = $22,
       venue_lat = $23,
       venue_lng = $24,
       published = $25,
       updated_at = now()
     where id = $1 and user_id = $2
     returning ${COLUMNS}`,
    [
      id,
      userId,
      input.partnerOne ?? current.partner_one,
      input.partnerTwo ?? current.partner_two,
      input.eventAt ?? current.event_at.toISOString(),
      input.venueName ?? current.venue_name,
      input.venueAddress === undefined ? current.venue_address : input.venueAddress,
      input.message === undefined ? current.message : input.message,
      input.accentColor ?? current.accent_color,
      input.variantId ?? current.variant_id,
      input.colourThemeId ?? current.colour_theme_id,
      input.introLine === undefined
        ? current.intro_line
        : normalizeIntroLine(input.introLine),
      input.ceremonyTime === undefined
        ? current.ceremony_time
        : input.ceremonyTime || null,
      input.receptionTime === undefined
        ? current.reception_time
        : input.receptionTime || null,
      input.inviteMode ?? current.invite_mode,
      input.scheduleItems === undefined
        ? current.schedule_items
          ? JSON.stringify(current.schedule_items)
          : null
        : input.scheduleItems?.length
          ? JSON.stringify(input.scheduleItems)
          : null,
      input.dressCode === undefined
        ? current.dress_code
        : input.dressCode || null,
      input.registryUrl === undefined
        ? current.registry_url
        : input.registryUrl || null,
      input.accommodationNote === undefined
        ? current.accommodation_note
        : input.accommodationNote || null,
      input.rsvpDeadline === undefined
        ? current.rsvp_deadline
        : input.rsvpDeadline || null,
      input.heroImage === undefined ? current.hero_image : input.heroImage,
      input.galleryImages === undefined
        ? current.gallery_images
          ? JSON.stringify(current.gallery_images)
          : null
        : input.galleryImages
          ? JSON.stringify(input.galleryImages)
          : null,
      input.venueLat === undefined ? current.venue_lat : input.venueLat,
      input.venueLng === undefined ? current.venue_lng : input.venueLng,
      input.published ?? current.published,
    ],
  );
  return rows[0] ? mapInvite(rows[0]) : null;
}

export async function deleteInvite(id: string, userId: string) {
  const rows = await query<{ id: string }>(
    `delete from invites
     where id = $1 and user_id = $2
     returning id::text as id`,
    [id, userId],
  );
  return Boolean(rows[0]);
}
