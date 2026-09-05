import { prisma } from "./db/prisma";
import {
  Prisma,
  type Guest as GuestRecord,
} from "@/lib/generated/prisma/client";
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

const RSVP_ORDER: Record<RsvpStatus, number> = {
  yes: 0,
  maybe: 1,
  no: 2,
  pending: 3,
};

function mapGuest(row: GuestRecord): Guest {
  return {
    id: row.id,
    invite_id: row.inviteId,
    display_name: row.displayName,
    token: row.token,
    is_curated: row.isCurated,
    rsvp_status: row.rsvpStatus,
    party_size: row.partySize,
    rsvp_note: row.rsvpNote,
    rsvp_at: row.rsvpAt,
    created_at: row.createdAt,
  };
}

export async function listGuestsForInvite(inviteId: string) {
  const rows = await prisma.guest.findMany({
    where: { inviteId },
  });
  return rows
    .map(mapGuest)
    .sort(
      (a, b) =>
        RSVP_ORDER[a.rsvp_status] - RSVP_ORDER[b.rsvp_status] ||
        a.display_name.localeCompare(b.display_name),
    );
}

export async function getGuestByToken(token: string) {
  const row = await prisma.guest.findUnique({ where: { token } });
  return row ? mapGuest(row) : null;
}

function clampPartySize(value: unknown) {
  const parsed = Number(value);
  if (!Number.isFinite(parsed)) return 1;
  return Math.min(20, Math.max(1, Math.round(parsed)));
}

export async function createCuratedGuest(
  inviteId: string,
  displayName: string,
  partySize = 1,
) {
  const row = await prisma.guest.create({
    data: {
      inviteId,
      displayName,
      token: makeGuestToken(),
      isCurated: true,
      partySize: clampPartySize(partySize),
    },
  });
  return mapGuest(row);
}

/** Create many curated guests (e.g. CSV import). Skips blank names. */
export async function createCuratedGuestsBulk(
  inviteId: string,
  displayNames: string[],
) {
  const names = displayNames.map((name) => name.trim()).filter(Boolean);
  if (!names.length) return [];

  const rows = await prisma.guest.createManyAndReturn({
    data: names.map((displayName) => ({
      inviteId,
      displayName,
      token: makeGuestToken(),
      isCurated: true,
    })),
  });
  return rows.map(mapGuest);
}

export async function getGuestByIdForInvite(guestId: string, inviteId: string) {
  const row = await prisma.guest.findFirst({
    where: { id: guestId, inviteId },
  });
  return row ? mapGuest(row) : null;
}

export async function updateCuratedGuest(
  guestId: string,
  inviteId: string,
  displayName: string,
  partySize?: number,
) {
  const current = await prisma.guest.findFirst({
    where: { id: guestId, inviteId, isCurated: true },
    select: { id: true },
  });
  if (!current) return null;

  const row = await prisma.guest.update({
    where: { id: guestId },
    data: {
      displayName,
      ...(partySize === undefined
        ? {}
        : { partySize: clampPartySize(partySize) }),
    },
  });
  return mapGuest(row);
}

export async function deleteGuest(guestId: string, inviteId: string) {
  const result = await prisma.guest.deleteMany({
    where: { id: guestId, inviteId },
  });
  return result.count > 0;
}

export async function submitPublicRsvp(input: {
  inviteId: string;
  displayName: string;
  status: Exclude<RsvpStatus, "pending">;
  partySize: number;
  note?: string;
}) {
  const row = await prisma.guest.create({
    data: {
      inviteId: input.inviteId,
      displayName: input.displayName,
      token: makeGuestToken(),
      isCurated: false,
      rsvpStatus: input.status,
      partySize: input.partySize,
      rsvpNote: input.note || null,
      rsvpAt: new Date(),
    },
  });
  return mapGuest(row);
}

export async function submitCuratedRsvp(input: {
  guestId: string;
  status: Exclude<RsvpStatus, "pending">;
  partySize?: number;
  note?: string;
  displayName?: string;
}) {
  try {
    const row = await prisma.guest.update({
      where: { id: input.guestId },
      data: {
        rsvpStatus: input.status,
        ...(input.partySize === undefined
          ? {}
          : { partySize: clampPartySize(input.partySize) }),
        rsvpNote: input.note || null,
        displayName: input.displayName || undefined,
        rsvpAt: new Date(),
      },
    });
    return mapGuest(row);
  } catch (error) {
    if (
      error instanceof Prisma.PrismaClientKnownRequestError &&
      error.code === "P2025"
    ) {
      return null;
    }
    throw error;
  }
}

export async function rsvpCounts(inviteId: string) {
  const rows = await prisma.guest.groupBy({
    by: ["rsvpStatus"],
    where: { inviteId },
    _count: { _all: true },
  });
  const counts = { pending: 0, yes: 0, no: 0, maybe: 0 };
  for (const row of rows) {
    counts[row.rsvpStatus] = row._count._all;
  }
  return counts;
}
