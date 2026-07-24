import { query } from "./db/postgres";
import { makeInviteSlug } from "./ids";

export const TEMPLATES = [
  { id: "veil", name: "Soft veil", blurb: "Quiet lift into the invitation." },
] as const;

export type TemplateId = (typeof TEMPLATES)[number]["id"];

const LEGACY_TEMPLATE_MAP: Record<string, TemplateId> = {
  envelope: "veil",
  floral: "veil",
  minimal: "veil",
  linen: "veil",
  arch: "veil",
};

function normalizeTemplateId(raw: string): TemplateId {
  const known = TEMPLATES.find((t) => t.id === raw)?.id;
  if (known) return known;
  return LEGACY_TEMPLATE_MAP[raw] ?? "veil";
}

export type Invite = {
  id: string;
  user_id: string;
  slug: string;
  template_id: TemplateId;
  partner_one: string;
  partner_two: string;
  event_at: Date;
  venue_name: string;
  venue_address: string | null;
  message: string | null;
  accent_color: string;
  published: boolean;
  created_at: Date;
  updated_at: Date;
};

type InviteRow = Omit<Invite, "template_id"> & { template_id: string };

function mapInvite(row: InviteRow): Invite {
  return { ...row, template_id: normalizeTemplateId(row.template_id) };
}

export async function listInvitesForUser(userId: string) {
  const rows = await query<InviteRow>(
    `select id::text as id, user_id::text as user_id, slug, template_id,
            partner_one, partner_two, event_at, venue_name, venue_address,
            message, accent_color, published, created_at, updated_at
     from invites
     where user_id = $1
     order by updated_at desc`,
    [userId],
  );
  return rows.map(mapInvite);
}

export async function getInviteByIdForUser(id: string, userId: string) {
  const rows = await query<InviteRow>(
    `select id::text as id, user_id::text as user_id, slug, template_id,
            partner_one, partner_two, event_at, venue_name, venue_address,
            message, accent_color, published, created_at, updated_at
     from invites
     where id = $1 and user_id = $2
     limit 1`,
    [id, userId],
  );
  return rows[0] ? mapInvite(rows[0]) : null;
}

export async function getPublishedInviteBySlug(slug: string) {
  const rows = await query<InviteRow>(
    `select id::text as id, user_id::text as user_id, slug, template_id,
            partner_one, partner_two, event_at, venue_name, venue_address,
            message, accent_color, published, created_at, updated_at
     from invites
     where slug = $1 and published = true
     limit 1`,
    [slug],
  );
  return rows[0] ? mapInvite(rows[0]) : null;
}

export async function getInviteById(id: string) {
  const rows = await query<InviteRow>(
    `select id::text as id, user_id::text as user_id, slug, template_id,
            partner_one, partner_two, event_at, venue_name, venue_address,
            message, accent_color, published, created_at, updated_at
     from invites
     where id = $1
     limit 1`,
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
  templateId?: TemplateId;
  accentColor?: string;
  published?: boolean;
};

export async function createInvite(input: CreateInviteInput) {
  const slug = makeInviteSlug(input.partnerOne, input.partnerTwo);
  const templateId = input.templateId ?? "veil";
  const accent = input.accentColor ?? "#7a2e3a";
  const published = input.published ?? true;
  const rows = await query<InviteRow>(
    `insert into invites (
       user_id, slug, template_id, partner_one, partner_two, event_at,
       venue_name, venue_address, message, accent_color, published
     ) values ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11)
     returning id::text as id, user_id::text as user_id, slug, template_id,
               partner_one, partner_two, event_at, venue_name, venue_address,
               message, accent_color, published, created_at, updated_at`,
    [
      input.userId,
      slug,
      templateId,
      input.partnerOne,
      input.partnerTwo,
      input.eventAt,
      input.venueName,
      input.venueAddress || null,
      input.message || null,
      accent,
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
  templateId?: TemplateId;
  accentColor?: string;
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
       template_id = $9,
       accent_color = $10,
       published = $11,
       updated_at = now()
     where id = $1 and user_id = $2
     returning id::text as id, user_id::text as user_id, slug, template_id,
               partner_one, partner_two, event_at, venue_name, venue_address,
               message, accent_color, published, created_at, updated_at`,
    [
      id,
      userId,
      input.partnerOne ?? current.partner_one,
      input.partnerTwo ?? current.partner_two,
      input.eventAt ?? current.event_at.toISOString(),
      input.venueName ?? current.venue_name,
      input.venueAddress === undefined
        ? current.venue_address
        : input.venueAddress,
      input.message === undefined ? current.message : input.message,
      input.templateId ?? current.template_id,
      input.accentColor ?? current.accent_color,
      input.published ?? current.published,
    ],
  );
  return rows[0] ? mapInvite(rows[0]) : null;
}
