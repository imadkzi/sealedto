"use client";

import { useState } from "react";
import type { Invite } from "@/lib/invites";
import type { Guest, RsvpStatus } from "@/lib/guests";
import { toInvitation, normalizeTemplateId } from "@/lib/invitation";

// Side-effect: register editorial template
import "@/components/invite/templates/editorial";

import {
  getTemplate,
  resolveColourTheme,
  resolveVariant,
  FALLBACK_TEMPLATE_ID,
} from "@/components/invite/registry";
import { InviteThemeProvider } from "@/components/invite/theme/InviteThemeProvider";
import { IntroOverlay } from "@/components/invite/animations/IntroOverlay";
import { usePageIntro } from "@/components/invite/hooks";
import type { RsvpSlot, InviteTheme, EditorialVariantId } from "@/components/invite/types";

type Props = {
  invite: Invite;
  guest?: Guest | null;
  mode: "public" | "curated";
};

export function InviteExperience({ invite, guest, mode }: Props) {
  /* ── RSVP state ── */
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
  const { introDone, onIntroComplete } = usePageIntro();

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

  /* ── Resolve template + variant + colour theme ── */
  const templateId = normalizeTemplateId(invite.template_id);
  const template = getTemplate(templateId) ?? getTemplate(FALLBACK_TEMPLATE_ID);

  if (!template) {
    return <p style={{ padding: "2rem", textAlign: "center" }}>Template not found.</p>;
  }

  const colourTheme = resolveColourTheme(template, invite.colour_theme_id ?? "ivory");
  const variant = resolveVariant(template, invite.variant_id ?? "classic");

  const theme: InviteTheme = {
    id: colourTheme.id,
    tokens: colourTheme.tokens,
    fonts: template.fonts,
  };

  const invitation = toInvitation(invite, guest);
  const TemplateComponent = template.component;

  const rsvp: RsvpSlot = {
    done,
    error,
    submitting,
    status,
    setStatus,
    name,
    setName,
    partySize,
    setPartySize,
    note,
    setNote,
    onSubmit,
    mode,
    guestName: guest?.display_name,
    isCurated: Boolean(guest?.is_curated),
  };

  return (
    <InviteThemeProvider theme={theme}>
      {!introDone && (
        <IntroOverlay
          partnerOne={invite.partner_one}
          partnerTwo={invite.partner_two}
          guestName={guest?.is_curated ? guest.display_name : undefined}
          introLine={invitation.introLine}
          eventLine={invitation.eventLine}
          onComplete={onIntroComplete}
        />
      )}
      <TemplateComponent
        invitation={invitation}
        rsvp={rsvp}
        variantId={variant.id as EditorialVariantId}
      />
    </InviteThemeProvider>
  );
}
