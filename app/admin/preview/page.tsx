"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

import "@/components/invite/templates/editorial";

import {
  getTemplate,
  resolveColourTheme,
  resolveVariant,
  FALLBACK_TEMPLATE_ID,
} from "@/components/invite/registry";
import { InviteThemeProvider } from "@/components/invite/theme/InviteThemeProvider";
import { EditorialTemplate } from "@/components/invite/templates/editorial/EditorialTemplate";
import type {
  EditorialVariantId,
  InviteTheme,
  RsvpSlot,
} from "@/components/invite/types";
import {
  PREVIEW_DRAFT_KEY,
  buildPreviewInvitation,
  type InviteDraftValues,
} from "@/lib/invitePreview";
import styles from "./page.module.scss";

const noopRsvp: RsvpSlot = {
  done: false,
  error: null,
  submitting: false,
  status: "yes",
  setStatus: () => {},
  name: "",
  setName: () => {},
  partySize: 1,
  setPartySize: () => {},
  note: "",
  setNote: () => {},
  onSubmit: (event) => event.preventDefault(),
  mode: "public",
  isCurated: false,
};

export default function AdminInvitePreviewPage() {
  const [draft, setDraft] = useState<InviteDraftValues | null>(null);
  const [missing, setMissing] = useState(false);

  useEffect(() => {
    function load() {
      try {
        const raw = localStorage.getItem(PREVIEW_DRAFT_KEY);
        if (!raw) {
          setMissing(true);
          setDraft(null);
          return;
        }
        setDraft(JSON.parse(raw) as InviteDraftValues);
        setMissing(false);
      } catch {
        setMissing(true);
        setDraft(null);
      }
    }

    load();
    window.addEventListener("storage", load);
    window.addEventListener("focus", load);
    return () => {
      window.removeEventListener("storage", load);
      window.removeEventListener("focus", load);
    };
  }, []);

  if (missing) {
    return (
      <div className={styles.empty}>
        <p>No draft to preview. Open an invite in the editor first.</p>
        <Link href="/admin">Back to admin</Link>
      </div>
    );
  }

  if (!draft) {
    return <div className={styles.empty}>Loading preview…</div>;
  }

  const template = getTemplate(FALLBACK_TEMPLATE_ID)!;
  const colourTheme = resolveColourTheme(
    template,
    draft.colourThemeId || "ivory",
  );
  const variant = resolveVariant(template, draft.variantId || "classic");
  const theme: InviteTheme = {
    id: colourTheme.id,
    tokens: colourTheme.tokens,
    fonts: template.fonts,
  };
  const invitation = buildPreviewInvitation(draft);

  return (
    <div className={styles.page}>
      <div className={styles.bar}>
        <span className={styles.badge}>Live preview</span>
        <span className={styles.meta}>
          {variant.name} · {colourTheme.name} · unsaved draft
        </span>
        <button
          type="button"
          className={styles.refresh}
          onClick={() => {
            try {
              const raw = localStorage.getItem(PREVIEW_DRAFT_KEY);
              if (raw) setDraft(JSON.parse(raw) as InviteDraftValues);
            } catch {
              /* ignore */
            }
          }}
        >
          Refresh
        </button>
      </div>
      <InviteThemeProvider theme={theme}>
        <EditorialTemplate
          invitation={invitation}
          rsvp={noopRsvp}
          variantId={variant.id as EditorialVariantId}
        />
      </InviteThemeProvider>
    </div>
  );
}
