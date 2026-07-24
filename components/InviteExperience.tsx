"use client";

import { useState } from "react";
import type { Invite } from "@/lib/invites";
import type { Guest, RsvpStatus } from "@/lib/guests";
import { VeilTemplate } from "@/components/templates/VeilTemplate";
import styles from "@/styles/pages/Invite.module.scss";

type Props = {
  invite: Invite;
  guest?: Guest | null;
  mode: "public" | "curated";
};

export function InviteExperience({ invite, guest, mode }: Props) {
  const [status, setStatus] = useState<Exclude<RsvpStatus, "pending">>(
    guest && guest.rsvp_status !== "pending" ? guest.rsvp_status : "yes",
  );
  const [name, setName] = useState(guest?.display_name ?? "");
  const [partySize, setPartySize] = useState(guest?.party_size ?? 1);
  const [note, setNote] = useState(guest?.rsvp_note ?? "");
  const [done, setDone] = useState(
    Boolean(guest && guest.rsvp_status !== "pending"),
  );
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSubmitting(true);
    setError(null);
    try {
      const res = await fetch("/api/rsvp", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({
          mode,
          slug: invite.slug,
          token: guest?.token,
          displayName: name,
          status,
          partySize,
          note,
        }),
      });
      if (!res.ok) {
        const data = (await res.json().catch(() => null)) as {
          error?: string;
        } | null;
        throw new Error(data?.error || "Could not save RSVP");
      }
      setDone(true);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Could not save RSVP");
    } finally {
      setSubmitting(false);
    }
  }

  const shared = {
    invite,
    guest,
    mode,
    status,
    setStatus,
    name,
    setName,
    partySize,
    setPartySize,
    note,
    setNote,
    done,
    error,
    submitting,
    onSubmit,
    accent: invite.accent_color,
  };

  return (
    <main className={styles.stage}>
      <VeilTemplate {...shared} />
    </main>
  );
}
