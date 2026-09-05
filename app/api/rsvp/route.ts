import { NextResponse } from "next/server";
import { headers } from "next/headers";
import { getPublishedInviteBySlug } from "@/lib/invites";
import {
  getGuestByToken,
  submitCuratedRsvp,
  submitPublicRsvp,
  type RsvpStatus,
} from "@/lib/guests";
import { hitRateLimit } from "@/lib/security/rate-limit";

const allowed = new Set(["yes", "no", "maybe"]);

export async function POST(request: Request) {
  const hdrs = await headers();
  const ip = hdrs.get("x-forwarded-for")?.split(",")[0]?.trim() || "unknown";

  const body = (await request.json().catch(() => null)) as {
    mode?: string;
    slug?: string;
    token?: string;
    displayName?: string;
    status?: string;
    partySize?: number;
    note?: string;
  } | null;

  if (!body) {
    return NextResponse.json({ error: "Invalid payload" }, { status: 400 });
  }

  const blocked = await hitRateLimit({
    key: `rsvp:${ip}:${body.slug || body.token || "unknown"}`,
    limit: 20,
    windowMs: 10 * 60 * 1000,
  });
  if (blocked) {
    return NextResponse.json({ error: "Too many requests" }, { status: 429 });
  }

  const status = String(body.status ?? "");
  if (!allowed.has(status)) {
    return NextResponse.json({ error: "Invalid RSVP status" }, { status: 400 });
  }

  const partySize = Math.min(
    20,
    Math.max(1, Number(body.partySize) || 1),
  );
  const note = String(body.note ?? "").slice(0, 500);

  if (body.mode === "curated") {
    const token = String(body.token ?? "");
    const guest = await getGuestByToken(token);
    if (!guest?.is_curated) {
      return NextResponse.json({ error: "Invite not found" }, { status: 404 });
    }
    const updated = await submitCuratedRsvp({
      guestId: guest.id,
      status: status as Exclude<RsvpStatus, "pending">,
      note,
    });
    return NextResponse.json({ ok: true, guest: updated });
  }

  const slug = String(body.slug ?? "");
  const displayName = String(body.displayName ?? "").trim();
  if (!slug || !displayName) {
    return NextResponse.json({ error: "Name is required" }, { status: 400 });
  }

  const invite = await getPublishedInviteBySlug(slug);
  if (!invite) {
    return NextResponse.json({ error: "Invite not found" }, { status: 404 });
  }

  const guest = await submitPublicRsvp({
    inviteId: invite.id,
    displayName: displayName.slice(0, 120),
    status: status as Exclude<RsvpStatus, "pending">,
    partySize,
    note,
  });

  return NextResponse.json({ ok: true, guest });
}
