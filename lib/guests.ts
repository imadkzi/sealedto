import { query } from "./db/postgres";
import { makeGuestToken } from "./ids";

export type RsvpStatus = "pending" | "yes" | "no" | "maybe";

export type Guest = {
  id: string;
  invite_id: string;
  display_name: string;
  token: string;
  is_curated: boolean;
  rsvp_status: RsvpStatus;
  party_size: number;
  rsvp_note: string | null;
  rsvp_at: Date | null;
  created_at: Date;
};

type GuestRow = Omit<Guest, "rsvp_status"> & { rsvp_status: string };

function mapGuest(row: GuestRow): Guest {
  const status = (["pending", "yes", "no", "maybe"] as const).includes(
    row.rsvp_status as RsvpStatus,
  )
    ? (row.rsvp_status as RsvpStatus)
    : "pending";
  return { ...row, rsvp_status: status };
}

export async function listGuestsForInvite(inviteId: string) {
  const rows = await query<GuestRow>(
    `select id::text as id, invite_id::text as invite_id, display_name, token,
            is_curated, rsvp_status, party_size, rsvp_note, rsvp_at, created_at
     from guests
     where invite_id = $1
     order by
       case rsvp_status when 'yes' then 0 when 'maybe' then 1 when 'no' then 2 else 3 end,
       display_name asc`,
    [inviteId],
  );
  return rows.map(mapGuest);
}

export async function getGuestByToken(token: string) {
  const rows = await query<GuestRow>(
    `select id::text as id, invite_id::text as invite_id, display_name, token,
            is_curated, rsvp_status, party_size, rsvp_note, rsvp_at, created_at
     from guests
     where token = $1
     limit 1`,
    [token],
  );
  return rows[0] ? mapGuest(rows[0]) : null;
}

export async function createCuratedGuest(inviteId: string, displayName: string) {
  const token = makeGuestToken();
  const rows = await query<GuestRow>(
    `insert into guests (invite_id, display_name, token, is_curated)
     values ($1, $2, $3, true)
     returning id::text as id, invite_id::text as invite_id, display_name, token,
               is_curated, rsvp_status, party_size, rsvp_note, rsvp_at, created_at`,
    [inviteId, displayName, token],
  );
  return mapGuest(rows[0]);
}

export async function submitPublicRsvp(input: {
  inviteId: string;
  displayName: string;
  status: Exclude<RsvpStatus, "pending">;
  partySize: number;
  note?: string;
}) {
  const token = makeGuestToken();
  const rows = await query<GuestRow>(
    `insert into guests (
       invite_id, display_name, token, is_curated, rsvp_status, party_size, rsvp_note, rsvp_at
     ) values ($1, $2, $3, false, $4, $5, $6, now())
     returning id::text as id, invite_id::text as invite_id, display_name, token,
               is_curated, rsvp_status, party_size, rsvp_note, rsvp_at, created_at`,
    [
      input.inviteId,
      input.displayName,
      token,
      input.status,
      input.partySize,
      input.note || null,
    ],
  );
  return mapGuest(rows[0]);
}

export async function submitCuratedRsvp(input: {
  guestId: string;
  status: Exclude<RsvpStatus, "pending">;
  partySize: number;
  note?: string;
  displayName?: string;
}) {
  const rows = await query<GuestRow>(
    `update guests set
       rsvp_status = $2,
       party_size = $3,
       rsvp_note = $4,
       display_name = coalesce($5, display_name),
       rsvp_at = now()
     where id = $1
     returning id::text as id, invite_id::text as invite_id, display_name, token,
               is_curated, rsvp_status, party_size, rsvp_note, rsvp_at, created_at`,
    [
      input.guestId,
      input.status,
      input.partySize,
      input.note || null,
      input.displayName || null,
    ],
  );
  return rows[0] ? mapGuest(rows[0]) : null;
}

export async function rsvpCounts(inviteId: string) {
  const rows = await query<{ rsvp_status: string; count: string }>(
    `select rsvp_status, count(*)::text as count
     from guests
     where invite_id = $1
     group by rsvp_status`,
    [inviteId],
  );
  const counts = { pending: 0, yes: 0, no: 0, maybe: 0 };
  for (const row of rows) {
    if (row.rsvp_status in counts) {
      counts[row.rsvp_status as keyof typeof counts] = Number(row.count);
    }
  }
  return counts;
}
